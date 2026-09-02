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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddress } from './user-address.entity.js';
let AddressesService = class AddressesService {
    addressRepo;
    constructor(addressRepo) {
        this.addressRepo = addressRepo;
    }
    async getAll(tenantId, userId) {
        return this.addressRepo.find({
            where: { tenant_id: tenantId, user_id: userId },
            order: { is_default: 'DESC', created_at: 'DESC' },
        });
    }
    async getOne(tenantId, userId, id) {
        const address = await this.addressRepo.findOne({
            where: { id, tenant_id: tenantId, user_id: userId },
        });
        if (!address) {
            throw new NotFoundException('Address not found');
        }
        return address;
    }
    async create(tenantId, userId, dto) {
        if (dto.is_default) {
            await this.unsetDefaults(tenantId, userId);
        }
        const address = this.addressRepo.create({
            ...dto,
            tenant_id: tenantId,
            user_id: userId,
        });
        return this.addressRepo.save(address);
    }
    async update(tenantId, userId, id, dto) {
        const address = await this.getOne(tenantId, userId, id);
        if (dto.is_default) {
            await this.unsetDefaults(tenantId, userId);
        }
        Object.assign(address, dto);
        return this.addressRepo.save(address);
    }
    async delete(tenantId, userId, id) {
        const address = await this.getOne(tenantId, userId, id);
        await this.addressRepo.remove(address);
    }
    async setDefault(tenantId, userId, id) {
        const address = await this.getOne(tenantId, userId, id);
        await this.unsetDefaults(tenantId, userId);
        address.is_default = true;
        return this.addressRepo.save(address);
    }
    async unsetDefaults(tenantId, userId) {
        await this.addressRepo.update({ tenant_id: tenantId, user_id: userId, is_default: true }, { is_default: false });
    }
};
AddressesService = __decorate([
    Injectable(),
    __param(0, InjectRepository(UserAddress)),
    __metadata("design:paramtypes", [Repository])
], AddressesService);
export { AddressesService };
//# sourceMappingURL=addresses.service.js.map