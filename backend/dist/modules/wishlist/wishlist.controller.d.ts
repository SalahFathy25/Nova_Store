import { WishlistService } from './wishlist.service.js';
declare class AddToWishlistDto {
    product_id: string;
}
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(tenantId: string, userId: string): Promise<{
        items: {
            id: string;
            product_id: string;
            product_title: string;
            product_slug: string;
            product_base_price: number;
            product_compare_at_price: number;
            product_is_active: boolean;
            thumbnail: string;
            images: {
                id: string;
                url: string;
                alt_text: string;
                is_primary: boolean;
            }[];
            created_at: Date;
        }[];
        item_count: number;
    }>;
    addToWishlist(tenantId: string, userId: string, dto: AddToWishlistDto): Promise<{
        items: {
            id: string;
            product_id: string;
            product_title: string;
            product_slug: string;
            product_base_price: number;
            product_compare_at_price: number;
            product_is_active: boolean;
            thumbnail: string;
            images: {
                id: string;
                url: string;
                alt_text: string;
                is_primary: boolean;
            }[];
            created_at: Date;
        }[];
        item_count: number;
    }>;
    removeFromWishlist(tenantId: string, userId: string, productId: string): Promise<{
        items: {
            id: string;
            product_id: string;
            product_title: string;
            product_slug: string;
            product_base_price: number;
            product_compare_at_price: number;
            product_is_active: boolean;
            thumbnail: string;
            images: {
                id: string;
                url: string;
                alt_text: string;
                is_primary: boolean;
            }[];
            created_at: Date;
        }[];
        item_count: number;
    }>;
}
export {};
