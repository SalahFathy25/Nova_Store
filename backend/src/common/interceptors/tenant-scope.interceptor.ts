import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContext } from '../middleware/tenant-context.js';

@Injectable()
export class TenantScopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'] as string;

    if (tenantId) {
      return new Observable((subscriber) => {
        TenantContext.run(tenantId, () => {
          next.handle().subscribe(subscriber);
        });
      });
    }

    return next.handle();
  }
}
