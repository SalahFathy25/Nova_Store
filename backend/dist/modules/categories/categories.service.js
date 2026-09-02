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
import { Repository, IsNull } from 'typeorm';
import { Category } from './category.entity.js';
let CategoriesService = class CategoriesService {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async findAll(tenantId) {
        return this.categoryRepo.find({
            where: { tenant_id: tenantId, parent_id: IsNull() },
            order: { display_order: 'ASC' },
        });
    }
    async findOne(id, tenantId) {
        const category = await this.categoryRepo.findOne({
            where: { id, tenant_id: tenantId },
        });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }
    async findChildren(id, tenantId) {
        return this.categoryRepo.find({
            where: { parent_id: id, tenant_id: tenantId },
            order: { display_order: 'ASC' },
        });
    }
    async create(dto, tenantId) {
        const slug = dto.slug || this.generateSlug(dto.name);
        const existing = await this.categoryRepo.findOne({
            where: { tenant_id: tenantId, slug },
        });
        if (existing) {
            throw new BadRequestException('Category with this slug already exists');
        }
        const category = this.categoryRepo.create({
            ...dto,
            tenant_id: tenantId,
            slug,
        });
        return this.categoryRepo.save(category);
    }
    async update(id, dto, tenantId) {
        const category = await this.findOne(id, tenantId);
        if (dto.slug && dto.slug !== category.slug) {
            const existing = await this.categoryRepo.findOne({
                where: { tenant_id: tenantId, slug: dto.slug },
            });
            if (existing) {
                throw new BadRequestException('Category with this slug already exists');
            }
        }
        Object.assign(category, dto);
        return this.categoryRepo.save(category);
    }
    async remove(id, tenantId) {
        const category = await this.findOne(id, tenantId);
        await this.categoryRepo.remove(category);
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
};
CategoriesService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Category)),
    __metadata("design:paramtypes", [Repository])
], CategoriesService);
export { CategoriesService };
//# sourceMappingURL=categories.service.js.map