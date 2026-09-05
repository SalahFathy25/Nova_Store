var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { BrandsModule } from './modules/brands/brands.module.js';
import { AttributesModule } from './modules/attributes/attributes.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { UploadModule } from './modules/upload/upload.module.js';
import { CartsModule } from './modules/carts/carts.module.js';
import { WishlistModule } from './modules/wishlist/wishlist.module.js';
import { OrdersModule } from './modules/orders/orders.module.js';
import { AddressesModule } from './modules/addresses/addresses.module.js';
import { CouponsModule } from './modules/coupons/coupons.module.js';
import { MarketingModule } from './modules/marketing/marketing.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { AppConfigModule } from './modules/app-config/app-config.module.js';
import { DeliveryModule } from './modules/delivery/delivery.module.js';
import { ReviewsModule } from './modules/reviews/reviews.module.js';
import { AppController } from './app.controller.js';
import { TenantMiddleware } from './common/middleware/tenant.middleware.js';
import { getDatabaseConfig } from './config/database.config.js';
import { Store } from './modules/stores/store.entity.js';
import { User } from './modules/users/user.entity.js';
import { UserAddress } from './modules/addresses/user-address.entity.js';
import { UserSession } from './modules/sessions/user-session.entity.js';
import { OtpCode } from './modules/otp/otp-code.entity.js';
import { Category } from './modules/categories/category.entity.js';
import { Brand } from './modules/brands/brand.entity.js';
import { Attribute } from './modules/attributes/attribute.entity.js';
import { AttributeValue } from './modules/attributes/attribute-value.entity.js';
import { Product } from './modules/products/product.entity.js';
import { ProductVariant } from './modules/products/product-variant.entity.js';
import { ProductImage } from './modules/products/product-image.entity.js';
import { ProductReview } from './modules/reviews/product-review.entity.js';
import { Cart } from './modules/carts/cart.entity.js';
import { CartItem } from './modules/carts/cart-item.entity.js';
import { WishlistItem } from './modules/wishlist/wishlist-item.entity.js';
import { ParentOrder } from './modules/orders/parent-order.entity.js';
import { SubOrder } from './modules/orders/sub-order.entity.js';
import { OrderItem } from './modules/orders/order-item.entity.js';
import { OrderStatusHistory } from './modules/orders/order-status-history.entity.js';
import { Payment } from './modules/payments/payment.entity.js';
import { Refund } from './modules/payments/refund.entity.js';
import { VendorPayout } from './modules/payments/vendor-payout.entity.js';
import { DeliveryShift } from './modules/delivery/delivery-shift.entity.js';
import { CashLedger } from './modules/delivery/cash-ledger.entity.js';
import { DeliveryZone } from './modules/delivery/delivery-zone.entity.js';
import { DriverLocationHistory } from './modules/delivery/driver-location-history.entity.js';
import { Coupon } from './modules/coupons/coupon.entity.js';
import { CouponUsage } from './modules/coupons/coupon-usage.entity.js';
import { Banner } from './modules/marketing/banner.entity.js';
import { HomeSection } from './modules/marketing/home-section.entity.js';
import { FlashSale } from './modules/marketing/flash-sale.entity.js';
import { FlashSaleProduct } from './modules/marketing/flash-sale-product.entity.js';
import { Notification } from './modules/notifications/notification.entity.js';
import { AuditLog } from './modules/audit-logs/audit-log.entity.js';
import { FeatureFlag } from './modules/feature-flags/feature-flag.entity.js';
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(TenantMiddleware).forRoutes('api');
    }
};
AppModule = __decorate([
    Module({
        controllers: [AppController],
        imports: [
            TypeOrmModule.forRoot(getDatabaseConfig()),
            TypeOrmModule.forFeature([
                Store,
                User,
                UserAddress,
                UserSession,
                OtpCode,
                Category,
                Brand,
                Attribute,
                AttributeValue,
                Product,
                ProductVariant,
                ProductImage,
                ProductReview,
                Cart,
                CartItem,
                WishlistItem,
                ParentOrder,
                SubOrder,
                OrderItem,
                OrderStatusHistory,
                Payment,
                Refund,
                VendorPayout,
                DeliveryShift,
                CashLedger,
                DeliveryZone,
                DriverLocationHistory,
                Coupon,
                CouponUsage,
                Banner,
                HomeSection,
                FlashSale,
                FlashSaleProduct,
                Notification,
                AuditLog,
                FeatureFlag,
            ]),
            PassportModule,
            AuthModule,
            CategoriesModule,
            BrandsModule,
            AttributesModule,
            ProductsModule,
            UploadModule,
            CartsModule,
            WishlistModule,
            OrdersModule,
            AddressesModule,
            CouponsModule,
            MarketingModule,
            NotificationsModule,
            AppConfigModule,
            DeliveryModule,
            ReviewsModule,
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map