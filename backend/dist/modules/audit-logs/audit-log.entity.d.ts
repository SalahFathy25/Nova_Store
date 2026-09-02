import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';
export declare class AuditLog {
    id: string;
    tenant_id: string;
    store: Store;
    user_id: string;
    user: User;
    action: string;
    entity: string;
    entity_id: string;
    old_values: Record<string, any>;
    new_values: Record<string, any>;
    ip_address: string;
    user_agent: string;
    created_at: Date;
}
