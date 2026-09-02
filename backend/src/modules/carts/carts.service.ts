import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity.js';
import { CartItem } from './cart-item.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductVariant } from '../products/product-variant.entity.js';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto.js';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async getCart(tenantId: string, userId: string) {
    let cart = await this.cartRepo.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!cart) {
      cart = this.cartRepo.create({ tenant_id: tenantId, user_id: userId });
      cart = await this.cartRepo.save(cart);
    }

    const items = await this.cartItemRepo.find({
      where: { cart_id: cart.id },
      relations: { product_variant: { product: true } },
    });

    let subtotal = 0;
    let discount = 0;

    const enrichedItems = items.map((item) => {
      const variant = item.product_variant;
      const product = variant?.product;
      const effectivePrice = variant?.price_override ?? product?.base_price ?? 0;
      const lineTotal = effectivePrice * item.quantity;
      const lineDiscount = item.discount_amount * item.quantity;

      subtotal += lineTotal;
      discount += lineDiscount;

      return {
        id: item.id,
        product_id: product?.id,
        product_title: product?.title,
        product_slug: product?.slug,
        product_image: variant?.image_url ?? null,
        variant_id: variant?.id,
        variant_title: variant?.title,
        variant_sku: variant?.sku,
        variant_attributes: variant?.attributes,
        quantity: item.quantity,
        unit_price: effectivePrice,
        discount_amount: item.discount_amount,
        line_total: lineTotal - lineDiscount,
        notes: item.notes,
        created_at: item.created_at,
      };
    });

    const total = subtotal - discount;

    return {
      id: cart.id,
      coupon_code: cart.coupon_code,
      notes: cart.notes,
      items: enrichedItems,
      item_count: enrichedItems.length,
      subtotal,
      discount,
      total,
      created_at: cart.created_at,
      updated_at: cart.updated_at,
    };
  }

  async addToCart(tenantId: string, userId: string, dto: AddToCartDto) {
    const product = await this.productRepo.findOne({
      where: { id: dto.product_id, tenant_id: tenantId, is_active: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found or inactive');
    }

    let variant: ProductVariant | null = null;
    if (dto.product_variant_id) {
      variant = await this.variantRepo.findOne({
        where: { id: dto.product_variant_id, tenant_id: tenantId, is_active: true },
      });

      if (!variant) {
        throw new NotFoundException('Product variant not found or inactive');
      }

      if (variant.product_id !== dto.product_id) {
        throw new BadRequestException('Variant does not belong to the specified product');
      }

      if (variant.stock_quantity < (dto.quantity ?? 1)) {
        throw new BadRequestException('Insufficient stock for the requested quantity');
      }
    }

    const effectiveVariantId = dto.product_variant_id ?? product.id;

    let cart = await this.cartRepo.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!cart) {
      cart = this.cartRepo.create({ tenant_id: tenantId, user_id: userId });
      cart = await this.cartRepo.save(cart);
    }

    const existingItem = await this.cartItemRepo.findOne({
      where: { cart_id: cart.id, product_variant_id: effectiveVariantId },
    });

    const quantity = dto.quantity ?? 1;

    if (existingItem) {
      existingItem.quantity += quantity;

      const stockQty = variant?.stock_quantity;
      if (stockQty !== undefined && stockQty !== null && existingItem.quantity > stockQty) {
        throw new BadRequestException(
          `Only ${stockQty} items available in stock`,
        );
      }

      existingItem.unit_price =
        variant?.price_override ?? product.base_price;
      await this.cartItemRepo.save(existingItem);
    } else {
      const unitPrice = variant?.price_override ?? product.base_price;

      if (variant && quantity > variant.stock_quantity) {
        throw new BadRequestException(
          `Only ${variant.stock_quantity} items available in stock`,
        );
      }

      const cartItem = this.cartItemRepo.create({
        cart_id: cart.id,
        product_variant_id: effectiveVariantId,
        quantity,
        unit_price: unitPrice,
        discount_amount: 0,
      });
      await this.cartItemRepo.save(cartItem);
    }

    return this.getCart(tenantId, userId);
  }

  async updateCartItem(
    tenantId: string,
    userId: string,
    itemId: string,
    dto: UpdateCartItemDto,
  ) {
    const cart = await this.cartRepo.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = await this.cartItemRepo.findOne({
      where: { id: itemId, cart_id: cart.id },
      relations: { product_variant: true },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    const variant = item.product_variant;
    if (variant && dto.quantity > variant.stock_quantity) {
      throw new BadRequestException(
        `Only ${variant.stock_quantity} items available in stock`,
      );
    }

    item.quantity = dto.quantity;
    await this.cartItemRepo.save(item);

    return this.getCart(tenantId, userId);
  }

  async removeCartItem(tenantId: string, userId: string, itemId: string) {
    const cart = await this.cartRepo.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = await this.cartItemRepo.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepo.remove(item);

    return this.getCart(tenantId, userId);
  }

  async clearCart(tenantId: string, userId: string) {
    const cart = await this.cartRepo.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartItemRepo.delete({ cart_id: cart.id });

    return this.getCart(tenantId, userId);
  }
}
