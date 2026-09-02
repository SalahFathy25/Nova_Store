import { Store } from '../stores/store.entity.js';
export declare class User {
    id: string;
    tenant_id: string;
    store: Store;
    full_name: string;
    email: string;
    phone: string;
    password_hash: string;
    role: string;
    avatar_url: string;
    fcm_token: string;
    is_active: boolean;
    is_verified: boolean;
    auth_provider: string;
    provider_uid: string;
    last_login_at: Date;
    created_at: Date;
    updated_at: Date;
}
