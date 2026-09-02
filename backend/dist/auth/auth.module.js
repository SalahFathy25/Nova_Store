var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
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
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map