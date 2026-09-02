import { User } from '../users/user.entity.js';
import { Product } from '../products/product.entity.js';
import { Store } from '../stores/store.entity.js';
export declare class WishlistItem {
    id: string;
    user_id: string;
    user: User;
    product_id: string;
    product: Product;
    tenant_id: string;
    store: Store;
    created_at: Date;
}
