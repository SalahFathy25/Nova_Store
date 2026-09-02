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
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity.js';
let BrandsService = class BrandsService {
    brandRepo;
    constructor(brandRepo) {
        this.brandRepo = brandRepo;
    }
    async findAll(tenantId) {
        return this.brandRepo.find({
            where: { tenant_id: tenantId },
            order: { name: 'ASC' },
        });
    }
    async findOne(id, tenantId) {
        const brand = await this.brandRepo.findOne({
            where: { id, tenant_id: tenantId },
        });
        if (!brand) {
            throw new NotFoundException('Brand not found');
        }
        return brand;
    }
    async create(dto, tenantId) {
        const slug = dto.slug || this.generateSlug(dto.name);
        const existing = await this.brandRepo.findOne({
            where: { tenant_id: tenantId, slug },
        });
        if (existing) {
            throw new BadRequestException('Brand with this slug already exists');
        }
        const brand = this.brandRepo.create({
            ...dto,
            tenant_id: tenantId,
            slug,
        });
        return this.brandRepo.save(brand);
    }
    async update(id, dto, tenantId) {
        const brand = await this.findOne(id, tenantId);
        if (dto.slug && dto.slug !== brand.slug) {
            const existing = await this.brandRepo.findOne({
                where: { tenant_id: tenantId, slug: dto.slug },
            });
            if (existing) {
                throw new BadRequestException('Brand with this slug already exists');
            }
        }
        Object.assign(brand, dto);
        return this.brandRepo.save(brand);
    }
    async remove(id, tenantId) {
        const brand = await this.findOne(id, tenantId);
        await this.brandRepo.remove(brand);
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
};
BrandsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Brand)),
    __metadata("design:paramtypes", [Repository])
], BrandsService);
export { BrandsService };
//# sourceMappingURL=brands.service.js.map