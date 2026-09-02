import { ParentOrder } from './parent-order.entity.js';
import { SubOrder } from './sub-order.entity.js';
import { User } from '../users/user.entity.js';
export declare class OrderStatusHistory {
    id: string;
    order_id: string;
    order: ParentOrder;
    sub_order_id: string;
    sub_order: SubOrder;
    from_status: string;
    to_status: string;
    changed_by: string;
    changer: User;
    reason: string;
    metadata: Record<string, any>;
    created_at: Date;
}
