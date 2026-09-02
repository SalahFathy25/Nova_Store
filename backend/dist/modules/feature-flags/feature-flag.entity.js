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
import { Store } from '../stores/store.entity.js';
let FeatureFlag = class FeatureFlag {
    id;
    tenant_id;
    store;
    flag_name;
    is_enabled;
    config;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], FeatureFlag.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], FeatureFlag.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], FeatureFlag.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, name: 'flag_name' }),
    __metadata("design:type", String)
], FeatureFlag.prototype, "flag_name", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'is_enabled' }),
    __metadata("design:type", Boolean)
], FeatureFlag.prototype, "is_enabled", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], FeatureFlag.prototype, "config", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], FeatureFlag.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], FeatureFlag.prototype, "updated_at", void 0);
FeatureFlag = __decorate([
    Entity('feature_flags')
], FeatureFlag);
export { FeatureFlag };
//# sourceMappingURL=feature-flag.entity.js.map