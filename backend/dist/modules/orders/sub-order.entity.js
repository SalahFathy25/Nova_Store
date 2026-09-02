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
import { ParentOrder } from './parent-order.entity.js';
import { User } from '../users/user.entity.js';
let SubOrder = class SubOrder {
    id;
    parent_order_id;
    parent_order;
    vendor_id;
    vendor;
    driver_id;
    driver;
    order_status;
    payment_status;
    delivery_status;
    subtotal;
    delivery_fee;
    commission_amount;
    net_amount;
    delivery_otp;
    otp_expires_at;
    estimated_delivery;
    actual_delivery;
    notes;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], SubOrder.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'parent_order_id' }),
    __metadata("design:type", String)
], SubOrder.prototype, "parent_order_id", void 0);
__decorate([
    ManyToOne(() => ParentOrder, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'parent_order_id' }),
    __metadata("design:type", ParentOrder)
], SubOrder.prototype, "parent_order", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'vendor_id' }),
    __metadata("design:type", String)
], SubOrder.prototype, "vendor_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true }),
    JoinColumn({ name: 'vendor_id' }),
    __metadata("design:type", User)
], SubOrder.prototype, "vendor", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'driver_id' }),
    __metadata("design:type", String)
], SubOrder.prototype, "driver_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true }),
    JoinColumn({ name: 'driver_id' }),
    __metadata("design:type", User)
], SubOrder.prototype, "driver", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'Pending', name: 'order_status' }),
    __metadata("design:type", String)
], SubOrder.prototype, "order_status", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'Pending', name: 'payment_status' }),
    __metadata("design:type", String)
], SubOrder.prototype, "payment_status", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'Unassigned', name: 'delivery_status' }),
    __metadata("design:type", String)
], SubOrder.prototype, "delivery_status", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SubOrder.prototype, "subtotal", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'delivery_fee' }),
    __metadata("design:type", Number)
], SubOrder.prototype, "delivery_fee", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'commission_amount' }),
    __metadata("design:type", Number)
], SubOrder.prototype, "commission_amount", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, name: 'net_amount' }),
    __metadata("design:type", Number)
], SubOrder.prototype, "net_amount", void 0);
__decorate([
    Column({ type: 'varchar', length: 6, name: 'delivery_otp' }),
    __metadata("design:type", String)
], SubOrder.prototype, "delivery_otp", void 0);
__decorate([
    Column({ type: 'timestamptz', nullable: true, name: 'otp_expires_at' }),
    __metadata("design:type", Date)
], SubOrder.prototype, "otp_expires_at", void 0);
__decorate([
    Column({ type: 'timestamptz', nullable: true, name: 'estimated_delivery' }),
    __metadata("design:type", Date)
], SubOrder.prototype, "estimated_delivery", void 0);
__decorate([
    Column({ type: 'timestamptz', nullable: true, name: 'actual_delivery' }),
    __metadata("design:type", Date)
], SubOrder.prototype, "actual_delivery", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SubOrder.prototype, "notes", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], SubOrder.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], SubOrder.prototype, "updated_at", void 0);
SubOrder = __decorate([
    Entity('sub_orders')
], SubOrder);
export { SubOrder };
//# sourceMappingURL=sub-order.entity.js.map