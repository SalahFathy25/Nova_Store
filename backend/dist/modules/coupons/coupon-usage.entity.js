var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, } from 'typeorm';
import { Coupon } from './coupon.entity.js';
import { User } from '../users/user.entity.js';
import { ParentOrder } from '../orders/parent-order.entity.js';
let CouponUsage = class CouponUsage {
    id;
    coupon_id;
    coupon;
    user_id;
    user;
    order_id;
    order;
    discount_amount;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], CouponUsage.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'coupon_id' }),
    __metadata("design:type", String)
], CouponUsage.prototype, "coupon_id", void 0);
__decorate([
    ManyToOne(() => Coupon, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'coupon_id' }),
    __metadata("design:type", Coupon)
], CouponUsage.prototype, "coupon", void 0);
__decorate([
    Column({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], CouponUsage.prototype, "user_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'user_id' }),
    __metadata("design:type", User)
], CouponUsage.prototype, "user", void 0);
__decorate([
    Column({ type: 'uuid', name: 'order_id' }),
    __metadata("design:type", String)
], CouponUsage.prototype, "order_id", void 0);
__decorate([
    ManyToOne(() => ParentOrder, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'order_id' }),
    __metadata("design:type", ParentOrder)
], CouponUsage.prototype, "order", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, name: 'discount_amount' }),
    __metadata("design:type", Number)
], CouponUsage.prototype, "discount_amount", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], CouponUsage.prototype, "created_at", void 0);
CouponUsage = __decorate([
    Entity('coupon_usage')
], CouponUsage);
export { CouponUsage };
//# sourceMappingURL=coupon-usage.entity.js.map