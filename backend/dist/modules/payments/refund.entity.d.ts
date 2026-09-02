import { ParentOrder } from '../orders/parent-order.entity.js';
import { Payment } from './payment.entity.js';
import { Store } from '../stores/store.entity.js';
import { User } from '../users/user.entity.js';
export declare class Refund {
    id: string;
    order_id: string;
    order: ParentOrder;
    payment_id: string;
    payment: Payment;
    tenant_id: string;
    store: Store;
    amount: number;
    reason: string;
    status: string;
    processed_by: string;
    processor: User;
    processed_at: Date;
    created_at: Date;
}
