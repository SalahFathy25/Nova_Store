import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';
export declare class DeliveryShift {
    id: string;
    driver_id: string;
    driver: User;
    tenant_id: string;
    store: Store;
    status: string;
    started_at: Date;
    ended_at: Date;
    total_orders: number;
    total_delivered: number;
    total_failed: number;
    total_earnings: number;
    current_location: Record<string, any>;
    created_at: Date;
}
