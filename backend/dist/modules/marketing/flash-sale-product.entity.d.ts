import { FlashSale } from './flash-sale.entity.js';
import { Product } from '../products/product.entity.js';
export declare class FlashSaleProduct {
    id: string;
    flash_sale_id: string;
    flash_sale: FlashSale;
    product_id: string;
    product: Product;
    flash_price: number;
    flash_stock: number;
    sold_count: number;
    created_at: Date;
}
