import { Controller, Post, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import {
  RegisterDto,
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateFcmTokenDto,
} from './dto/auth.dto.js';
import { CurrentTenantId } from '../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../common/decorators/user.decorator.js';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(
    @Body() dto: RegisterDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.authService.register(dto, tenantId);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(
    @Body() dto: LoginDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.authService.login(dto, tenantId);
  }

  @Post('otp/send')
  @ApiOperation({ summary: 'Send OTP to phone number' })
  @ApiResponse({ status: 200, description: 'OTP sent' })
  async sendOtp(
    @Body() dto: SendOtpDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.authService.sendOtp(dto, tenantId);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({ status: 200, description: 'OTP verified' })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.authService.verifyOtp(dto, tenantId);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refresh_token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset code' })
  @ApiResponse({ status: 200, description: 'Reset code sent' })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.authService.forgotPassword(dto.email, tenantId);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with code' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.authService.resetPassword(
      dto.email,
      dto.code,
      dto.new_password,
      tenantId,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @Patch('fcm-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update FCM token for push notifications' })
  @ApiResponse({ status: 200, description: 'FCM token updated' })
  async updateFcmToken(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateFcmTokenDto,
  ) {
    return this.authService.updateFcmToken(userId, dto.fcm_token);
  }
}
