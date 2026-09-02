import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../modules/users/user.entity.js';
import { OtpCode } from '../modules/otp/otp-code.entity.js';
import { UserSession } from '../modules/sessions/user-session.entity.js';
import { RegisterDto, LoginDto, SendOtpDto, VerifyOtpDto, AuthTokens, AuthResponse } from './dto/auth.dto.js';
import { SmsService } from '../common/services/sms.service.js';
export declare class AuthService {
    private readonly userRepo;
    private readonly otpRepo;
    private readonly sessionRepo;
    private readonly jwtService;
    private readonly smsService;
    private readonly logger;
    constructor(userRepo: Repository<User>, otpRepo: Repository<OtpCode>, sessionRepo: Repository<UserSession>, jwtService: JwtService, smsService: SmsService);
    register(dto: RegisterDto, tenantId: string): Promise<AuthResponse>;
    login(dto: LoginDto, tenantId: string): Promise<AuthResponse>;
    sendOtp(dto: SendOtpDto, tenantId: string): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto, tenantId: string): Promise<AuthResponse | {
        verified: boolean;
    }>;
    refreshToken(refreshToken: string): Promise<AuthTokens>;
    getProfile(userId: string): Promise<any>;
    forgotPassword(email: string, tenantId: string): Promise<{
        message: string;
    }>;
    resetPassword(email: string, code: string, newPassword: string, tenantId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private createSession;
    private generateOtpCode;
    private sanitizeUser;
}
