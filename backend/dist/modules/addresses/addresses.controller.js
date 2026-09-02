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
import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service.js';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../../common/decorators/user.decorator.js';
let AddressesController = class AddressesController {
    addressesService;
    constructor(addressesService) {
        this.addressesService = addressesService;
    }
    async findAll(tenantId, userId) {
        return this.addressesService.getAll(tenantId, userId);
    }
    async findOne(id, tenantId, userId) {
        return this.addressesService.getOne(tenantId, userId, id);
    }
    async create(dto, tenantId, userId) {
        return this.addressesService.create(tenantId, userId, dto);
    }
    async update(id, dto, tenantId, userId) {
        return this.addressesService.update(tenantId, userId, id, dto);
    }
    async remove(id, tenantId, userId) {
        await this.addressesService.delete(tenantId, userId, id);
        return { message: 'Address deleted successfully' };
    }
    async setDefault(id, tenantId, userId) {
        return this.addressesService.setDefault(tenantId, userId, id);
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all user addresses' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get address by ID' }),
    __param(0, Param('id')),
    __param(1, CurrentTenantId()),
    __param(2, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "findOne", null);
__decorate([
    Post(),
    ApiOperation({ summary: 'Create a new address' }),
    __param(0, Body()),
    __param(1, CurrentTenantId()),
    __param(2, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAddressDto, String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "create", null);
__decorate([
    Put(':id'),
    ApiOperation({ summary: 'Update an address' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentTenantId()),
    __param(3, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateAddressDto, String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    ApiOperation({ summary: 'Delete an address' }),
    __param(0, Param('id')),
    __param(1, CurrentTenantId()),
    __param(2, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "remove", null);
__decorate([
    Patch(':id/default'),
    ApiOperation({ summary: 'Set address as default' }),
    __param(0, Param('id')),
    __param(1, CurrentTenantId()),
    __param(2, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "setDefault", null);
AddressesController = __decorate([
    ApiTags('Addresses'),
    Controller('api/v1/addresses'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    __metadata("design:paramtypes", [AddressesService])
], AddressesController);
export { AddressesController };
//# sourceMappingURL=addresses.controller.js.map