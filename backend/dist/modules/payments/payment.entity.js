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
import { ParentOrder } from '../orders/parent-order.entity.js';
import { Store } from '../stores/store.entity.js';
let Payment = class Payment {
    id;
    order_id;
    order;
    tenant_id;
    store;
    provider;
    transaction_id;
    amount;
    currency;
    status;
    payment_method_details;
    metadata;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'order_id' }),
    __metadata("design:type", String)
], Payment.prototype, "order_id", void 0);
__decorate([
    ManyToOne(() => ParentOrder, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'order_id' }),
    __metadata("design:type", ParentOrder)
], Payment.prototype, "order", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], Payment.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], Payment.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Payment.prototype, "provider", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true, name: 'transaction_id' }),
    __metadata("design:type", String)
], Payment.prototype, "transaction_id", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    Column({ type: 'varchar', length: 3, default: 'EGP' }),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'Pending' }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true, name: 'payment_method_details' }),
    __metadata("design:type", Object)
], Payment.prototype, "payment_method_details", void 0);
__decorate([
    Column({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], Payment.prototype, "metadata", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Payment.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], Payment.prototype, "updated_at", void 0);
Payment = __decorate([
    Entity('payments')
], Payment);
export { Payment };
//# sourceMappingURL=payment.entity.js.map