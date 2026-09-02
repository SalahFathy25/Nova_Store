import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';
export declare class Notification {
    id: string;
    user_id: string;
    user: User;
    tenant_id: string;
    store: Store;
    title: string;
    body: string;
    data: Record<string, any>;
    type: string;
    is_read: boolean;
    created_at: Date;
}
