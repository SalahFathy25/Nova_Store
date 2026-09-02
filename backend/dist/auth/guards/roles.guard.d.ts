import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
declare const RolesGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class RolesGuard extends RolesGuard_base {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest(err: any, user: any, info: any, context: ExecutionContext): any;
}
export {};
