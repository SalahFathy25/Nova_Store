import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service.js';
import {
  StartShiftDto,
  UpdateLocationDto,
  VerifyDeliveryOtpDto,
  SubmitCashDto,
  AssignDriverDto,
  UpdateOrderStatusDto,
  RegisterDriverDto,
} from './dto/index.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../../common/decorators/user.decorator.js';

@ApiTags('Delivery')
@Controller('api/v1/delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  // ─── Driver Auth & Profile ──────────────────────────────────
  @Post('drivers/register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new driver (Admin only)' })
  async registerDriver(
    @CurrentTenantId() tenantId: string,
    @Body() dto: RegisterDriverDto,
  ) {
    return this.deliveryService.registerDriver(tenantId, dto);
  }

  @Get('drivers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all drivers (Admin only)' })
  async getAllDrivers(@CurrentTenantId() tenantId: string) {
    return this.deliveryService.getAllDrivers(tenantId);
  }

  @Get('drivers/me')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own profile (Driver)' })
  async getMyProfile(@CurrentUser('id') driverId: string) {
    return this.deliveryService.getDriverProfile(driverId);
  }

  @Patch('drivers/me')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own profile (Driver)' })
  async updateMyProfile(
    @CurrentUser('id') driverId: string,
    @Body() data: Partial<RegisterDriverDto>,
  ) {
    return this.deliveryService.updateDriverProfile(driverId, data as any);
  }

  @Get('drivers/:id/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get driver stats (Admin only)' })
  async getDriverStats(@Param('id') driverId: string) {
    return this.deliveryService.getDriverStats(driverId);
  }

  // ─── Shift Management ───────────────────────────────────────
  @Post('shifts/start')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a delivery shift (Driver)' })
  async startShift(
    @CurrentUser('id') driverId: string,
    @CurrentTenantId() tenantId: string,
  ) {
    return this.deliveryService.startShift(driverId, tenantId);
  }

  @Patch('shifts/:id/end')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'End a delivery shift (Driver)' })
  async endShift(
    @Param('id') shiftId: string,
    @CurrentUser('id') driverId: string,
  ) {
    return this.deliveryService.endShift(shiftId, driverId);
  }

  @Get('shifts/active')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active shift (Driver)' })
  async getActiveShift(@CurrentUser('id') driverId: string) {
    return this.deliveryService.getActiveShift(driverId);
  }

  @Get('shifts/history')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get shift history (Driver)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getShiftHistory(
    @CurrentUser('id') driverId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.deliveryService.getShiftHistory(driverId, page, limit);
  }

  // ─── Location Tracking ──────────────────────────────────────
  @Post('location')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update driver location (Driver)' })
  async updateLocation(
    @CurrentUser('id') driverId: string,
    @CurrentTenantId() tenantId: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.deliveryService.updateLocation(driverId, tenantId, dto);
  }

  @Get('location/:driverId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get driver location (Admin)' })
  async getDriverLocation(@Param('driverId') driverId: string) {
    return this.deliveryService.getDriverLocation(driverId);
  }

  @Get('location/order/:subOrderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get driver location for an order' })
  async getSubOrderDriverLocation(@Param('subOrderId') subOrderId: string) {
    return this.deliveryService.getSubOrderDriverLocation(subOrderId);
  }

  // ─── Order Assignment ───────────────────────────────────────
  @Post('orders/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign driver to order (Admin)' })
  async assignDriver(
    @CurrentTenantId() tenantId: string,
    @Body() dto: AssignDriverDto,
  ) {
    return this.deliveryService.assignDriver(dto, tenantId);
  }

  @Get('orders/my')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my assigned orders (Driver)' })
  @ApiQuery({ name: 'status', required: false, type: String })
  async getMyOrders(
    @CurrentUser('id') driverId: string,
    @Query('status') status?: string,
  ) {
    return this.deliveryService.getDriverOrders(driverId, status);
  }

  @Get('orders/unassigned')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unassigned orders (Admin)' })
  async getUnassignedOrders(@CurrentTenantId() tenantId: string) {
    return this.deliveryService.getUnassignedOrders(tenantId);
  }

  @Patch('orders/:subOrderId/status')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order delivery status (Driver)' })
  async updateOrderStatus(
    @Param('subOrderId') subOrderId: string,
    @CurrentUser('id') driverId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.deliveryService.updateOrderStatus(subOrderId, driverId, dto);
  }

  // ─── OTP Verification ───────────────────────────────────────
  @Post('orders/:subOrderId/verify-otp')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify delivery OTP (Driver)' })
  async verifyDeliveryOtp(
    @Param('subOrderId') subOrderId: string,
    @CurrentUser('id') driverId: string,
    @Body() dto: VerifyDeliveryOtpDto,
  ) {
    return this.deliveryService.verifyDeliveryOtp(subOrderId, driverId, dto);
  }

  // ─── Cash Ledger ────────────────────────────────────────────
  @Post('cash/submit')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit collected cash (Driver)' })
  async submitCash(
    @CurrentUser('id') driverId: string,
    @CurrentTenantId() tenantId: string,
    @Body() dto: SubmitCashDto,
  ) {
    return this.deliveryService.submitCash(driverId, tenantId, dto);
  }

  @Get('cash/ledger')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get cash ledger (Driver)' })
  @ApiQuery({ name: 'shift_id', required: false, type: String })
  async getCashLedger(
    @CurrentUser('id') driverId: string,
    @Query('shift_id') shiftId?: string,
  ) {
    return this.deliveryService.getCashLedger(driverId, shiftId);
  }

  @Get('cash/summary')
  @UseGuards(JwtAuthGuard)
  @Roles('driver')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get cash summary (Driver)' })
  async getCashSummary(@CurrentUser('id') driverId: string) {
    return this.deliveryService.getCashSummary(driverId);
  }

  // ─── Delivery Zones ─────────────────────────────────────────
  @Get('zones')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get delivery zones' })
  async getDeliveryZones(@CurrentTenantId() tenantId: string) {
    return this.deliveryService.getDeliveryZones(tenantId);
  }

  @Post('zones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create delivery zone (Admin)' })
  async createDeliveryZone(
    @CurrentTenantId() tenantId: string,
    @Body() data: Partial<any>,
  ) {
    return this.deliveryService.createDeliveryZone(tenantId, data);
  }
}
