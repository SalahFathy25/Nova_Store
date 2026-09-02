export declare class UserSession {
    id: string;
    user_id: string;
    refresh_token_hash: string;
    device_info: Record<string, any>;
    ip_address: string;
    expires_at: Date;
    created_at: Date;
}
