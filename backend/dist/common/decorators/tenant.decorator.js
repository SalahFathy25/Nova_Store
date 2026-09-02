import { createParamDecorator } from '@nestjs/common';
import { TenantContext } from '../middleware/tenant-context.js';
export const CurrentTenantId = createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request['tenantId'] || TenantContext.getTenantId();
});
//# sourceMappingURL=tenant.decorator.js.map