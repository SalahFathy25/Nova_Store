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
import { Controller, Get, Post, Delete, Body, Param, UseGuards, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../../common/decorators/user.decorator.js';
import { IsUUID } from 'class-validator';
class AddToWishlistDto {
    product_id;
}
__decorate([
    ApiProperty({ description: 'Product ID to add to wishlist' }),
    IsUUID(),
    __metadata("design:type", String)
], AddToWishlistDto.prototype, "product_id", void 0);
let WishlistController = class WishlistController {
    wishlistService;
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }
    async getWishlist(tenantId, userId) {
        return this.wishlistService.getWishlist(tenantId, userId);
    }
    async addToWishlist(tenantId, userId, dto) {
        return this.wishlistService.addToWishlist(tenantId, userId, dto.product_id);
    }
    async removeFromWishlist(tenantId, userId, productId) {
        return this.wishlistService.removeFromWishlist(tenantId, userId, productId);
    }
};
__decorate([
    Get(),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get user wishlist' }),
    ApiResponse({ status: 200, description: 'Wishlist retrieved successfully' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "getWishlist", null);
__decorate([
    Post(),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add product to wishlist' }),
    ApiResponse({ status: 201, description: 'Product added to wishlist' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, AddToWishlistDto]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "addToWishlist", null);
__decorate([
    Delete(':productId'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remove product from wishlist' }),
    ApiResponse({ status: 200, description: 'Product removed from wishlist' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __param(2, Param('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "removeFromWishlist", null);
WishlistController = __decorate([
    ApiTags('Wishlist'),
    Controller('api/v1/wishlist'),
    __metadata("design:paramtypes", [WishlistService])
], WishlistController);
export { WishlistController };
//# sourceMappingURL=wishlist.controller.js.map