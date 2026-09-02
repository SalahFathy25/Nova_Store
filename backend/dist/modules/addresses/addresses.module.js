var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserAddress } from './user-address.entity.js';
import { AddressesService } from './addresses.service.js';
import { AddressesController } from './addresses.controller.js';
import { jwtConfig } from '../../config/jwt.config.js';
let AddressesModule = class AddressesModule {
};
AddressesModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([UserAddress]),
            PassportModule.register({ defaultStrategy: 'jwt' }),
            JwtModule.register({ secret: jwtConfig.secret, signOptions: { expiresIn: '15m' } }),
        ],
        controllers: [AddressesController],
        providers: [AddressesService],
        exports: [AddressesService],
    })
], AddressesModule);
export { AddressesModule };
//# sourceMappingURL=addresses.module.js.map