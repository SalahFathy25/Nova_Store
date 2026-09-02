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
import { AttributesService } from './attributes.service.js';
import { CreateAttributeDto, UpdateAttributeDto, CreateAttributeValueDto } from './dto/attribute.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
let AttributesController = class AttributesController {
    attributesService;
    constructor(attributesService) {
        this.attributesService = attributesService;
    }
    async findAll(tenantId) {
        return this.attributesService.findAll(tenantId);
    }
    async findOne(id, tenantId) {
        return this.attributesService.findOne(id, tenantId);
    }
    async create(dto, tenantId) {
        return this.attributesService.create(dto, tenantId);
    }
    async update(id, dto, tenantId) {
        return this.attributesService.update(id, dto, tenantId);
    }
    async remove(id, tenantId) {
        await this.attributesService.remove(id, tenantId);
        return { message: 'Attribute deleted successfully' };
    }
    async addValue(id, dto, tenantId) {
        return this.attributesService.addValue(id, dto, tenantId);
    }
    async removeValue(valueId) {
        await this.attributesService.removeValue(valueId);
        return { message: 'Attribute value deleted successfully' };
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all attributes' }),
    __param(0, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get attribute by ID' }),
    __param(0, Param('id')),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "findOne", null);
__decorate([
    Post(),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create an attribute' }),
    __param(0, Body()),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAttributeDto, String]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "create", null);
__decorate([
    Put(':id'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update an attribute' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateAttributeDto, String]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete an attribute' }),
    __param(0, Param('id')),
    __param(1, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "remove", null);
__decorate([
    Post(':id/values'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add attribute value' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentTenantId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateAttributeValueDto, String]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "addValue", null);
__decorate([
    Delete('values/:valueId'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remove attribute value' }),
    __param(0, Param('valueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "removeValue", null);
AttributesController = __decorate([
    ApiTags('Attributes'),
    Controller('api/v1/attributes'),
    __metadata("design:paramtypes", [AttributesService])
], AttributesController);
export { AttributesController };
//# sourceMappingURL=attributes.controller.js.map