export declare class CreateProductDto {
    title: string;
    slug?: string;
    description?: string;
    short_description?: string;
    base_price: number;
    compare_at_price?: number;
    cost_price?: number;
    sku?: string;
    category_id?: string;
    brand_id?: string;
    tags?: string[];
}
export declare class UpdateProductDto {
    title?: string;
    slug?: string;
    description?: string;
    short_description?: string;
    base_price?: number;
    compare_at_price?: number;
    is_active?: boolean;
    is_featured?: boolean;
    category_id?: string;
    brand_id?: string;
}
export declare class CreateVariantDto {
    sku: string;
    title?: string;
    attributes?: Record<string, any>;
    price_override?: number;
    stock_quantity: number;
}
