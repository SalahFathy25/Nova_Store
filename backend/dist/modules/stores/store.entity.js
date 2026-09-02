var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
let Store = class Store {
    id;
    name;
    domain;
    configurations;
    branding;
    is_active;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Store.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Store.prototype, "domain", void 0);
__decorate([
    Column({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], Store.prototype, "configurations", void 0);
__decorate([
    Column({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], Store.prototype, "branding", void 0);
__decorate([
    Column({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Store.prototype, "is_active", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Store.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Store.prototype, "updated_at", void 0);
Store = __decorate([
    Entity('stores')
], Store);
export { Store };
//# sourceMappingURL=store.entity.js.map