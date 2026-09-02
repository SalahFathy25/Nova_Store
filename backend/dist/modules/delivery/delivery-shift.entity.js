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
import { Store } from '../stores/store.entity.js';
let DeliveryShift = class DeliveryShift {
    id;
    driver_id;
    driver;
    tenant_id;
    store;
    status;
    started_at;
    ended_at;
    total_orders;
    total_delivered;
    total_failed;
    total_earnings;
    current_location;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], DeliveryShift.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'driver_id' }),
    __metadata("design:type", String)
], DeliveryShift.prototype, "driver_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'driver_id' }),
    __metadata("design:type", User)
], DeliveryShift.prototype, "driver", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], DeliveryShift.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], DeliveryShift.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'Offline' }),
    __metadata("design:type", String)
], DeliveryShift.prototype, "status", void 0);
__decorate([
    Column({ type: 'timestamptz', default: () => 'NOW()', name: 'started_at' }),
    __metadata("design:type", Date)
], DeliveryShift.prototype, "started_at", void 0);
__decorate([
    Column({ type: 'timestamptz', nullable: true, name: 'ended_at' }),
    __metadata("design:type", Date)
], DeliveryShift.prototype, "ended_at", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'total_orders' }),
    __metadata("design:type", Number)
], DeliveryShift.prototype, "total_orders", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'total_delivered' }),
    __metadata("design:type", Number)
], DeliveryShift.prototype, "total_delivered", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'total_failed' }),
    __metadata("design:type", Number)
], DeliveryShift.prototype, "total_failed", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'total_earnings' }),
    __metadata("design:type", Number)
], DeliveryShift.prototype, "total_earnings", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true, name: 'current_location' }),
    __metadata("design:type", Object)
], DeliveryShift.prototype, "current_location", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], DeliveryShift.prototype, "created_at", void 0);
DeliveryShift = __decorate([
    Entity('delivery_shifts')
], DeliveryShift);
export { DeliveryShift };
//# sourceMappingURL=delivery-shift.entity.js.map