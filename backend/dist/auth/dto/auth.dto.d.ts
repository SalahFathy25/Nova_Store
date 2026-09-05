export declare class RegisterDto {
    full_name: string;
    email?: string;
    phone?: string;
    password: string;
}
export declare class LoginDto {
    email?: string;
    phone?: string;
    password: string;
}
export declare class SendOtpDto {
    phone: string;
    purpose?: string;
}
export declare class VerifyOtpDto {
    phone: string;
    code: string;
    purpose?: string;
}
export declare class RefreshTokenDto {
    refresh_token: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    email: string;
    code: string;
    new_password: string;
}
export declare class AuthTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}
export declare class AuthResponse {
    user: any;
    tokens: AuthTokens;
}
export declare class UpdateFcmTokenDto {
    fcm_token: string;
}
