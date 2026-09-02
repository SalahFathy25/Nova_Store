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

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product, ProductVariant]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: jwtConfig.secret, signOptions: { expiresIn: '15m' } }),
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
