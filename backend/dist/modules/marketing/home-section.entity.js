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
let HomeSection = class HomeSection {
    id;
    tenant_id;
    store;
    type;
    title;
    config;
    display_order;
    is_active;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], HomeSection.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], HomeSection.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], HomeSection.prototype, "store", void 0);
__decorate([
    Column({
        type: 'varchar',
        length: 50,
        enum: ['banner', 'category_grid', 'product_list', 'product_grid', 'flash_sale', 'brands', 'custom'],
    }),
    __metadata("design:type", String)
], HomeSection.prototype, "type", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], HomeSection.prototype, "title", void 0);
__decorate([
    Column({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], HomeSection.prototype, "config", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'display_order' }),
    __metadata("design:type", Number)
], HomeSection.prototype, "display_order", void 0);
__decorate([
    Column({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], HomeSection.prototype, "is_active", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], HomeSection.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], HomeSection.prototype, "updated_at", void 0);
HomeSection = __decorate([
    Entity('home_sections')
], HomeSection);
export { HomeSection };
//# sourceMappingURL=home-section.entity.js.map