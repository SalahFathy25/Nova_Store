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
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity.js';
import { ProductVariant } from './product-variant.entity.js';
import { ProductImage } from './product-image.entity.js';
let ProductsService = class ProductsService {
    productRepo;
    variantRepo;
    imageRepo;
    constructor(productRepo, variantRepo, imageRepo) {
        this.productRepo = productRepo;
        this.variantRepo = variantRepo;
        this.imageRepo = imageRepo;
    }
    async findAll(tenantId, page = 1, limit = 20, search, categoryId, brandId) {
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
        const data = await Promise.all(products.map(async (product) => {
            const [images, variants] = await Promise.all([
                this.imageRepo.find({ where: { product_id: product.id } }),
                this.variantRepo.find({ where: { product_id: product.id } }),
            ]);
            return { ...product, images, variants };
        }));
        return { data, total, page, limit };
    }
    async findOne(id, tenantId) {
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
    async create(dto, tenantId) {
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
    async update(id, dto, tenantId) {
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
    async remove(id, tenantId) {
        const product = await this.findOne(id, tenantId);
        await this.productRepo.remove(product);
    }
    async addVariant(productId, dto, tenantId) {
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
    async updateVariant(variantId, dto) {
        const variant = await this.variantRepo.findOne({ where: { id: variantId } });
        if (!variant) {
            throw new NotFoundException('Variant not found');
        }
        Object.assign(variant, dto);
        return this.variantRepo.save(variant);
    }
    async removeVariant(variantId) {
        const variant = await this.variantRepo.findOne({ where: { id: variantId } });
        if (!variant) {
            throw new NotFoundException('Variant not found');
        }
        await this.variantRepo.remove(variant);
    }
    async addImage(productId, url, altText, isPrimary = false) {
        const image = this.imageRepo.create({
            product_id: productId,
            url,
            alt_text: altText,
            is_primary: isPrimary,
        });
        return this.imageRepo.save(image);
    }
    async removeImage(imageId) {
        const image = await this.imageRepo.findOne({ where: { id: imageId } });
        if (!image) {
            throw new NotFoundException('Image not found');
        }
        await this.imageRepo.remove(image);
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
};
ProductsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Product)),
    __param(1, InjectRepository(ProductVariant)),
    __param(2, InjectRepository(ProductImage)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository])
], ProductsService);
export { ProductsService };
//# sourceMappingURL=products.service.js.map