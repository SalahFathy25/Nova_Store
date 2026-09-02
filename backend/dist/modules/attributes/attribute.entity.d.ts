import { Store } from '../stores/store.entity.js';
export declare class Attribute {
    id: string;
    tenant_id: string;
    store: Store;
    name: string;
    type: string;
    is_filterable: boolean;
    is_variant: boolean;
    display_order: number;
    created_at: Date;
}
