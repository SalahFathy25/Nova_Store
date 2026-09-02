var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsEmail, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class RegisterDto {
    full_name;
    email;
    phone;
    password;
}
__decorate([
    ApiProperty({ example: 'John Doe' }),
    IsString(),
    __metadata("design:type", String)
], RegisterDto.prototype, "full_name", void 0);
__decorate([
    ApiPropertyOptional({ example: 'john@example.com' }),
    IsEmail(),
    IsOptional(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    ApiPropertyOptional({ example: '+201234567890' }),
    IsPhoneNumber(),
    IsOptional(),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    ApiProperty({ example: 'password123' }),
    IsString(),
    MinLength(8),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
export class LoginDto {
    email;
    phone;
    password;
}
__decorate([
    ApiPropertyOptional({ example: 'john@example.com' }),
    IsEmail(),
    IsOptional(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    ApiPropertyOptional({ example: '+201234567890' }),
    IsPhoneNumber(),
    IsOptional(),
    __metadata("design:type", String)
], LoginDto.prototype, "phone", void 0);
__decorate([
    ApiProperty({ example: 'password123' }),
    IsString(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
export class SendOtpDto {
    phone;
    purpose;
}
__decorate([
    ApiProperty({ example: '+201234567890' }),
    IsPhoneNumber(),
    __metadata("design:type", String)
], SendOtpDto.prototype, "phone", void 0);
__decorate([
    ApiPropertyOptional({ enum: ['login', 'register', 'verify', 'reset_password'] }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], SendOtpDto.prototype, "purpose", void 0);
export class VerifyOtpDto {
    phone;
    code;
    purpose;
}
__decorate([
    ApiProperty({ example: '+201234567890' }),
    IsPhoneNumber(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "phone", void 0);
__decorate([
    ApiProperty({ example: '123456' }),
    IsString(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "code", void 0);
__decorate([
    ApiPropertyOptional({ enum: ['login', 'register', 'verify', 'reset_password'] }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "purpose", void 0);
export class RefreshTokenDto {
    refresh_token;
}
__decorate([
    ApiProperty(),
    IsString(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refresh_token", void 0);
export class ForgotPasswordDto {
    email;
}
__decorate([
    ApiProperty({ example: 'john@example.com' }),
    IsEmail(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
export class ResetPasswordDto {
    email;
    code;
    new_password;
}
__decorate([
    ApiProperty({ example: 'john@example.com' }),
    IsEmail(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ example: '123456' }),
    IsString(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "code", void 0);
__decorate([
    ApiProperty({ example: 'newpassword123' }),
    IsString(),
    MinLength(8),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "new_password", void 0);
export class AuthTokens {
    access_token;
    refresh_token;
    expires_in;
}
export class AuthResponse {
    user;
    tokens;
}
//# sourceMappingURL=auth.dto.js.map