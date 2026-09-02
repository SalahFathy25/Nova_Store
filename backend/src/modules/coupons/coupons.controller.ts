import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CouponsService } from './coupons.service.js';
import { ValidateCouponDto } from './dto/coupon.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../../common/decorators/user.decorator.js';

@ApiTags('Coupons')
@Controller('api/v1/coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate a coupon code' })
  @ApiResponse({ status: 200, description: 'Coupon validation result' })
  async validateCoupon(
    @Body() dto: ValidateCouponDto,
    @CurrentTenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.couponsService.validateCoupon(
      tenantId,
      dto.code,
      dto.subtotal,
      userId,
    );
  }
}
