import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity.js';
import { ProductVariant } from './product-variant.entity.js';
import { ProductImage } from './product-image.entity.js';
import { CreateProductDto, UpdateProductDto, CreateVariantDto } from './dto/product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(ProductImage)
    private readonly imageRepo: Repository<ProductImage>,
  ) {}

  async findAll(
    tenantId: string,
    page = 1,
    limit = 20,
    search?: string,
    categoryId?: string,
    brandId?: string,
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const query = this.productRepo.createQueryBuilder('product')
      .where('product.tenant_id = :tenantId', { tenantId })
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand');

    if (search) {
      query.andWhere('product.title ILIKE :search', { search: `%${search}%` });
    }

    if (categoryId) {
      query.andWhere('product.category_id = :categoryId', { categoryId });
    }

    if (brandId) {
      query.andWhere('product.brand_id = :brandId', { brandId });
    }

    const total = await query.getCount();
    const products = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.created_at', 'DESC')
      .getMany();

    const data = await Promise.all(
      products.map(async (product) => {
        const [images, variants] = await Promise.all([
          this.imageRepo.find({ where: { product_id: product.id } }),
          this.variantRepo.find({ where: { product_id: product.id } }),
        ]);
        return { ...product, images, variants };
      }),
    );

    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string): Promise<any> {
    const product = await this.productRepo.findOne({
      where: { id, tenant_id: tenantId },
      relations: { category: true, brand: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const [images, variants] = await Promise.all([
      this.imageRepo.find({ where: { product_id: id } }),
      this.variantRepo.find({ where: { product_id: id } }),
    ]);

    return { ...product, images, variants };
  }

  async create(dto: CreateProductDto, tenantId: string): Promise<Product> {
    const slug = dto.slug || this.generateSlug(dto.title);

    const existing = await this.productRepo.findOne({
      where: { tenant_id: tenantId, slug },
    });

    if (existing) {
      throw new BadRequestException('Product with this slug already exists');
    }

    const product = this.productRepo.create({
      ...dto,
      tenant_id: tenantId,
      slug,
    });

    return this.productRepo.save(product);
  }

  async update(id: string, dto: UpdateProductDto, tenantId: string): Promise<Product> {
    const product = await this.findOne(id, tenantId);

    if (dto.slug && dto.slug !== product.slug) {
      const existing = await this.productRepo.findOne({
        where: { tenant_id: tenantId, slug: dto.slug },
      });

      if (existing) {
        throw new BadRequestException('Product with this slug already exists');
      }
    }

    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const product = await this.findOne(id, tenantId);
    await this.productRepo.remove(product);
  }

  async addVariant(productId: string, dto: CreateVariantDto, tenantId: string): Promise<ProductVariant> {
    await this.findOne(productId, tenantId);

    const existing = await this.variantRepo.findOne({
      where: { sku: dto.sku },
    });

    if (existing) {
      throw new BadRequestException('Variant with this SKU already exists');
    }

    const variant = this.variantRepo.create({
      ...dto,
      product_id: productId,
      tenant_id: tenantId,
    });

    return this.variantRepo.save(variant);
  }

  async updateVariant(variantId: string, dto: Partial<CreateVariantDto>): Promise<ProductVariant> {
    const variant = await this.variantRepo.findOne({ where: { id: variantId } });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    Object.assign(variant, dto);
    return this.variantRepo.save(variant);
  }

  async removeVariant(variantId: string): Promise<void> {
    const variant = await this.variantRepo.findOne({ where: { id: variantId } });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    await this.variantRepo.remove(variant);
  }

  async addImage(
    productId: string,
    url: string,
    altText?: string,
    isPrimary = false,
  ): Promise<ProductImage> {
    const image = this.imageRepo.create({
      product_id: productId,
      url,
      alt_text: altText,
      is_primary: isPrimary,
    });

    return this.imageRepo.save(image);
  }

  async removeImage(imageId: string): Promise<void> {
    const image = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    await this.imageRepo.remove(image);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async getSuggestions(tenantId: string, query: string): Promise<string[]> {
    const results = await this.productRepo
      .createQueryBuilder('product')
      .select('product.title')
      .where('product.tenant_id = :tenantId', { tenantId })
      .andWhere('product.title ILIKE :query', { query: `%${query}%` })
      .limit(8)
      .getMany();

    return results.map((r: any) => r.title);
  }

  async getPopularSearches(tenantId: string): Promise<string[]> {
    const results = await this.productRepo
      .createQueryBuilder('product')
      .select('product.title')
      .where('product.tenant_id = :tenantId', { tenantId })
      .orderBy('product.view_count', 'DESC')
      .limit(10)
      .getMany();

    return results.map((r: any) => r.title);
  }

  async getRelatedProducts(tenantId: string, productId: string, limit = 10): Promise<any[]> {
    const product = await this.findOne(productId, tenantId);
    if (!product) return [];

    const related = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.tenant_id = :tenantId', { tenantId })
      .andWhere('product.id != :productId', { productId })
      .andWhere('product.category_id = :categoryId', { categoryId: product.category_id })
      .orderBy('RANDOM()')
      .limit(limit)
      .getMany();

    return Promise.all(
      related.map(async (p: any) => {
        const [images, variants] = await Promise.all([
          this.imageRepo.find({ where: { product_id: p.id } }),
          this.variantRepo.find({ where: { product_id: p.id } }),
        ]);
        return { ...p, images, variants };
      }),
    );
  }
}
