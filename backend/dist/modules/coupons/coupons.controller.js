var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CouponsService } from './coupons.service.js';
import { ValidateCouponDto } from './dto/coupon.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../../common/decorators/user.decorator.js';
let CouponsController = class CouponsController {
    couponsService;
    constructor(couponsService) {
        this.couponsService = couponsService;
    }
    async validateCoupon(dto, tenantId, userId) {
        return this.couponsService.validateCoupon(tenantId, dto.code, dto.subtotal, userId);
    }
};
__decorate([
    Post('validate'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Validate a coupon code' }),
    ApiResponse({ status: 200, description: 'Coupon validation result' }),
    __param(0, Body()),
    __param(1, CurrentTenantId()),
    __param(2, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ValidateCouponDto, String, String]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "validateCoupon", null);
CouponsController = __decorate([
    ApiTags('Coupons'),
    Controller('api/v1/coupons'),
    __metadata("design:paramtypes", [CouponsService])
], CouponsController);
export { CouponsController };
//# sourceMappingURL=coupons.controller.js.map