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
import { ParentOrder } from './parent-order.entity.js';
import { SubOrder } from './sub-order.entity.js';
import { OrderItem } from './order-item.entity.js';
import { OrderStatusHistory } from './order-status-history.entity.js';
import { Cart } from '../carts/cart.entity.js';
import { CartItem } from '../carts/cart-item.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductVariant } from '../products/product-variant.entity.js';
import { UserAddress } from '../addresses/user-address.entity.js';
import { Coupon } from '../coupons/coupon.entity.js';
import { CouponUsage } from '../coupons/coupon-usage.entity.js';
import { Payment } from '../payments/payment.entity.js';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { jwtConfig } from '../../config/jwt.config.js';
let OrdersModule = class OrdersModule {
};
OrdersModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([
                ParentOrder, SubOrder, OrderItem, OrderStatusHistory,
                Cart, CartItem, Product, ProductVariant,
                UserAddress, Coupon, CouponUsage, Payment,
            ]),
            PassportModule.register({ defaultStrategy: 'jwt' }),
            JwtModule.register({ secret: jwtConfig.secret, signOptions: { expiresIn: '15m' } }),
        ],
        controllers: [OrdersController],
        providers: [OrdersService],
        exports: [OrdersService],
    })
], OrdersModule);
export { OrdersModule };
//# sourceMappingURL=orders.module.js.map