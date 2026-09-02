import { Store } from '../stores/store.entity.js';
export declare class Banner {
    id: string;
    tenant_id: string;
    store: Store;
    title: string;
    image_url: string;
    link_type: string;
    link_value: string;
    position: string;
    display_order: number;
    starts_at: Date;
    expires_at: Date;
    is_active: boolean;
    created_at: Date;
}
