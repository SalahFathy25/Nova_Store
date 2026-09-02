import { Repository } from 'typeorm';
import { Category } from './category.entity.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';
export declare class CategoriesService {
    private readonly categoryRepo;
    constructor(categoryRepo: Repository<Category>);
    findAll(tenantId: string): Promise<Category[]>;
    findOne(id: string, tenantId: string): Promise<Category>;
    findChildren(id: string, tenantId: string): Promise<Category[]>;
    create(dto: CreateCategoryDto, tenantId: string): Promise<Category>;
    update(id: string, dto: UpdateCategoryDto, tenantId: string): Promise<Category>;
    remove(id: string, tenantId: string): Promise<void>;
    private generateSlug;
}
