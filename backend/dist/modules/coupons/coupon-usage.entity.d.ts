import { Coupon } from './coupon.entity.js';
import { User } from '../users/user.entity.js';
import { ParentOrder } from '../orders/parent-order.entity.js';
export declare class CouponUsage {
    id: string;
    coupon_id: string;
    coupon: Coupon;
    user_id: string;
    user: User;
    order_id: string;
    order: ParentOrder;
    discount_amount: number;
    created_at: Date;
}
