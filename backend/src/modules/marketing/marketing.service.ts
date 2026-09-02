import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, In, IsNull } from 'typeorm';
import { Banner } from './banner.entity.js';
import { HomeSection } from './home-section.entity.js';
import { FlashSale } from './flash-sale.entity.js';
import { FlashSaleProduct } from './flash-sale-product.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductImage } from '../products/product-image.entity.js';
import { ProductVariant } from '../products/product-variant.entity.js';
import { Category } from '../categories/category.entity.js';
import { Brand } from '../brands/brand.entity.js';

@Injectable()
export class MarketingService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepo: Repository<Banner>,
    @InjectRepository(HomeSection)
    private readonly homeSectionRepo: Repository<HomeSection>,
    @InjectRepository(FlashSale)
    private readonly flashSaleRepo: Repository<FlashSale>,
    @InjectRepository(FlashSaleProduct)
    private readonly flashSaleProductRepo: Repository<FlashSaleProduct>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepo: Repository<ProductImage>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  async getBanners(tenantId: string, position?: string) {
    const where: any = {
      tenant_id: tenantId,
      is_active: true,
    };

    if (position) {
      where.position = position;
    }

    const now = new Date();
    where.starts_at = LessThanOrEqual(now);
    where.expires_at = MoreThanOrEqual(now);

    return this.bannerRepo.find({
      where,
      order: { display_order: 'ASC', created_at: 'DESC' },
    });
  }

  async getHomeSections(tenantId: string) {
    const sections = await this.homeSectionRepo.find({
      where: { tenant_id: tenantId, is_active: true },
      order: { display_order: 'ASC', created_at: 'DESC' },
    });

    const enrichedSections = await Promise.all(
      sections.map(async (section) => {
        let data: any = null;

        switch (section.type) {
          case 'product_list':
          case 'product_grid':
            data = await this.getSectionProducts(tenantId, section.config);
            break;
          case 'flash_sale':
            data = await this.getActiveFlashSale(tenantId);
            break;
          case 'category_grid':
            data = await this.getTopCategories(tenantId);
            break;
          case 'brands':
            data = await this.getBrands(tenantId);
            break;
          default:
            data = section.config;
        }

        return {
          ...section,
          data,
        };
      }),
    );

    return enrichedSections;
  }

  async getFlashSale(tenantId: string) {
    return this.getActiveFlashSale(tenantId);
  }

  async getFlashSaleProducts(tenantId: string, flashSaleId: string) {
    const flashSale = await this.flashSaleRepo.findOne({
      where: { id: flashSaleId, tenant_id: tenantId, is_active: true },
    });

    if (!flashSale) {
      return [];
    }

    return this.getFlashSaleProductsWithDetails(flashSale);
  }

  private async getActiveFlashSale(tenantId: string) {
    const now = new Date();

    const flashSale = await this.flashSaleRepo.findOne({
      where: {
        tenant_id: tenantId,
        is_active: true,
        starts_at: LessThanOrEqual(now),
        ends_at: MoreThanOrEqual(now),
      },
      order: { starts_at: 'DESC' },
    });

    if (!flashSale) {
      return null;
    }

    const products = await this.getFlashSaleProductsWithDetails(flashSale);

    return {
      ...flashSale,
      products,
    };
  }

  private async getFlashSaleProductsWithDetails(flashSale: FlashSale) {
    const flashProducts = await this.flashSaleProductRepo.find({
      where: { flash_sale_id: flashSale.id },
      relations: { product: true },
      order: { created_at: 'ASC' },
    });

    const productIds = flashProducts.map((fp) => fp.product_id);

    const products = await this.productRepo.find({
      where: { id: In(productIds), is_active: true },
    });

    const productImages = await this.productImageRepo.find({
      where: { product_id: In(productIds) },
      order: { display_order: 'ASC', is_primary: 'DESC' },
    });

    const variants = await this.variantRepo.find({
      where: { product_id: In(productIds), is_active: true },
    });

    return flashProducts
      .map((fp) => {
        const product = products.find((p) => p.id === fp.product_id);
        if (!product) return null;

        const images = productImages.filter((img) => img.product_id === product.id);
        const productVariants = variants.filter((v) => v.product_id === product.id);

        return {
          flash_product_id: fp.id,
          flash_price: fp.flash_price,
          flash_stock: fp.flash_stock,
          sold_count: fp.sold_count,
          product: {
            ...product,
            images,
            variants: productVariants,
          },
        };
      })
      .filter(Boolean);
  }

  private async getSectionProducts(tenantId: string, config: Record<string, any>) {
    const limit = config?.limit ?? 10;

    if (config?.product_ids && Array.isArray(config.product_ids) && config.product_ids.length > 0) {
      const products = await this.productRepo.find({
        where: {
          id: In(config.product_ids),
          tenant_id: tenantId,
          is_active: true,
        },
        take: limit,
      });

      const productIds = products.map((p) => p.id);

      const images = await this.productImageRepo.find({
        where: { product_id: In(productIds) },
        order: { display_order: 'ASC', is_primary: 'DESC' },
      });

      const variants = await this.variantRepo.find({
        where: { product_id: In(productIds), is_active: true },
      });

      return products.map((product) => {
        const productImages = images.filter((img) => img.product_id === product.id);
        const productVariants = variants.filter((v) => v.product_id === product.id);
        return {
          ...product,
          images: productImages,
          variants: productVariants,
        };
      });
    }

    if (config?.category_id) {
      const products = await this.productRepo.find({
        where: {
          category_id: config.category_id,
          tenant_id: tenantId,
          is_active: true,
        },
        order: { created_at: 'DESC' },
        take: limit,
      });

      const productIds = products.map((p) => p.id);

      const images = await this.productImageRepo.find({
        where: { product_id: In(productIds) },
        order: { display_order: 'ASC', is_primary: 'DESC' },
      });

      const variants = await this.variantRepo.find({
        where: { product_id: In(productIds), is_active: true },
      });

      return products.map((product) => {
        const productImages = images.filter((img) => img.product_id === product.id);
        const productVariants = variants.filter((v) => v.product_id === product.id);
        return {
          ...product,
          images: productImages,
          variants: productVariants,
        };
      });
    }

    const products = await this.productRepo.find({
      where: { tenant_id: tenantId, is_active: true, is_featured: true },
      order: { created_at: 'DESC' },
      take: limit,
    });

    const productIds = products.map((p) => p.id);

    const images = await this.productImageRepo.find({
      where: { product_id: In(productIds) },
      order: { display_order: 'ASC', is_primary: 'DESC' },
    });

    const variants = await this.variantRepo.find({
      where: { product_id: In(productIds), is_active: true },
    });

    return products.map((product) => {
      const productImages = images.filter((img) => img.product_id === product.id);
      const productVariants = variants.filter((v) => v.product_id === product.id);
      return {
        ...product,
        images: productImages,
        variants: productVariants,
      };
    });
  }

  private async getTopCategories(tenantId: string) {
    return this.categoryRepo.find({
      where: { tenant_id: tenantId, is_active: true, parent_id: IsNull() },
      order: { display_order: 'ASC', name: 'ASC' },
      take: 20,
    });
  }

  private async getBrands(tenantId: string) {
    return this.brandRepo.find({
      where: { tenant_id: tenantId, is_active: true },
      order: { name: 'ASC' },
      take: 20,
    });
  }
}
