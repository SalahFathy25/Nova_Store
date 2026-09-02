import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';
export declare class VendorPayout {
    id: string;
    vendor_id: string;
    vendor: User;
    tenant_id: string;
    store: Store;
    amount: number;
    commission_deducted: number;
    orders: Record<string, any>;
    status: string;
    payout_method: string;
    payout_details: Record<string, any>;
    processed_at: Date;
    created_at: Date;
}
