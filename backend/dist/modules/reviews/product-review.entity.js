var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index, } from 'typeorm';
import { Product } from '../products/product.entity.js';
import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';
let ProductReview = class ProductReview {
    id;
    product_id;
    product;
    user_id;
    user;
    tenant_id;
    store;
    order_id;
    rating;
    title;
    comment;
    images;
    is_verified_purchase;
    is_approved;
    helpful_count;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ProductReview.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'product_id' }),
    __metadata("design:type", String)
], ProductReview.prototype, "product_id", void 0);
__decorate([
    ManyToOne(() => Product, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'product_id' }),
    __metadata("design:type", Product)
], ProductReview.prototype, "product", void 0);
__decorate([
    Column({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], ProductReview.prototype, "user_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'user_id' }),
    __metadata("design:type", User)
], ProductReview.prototype, "user", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], ProductReview.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], ProductReview.prototype, "store", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'order_id' }),
    __metadata("design:type", String)
], ProductReview.prototype, "order_id", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], ProductReview.prototype, "rating", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ProductReview.prototype, "title", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductReview.prototype, "comment", void 0);
__decorate([
    Column({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Array)
], ProductReview.prototype, "images", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'is_verified_purchase' }),
    __metadata("design:type", Boolean)
], ProductReview.prototype, "is_verified_purchase", void 0);
__decorate([
    Column({ type: 'boolean', default: true, name: 'is_approved' }),
    __metadata("design:type", Boolean)
], ProductReview.prototype, "is_approved", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'helpful_count' }),
    __metadata("design:type", Number)
], ProductReview.prototype, "helpful_count", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], ProductReview.prototype, "created_at", void 0);
ProductReview = __decorate([
    Entity('product_reviews'),
    Index(['user_id', 'product_id', 'order_id'], { unique: true })
], ProductReview);
export { ProductReview };
//# sourceMappingURL=product-review.entity.js.map