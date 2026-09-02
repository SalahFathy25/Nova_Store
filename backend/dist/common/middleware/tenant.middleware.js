var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TenantContext } from './tenant-context.js';
let TenantMiddleware = class TenantMiddleware {
    use(req, _res, next) {
        const tenantId = req.headers['x-tenant-id'];
        if (!tenantId) {
            throw new UnauthorizedException('X-Tenant-ID header is required');
        }
        TenantContext.run(tenantId, () => {
            req.tenantId = tenantId;
            next();
        });
    }
};
TenantMiddleware = __decorate([
    Injectable()
], TenantMiddleware);
export { TenantMiddleware };
//# sourceMappingURL=tenant.middleware.js.map