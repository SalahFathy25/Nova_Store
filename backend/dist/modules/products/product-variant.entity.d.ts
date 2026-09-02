import { Product } from './product.entity.js';
import { Store } from '../stores/store.entity.js';
export declare class ProductVariant {
    id: string;
    product_id: string;
    product: Product;
    tenant_id: string;
    store: Store;
    sku: string;
    title: string;
    attributes: Record<string, any>;
    price_override: number;
    compare_at_price: number;
    cost_price: number;
    stock_quantity: number;
    low_stock_threshold: number;
    weight: number;
    barcode: string;
    is_active: boolean;
    image_url: string;
    created_at: Date;
    updated_at: Date;
}
