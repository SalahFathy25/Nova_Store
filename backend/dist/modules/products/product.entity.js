var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, } from 'typeorm';
import { Store } from '../stores/store.entity.js';
import { Category } from '../categories/category.entity.js';
import { Brand } from '../brands/brand.entity.js';
import { User } from '../users/user.entity.js';
let Product = class Product {
    id;
    tenant_id;
    store;
    vendor_id;
    vendor;
    category_id;
    category;
    brand_id;
    brand;
    title;
    slug;
    description;
    short_description;
    base_price;
    compare_at_price;
    cost_price;
    sku;
    barcode;
    is_active;
    is_featured;
    is_digital;
    weight;
    tags;
    metadata;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], Product.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], Product.prototype, "store", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'vendor_id' }),
    __metadata("design:type", String)
], Product.prototype, "vendor_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true }),
    JoinColumn({ name: 'vendor_id' }),
    __metadata("design:type", User)
], Product.prototype, "vendor", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'category_id' }),
    __metadata("design:type", String)
], Product.prototype, "category_id", void 0);
__decorate([
    ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true }),
    JoinColumn({ name: 'category_id' }),
    __metadata("design:type", Category)
], Product.prototype, "category", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'brand_id' }),
    __metadata("design:type", String)
], Product.prototype, "brand_id", void 0);
__decorate([
    ManyToOne(() => Brand, { onDelete: 'SET NULL', nullable: true }),
    JoinColumn({ name: 'brand_id' }),
    __metadata("design:type", Brand)
], Product.prototype, "brand", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    Column({ type: 'varchar', length: 500, nullable: true, name: 'short_description' }),
    __metadata("design:type", String)
], Product.prototype, "short_description", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, name: 'base_price' }),
    __metadata("design:type", Number)
], Product.prototype, "base_price", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'compare_at_price' }),
    __metadata("design:type", Number)
], Product.prototype, "compare_at_price", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'cost_price' }),
    __metadata("design:type", Number)
], Product.prototype, "cost_price", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "barcode", void 0);
__decorate([
    Column({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], Product.prototype, "is_active", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'is_featured' }),
    __metadata("design:type", Boolean)
], Product.prototype, "is_featured", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'is_digital' }),
    __metadata("design:type", Boolean)
], Product.prototype, "is_digital", void 0);
__decorate([
    Column({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "weight", void 0);
__decorate([
    Column({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Array)
], Product.prototype, "tags", void 0);
__decorate([
    Column({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], Product.prototype, "metadata", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Product.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], Product.prototype, "updated_at", void 0);
Product = __decorate([
    Entity('products')
], Product);
export { Product };
//# sourceMappingURL=product.entity.js.map