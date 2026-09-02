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
import { Cart } from './cart.entity.js';
import { CartItem } from './cart-item.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductVariant } from '../products/product-variant.entity.js';
import { CartsService } from './carts.service.js';
import { CartsController } from './carts.controller.js';
import { jwtConfig } from '../../config/jwt.config.js';
let CartsModule = class CartsModule {
};
CartsModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([Cart, CartItem, Product, ProductVariant]),
            PassportModule.register({ defaultStrategy: 'jwt' }),
            JwtModule.register({ secret: jwtConfig.secret, signOptions: { expiresIn: '15m' } }),
        ],
        controllers: [CartsController],
        providers: [CartsService],
        exports: [CartsService],
    })
], CartsModule);
export { CartsModule };
//# sourceMappingURL=carts.module.js.map