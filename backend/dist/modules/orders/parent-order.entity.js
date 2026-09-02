var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, } from 'typeorm';
import { Store } from '../stores/store.entity.js';
import { User } from '../users/user.entity.js';
let ParentOrder = class ParentOrder {
    id;
    order_number;
    tenant_id;
    store;
    customer_id;
    customer;
    status;
    total_amount;
    subtotal;
    discount_amount;
    shipping_fee;
    tax_amount;
    grand_total;
    payment_method;
    payment_status;
    shipping_address;
    billing_address;
    notes;
    coupon_code;
    coupon_discount;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ParentOrder.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, name: 'order_number' }),
    __metadata("design:type", String)
], ParentOrder.prototype, "order_number", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], ParentOrder.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], ParentOrder.prototype, "store", void 0);
__decorate([
    Column({ type: 'uuid', name: 'customer_id' }),
    __metadata("design:type", String)
], ParentOrder.prototype, "customer_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'RESTRICT' }),
    JoinColumn({ name: 'customer_id' }),
    __metadata("design:type", User)
], ParentOrder.prototype, "customer", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'Pending' }),
    __metadata("design:type", String)
], ParentOrder.prototype, "status", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' }),
    __metadata("design:type", Number)
], ParentOrder.prototype, "total_amount", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ParentOrder.prototype, "subtotal", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'discount_amount' }),
    __metadata("design:type", Number)
], ParentOrder.prototype, "discount_amount", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'shipping_fee' }),
    __metadata("design:type", Number)
], ParentOrder.prototype, "shipping_fee", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'tax_amount' }),
    __metadata("design:type", Number)
], ParentOrder.prototype, "tax_amount", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, name: 'grand_total' }),
    __metadata("design:type", Number)
], ParentOrder.prototype, "grand_total", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, name: 'payment_method' }),
    __metadata("design:type", String)
], ParentOrder.prototype, "payment_method", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'Pending', name: 'payment_status' }),
    __metadata("design:type", String)
], ParentOrder.prototype, "payment_status", void 0);
__decorate([
    Column({ type: 'jsonb', name: 'shipping_address' }),
    __metadata("design:type", Object)
], ParentOrder.prototype, "shipping_address", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true, name: 'billing_address' }),
    __metadata("design:type", Object)
], ParentOrder.prototype, "billing_address", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ParentOrder.prototype, "notes", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, nullable: true, name: 'coupon_code' }),
    __metadata("design:type", String)
], ParentOrder.prototype, "coupon_code", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'coupon_discount' }),
    __metadata("design:type", Number)
], ParentOrder.prototype, "coupon_discount", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], ParentOrder.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], ParentOrder.prototype, "updated_at", void 0);
ParentOrder = __decorate([
    Entity('parent_orders'),
    Index(['tenant_id', 'order_number'], { unique: true })
], ParentOrder);
export { ParentOrder };
//# sourceMappingURL=parent-order.entity.js.map