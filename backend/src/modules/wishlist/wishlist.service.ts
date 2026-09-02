import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductImage } from '../products/product-image.entity.js';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistItemRepo: Repository<WishlistItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepo: Repository<ProductImage>,
  ) {}

  async getWishlist(tenantId: string, userId: string) {
    const items = await this.wishlistItemRepo.find({
      where: { tenant_id: tenantId, user_id: userId },
      relations: { product: true },
      order: { created_at: 'DESC' },
    });

    const enrichedItems = await Promise.all(
      items.map(async (item) => {
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
      }),
    );

    return {
      items: enrichedItems,
      item_count: enrichedItems.length,
    };
  }

  async addToWishlist(tenantId: string, userId: string, productId: string) {
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

  async removeFromWishlist(tenantId: string, userId: string, productId: string) {
    const item = await this.wishlistItemRepo.findOne({
      where: { tenant_id: tenantId, user_id: userId, product_id: productId },
    });

    if (!item) {
      throw new NotFoundException('Product not found in wishlist');
    }

    await this.wishlistItemRepo.remove(item);

    return this.getWishlist(tenantId, userId);
  }

  async isInWishlist(tenantId: string, userId: string, productId: string): Promise<boolean> {
    const item = await this.wishlistItemRepo.findOne({
      where: { tenant_id: tenantId, user_id: userId, product_id: productId },
    });

    return !!item;
  }
}
