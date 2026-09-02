import { AuthService } from './auth.service.js';
import { RegisterDto, LoginDto, SendOtpDto, VerifyOtpDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, tenantId: string): Promise<import("./dto/auth.dto.js").AuthResponse>;
    login(dto: LoginDto, tenantId: string): Promise<import("./dto/auth.dto.js").AuthResponse>;
    sendOtp(dto: SendOtpDto, tenantId: string): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto, tenantId: string): Promise<import("./dto/auth.dto.js").AuthResponse | {
        verified: boolean;
    }>;
    refreshToken(dto: RefreshTokenDto): Promise<import("./dto/auth.dto.js").AuthTokens>;
    forgotPassword(dto: ForgotPasswordDto, tenantId: string): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto, tenantId: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<any>;
}
