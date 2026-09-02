import { Cart } from './cart.entity.js';
import { ProductVariant } from '../products/product-variant.entity.js';
export declare class CartItem {
    id: string;
    cart_id: string;
    cart: Cart;
    product_variant_id: string;
    product_variant: ProductVariant;
    quantity: number;
    unit_price: number;
    discount_amount: number;
    notes: string;
    created_at: Date;
}
