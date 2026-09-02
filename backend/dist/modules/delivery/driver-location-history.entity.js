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
import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';
import { SubOrder } from '../orders/sub-order.entity.js';
let DriverLocationHistory = class DriverLocationHistory {
    id;
    driver_id;
    driver;
    tenant_id;
    store;
    sub_order_id;
    sub_order;
    latitude;
    longitude;
    speed;
    heading;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], DriverLocationHistory.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'driver_id' }),
    __metadata("design:type", String)
], DriverLocationHistory.prototype, "driver_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'driver_id' }),
    __metadata("design:type", User)
], DriverLocationHistory.prototype, "driver", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], DriverLocationHistory.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], DriverLocationHistory.prototype, "store", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'sub_order_id' }),
    __metadata("design:type", Object)
], DriverLocationHistory.prototype, "sub_order_id", void 0);
__decorate([
    ManyToOne(() => SubOrder, { onDelete: 'SET NULL', nullable: true }),
    JoinColumn({ name: 'sub_order_id' }),
    __metadata("design:type", SubOrder)
], DriverLocationHistory.prototype, "sub_order", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 8 }),
    __metadata("design:type", Number)
], DriverLocationHistory.prototype, "latitude", void 0);
__decorate([
    Column({ type: 'decimal', precision: 11, scale: 8 }),
    __metadata("design:type", Number)
], DriverLocationHistory.prototype, "longitude", void 0);
__decorate([
    Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], DriverLocationHistory.prototype, "speed", void 0);
__decorate([
    Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], DriverLocationHistory.prototype, "heading", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], DriverLocationHistory.prototype, "created_at", void 0);
DriverLocationHistory = __decorate([
    Entity('driver_location_history'),
    Index(['driver_id', 'created_at']),
    Index(['sub_order_id'])
], DriverLocationHistory);
export { DriverLocationHistory };
//# sourceMappingURL=driver-location-history.entity.js.map