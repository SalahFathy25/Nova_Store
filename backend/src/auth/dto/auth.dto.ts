import { IsString, IsEmail, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  full_name: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+201234567890' })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+201234567890' })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;
}

export class SendOtpDto {
  @ApiProperty({ example: '+201234567890' })
  @IsPhoneNumber()
  phone: string;

  @ApiPropertyOptional({ enum: ['login', 'register', 'verify', 'reset_password'] })
  @IsString()
  @IsOptional()
  purpose?: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+201234567890' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ enum: ['login', 'register', 'verify', 'reset_password'] })
  @IsString()
  @IsOptional()
  purpose?: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refresh_token: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'newpassword123' })
  @IsString()
  @MinLength(8)
  new_password: string;
}

export class AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export class AuthResponse {
  user: any;
  tokens: AuthTokens;
}
