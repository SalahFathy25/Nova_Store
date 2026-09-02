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
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartsService } from './carts.service.js';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../../common/decorators/user.decorator.js';
let CartsController = class CartsController {
    cartsService;
    constructor(cartsService) {
        this.cartsService = cartsService;
    }
    async getCart(tenantId, userId) {
        return this.cartsService.getCart(tenantId, userId);
    }
    async addItem(tenantId, userId, dto) {
        return this.cartsService.addToCart(tenantId, userId, dto);
    }
    async updateItem(tenantId, userId, itemId, dto) {
        return this.cartsService.updateCartItem(tenantId, userId, itemId, dto);
    }
    async removeItem(tenantId, userId, itemId) {
        return this.cartsService.removeCartItem(tenantId, userId, itemId);
    }
    async clearCart(tenantId, userId) {
        return this.cartsService.clearCart(tenantId, userId);
    }
};
__decorate([
    Get(),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get current user cart' }),
    ApiResponse({ status: 200, description: 'Cart retrieved successfully' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartsController.prototype, "getCart", null);
__decorate([
    Post('items'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add item to cart' }),
    ApiResponse({ status: 201, description: 'Item added to cart successfully' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, AddToCartDto]),
    __metadata("design:returntype", Promise)
], CartsController.prototype, "addItem", null);
__decorate([
    Patch('items/:id'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update cart item quantity' }),
    ApiResponse({ status: 200, description: 'Cart item updated successfully' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __param(2, Param('id')),
    __param(3, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, UpdateCartItemDto]),
    __metadata("design:returntype", Promise)
], CartsController.prototype, "updateItem", null);
__decorate([
    Delete('items/:id'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remove item from cart' }),
    ApiResponse({ status: 200, description: 'Cart item removed successfully' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __param(2, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CartsController.prototype, "removeItem", null);
__decorate([
    Delete(),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Clear all items from cart' }),
    ApiResponse({ status: 200, description: 'Cart cleared successfully' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartsController.prototype, "clearCart", null);
CartsController = __decorate([
    ApiTags('Cart'),
    Controller('api/v1/cart'),
    __metadata("design:paramtypes", [CartsService])
], CartsController);
export { CartsController };
//# sourceMappingURL=carts.controller.js.map