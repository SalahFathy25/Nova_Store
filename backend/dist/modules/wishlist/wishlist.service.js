var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductImage } from '../products/product-image.entity.js';
let WishlistService = class WishlistService {
    wishlistItemRepo;
    productRepo;
    productImageRepo;
    constructor(wishlistItemRepo, productRepo, productImageRepo) {
        this.wishlistItemRepo = wishlistItemRepo;
        this.productRepo = productRepo;
        this.productImageRepo = productImageRepo;
    }
    async getWishlist(tenantId, userId) {
        const items = await this.wishlistItemRepo.find({
            where: { tenant_id: tenantId, user_id: userId },
            relations: { product: true },
            order: { created_at: 'DESC' },
        });
        const enrichedItems = await Promise.all(items.map(async (item) => {
            const images = await this.productImageRepo.find({
                where: { product_id: item.product_id },
                order: { display_order: 'ASC' },
            });
            const primaryImage = images.find((img) => img.is_primary);
            const thumbnail = primaryImage?.url ?? images[0]?.url ?? null;
            return {
                id: item.id,
                product_id: item.product_id,
                product_title: item.product?.title,
                product_slug: item.product?.slug,
                product_base_price: item.product?.base_price,
                product_compare_at_price: item.product?.compare_at_price,
                product_is_active: item.product?.is_active,
                thumbnail,
                images: images.map((img) => ({
                    id: img.id,
                    url: img.url,
                    alt_text: img.alt_text,
                    is_primary: img.is_primary,
                })),
                created_at: item.created_at,
            };
        }));
        return {
            items: enrichedItems,
            item_count: enrichedItems.length,
        };
    }
    async addToWishlist(tenantId, userId, productId) {
        const product = await this.productRepo.findOne({
            where: { id: productId, tenant_id: tenantId, is_active: true },
        });
        if (!product) {
            throw new NotFoundException('Product not found or inactive');
        }
        const existing = await this.wishlistItemRepo.findOne({
            where: { tenant_id: tenantId, user_id: userId, product_id: productId },
        });
        if (existing) {
            throw new ConflictException('Product is already in your wishlist');
        }
        const wishlistItem = this.wishlistItemRepo.create({
            tenant_id: tenantId,
            user_id: userId,
            product_id: productId,
        });
        await this.wishlistItemRepo.save(wishlistItem);
        return this.getWishlist(tenantId, userId);
    }
    async removeFromWishlist(tenantId, userId, productId) {
        const item = await this.wishlistItemRepo.findOne({
            where: { tenant_id: tenantId, user_id: userId, product_id: productId },
        });
        if (!item) {
            throw new NotFoundException('Product not found in wishlist');
        }
        await this.wishlistItemRepo.remove(item);
        return this.getWishlist(tenantId, userId);
    }
    async isInWishlist(tenantId, userId, productId) {
        const item = await this.wishlistItemRepo.findOne({
            where: { tenant_id: tenantId, user_id: userId, product_id: productId },
        });
        return !!item;
    }
};
WishlistService = __decorate([
    Injectable(),
    __param(0, InjectRepository(WishlistItem)),
    __param(1, InjectRepository(Product)),
    __param(2, InjectRepository(ProductImage)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository])
], WishlistService);
export { WishlistService };
//# sourceMappingURL=wishlist.service.js.map