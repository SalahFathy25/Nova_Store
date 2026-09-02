import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';
export declare class Cart {
    id: string;
    user_id: string;
    user: User;
    tenant_id: string;
    store: Store;
    session_id: string;
    coupon_code: string;
    notes: string;
    created_at: Date;
    updated_at: Date;
}
