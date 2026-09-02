var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, } from 'typeorm';
import { Product } from './product.entity.js';
let ProductImage = class ProductImage {
    id;
    product_id;
    product;
    url;
    alt_text;
    display_order;
    is_primary;
    variants;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ProductImage.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'product_id' }),
    __metadata("design:type", String)
], ProductImage.prototype, "product_id", void 0);
__decorate([
    ManyToOne(() => Product, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'product_id' }),
    __metadata("design:type", Product)
], ProductImage.prototype, "product", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], ProductImage.prototype, "url", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true, name: 'alt_text' }),
    __metadata("design:type", String)
], ProductImage.prototype, "alt_text", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'display_order' }),
    __metadata("design:type", Number)
], ProductImage.prototype, "display_order", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'is_primary' }),
    __metadata("design:type", Boolean)
], ProductImage.prototype, "is_primary", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "variants", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], ProductImage.prototype, "created_at", void 0);
ProductImage = __decorate([
    Entity('product_images')
], ProductImage);
export { ProductImage };
//# sourceMappingURL=product-image.entity.js.map