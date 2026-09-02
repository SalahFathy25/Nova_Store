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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/order.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../../common/decorators/user.decorator.js';
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async getOrders(tenantId, userId, page, limit) {
        return this.ordersService.getOrders(tenantId, userId, page, limit);
    }
    async getOrder(tenantId, userId, orderId) {
        return this.ordersService.getOrder(tenantId, userId, orderId);
    }
    async createOrder(tenantId, userId, dto) {
        return this.ordersService.createOrder(tenantId, userId, dto);
    }
    async cancelOrder(tenantId, userId, orderId) {
        return this.ordersService.cancelOrder(tenantId, userId, orderId);
    }
};
__decorate([
    Get(),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get user orders (paginated)' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __param(2, Query('page', new DefaultValuePipe(1), ParseIntPipe)),
    __param(3, Query('limit', new DefaultValuePipe(10), ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrders", null);
__decorate([
    Get(':id'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get order detail' }),
    ApiResponse({ status: 200, description: 'Order retrieved successfully' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __param(2, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrder", null);
__decorate([
    Post(),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create order from cart' }),
    ApiResponse({ status: 201, description: 'Order created successfully' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    Patch(':id/cancel'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Cancel an order' }),
    ApiResponse({ status: 200, description: 'Order cancelled successfully' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __param(2, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "cancelOrder", null);
OrdersController = __decorate([
    ApiTags('Orders'),
    Controller('api/v1/orders'),
    __metadata("design:paramtypes", [OrdersService])
], OrdersController);
export { OrdersController };
//# sourceMappingURL=orders.controller.js.map