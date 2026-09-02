import { Store } from '../stores/store.entity.js';
export declare class HomeSection {
    id: string;
    tenant_id: string;
    store: Store;
    type: string;
    title: string;
    config: Record<string, any>;
    display_order: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
