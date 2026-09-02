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
import { User } from '../users/user.entity.js';
import { DeliveryShift } from './delivery-shift.entity.js';
import { Store } from '../stores/store.entity.js';
import { SubOrder } from '../orders/sub-order.entity.js';
let CashLedger = class CashLedger {
    id;
    driver_id;
    driver;
    shift_id;
    shift;
    tenant_id;
    store;
    sub_order_id;
    sub_order;
    amount;
    type;
    notes;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], CashLedger.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'driver_id' }),
    __metadata("design:type", String)
], CashLedger.prototype, "driver_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'driver_id' }),
    __metadata("design:type", User)
], CashLedger.prototype, "driver", void 0);
__decorate([
    Column({ type: 'uuid', name: 'shift_id' }),
    __metadata("design:type", String)
], CashLedger.prototype, "shift_id", void 0);
__decorate([
    ManyToOne(() => DeliveryShift, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'shift_id' }),
    __metadata("design:type", DeliveryShift)
], CashLedger.prototype, "shift", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], CashLedger.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], CashLedger.prototype, "store", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'sub_order_id' }),
    __metadata("design:type", String)
], CashLedger.prototype, "sub_order_id", void 0);
__decorate([
    ManyToOne(() => SubOrder, { onDelete: 'SET NULL', nullable: true }),
    JoinColumn({ name: 'sub_order_id' }),
    __metadata("design:type", SubOrder)
], CashLedger.prototype, "sub_order", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CashLedger.prototype, "amount", void 0);
__decorate([
    Column({
        type: 'varchar',
        length: 50,
        enum: ['collected', 'submitted', 'discrepancy', 'adjustment'],
    }),
    __metadata("design:type", String)
], CashLedger.prototype, "type", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CashLedger.prototype, "notes", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], CashLedger.prototype, "created_at", void 0);
CashLedger = __decorate([
    Entity('cash_ledger')
], CashLedger);
export { CashLedger };
//# sourceMappingURL=cash-ledger.entity.js.map