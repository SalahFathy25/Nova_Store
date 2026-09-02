import { Repository } from 'typeorm';
import { Brand } from './brand.entity.js';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto.js';
export declare class BrandsService {
    private readonly brandRepo;
    constructor(brandRepo: Repository<Brand>);
    findAll(tenantId: string): Promise<Brand[]>;
    findOne(id: string, tenantId: string): Promise<Brand>;
    create(dto: CreateBrandDto, tenantId: string): Promise<Brand>;
    update(id: string, dto: UpdateBrandDto, tenantId: string): Promise<Brand>;
    remove(id: string, tenantId: string): Promise<void>;
    private generateSlug;
}
