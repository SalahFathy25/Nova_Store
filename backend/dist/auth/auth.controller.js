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
import { Controller, Post, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RegisterDto, LoginDto, SendOtpDto, VerifyOtpDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, UpdateFcmTokenDto, } from './dto/auth.dto.js';
import { CurrentTenantId } from '../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../common/decorators/user.decorator.js';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto, tenantId) {
        return this.authService.register(dto, tenantId);
    }
    async login(dto, tenantId) {
        return this.authService.login(dto, tenantId);
    }
    async sendOtp(dto, tenantId) {
        return this.authService.sendOtp(dto, tenantId);
    }
    async verifyOtp(dto, tenantId) {
        return this.authService.verifyOtp(dto, tenantId);
    }
    async refreshToken(dto) {
        return this.authService.refreshToken(dto.refresh_token);
    }
    async forgotPassword(dto, tenantId) {
        return this.authService.forgotPassword(dto.email, tenantId);
    }
    async resetPassword(dto, tenantId) {
        return this.authService.resetPassword(dto.email, dto.code, dto.new_password, tenantId);
    }
    async getProfile(userId) {
        return this.authService.getProfile(userId);
    }
    async updateFcmToken(userId, dto) {
        return this.authService.updateFcmToken(userId, dto.fcm_token);
    }
};
__decorate([
    Post('register'),
    ApiOperation({ summary: 'Register a new user' }),
    ApiResponse({ status: 201, description: 'User registered successfully' }),
    __param(0, Body()),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    Post('login'),
    ApiOperation({ summary: 'Login with email and password' }),
    ApiResponse({ status: 200, description: 'Login successful' }),
    __param(0, Body()),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Post('otp/send'),
    ApiOperation({ summary: 'Send OTP to phone number' }),
    ApiResponse({ status: 200, description: 'OTP sent' }),
    __param(0, Body()),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendOtpDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendOtp", null);
__decorate([
    Post('otp/verify'),
    ApiOperation({ summary: 'Verify OTP code' }),
    ApiResponse({ status: 200, description: 'OTP verified' }),
    __param(0, Body()),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyOtpDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    Post('refresh-token'),
    ApiOperation({ summary: 'Refresh access token' }),
    ApiResponse({ status: 200, description: 'Token refreshed' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    Post('forgot-password'),
    ApiOperation({ summary: 'Send password reset code' }),
    ApiResponse({ status: 200, description: 'Reset code sent' }),
    __param(0, Body()),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPasswordDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    Post('reset-password'),
    ApiOperation({ summary: 'Reset password with code' }),
    ApiResponse({ status: 200, description: 'Password reset successfully' }),
    __param(0, Body()),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    Get('me'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get current user profile' }),
    ApiResponse({ status: 200, description: 'User profile' }),
    __param(0, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    Patch('fcm-token'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update FCM token for push notifications' }),
    ApiResponse({ status: 200, description: 'FCM token updated' }),
    __param(0, CurrentUser('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateFcmTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateFcmToken", null);
AuthController = __decorate([
    ApiTags('Auth'),
    Controller('api/v1/auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map