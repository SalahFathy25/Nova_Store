export declare class TenantContext {
    static run(tenantId: string, callback: () => void): void;
    static getTenantId(): string | undefined;
    static getTenantIdOrThrow(): string;
}
