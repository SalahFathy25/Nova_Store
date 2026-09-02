var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
import { Injectable, Logger, UnauthorizedException, ConflictException, BadRequestException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../modules/users/user.entity.js';
import { OtpCode } from '../modules/otp/otp-code.entity.js';
import { UserSession } from '../modules/sessions/user-session.entity.js';
import { jwtConfig } from '../config/jwt.config.js';
import { SmsService } from '../common/services/sms.service.js';
let AuthService = AuthService_1 = class AuthService {
    userRepo;
    otpRepo;
    sessionRepo;
    jwtService;
    smsService;
    logger = new Logger(AuthService_1.name);
    constructor(userRepo, otpRepo, sessionRepo, jwtService, smsService) {
        this.userRepo = userRepo;
        this.otpRepo = otpRepo;
        this.sessionRepo = sessionRepo;
        this.jwtService = jwtService;
        this.smsService = smsService;
    }
    async register(dto, tenantId) {
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
            phone: dto.phone,
            password_hash: passwordHash,
            role: 'customer',
            is_verified: true,
        });
        const savedUser = await this.userRepo.save(user);
        const tokens = await this.generateTokens(savedUser, tenantId);
        await this.createSession(savedUser.id, tokens.refresh_token);
        return { user: this.sanitizeUser(savedUser), tokens };
    }
    async login(dto, tenantId) {
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
    async sendOtp(dto, tenantId) {
        const code = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.otpRepo.save(this.otpRepo.create({
            phone: dto.phone,
            tenant_id: tenantId,
            code,
            purpose: dto.purpose || 'login',
            expires_at: expiresAt,
        }));
        await this.smsService.sendOtp(dto.phone, code);
        return { message: 'OTP sent successfully' };
    }
    async verifyOtp(dto, tenantId) {
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
            await this.userRepo.update({ phone: dto.phone, tenant_id: tenantId }, { is_verified: true });
            return { verified: true };
        }
        let user = await this.userRepo.findOne({
            where: { phone: dto.phone, tenant_id: tenantId },
        });
        if (!user) {
            user = await this.userRepo.save(this.userRepo.create({
                phone: dto.phone,
                tenant_id: tenantId,
                full_name: 'Customer',
                role: 'customer',
                auth_provider: 'phone',
                is_verified: true,
            }));
        }
        const tokens = await this.generateTokens(user, tenantId);
        await this.createSession(user.id, tokens.refresh_token);
        return { user: this.sanitizeUser(user), tokens };
    }
    async refreshToken(refreshToken) {
        const sessions = await this.sessionRepo.find({
            where: { expires_at: MoreThan(new Date()) },
        });
        let validSession = null;
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
    async getProfile(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return this.sanitizeUser(user);
    }
    async forgotPassword(email, tenantId) {
        const user = await this.userRepo.findOne({
            where: { email, tenant_id: tenantId },
        });
        if (!user) {
            return { message: 'If the email exists, a reset code has been sent' };
        }
        const code = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await this.otpRepo.save(this.otpRepo.create({
            phone: user.phone || '',
            tenant_id: tenantId,
            code,
            purpose: 'reset_password',
            expires_at: expiresAt,
        }));
        await this.smsService.sendOtp(user.phone || '', code);
        return { message: 'If the email exists, a reset code has been sent' };
    }
    async resetPassword(email, code, newPassword, tenantId) {
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
        await this.sessionRepo.delete({ user_id: user.id });
        return { message: 'Password reset successfully' };
    }
    async generateTokens(user, tenantId) {
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
    async createSession(userId, refreshToken) {
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.sessionRepo.save(this.sessionRepo.create({
            user_id: userId,
            refresh_token_hash: refreshTokenHash,
            expires_at: expiresAt,
        }));
    }
    generateOtpCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    sanitizeUser(user) {
        const { password_hash, fcm_token, ...result } = user;
        return result;
    }
};
AuthService = AuthService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __param(1, InjectRepository(OtpCode)),
    __param(2, InjectRepository(UserSession)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        JwtService,
        SmsService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map