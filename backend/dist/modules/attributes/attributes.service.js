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
import { Attribute } from './attribute.entity.js';
import { AttributeValue } from './attribute-value.entity.js';
let AttributesService = class AttributesService {
    attributeRepo;
    attributeValueRepo;
    constructor(attributeRepo, attributeValueRepo) {
        this.attributeRepo = attributeRepo;
        this.attributeValueRepo = attributeValueRepo;
    }
    async findAll(tenantId) {
        const attributes = await this.attributeRepo.find({
            where: { tenant_id: tenantId },
            order: { display_order: 'ASC' },
        });
        const result = await Promise.all(attributes.map(async (attr) => {
            const values = await this.attributeValueRepo.find({
                where: { attribute_id: attr.id },
                order: { display_order: 'ASC' },
            });
            return { ...attr, values };
        }));
        return result;
    }
    async findOne(id, tenantId) {
        const attribute = await this.attributeRepo.findOne({
            where: { id, tenant_id: tenantId },
        });
        if (!attribute) {
            throw new NotFoundException('Attribute not found');
        }
        const values = await this.attributeValueRepo.find({
            where: { attribute_id: id },
            order: { display_order: 'ASC' },
        });
        return { ...attribute, values };
    }
    async create(dto, tenantId) {
        const existing = await this.attributeRepo.findOne({
            where: { tenant_id: tenantId, name: dto.name },
        });
        if (existing) {
            throw new BadRequestException('Attribute with this name already exists');
        }
        const attribute = this.attributeRepo.create({
            ...dto,
            tenant_id: tenantId,
        });
        return this.attributeRepo.save(attribute);
    }
    async update(id, dto, tenantId) {
        const attribute = await this.findOne(id, tenantId);
        if (dto.name && dto.name !== attribute.name) {
            const existing = await this.attributeRepo.findOne({
                where: { tenant_id: tenantId, name: dto.name },
            });
            if (existing) {
                throw new BadRequestException('Attribute with this name already exists');
            }
        }
        Object.assign(attribute, dto);
        return this.attributeRepo.save(attribute);
    }
    async remove(id, tenantId) {
        const attribute = await this.findOne(id, tenantId);
        await this.attributeRepo.remove(attribute);
    }
    async addValue(attributeId, dto, tenantId) {
        await this.findOne(attributeId, tenantId);
        const existing = await this.attributeValueRepo.findOne({
            where: { attribute_id: attributeId, value: dto.value },
        });
        if (existing) {
            throw new BadRequestException('Attribute value already exists');
        }
        const value = this.attributeValueRepo.create({
            ...dto,
            attribute_id: attributeId,
        });
        return this.attributeValueRepo.save(value);
    }
    async removeValue(valueId) {
        const value = await this.attributeValueRepo.findOne({ where: { id: valueId } });
        if (!value) {
            throw new NotFoundException('Attribute value not found');
        }
        await this.attributeValueRepo.remove(value);
    }
};
AttributesService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Attribute)),
    __param(1, InjectRepository(AttributeValue)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], AttributesService);
export { AttributesService };
//# sourceMappingURL=attributes.service.js.map