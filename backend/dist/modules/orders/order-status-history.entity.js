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
import { ParentOrder } from './parent-order.entity.js';
import { SubOrder } from './sub-order.entity.js';
import { User } from '../users/user.entity.js';
let OrderStatusHistory = class OrderStatusHistory {
    id;
    order_id;
    order;
    sub_order_id;
    sub_order;
    from_status;
    to_status;
    changed_by;
    changer;
    reason;
    metadata;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'order_id' }),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "order_id", void 0);
__decorate([
    ManyToOne(() => ParentOrder, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'order_id' }),
    __metadata("design:type", ParentOrder)
], OrderStatusHistory.prototype, "order", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'sub_order_id' }),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "sub_order_id", void 0);
__decorate([
    ManyToOne(() => SubOrder, { onDelete: 'CASCADE', nullable: true }),
    JoinColumn({ name: 'sub_order_id' }),
    __metadata("design:type", SubOrder)
], OrderStatusHistory.prototype, "sub_order", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, nullable: true, name: 'from_status' }),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "from_status", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, name: 'to_status' }),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "to_status", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'changed_by' }),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "changed_by", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true }),
    JoinColumn({ name: 'changed_by' }),
    __metadata("design:type", User)
], OrderStatusHistory.prototype, "changer", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "reason", void 0);
__decorate([
    Column({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], OrderStatusHistory.prototype, "metadata", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], OrderStatusHistory.prototype, "created_at", void 0);
OrderStatusHistory = __decorate([
    Entity('order_status_history')
], OrderStatusHistory);
export { OrderStatusHistory };
//# sourceMappingURL=order-status-history.entity.js.map