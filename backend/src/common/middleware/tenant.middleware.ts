import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from './tenant-context.js';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      throw new UnauthorizedException('X-Tenant-ID header is required');
    }

    TenantContext.run(tenantId, () => {
      (req as any).tenantId = tenantId;
      next();
    });
  }
}
