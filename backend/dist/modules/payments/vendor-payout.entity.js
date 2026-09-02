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
let VendorPayout = class VendorPayout {
    id;
    vendor_id;
    vendor;
    tenant_id;
    store;
    amount;
    commission_deducted;
    orders;
    status;
    payout_method;
    payout_details;
    processed_at;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], VendorPayout.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'vendor_id' }),
    __metadata("design:type", String)
], VendorPayout.prototype, "vendor_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'vendor_id' }),
    __metadata("design:type", User)
], VendorPayout.prototype, "vendor", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], VendorPayout.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], VendorPayout.prototype, "store", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], VendorPayout.prototype, "amount", void 0);
__decorate([
    Column({ type: 'decimal', precision: 10, scale: 2, name: 'commission_deducted' }),
    __metadata("design:type", Number)
], VendorPayout.prototype, "commission_deducted", void 0);
__decorate([
    Column({ type: 'jsonb' }),
    __metadata("design:type", Object)
], VendorPayout.prototype, "orders", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'Pending' }),
    __metadata("design:type", String)
], VendorPayout.prototype, "status", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, nullable: true, name: 'payout_method' }),
    __metadata("design:type", String)
], VendorPayout.prototype, "payout_method", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true, name: 'payout_details' }),
    __metadata("design:type", Object)
], VendorPayout.prototype, "payout_details", void 0);
__decorate([
    Column({ type: 'timestamptz', nullable: true, name: 'processed_at' }),
    __metadata("design:type", Date)
], VendorPayout.prototype, "processed_at", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], VendorPayout.prototype, "created_at", void 0);
VendorPayout = __decorate([
    Entity('vendor_payouts')
], VendorPayout);
export { VendorPayout };
//# sourceMappingURL=vendor-payout.entity.js.map