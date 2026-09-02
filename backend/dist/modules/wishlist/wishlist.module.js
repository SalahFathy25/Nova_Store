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
import { WishlistItem } from './wishlist-item.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductImage } from '../products/product-image.entity.js';
import { WishlistService } from './wishlist.service.js';
import { WishlistController } from './wishlist.controller.js';
import { jwtConfig } from '../../config/jwt.config.js';
let WishlistModule = class WishlistModule {
};
WishlistModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([WishlistItem, Product, ProductImage]),
            PassportModule.register({ defaultStrategy: 'jwt' }),
            JwtModule.register({ secret: jwtConfig.secret, signOptions: { expiresIn: '15m' } }),
        ],
        controllers: [WishlistController],
        providers: [WishlistService],
        exports: [WishlistService],
    })
], WishlistModule);
export { WishlistModule };
//# sourceMappingURL=wishlist.module.js.map