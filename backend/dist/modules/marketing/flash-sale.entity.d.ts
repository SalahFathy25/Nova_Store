import { Store } from '../stores/store.entity.js';
export declare class FlashSale {
    id: string;
    tenant_id: string;
    store: Store;
    name: string;
    description: string;
    starts_at: Date;
    ends_at: Date;
    is_active: boolean;
    created_at: Date;
}
