import { Store } from '../stores/store.entity.js';
export declare class Brand {
    id: string;
    tenant_id: string;
    store: Store;
    name: string;
    slug: string;
    logo_url: string;
    description: string;
    is_active: boolean;
    created_at: Date;
}
