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
import { User } from '../users/user.entity.js';
import { Store } from '../stores/store.entity.js';
let Cart = class Cart {
    id;
    user_id;
    user;
    tenant_id;
    store;
    session_id;
    coupon_code;
    notes;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Cart.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'user_id' }),
    __metadata("design:type", String)
], Cart.prototype, "user_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true }),
    JoinColumn({ name: 'user_id' }),
    __metadata("design:type", User)
], Cart.prototype, "user", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], Cart.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], Cart.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true, name: 'session_id' }),
    __metadata("design:type", String)
], Cart.prototype, "session_id", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, nullable: true, name: 'coupon_code' }),
    __metadata("design:type", String)
], Cart.prototype, "coupon_code", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cart.prototype, "notes", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Cart.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], Cart.prototype, "updated_at", void 0);
Cart = __decorate([
    Entity('carts')
], Cart);
export { Cart };
//# sourceMappingURL=cart.entity.js.map