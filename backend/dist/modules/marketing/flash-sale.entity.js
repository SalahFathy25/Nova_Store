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
let FlashSale = class FlashSale {
    id;
    tenant_id;
    store;
    name;
    description;
    starts_at;
    ends_at;
    is_active;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], FlashSale.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], FlashSale.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], FlashSale.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], FlashSale.prototype, "name", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], FlashSale.prototype, "description", void 0);
__decorate([
    Column({ type: 'timestamptz', name: 'starts_at' }),
    __metadata("design:type", Date)
], FlashSale.prototype, "starts_at", void 0);
__decorate([
    Column({ type: 'timestamptz', name: 'ends_at' }),
    __metadata("design:type", Date)
], FlashSale.prototype, "ends_at", void 0);
__decorate([
    Column({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], FlashSale.prototype, "is_active", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], FlashSale.prototype, "created_at", void 0);
FlashSale = __decorate([
    Entity('flash_sales')
], FlashSale);
export { FlashSale };
//# sourceMappingURL=flash-sale.entity.js.map