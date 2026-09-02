import { BrandsService } from './brands.service.js';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto.js';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    findAll(tenantId: string): Promise<import("./brand.entity.js").Brand[]>;
    findOne(id: string, tenantId: string): Promise<import("./brand.entity.js").Brand>;
    create(dto: CreateBrandDto, tenantId: string): Promise<import("./brand.entity.js").Brand>;
    update(id: string, dto: UpdateBrandDto, tenantId: string): Promise<import("./brand.entity.js").Brand>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
