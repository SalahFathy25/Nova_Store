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
import { Product } from './product.entity.js';
import { Store } from '../stores/store.entity.js';
let ProductVariant = class ProductVariant {
    id;
    product_id;
    product;
    tenant_id;
    store;
    sku;
    title;
    attributes;
    price_override;
    compare_at_price;
    cost_price;
    stock_quantity;
    low_stock_threshold;
    weight;
    barcode;
    is_active;
    image_url;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ProductVariant.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'product_id' }),
    __metadata("design:type", String)
], ProductVariant.prototype, "product_id", void 0);
__decorate([
    ManyToOne(() => Product, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'product_id' }),
    __metadata("design:type", Product)
], ProductVariant.prototype, "product", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], ProductVariant.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], ProductVariant.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "sku", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "title", void 0);
__decorate([
    Column({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "attributes", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'price_override' }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "price_override", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'compare_at_price' }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "compare_at_price", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'cost_price' }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "cost_price", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'stock_quantity' }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "stock_quantity", void 0);
__decorate([
    Column({ type: 'int', default: 5, name: 'low_stock_threshold' }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "low_stock_threshold", void 0);
__decorate([
    Column({ type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "weight", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "barcode", void 0);
__decorate([
    Column({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "is_active", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'image_url' }),
    __metadata("design:type", String)
], ProductVariant.prototype, "image_url", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], ProductVariant.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], ProductVariant.prototype, "updated_at", void 0);
ProductVariant = __decorate([
    Entity('product_variants')
], ProductVariant);
export { ProductVariant };
//# sourceMappingURL=product-variant.entity.js.map