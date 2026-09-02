import { Repository } from 'typeorm';
import { Attribute } from './attribute.entity.js';
import { AttributeValue } from './attribute-value.entity.js';
import { CreateAttributeDto, UpdateAttributeDto, CreateAttributeValueDto } from './dto/attribute.dto.js';
export declare class AttributesService {
    private readonly attributeRepo;
    private readonly attributeValueRepo;
    constructor(attributeRepo: Repository<Attribute>, attributeValueRepo: Repository<AttributeValue>);
    findAll(tenantId: string): Promise<any[]>;
    findOne(id: string, tenantId: string): Promise<any>;
    create(dto: CreateAttributeDto, tenantId: string): Promise<Attribute>;
    update(id: string, dto: UpdateAttributeDto, tenantId: string): Promise<Attribute>;
    remove(id: string, tenantId: string): Promise<void>;
    addValue(attributeId: string, dto: CreateAttributeValueDto, tenantId: string): Promise<AttributeValue>;
    removeValue(valueId: string): Promise<void>;
}
