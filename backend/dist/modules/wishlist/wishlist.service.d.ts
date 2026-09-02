import { Repository } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductImage } from '../products/product-image.entity.js';
export declare class WishlistService {
    private readonly wishlistItemRepo;
    private readonly productRepo;
    private readonly productImageRepo;
    constructor(wishlistItemRepo: Repository<WishlistItem>, productRepo: Repository<Product>, productImageRepo: Repository<ProductImage>);
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
    addToWishlist(tenantId: string, userId: string, productId: string): Promise<{
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
    isInWishlist(tenantId: string, userId: string, productId: string): Promise<boolean>;
}
