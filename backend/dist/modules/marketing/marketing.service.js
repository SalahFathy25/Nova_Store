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
let MarketingService = class MarketingService {
    bannerRepo;
    homeSectionRepo;
    flashSaleRepo;
    flashSaleProductRepo;
    productRepo;
    productImageRepo;
    variantRepo;
    categoryRepo;
    brandRepo;
    constructor(bannerRepo, homeSectionRepo, flashSaleRepo, flashSaleProductRepo, productRepo, productImageRepo, variantRepo, categoryRepo, brandRepo) {
        this.bannerRepo = bannerRepo;
        this.homeSectionRepo = homeSectionRepo;
        this.flashSaleRepo = flashSaleRepo;
        this.flashSaleProductRepo = flashSaleProductRepo;
        this.productRepo = productRepo;
        this.productImageRepo = productImageRepo;
        this.variantRepo = variantRepo;
        this.categoryRepo = categoryRepo;
        this.brandRepo = brandRepo;
    }
    async getBanners(tenantId, position) {
        const where = {
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
    async getHomeSections(tenantId) {
        const sections = await this.homeSectionRepo.find({
            where: { tenant_id: tenantId, is_active: true },
            order: { display_order: 'ASC', created_at: 'DESC' },
        });
        const enrichedSections = await Promise.all(sections.map(async (section) => {
            let data = null;
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
        }));
        return enrichedSections;
    }
    async getFlashSale(tenantId) {
        return this.getActiveFlashSale(tenantId);
    }
    async getFlashSaleProducts(tenantId, flashSaleId) {
        const flashSale = await this.flashSaleRepo.findOne({
            where: { id: flashSaleId, tenant_id: tenantId, is_active: true },
        });
        if (!flashSale) {
            return [];
        }
        return this.getFlashSaleProductsWithDetails(flashSale);
    }
    async getActiveFlashSale(tenantId) {
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
    async getFlashSaleProductsWithDetails(flashSale) {
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
            if (!product)
                return null;
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
    async getSectionProducts(tenantId, config) {
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
    async getTopCategories(tenantId) {
        return this.categoryRepo.find({
            where: { tenant_id: tenantId, is_active: true, parent_id: IsNull() },
            order: { display_order: 'ASC', name: 'ASC' },
            take: 20,
        });
    }
    async getBrands(tenantId) {
        return this.brandRepo.find({
            where: { tenant_id: tenantId, is_active: true },
            order: { name: 'ASC' },
            take: 20,
        });
    }
};
MarketingService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Banner)),
    __param(1, InjectRepository(HomeSection)),
    __param(2, InjectRepository(FlashSale)),
    __param(3, InjectRepository(FlashSaleProduct)),
    __param(4, InjectRepository(Product)),
    __param(5, InjectRepository(ProductImage)),
    __param(6, InjectRepository(ProductVariant)),
    __param(7, InjectRepository(Category)),
    __param(8, InjectRepository(Brand)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository,
        Repository])
], MarketingService);
export { MarketingService };
//# sourceMappingURL=marketing.service.js.map