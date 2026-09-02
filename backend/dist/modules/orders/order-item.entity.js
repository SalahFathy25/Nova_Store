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
import { SubOrder } from './sub-order.entity.js';
import { Product } from '../products/product.entity.js';
import { ProductVariant } from '../products/product-variant.entity.js';
let OrderItem = class OrderItem {
    id;
    sub_order_id;
    sub_order;
    product_id;
    product;
    product_variant_id;
    product_variant;
    product_title;
    variant_title;
    quantity;
    unit_price;
    total_price;
    discount_amount;
    tax_amount;
    image_url;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], OrderItem.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'sub_order_id' }),
    __metadata("design:type", String)
], OrderItem.prototype, "sub_order_id", void 0);
__decorate([
    ManyToOne(() => SubOrder, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'sub_order_id' }),
    __metadata("design:type", SubOrder)
], OrderItem.prototype, "sub_order", void 0);
__decorate([
    Column({ type: 'uuid', name: 'product_id' }),
    __metadata("design:type", String)
], OrderItem.prototype, "product_id", void 0);
__decorate([
    ManyToOne(() => Product, { onDelete: 'RESTRICT' }),
    JoinColumn({ name: 'product_id' }),
    __metadata("design:type", Product)
], OrderItem.prototype, "product", void 0);
__decorate([
    Column({ type: 'uuid', name: 'product_variant_id' }),
    __metadata("design:type", String)
], OrderItem.prototype, "product_variant_id", void 0);
__decorate([
    ManyToOne(() => ProductVariant, { onDelete: 'RESTRICT' }),
    JoinColumn({ name: 'product_variant_id' }),
    __metadata("design:type", ProductVariant)
], OrderItem.prototype, "product_variant", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'product_title' }),
    __metadata("design:type", String)
], OrderItem.prototype, "product_title", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true, name: 'variant_title' }),
    __metadata("design:type", String)
], OrderItem.prototype, "variant_title", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' }),
    __metadata("design:type", Number)
], OrderItem.prototype, "unit_price", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' }),
    __metadata("design:type", Number)
], OrderItem.prototype, "total_price", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'discount_amount' }),
    __metadata("design:type", Number)
], OrderItem.prototype, "discount_amount", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'tax_amount' }),
    __metadata("design:type", Number)
], OrderItem.prototype, "tax_amount", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'image_url' }),
    __metadata("design:type", String)
], OrderItem.prototype, "image_url", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], OrderItem.prototype, "created_at", void 0);
OrderItem = __decorate([
    Entity('order_items')
], OrderItem);
export { OrderItem };
//# sourceMappingURL=order-item.entity.js.map