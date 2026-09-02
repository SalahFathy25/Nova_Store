import { ParentOrder } from '../orders/parent-order.entity.js';
import { Store } from '../stores/store.entity.js';
export declare class Payment {
    id: string;
    order_id: string;
    order: ParentOrder;
    tenant_id: string;
    store: Store;
    provider: string;
    transaction_id: string;
    amount: number;
    currency: string;
    status: string;
    payment_method_details: Record<string, any>;
    metadata: Record<string, any>;
    created_at: Date;
    updated_at: Date;
}
