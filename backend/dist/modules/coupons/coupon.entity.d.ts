import { Store } from '../stores/store.entity.js';
export declare class Coupon {
    id: string;
    tenant_id: string;
    store: Store;
    code: string;
    description: string;
    type: string;
    value: number;
    minimum_order: number;
    maximum_discount: number;
    usage_limit: number;
    usage_limit_per_user: number;
    current_usage: number;
    applicable_products: string[];
    applicable_categories: string[];
    starts_at: Date;
    expires_at: Date;
    is_active: boolean;
    created_at: Date;
}
