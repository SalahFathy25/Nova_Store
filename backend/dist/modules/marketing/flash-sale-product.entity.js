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
import { FlashSale } from './flash-sale.entity.js';
import { Product } from '../products/product.entity.js';
let FlashSaleProduct = class FlashSaleProduct {
    id;
    flash_sale_id;
    flash_sale;
    product_id;
    product;
    flash_price;
    flash_stock;
    sold_count;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], FlashSaleProduct.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'flash_sale_id' }),
    __metadata("design:type", String)
], FlashSaleProduct.prototype, "flash_sale_id", void 0);
__decorate([
    ManyToOne(() => FlashSale, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'flash_sale_id' }),
    __metadata("design:type", FlashSale)
], FlashSaleProduct.prototype, "flash_sale", void 0);
__decorate([
    Column({ type: 'uuid', name: 'product_id' }),
    __metadata("design:type", String)
], FlashSaleProduct.prototype, "product_id", void 0);
__decorate([
    ManyToOne(() => Product, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'product_id' }),
    __metadata("design:type", Product)
], FlashSaleProduct.prototype, "product", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, name: 'flash_price' }),
    __metadata("design:type", Number)
], FlashSaleProduct.prototype, "flash_price", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'flash_stock' }),
    __metadata("design:type", Number)
], FlashSaleProduct.prototype, "flash_stock", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'sold_count' }),
    __metadata("design:type", Number)
], FlashSaleProduct.prototype, "sold_count", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], FlashSaleProduct.prototype, "created_at", void 0);
FlashSaleProduct = __decorate([
    Entity('flash_sale_products')
], FlashSaleProduct);
export { FlashSaleProduct };
//# sourceMappingURL=flash-sale-product.entity.js.map