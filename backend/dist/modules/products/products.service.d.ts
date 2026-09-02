import { Repository } from 'typeorm';
import { Product } from './product.entity.js';
import { ProductVariant } from './product-variant.entity.js';
import { ProductImage } from './product-image.entity.js';
import { CreateProductDto, UpdateProductDto, CreateVariantDto } from './dto/product.dto.js';
export declare class ProductsService {
    private readonly productRepo;
    private readonly variantRepo;
    private readonly imageRepo;
    constructor(productRepo: Repository<Product>, variantRepo: Repository<ProductVariant>, imageRepo: Repository<ProductImage>);
    findAll(tenantId: string, page?: number, limit?: number, search?: string, categoryId?: string, brandId?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, tenantId: string): Promise<any>;
    create(dto: CreateProductDto, tenantId: string): Promise<Product>;
    update(id: string, dto: UpdateProductDto, tenantId: string): Promise<Product>;
    remove(id: string, tenantId: string): Promise<void>;
    addVariant(productId: string, dto: CreateVariantDto, tenantId: string): Promise<ProductVariant>;
    updateVariant(variantId: string, dto: Partial<CreateVariantDto>): Promise<ProductVariant>;
    removeVariant(variantId: string): Promise<void>;
    addImage(productId: string, url: string, altText?: string, isPrimary?: boolean): Promise<ProductImage>;
    removeImage(imageId: string): Promise<void>;
    private generateSlug;
}
