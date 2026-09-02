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
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MarketingService } from './marketing.service.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
let MarketingController = class MarketingController {
    marketingService;
    constructor(marketingService) {
        this.marketingService = marketingService;
    }
    async getHomeSections(tenantId) {
        return this.marketingService.getHomeSections(tenantId);
    }
    async getBanners(tenantId, position) {
        return this.marketingService.getBanners(tenantId, position);
    }
    async getFlashSale(tenantId) {
        return this.marketingService.getFlashSale(tenantId);
    }
    async getFlashSaleProducts(tenantId, flashSaleId) {
        return this.marketingService.getFlashSaleProducts(tenantId, flashSaleId);
    }
};
__decorate([
    Get('home'),
    ApiOperation({ summary: 'Get home page sections with data' }),
    ApiResponse({ status: 200, description: 'Home sections retrieved successfully' }),
    __param(0, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getHomeSections", null);
__decorate([
    Get('banners'),
    ApiOperation({ summary: 'Get active banners' }),
    ApiQuery({ name: 'position', required: false, type: String }),
    ApiResponse({ status: 200, description: 'Banners retrieved successfully' }),
    __param(0, CurrentTenantId()),
    __param(1, Query('position')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getBanners", null);
__decorate([
    Get('flash-sales/current'),
    ApiOperation({ summary: 'Get current active flash sale with products' }),
    ApiResponse({ status: 200, description: 'Flash sale retrieved successfully' }),
    __param(0, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getFlashSale", null);
__decorate([
    Get('flash-sales/:id/products'),
    ApiOperation({ summary: 'Get products in a specific flash sale' }),
    ApiResponse({ status: 200, description: 'Flash sale products retrieved successfully' }),
    __param(0, CurrentTenantId()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getFlashSaleProducts", null);
MarketingController = __decorate([
    ApiTags('Marketing / Home'),
    Controller('api/v1'),
    __metadata("design:paramtypes", [MarketingService])
], MarketingController);
export { MarketingController };
//# sourceMappingURL=marketing.controller.js.map