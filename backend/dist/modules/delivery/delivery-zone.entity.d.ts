import { Store } from '../stores/store.entity.js';
export declare class DeliveryZone {
    id: string;
    tenant_id: string;
    store: Store;
    name: string;
    coordinates: Record<string, any>;
    radius_km: number;
    flat_fee: number;
    free_above: number;
    is_active: boolean;
    created_at: Date;
}
