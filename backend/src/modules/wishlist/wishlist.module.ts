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

@Module({
  imports: [
    TypeOrmModule.forFeature([WishlistItem, Product, ProductImage]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: jwtConfig.secret, signOptions: { expiresIn: '15m' } }),
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
