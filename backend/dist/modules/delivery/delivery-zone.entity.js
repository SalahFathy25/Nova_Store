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
import { Store } from '../stores/store.entity.js';
let DeliveryZone = class DeliveryZone {
    id;
    tenant_id;
    store;
    name;
    coordinates;
    radius_km;
    flat_fee;
    free_above;
    is_active;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], DeliveryZone.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], DeliveryZone.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], DeliveryZone.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], DeliveryZone.prototype, "name", void 0);
__decorate([
    Column({ type: 'jsonb' }),
    __metadata("design:type", Object)
], DeliveryZone.prototype, "coordinates", void 0);
__decorate([
    Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'radius_km' }),
    __metadata("design:type", Number)
], DeliveryZone.prototype, "radius_km", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'flat_fee' }),
    __metadata("design:type", Number)
], DeliveryZone.prototype, "flat_fee", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'free_above' }),
    __metadata("design:type", Number)
], DeliveryZone.prototype, "free_above", void 0);
__decorate([
    Column({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], DeliveryZone.prototype, "is_active", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], DeliveryZone.prototype, "created_at", void 0);
DeliveryZone = __decorate([
    Entity('delivery_zones')
], DeliveryZone);
export { DeliveryZone };
//# sourceMappingURL=delivery-zone.entity.js.map