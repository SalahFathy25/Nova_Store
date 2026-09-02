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

@Module({
  imports: [
    TypeOrmModule.forFeature([Banner, HomeSection, FlashSale, FlashSaleProduct, Product, ProductImage, ProductVariant, Category, Brand]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: jwtConfig.secret, signOptions: { expiresIn: '15m' } }),
  ],
  controllers: [MarketingController],
  providers: [MarketingService],
  exports: [MarketingService],
})
export class MarketingModule {}
