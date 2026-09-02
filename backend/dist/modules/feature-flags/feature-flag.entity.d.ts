import { Store } from '../stores/store.entity.js';
export declare class FeatureFlag {
    id: string;
    tenant_id: string;
    store: Store;
    flag_name: string;
    is_enabled: boolean;
    config: Record<string, any>;
    created_at: Date;
    updated_at: Date;
}
