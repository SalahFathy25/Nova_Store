import { SubOrder } from './sub-order.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductVariant } from '../products/product-variant.entity.js';
export declare class OrderItem {
    id: string;
    sub_order_id: string;
    sub_order: SubOrder;
    product_id: string;
    product: Product;
    product_variant_id: string;
    product_variant: ProductVariant;
    product_title: string;
    variant_title: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    discount_amount: number;
    tax_amount: number;
    image_url: string;
    created_at: Date;
}
