import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(tenantId: string): Promise<import("./category.entity.js").Category[]>;
    findOne(id: string, tenantId: string): Promise<import("./category.entity.js").Category>;
    create(dto: CreateCategoryDto, tenantId: string): Promise<import("./category.entity.js").Category>;
    update(id: string, dto: UpdateCategoryDto, tenantId: string): Promise<import("./category.entity.js").Category>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
