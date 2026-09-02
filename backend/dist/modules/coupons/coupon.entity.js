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
import { Store } from '../stores/store.entity.js';
let Coupon = class Coupon {
    id;
    tenant_id;
    store;
    code;
    description;
    type;
    value;
    minimum_order;
    maximum_discount;
    usage_limit;
    usage_limit_per_user;
    current_usage;
    applicable_products;
    applicable_categories;
    starts_at;
    expires_at;
    is_active;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Coupon.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], Coupon.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], Coupon.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Coupon.prototype, "code", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Coupon.prototype, "description", void 0);
__decorate([
    Column({
        type: 'varchar',
        length: 50,
        enum: ['percentage', 'fixed', 'free_shipping', 'bogo'],
    }),
    __metadata("design:type", String)
], Coupon.prototype, "type", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Coupon.prototype, "value", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'minimum_order' }),
    __metadata("design:type", Number)
], Coupon.prototype, "minimum_order", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'maximum_discount' }),
    __metadata("design:type", Number)
], Coupon.prototype, "maximum_discount", void 0);
__decorate([
    Column({ type: 'int', nullable: true, name: 'usage_limit' }),
    __metadata("design:type", Number)
], Coupon.prototype, "usage_limit", void 0);
__decorate([
    Column({ type: 'int', default: 1, name: 'usage_limit_per_user' }),
    __metadata("design:type", Number)
], Coupon.prototype, "usage_limit_per_user", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'current_usage' }),
    __metadata("design:type", Number)
], Coupon.prototype, "current_usage", void 0);
__decorate([
    Column({ type: 'uuid', array: true, nullable: true, name: 'applicable_products' }),
    __metadata("design:type", Array)
], Coupon.prototype, "applicable_products", void 0);
__decorate([
    Column({ type: 'uuid', array: true, nullable: true, name: 'applicable_categories' }),
    __metadata("design:type", Array)
], Coupon.prototype, "applicable_categories", void 0);
__decorate([
    Column({ type: 'timestamptz', nullable: true, name: 'starts_at' }),
    __metadata("design:type", Date)
], Coupon.prototype, "starts_at", void 0);
__decorate([
    Column({ type: 'timestamptz', nullable: true, name: 'expires_at' }),
    __metadata("design:type", Date)
], Coupon.prototype, "expires_at", void 0);
__decorate([
    Column({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "is_active", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Coupon.prototype, "created_at", void 0);
Coupon = __decorate([
    Entity('coupons'),
    Index(['tenant_id', 'code'], { unique: true })
], Coupon);
export { Coupon };
//# sourceMappingURL=coupon.entity.js.map