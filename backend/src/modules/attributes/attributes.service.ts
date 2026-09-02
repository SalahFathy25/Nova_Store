import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './attribute.entity.js';
import { AttributeValue } from './attribute-value.entity.js';
import { CreateAttributeDto, UpdateAttributeDto, CreateAttributeValueDto } from './dto/attribute.dto.js';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepo: Repository<Attribute>,
    @InjectRepository(AttributeValue)
    private readonly attributeValueRepo: Repository<AttributeValue>,
  ) {}

  async findAll(tenantId: string): Promise<any[]> {
    const attributes = await this.attributeRepo.find({
      where: { tenant_id: tenantId },
      order: { display_order: 'ASC' },
    });

    const result = await Promise.all(
      attributes.map(async (attr) => {
        const values = await this.attributeValueRepo.find({
          where: { attribute_id: attr.id },
          order: { display_order: 'ASC' },
        });
        return { ...attr, values };
      }),
    );

    return result;
  }

  async findOne(id: string, tenantId: string): Promise<any> {
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

  async create(dto: CreateAttributeDto, tenantId: string): Promise<Attribute> {
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

  async update(id: string, dto: UpdateAttributeDto, tenantId: string): Promise<Attribute> {
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

  async remove(id: string, tenantId: string): Promise<void> {
    const attribute = await this.findOne(id, tenantId);
    await this.attributeRepo.remove(attribute);
  }

  async addValue(attributeId: string, dto: CreateAttributeValueDto, tenantId: string): Promise<AttributeValue> {
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

  async removeValue(valueId: string): Promise<void> {
    const value = await this.attributeValueRepo.findOne({ where: { id: valueId } });
    if (!value) {
      throw new NotFoundException('Attribute value not found');
    }
    await this.attributeValueRepo.remove(value);
  }
}
