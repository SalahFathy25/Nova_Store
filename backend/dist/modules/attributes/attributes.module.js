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
import { Attribute } from './attribute.entity.js';
import { AttributeValue } from './attribute-value.entity.js';
import { AttributesService } from './attributes.service.js';
import { AttributesController } from './attributes.controller.js';
import { jwtConfig } from '../../config/jwt.config.js';
let AttributesModule = class AttributesModule {
};
AttributesModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([Attribute, AttributeValue]),
            PassportModule.register({ defaultStrategy: 'jwt' }),
            JwtModule.register({ secret: jwtConfig.secret, signOptions: { expiresIn: '15m' } }),
        ],
        controllers: [AttributesController],
        providers: [AttributesService],
        exports: [AttributesService],
    })
], AttributesModule);
export { AttributesModule };
//# sourceMappingURL=attributes.module.js.map