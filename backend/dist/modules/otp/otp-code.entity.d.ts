import { Store } from '../stores/store.entity.js';
export declare class OtpCode {
    id: string;
    phone: string;
    tenant_id: string;
    store: Store;
    code: string;
    purpose: string;
    expires_at: Date;
    used: boolean;
    attempts: number;
    created_at: Date;
}
