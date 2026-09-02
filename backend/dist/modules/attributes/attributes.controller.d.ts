import { AttributesService } from './attributes.service.js';
import { CreateAttributeDto, UpdateAttributeDto, CreateAttributeValueDto } from './dto/attribute.dto.js';
export declare class AttributesController {
    private readonly attributesService;
    constructor(attributesService: AttributesService);
    findAll(tenantId: string): Promise<any[]>;
    findOne(id: string, tenantId: string): Promise<any>;
    create(dto: CreateAttributeDto, tenantId: string): Promise<import("./attribute.entity.js").Attribute>;
    update(id: string, dto: UpdateAttributeDto, tenantId: string): Promise<import("./attribute.entity.js").Attribute>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
    addValue(id: string, dto: CreateAttributeValueDto, tenantId: string): Promise<import("./attribute-value.entity.js").AttributeValue>;
    removeValue(valueId: string): Promise<{
        message: string;
    }>;
}
