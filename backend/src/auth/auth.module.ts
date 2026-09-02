import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { User } from '../modules/users/user.entity.js';
import { OtpCode } from '../modules/otp/otp-code.entity.js';
import { UserSession } from '../modules/sessions/user-session.entity.js';
import { jwtConfig } from '../config/jwt.config.js';
import { SmsService } from '../common/services/sms.service.js';
import { DevSmsService } from '../common/services/dev-sms.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OtpCode, UserSession]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: SmsService, useClass: DevSmsService },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
