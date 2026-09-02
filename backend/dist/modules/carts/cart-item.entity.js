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
import { Cart } from './cart.entity.js';
import { ProductVariant } from '../products/product-variant.entity.js';
let CartItem = class CartItem {
    id;
    cart_id;
    cart;
    product_variant_id;
    product_variant;
    quantity;
    unit_price;
    discount_amount;
    notes;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], CartItem.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'cart_id' }),
    __metadata("design:type", String)
], CartItem.prototype, "cart_id", void 0);
__decorate([
    ManyToOne(() => Cart, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'cart_id' }),
    __metadata("design:type", Cart)
], CartItem.prototype, "cart", void 0);
__decorate([
    Column({ type: 'uuid', name: 'product_variant_id' }),
    __metadata("design:type", String)
], CartItem.prototype, "product_variant_id", void 0);
__decorate([
    ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'product_variant_id' }),
    __metadata("design:type", ProductVariant)
], CartItem.prototype, "product_variant", void 0);
__decorate([
    Column({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], CartItem.prototype, "quantity", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' }),
    __metadata("design:type", Number)
], CartItem.prototype, "unit_price", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'discount_amount' }),
    __metadata("design:type", Number)
], CartItem.prototype, "discount_amount", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CartItem.prototype, "notes", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], CartItem.prototype, "created_at", void 0);
CartItem = __decorate([
    Entity('cart_items')
], CartItem);
export { CartItem };
//# sourceMappingURL=cart-item.entity.js.map