import { Store } from '../stores/store.entity.js';
import { User } from '../users/user.entity.js';
export declare class ParentOrder {
    id: string;
    order_number: string;
    tenant_id: string;
    store: Store;
    customer_id: string;
    customer: User;
    status: string;
    total_amount: number;
    subtotal: number;
    discount_amount: number;
    shipping_fee: number;
    tax_amount: number;
    grand_total: number;
    payment_method: string;
    payment_status: string;
    shipping_address: Record<string, any>;
    billing_address: Record<string, any>;
    notes: string;
    coupon_code: string;
    coupon_discount: number;
    created_at: Date;
    updated_at: Date;
}
