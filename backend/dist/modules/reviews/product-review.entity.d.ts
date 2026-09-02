import { Product } from '../products/product.entity.js';
import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';
export declare class ProductReview {
    id: string;
    product_id: string;
    product: Product;
    user_id: string;
    user: User;
    tenant_id: string;
    store: Store;
    order_id: string;
    rating: number;
    title: string;
    comment: string;
    images: string[];
    is_verified_purchase: boolean;
    is_approved: boolean;
    helpful_count: number;
    created_at: Date;
}
