import { CouponsService } from './coupons.service.js';
import { ValidateCouponDto } from './dto/coupon.dto.js';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    validateCoupon(dto: ValidateCouponDto, tenantId: string, userId: string): Promise<{
        valid: boolean;
        coupon: import("./coupon.entity.js").Coupon;
        discount_amount: number;
        discount_type: string;
        discount_value: number;
        message: string;
    }>;
}
