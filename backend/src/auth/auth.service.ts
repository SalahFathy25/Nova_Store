import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../modules/users/user.entity.js';
import { OtpCode } from '../modules/otp/otp-code.entity.js';
import { UserSession } from '../modules/sessions/user-session.entity.js';
import {
  RegisterDto,
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  AuthTokens,
  AuthResponse,
} from './dto/auth.dto.js';
import { jwtConfig } from '../config/jwt.config.js';
import { SmsService } from '../common/services/sms.service.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(OtpCode)
    private readonly otpRepo: Repository<OtpCode>,
    @InjectRepository(UserSession)
    private readonly sessionRepo: Repository<UserSession>,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}

  async register(dto: RegisterDto, tenantId: string): Promise<AuthResponse> {
    this.logger.log(`Register attempt for email: ${dto.email}, tenant: ${tenantId}`);

    const existingUser = await this.userRepo.findOne({
      where: { tenant_id: tenantId, email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = this.userRepo.create({
      tenant_id: tenantId,
      full_name: dto.full_name,
      email: dto.email,
      phone: dto.phone || undefined,
      password_hash: passwordHash,
      role: 'customer',
      is_verified: true,
    });

    this.logger.log('Saving user...');
    const savedUser = await this.userRepo.save(user);
    this.logger.log(`User saved: ${savedUser.id}`);

    const tokens = await this.generateTokens(savedUser, tenantId);
    await this.createSession(savedUser.id, tokens.refresh_token);

    return { user: this.sanitizeUser(savedUser), tokens };
  }

  async login(dto: LoginDto, tenantId: string): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({
      where: { tenant_id: tenantId, email: dto.email },
    });

    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const tokens = await this.generateTokens(user, tenantId);
    await this.createSession(user.id, tokens.refresh_token);

    await this.userRepo.update(user.id, { last_login_at: new Date() });

    return { user: this.sanitizeUser(user), tokens };
  }

  async sendOtp(dto: SendOtpDto, tenantId: string): Promise<{ message: string }> {
    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.otpRepo.save(
      this.otpRepo.create({
        phone: dto.phone,
        tenant_id: tenantId,
        code,
        purpose: dto.purpose || 'login',
        expires_at: expiresAt,
      }),
    );

    await this.smsService.sendOtp(dto.phone, code);

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto, tenantId: string): Promise<AuthResponse | { verified: boolean }> {
    const otp = await this.otpRepo.findOne({
      where: {
        phone: dto.phone,
        tenant_id: tenantId,
        code: dto.code,
        purpose: dto.purpose || 'login',
        used: false,
        expires_at: MoreThan(new Date()),
      },
    });

    if (!otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.otpRepo.update(otp.id, { used: true });

    if (dto.purpose === 'verify') {
      await this.userRepo.update(
        { phone: dto.phone, tenant_id: tenantId },
        { is_verified: true },
      );
      return { verified: true };
    }

    let user = await this.userRepo.findOne({
      where: { phone: dto.phone, tenant_id: tenantId },
    });

    if (!user) {
      user = await this.userRepo.save(
        this.userRepo.create({
          phone: dto.phone,
          tenant_id: tenantId,
          full_name: 'Customer',
          role: 'customer',
          auth_provider: 'phone',
          is_verified: true,
        }),
      );
    }

    const tokens = await this.generateTokens(user, tenantId);
    await this.createSession(user.id, tokens.refresh_token);

    return { user: this.sanitizeUser(user), tokens };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const sessions = await this.sessionRepo.find({
      where: { expires_at: MoreThan(new Date()) },
    });

    let validSession: UserSession | null = null;
    for (const session of sessions) {
      const isValid = await bcrypt.compare(refreshToken, session.refresh_token_hash);
      if (isValid) {
        validSession = session;
        break;
      }
    }

    if (!validSession) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepo.findOne({
      where: { id: validSession.user_id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.sessionRepo.delete(validSession.id);

    const tokens = await this.generateTokens(user, user.tenant_id);
    await this.createSession(user.id, tokens.refresh_token);

    return tokens;
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.sanitizeUser(user);
  }

  async forgotPassword(email: string, tenantId: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({
      where: { email, tenant_id: tenantId },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If the email exists, a reset code has been sent' };
    }

    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.otpRepo.save(
      this.otpRepo.create({
        phone: user.phone || '',
        tenant_id: tenantId,
        code,
        purpose: 'reset_password',
        expires_at: expiresAt,
      }),
    );

    await this.smsService.sendOtp(user.phone || '', code);

    return { message: 'If the email exists, a reset code has been sent' };
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
    tenantId: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({
      where: { email, tenant_id: tenantId },
    });

    if (!user) {
      throw new BadRequestException('Invalid request');
    }

    const otp = await this.otpRepo.findOne({
      where: {
        phone: user.phone || '',
        tenant_id: tenantId,
        code,
        purpose: 'reset_password',
        used: false,
      },
    });

    if (!otp) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    if (otp.expires_at < new Date()) {
      throw new BadRequestException('Reset code has expired');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.userRepo.update(user.id, { password_hash: passwordHash });
    await this.otpRepo.update(otp.id, { used: true });

    // Invalidate all existing sessions
    await this.sessionRepo.delete({ user_id: user.id });

    return { message: 'Password reset successfully' };
  }

  private async generateTokens(user: User, tenantId: string): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenant_id: tenantId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: jwtConfig.refreshSecret,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900,
    };
  }

  private async createSession(userId: string, refreshToken: string): Promise<void> {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.sessionRepo.save(
      this.sessionRepo.create({
        user_id: userId,
        refresh_token_hash: refreshTokenHash,
        expires_at: expiresAt,
      }),
    );
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async updateFcmToken(userId: string, fcmToken: string): Promise<{ success: boolean }> {
    await this.userRepo.update(userId, { fcm_token: fcmToken });
    return { success: true };
  }

  private sanitizeUser(user: User) {
    const { password_hash, fcm_token, ...result } = user as any;
    return result;
  }
}
