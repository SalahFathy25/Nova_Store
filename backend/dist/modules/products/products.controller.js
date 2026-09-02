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
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service.js';
import { CreateProductDto, UpdateProductDto, CreateVariantDto } from './dto/product.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    async findAll(tenantId, page, limit, search, categoryId, brandId) {
        return this.productsService.findAll(tenantId, page || 1, limit || 20, search, categoryId, brandId);
    }
    async findOne(id, tenantId) {
        return this.productsService.findOne(id, tenantId);
    }
    async create(dto, tenantId) {
        return this.productsService.create(dto, tenantId);
    }
    async update(id, dto, tenantId) {
        return this.productsService.update(id, dto, tenantId);
    }
    async remove(id, tenantId) {
        await this.productsService.remove(id, tenantId);
        return { message: 'Product deleted successfully' };
    }
    async addVariant(id, dto, tenantId) {
        return this.productsService.addVariant(id, dto, tenantId);
    }
    async updateVariant(variantId, dto) {
        return this.productsService.updateVariant(variantId, dto);
    }
    async removeVariant(variantId) {
        await this.productsService.removeVariant(variantId);
        return { message: 'Variant deleted successfully' };
    }
    async addImage(id, body) {
        return this.productsService.addImage(id, body.url, body.alt_text, body.is_primary);
    }
    async removeImage(imageId) {
        await this.productsService.removeImage(imageId);
        return { message: 'Image deleted successfully' };
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all products' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'search', required: false, type: String }),
    ApiQuery({ name: 'category_id', required: false, type: String }),
    ApiQuery({ name: 'brand_id', required: false, type: String }),
    __param(0, CurrentTenantId()),
    __param(1, Query('page')),
    __param(2, Query('limit')),
    __param(3, Query('search')),
    __param(4, Query('category_id')),
    __param(5, Query('brand_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get product by ID' }),
    __param(0, Param('id')),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    Post(),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a product' }),
    __param(0, Body()),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProductDto, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    Put(':id'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a product' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateProductDto, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a product' }),
    __param(0, Param('id')),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
__decorate([
    Post(':id/variants'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add product variant' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateVariantDto, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addVariant", null);
__decorate([
    Put('variants/:variantId'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update product variant' }),
    __param(0, Param('variantId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateVariant", null);
__decorate([
    Delete('variants/:variantId'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete product variant' }),
    __param(0, Param('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "removeVariant", null);
__decorate([
    Post(':id/images'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add product image' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addImage", null);
__decorate([
    Delete('images/:imageId'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remove product image' }),
    __param(0, Param('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "removeImage", null);
ProductsController = __decorate([
    ApiTags('Products'),
    Controller('api/v1/products'),
    __metadata("design:paramtypes", [ProductsService])
], ProductsController);
export { ProductsController };
//# sourceMappingURL=products.controller.js.map