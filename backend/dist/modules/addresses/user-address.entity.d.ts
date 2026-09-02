import { Store } from '../stores/store.entity.js';
export declare class UserAddress {
    id: string;
    user_id: string;
    tenant_id: string;
    store: Store;
    label: string;
    full_address: string;
    street: string;
    building: string;
    floor: string;
    apartment: string;
    landmark: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    latitude: number;
    longitude: number;
    is_default: boolean;
    created_at: Date;
}
