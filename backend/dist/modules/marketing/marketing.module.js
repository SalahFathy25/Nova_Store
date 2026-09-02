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
import { Banner } from './banner.entity.js';
import { HomeSection } from './home-section.entity.js';
import { FlashSale } from './flash-sale.entity.js';
import { FlashSaleProduct } from './flash-sale-product.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductImage } from '../products/product-image.entity.js';
import { ProductVariant } from '../products/product-variant.entity.js';
import { Category } from '../categories/category.entity.js';
import { Brand } from '../brands/brand.entity.js';
import { MarketingService } from './marketing.service.js';
import { MarketingController } from './marketing.controller.js';
import { jwtConfig } from '../../config/jwt.config.js';
let MarketingModule = class MarketingModule {
};
MarketingModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([Banner, HomeSection, FlashSale, FlashSaleProduct, Product, ProductImage, ProductVariant, Category, Brand]),
            PassportModule.register({ defaultStrategy: 'jwt' }),
            JwtModule.register({ secret: jwtConfig.secret, signOptions: { expiresIn: '15m' } }),
        ],
        controllers: [MarketingController],
        providers: [MarketingService],
        exports: [MarketingService],
    })
], MarketingModule);
export { MarketingModule };
//# sourceMappingURL=marketing.module.js.map