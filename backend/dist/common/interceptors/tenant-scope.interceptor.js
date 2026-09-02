var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContext } from '../middleware/tenant-context.js';
let TenantScopeInterceptor = class TenantScopeInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const tenantId = request.headers['x-tenant-id'];
        if (tenantId) {
            return new Observable((subscriber) => {
                TenantContext.run(tenantId, () => {
                    next.handle().subscribe(subscriber);
                });
            });
        }
        return next.handle();
    }
};
TenantScopeInterceptor = __decorate([
    Injectable()
], TenantScopeInterceptor);
export { TenantScopeInterceptor };
//# sourceMappingURL=tenant-scope.interceptor.js.map