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
import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service.js';
import { UpdateLocationDto, VerifyDeliveryOtpDto, SubmitCashDto, AssignDriverDto, UpdateOrderStatusDto, RegisterDriverDto, } from './dto/index.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../../common/decorators/user.decorator.js';
let DeliveryController = class DeliveryController {
    deliveryService;
    constructor(deliveryService) {
        this.deliveryService = deliveryService;
    }
    async registerDriver(tenantId, dto) {
        return this.deliveryService.registerDriver(tenantId, dto);
    }
    async getAllDrivers(tenantId) {
        return this.deliveryService.getAllDrivers(tenantId);
    }
    async getMyProfile(driverId) {
        return this.deliveryService.getDriverProfile(driverId);
    }
    async updateMyProfile(driverId, data) {
        return this.deliveryService.updateDriverProfile(driverId, data);
    }
    async getDriverStats(driverId) {
        return this.deliveryService.getDriverStats(driverId);
    }
    async startShift(driverId, tenantId) {
        return this.deliveryService.startShift(driverId, tenantId);
    }
    async endShift(shiftId, driverId) {
        return this.deliveryService.endShift(shiftId, driverId);
    }
    async getActiveShift(driverId) {
        return this.deliveryService.getActiveShift(driverId);
    }
    async getShiftHistory(driverId, page, limit) {
        return this.deliveryService.getShiftHistory(driverId, page, limit);
    }
    async updateLocation(driverId, tenantId, dto) {
        return this.deliveryService.updateLocation(driverId, tenantId, dto);
    }
    async getDriverLocation(driverId) {
        return this.deliveryService.getDriverLocation(driverId);
    }
    async getSubOrderDriverLocation(subOrderId) {
        return this.deliveryService.getSubOrderDriverLocation(subOrderId);
    }
    async assignDriver(tenantId, dto) {
        return this.deliveryService.assignDriver(dto, tenantId);
    }
    async getMyOrders(driverId, status) {
        return this.deliveryService.getDriverOrders(driverId, status);
    }
    async getUnassignedOrders(tenantId) {
        return this.deliveryService.getUnassignedOrders(tenantId);
    }
    async updateOrderStatus(subOrderId, driverId, dto) {
        return this.deliveryService.updateOrderStatus(subOrderId, driverId, dto);
    }
    async verifyDeliveryOtp(subOrderId, driverId, dto) {
        return this.deliveryService.verifyDeliveryOtp(subOrderId, driverId, dto);
    }
    async submitCash(driverId, tenantId, dto) {
        return this.deliveryService.submitCash(driverId, tenantId, dto);
    }
    async getCashLedger(driverId, shiftId) {
        return this.deliveryService.getCashLedger(driverId, shiftId);
    }
    async getCashSummary(driverId) {
        return this.deliveryService.getCashSummary(driverId);
    }
    async getDeliveryZones(tenantId) {
        return this.deliveryService.getDeliveryZones(tenantId);
    }
    async createDeliveryZone(tenantId, data) {
        return this.deliveryService.createDeliveryZone(tenantId, data);
    }
};
__decorate([
    Post('drivers/register'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('admin', 'vendor_admin'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Register a new driver (Admin only)' }),
    __param(0, CurrentTenantId()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RegisterDriverDto]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "registerDriver", null);
__decorate([
    Get('drivers'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('admin', 'vendor_admin'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get all drivers (Admin only)' }),
    __param(0, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getAllDrivers", null);
__decorate([
    Get('drivers/me'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get own profile (Driver)' }),
    __param(0, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getMyProfile", null);
__decorate([
    Patch('drivers/me'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update own profile (Driver)' }),
    __param(0, CurrentUser('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "updateMyProfile", null);
__decorate([
    Get('drivers/:id/stats'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('admin', 'vendor_admin'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get driver stats (Admin only)' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDriverStats", null);
__decorate([
    Post('shifts/start'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Start a delivery shift (Driver)' }),
    __param(0, CurrentUser('id')),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "startShift", null);
__decorate([
    Patch('shifts/:id/end'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'End a delivery shift (Driver)' }),
    __param(0, Param('id')),
    __param(1, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "endShift", null);
__decorate([
    Get('shifts/active'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get active shift (Driver)' }),
    __param(0, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getActiveShift", null);
__decorate([
    Get('shifts/history'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get shift history (Driver)' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    __param(0, CurrentUser('id')),
    __param(1, Query('page', new DefaultValuePipe(1), ParseIntPipe)),
    __param(2, Query('limit', new DefaultValuePipe(20), ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getShiftHistory", null);
__decorate([
    Post('location'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update driver location (Driver)' }),
    __param(0, CurrentUser('id')),
    __param(1, CurrentTenantId()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UpdateLocationDto]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "updateLocation", null);
__decorate([
    Get('location/:driverId'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get driver location (Admin)' }),
    __param(0, Param('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDriverLocation", null);
__decorate([
    Get('location/order/:subOrderId'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get driver location for an order' }),
    __param(0, Param('subOrderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getSubOrderDriverLocation", null);
__decorate([
    Post('orders/assign'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('admin', 'vendor_admin'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Assign driver to order (Admin)' }),
    __param(0, CurrentTenantId()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AssignDriverDto]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "assignDriver", null);
__decorate([
    Get('orders/my'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get my assigned orders (Driver)' }),
    ApiQuery({ name: 'status', required: false, type: String }),
    __param(0, CurrentUser('id')),
    __param(1, Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getMyOrders", null);
__decorate([
    Get('orders/unassigned'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('admin', 'vendor_admin'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get unassigned orders (Admin)' }),
    __param(0, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getUnassignedOrders", null);
__decorate([
    Patch('orders/:subOrderId/status'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update order delivery status (Driver)' }),
    __param(0, Param('subOrderId')),
    __param(1, CurrentUser('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "updateOrderStatus", null);
__decorate([
    Post('orders/:subOrderId/verify-otp'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Verify delivery OTP (Driver)' }),
    __param(0, Param('subOrderId')),
    __param(1, CurrentUser('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, VerifyDeliveryOtpDto]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "verifyDeliveryOtp", null);
__decorate([
    Post('cash/submit'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Submit collected cash (Driver)' }),
    __param(0, CurrentUser('id')),
    __param(1, CurrentTenantId()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, SubmitCashDto]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "submitCash", null);
__decorate([
    Get('cash/ledger'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get cash ledger (Driver)' }),
    ApiQuery({ name: 'shift_id', required: false, type: String }),
    __param(0, CurrentUser('id')),
    __param(1, Query('shift_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getCashLedger", null);
__decorate([
    Get('cash/summary'),
    UseGuards(JwtAuthGuard),
    Roles('driver'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get cash summary (Driver)' }),
    __param(0, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getCashSummary", null);
__decorate([
    Get('zones'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get delivery zones' }),
    __param(0, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDeliveryZones", null);
__decorate([
    Post('zones'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('admin', 'vendor_admin'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create delivery zone (Admin)' }),
    __param(0, CurrentTenantId()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "createDeliveryZone", null);
DeliveryController = __decorate([
    ApiTags('Delivery'),
    Controller('api/v1/delivery'),
    __metadata("design:paramtypes", [DeliveryService])
], DeliveryController);
export { DeliveryController };
//# sourceMappingURL=delivery.controller.js.map