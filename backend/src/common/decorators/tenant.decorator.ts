import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContext } from '../middleware/tenant-context.js';

export const CurrentTenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request['tenantId'] || TenantContext.getTenantId();
  },
);
