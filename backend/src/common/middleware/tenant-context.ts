import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<string>();

export class TenantContext {
  static run(tenantId: string, callback: () => void) {
    asyncLocalStorage.run(tenantId, callback);
  }

  static getTenantId(): string | undefined {
    return asyncLocalStorage.getStore();
  }

  static getTenantIdOrThrow(): string {
    const tenantId = this.getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not available');
    }
    return tenantId;
  }
}
