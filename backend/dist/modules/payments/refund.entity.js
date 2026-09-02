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
import { ParentOrder } from '../orders/parent-order.entity.js';
import { Payment } from './payment.entity.js';
import { Store } from '../stores/store.entity.js';
import { User } from '../users/user.entity.js';
let Refund = class Refund {
    id;
    order_id;
    order;
    payment_id;
    payment;
    tenant_id;
    store;
    amount;
    reason;
    status;
    processed_by;
    processor;
    processed_at;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Refund.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'order_id' }),
    __metadata("design:type", String)
], Refund.prototype, "order_id", void 0);
__decorate([
    ManyToOne(() => ParentOrder, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'order_id' }),
    __metadata("design:type", ParentOrder)
], Refund.prototype, "order", void 0);
__decorate([
    Column({ type: 'uuid', name: 'payment_id' }),
    __metadata("design:type", String)
], Refund.prototype, "payment_id", void 0);
__decorate([
    ManyToOne(() => Payment, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'payment_id' }),
    __metadata("design:type", Payment)
], Refund.prototype, "payment", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], Refund.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], Refund.prototype, "store", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Refund.prototype, "amount", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Refund.prototype, "reason", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'Pending' }),
    __metadata("design:type", String)
], Refund.prototype, "status", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'processed_by' }),
    __metadata("design:type", String)
], Refund.prototype, "processed_by", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true }),
    JoinColumn({ name: 'processed_by' }),
    __metadata("design:type", User)
], Refund.prototype, "processor", void 0);
__decorate([
    Column({ type: 'timestamptz', nullable: true, name: 'processed_at' }),
    __metadata("design:type", Date)
], Refund.prototype, "processed_at", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Refund.prototype, "created_at", void 0);
Refund = __decorate([
    Entity('refunds')
], Refund);
export { Refund };
//# sourceMappingURL=refund.entity.js.map