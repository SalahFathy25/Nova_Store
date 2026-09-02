var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity.js';
import { CouponUsage } from './coupon-usage.entity.js';
let CouponsService = class CouponsService {
    couponRepo;
    usageRepo;
    constructor(couponRepo, usageRepo) {
        this.couponRepo = couponRepo;
        this.usageRepo = usageRepo;
    }
    async validateCoupon(tenantId, code, subtotal, userId) {
        const coupon = await this.couponRepo.findOne({
            where: { tenant_id: tenantId, code: code.toUpperCase(), is_active: true },
        });
        if (!coupon) {
            throw new NotFoundException('Invalid coupon code');
        }
        const now = new Date();
        if (coupon.starts_at && coupon.starts_at > now) {
            throw new BadRequestException('Coupon is not yet active');
        }
        if (coupon.expires_at && coupon.expires_at < now) {
            throw new BadRequestException('Coupon has expired');
        }
        if (subtotal < coupon.minimum_order) {
            throw new BadRequestException(`Minimum order amount is ${coupon.minimum_order}`);
        }
        if (coupon.usage_limit && coupon.current_usage >= coupon.usage_limit) {
            throw new BadRequestException('Coupon usage limit reached');
        }
        if (coupon.usage_limit_per_user) {
            const userUsageCount = await this.usageRepo.count({
                where: { coupon_id: coupon.id, user_id: userId },
            });
            if (userUsageCount >= coupon.usage_limit_per_user) {
                throw new BadRequestException('You have reached the usage limit for this coupon');
            }
        }
        const discount_amount = this.calculateDiscount(coupon, subtotal);
        return {
            valid: true,
            coupon,
            discount_amount,
            discount_type: coupon.type,
            discount_value: coupon.value,
            message: 'Coupon applied successfully',
        };
    }
    calculateDiscount(coupon, subtotal) {
        let discount = 0;
        switch (coupon.type) {
            case 'percentage':
                discount = (subtotal * coupon.value) / 100;
                if (coupon.maximum_discount) {
                    discount = Math.min(discount, coupon.maximum_discount);
                }
                break;
            case 'fixed':
                discount = Math.min(coupon.value, subtotal);
                break;
            case 'free_shipping':
                discount = 0;
                break;
            case 'bogo':
                discount = 0;
                break;
            default:
                discount = 0;
        }
        return Math.round(discount * 100) / 100;
    }
};
CouponsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Coupon)),
    __param(1, InjectRepository(CouponUsage)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], CouponsService);
export { CouponsService };
//# sourceMappingURL=coupons.service.js.map