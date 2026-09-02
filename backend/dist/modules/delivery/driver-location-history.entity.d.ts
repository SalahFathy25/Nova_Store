import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';
import { SubOrder } from '../orders/sub-order.entity.js';
export declare class DriverLocationHistory {
    id: string;
    driver_id: string;
    driver: User;
    tenant_id: string;
    store: Store;
    sub_order_id: string | null;
    sub_order: SubOrder;
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    created_at: Date;
}
