import { User } from '../users/user.entity.js';
import { DeliveryShift } from './delivery-shift.entity.js';
import { Store } from '../stores/store.entity.js';
import { SubOrder } from '../orders/sub-order.entity.js';
export declare class CashLedger {
    id: string;
    driver_id: string;
    driver: User;
    shift_id: string;
    shift: DeliveryShift;
    tenant_id: string;
    store: Store;
    sub_order_id: string;
    sub_order: SubOrder;
    amount: number;
    type: string;
    notes: string;
    created_at: Date;
}
