import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity.js';
import { CouponUsage } from './coupon-usage.entity.js';
export declare class CouponsService {
    private readonly couponRepo;
    private readonly usageRepo;
    constructor(couponRepo: Repository<Coupon>, usageRepo: Repository<CouponUsage>);
    validateCoupon(tenantId: string, code: string, subtotal: number, userId: string): Promise<{
        valid: boolean;
        coupon: Coupon;
        discount_amount: number;
        discount_type: string;
        discount_value: number;
        message: string;
    }>;
    private calculateDiscount;
}
