import { ProductsService } from './products.service.js';
import { CreateProductDto, UpdateProductDto, CreateVariantDto } from './dto/product.dto.js';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(tenantId: string, page?: number, limit?: number, search?: string, categoryId?: string, brandId?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, tenantId: string): Promise<any>;
    create(dto: CreateProductDto, tenantId: string): Promise<import("./product.entity.js").Product>;
    update(id: string, dto: UpdateProductDto, tenantId: string): Promise<import("./product.entity.js").Product>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
    addVariant(id: string, dto: CreateVariantDto, tenantId: string): Promise<import("./product-variant.entity.js").ProductVariant>;
    updateVariant(variantId: string, dto: Partial<CreateVariantDto>): Promise<import("./product-variant.entity.js").ProductVariant>;
    removeVariant(variantId: string): Promise<{
        message: string;
    }>;
    addImage(id: string, body: {
        url: string;
        alt_text?: string;
        is_primary?: boolean;
    }): Promise<import("./product-image.entity.js").ProductImage>;
    removeImage(imageId: string): Promise<{
        message: string;
    }>;
}
