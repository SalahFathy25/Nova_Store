import { ParentOrder } from './parent-order.entity.js';
import { User } from '../users/user.entity.js';
export declare class SubOrder {
    id: string;
    parent_order_id: string;
    parent_order: ParentOrder;
    vendor_id: string;
    vendor: User;
    driver_id: string;
    driver: User;
    order_status: string;
    payment_status: string;
    delivery_status: string;
    subtotal: number;
    delivery_fee: number;
    commission_amount: number;
    net_amount: number;
    delivery_otp: string;
    otp_expires_at: Date;
    estimated_delivery: Date;
    actual_delivery: Date;
    notes: string;
    created_at: Date;
    updated_at: Date;
}
