import { AsyncLocalStorage } from 'async_hooks';
const asyncLocalStorage = new AsyncLocalStorage();
export class TenantContext {
    static run(tenantId, callback) {
        asyncLocalStorage.run(tenantId, callback);
    }
    static getTenantId() {
        return asyncLocalStorage.getStore();
    }
    static getTenantIdOrThrow() {
        const tenantId = this.getTenantId();
        if (!tenantId) {
            throw new Error('Tenant context not available');
        }
        return tenantId;
    }
}
//# sourceMappingURL=tenant-context.js.map