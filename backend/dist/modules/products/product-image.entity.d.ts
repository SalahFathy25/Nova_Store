import { Product } from './product.entity.js';
export declare class ProductImage {
    id: string;
    product_id: string;
    product: Product;
    url: string;
    alt_text: string;
    display_order: number;
    is_primary: boolean;
    variants: Record<string, any>;
    created_at: Date;
}
