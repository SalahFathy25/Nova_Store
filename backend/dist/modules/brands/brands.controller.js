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
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BrandsService } from './brands.service.js';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
let BrandsController = class BrandsController {
    brandsService;
    constructor(brandsService) {
        this.brandsService = brandsService;
    }
    async findAll(tenantId) {
        return this.brandsService.findAll(tenantId);
    }
    async findOne(id, tenantId) {
        return this.brandsService.findOne(id, tenantId);
    }
    async create(dto, tenantId) {
        return this.brandsService.create(dto, tenantId);
    }
    async update(id, dto, tenantId) {
        return this.brandsService.update(id, dto, tenantId);
    }
    async remove(id, tenantId) {
        await this.brandsService.remove(id, tenantId);
        return { message: 'Brand deleted successfully' };
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all brands' }),
    __param(0, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get brand by ID' }),
    __param(0, Param('id')),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "findOne", null);
__decorate([
    Post(),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a brand' }),
    __param(0, Body()),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateBrandDto, String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "create", null);
__decorate([
    Put(':id'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a brand' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateBrandDto, String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a brand' }),
    __param(0, Param('id')),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "remove", null);
BrandsController = __decorate([
    ApiTags('Brands'),
    Controller('api/v1/brands'),
    __metadata("design:paramtypes", [BrandsService])
], BrandsController);
export { BrandsController };
//# sourceMappingURL=brands.controller.js.map