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
let Attribute = class Attribute {
    id;
    tenant_id;
    store;
    name;
    type;
    is_filterable;
    is_variant;
    display_order;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Attribute.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], Attribute.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], Attribute.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Attribute.prototype, "name", void 0);
__decorate([
    Column({
        type: 'varchar',
        length: 50,
        enum: ['text', 'number', 'color', 'select', 'multi_select'],
    }),
    __metadata("design:type", String)
], Attribute.prototype, "type", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'is_filterable' }),
    __metadata("design:type", Boolean)
], Attribute.prototype, "is_filterable", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'is_variant' }),
    __metadata("design:type", Boolean)
], Attribute.prototype, "is_variant", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'display_order' }),
    __metadata("design:type", Number)
], Attribute.prototype, "display_order", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Attribute.prototype, "created_at", void 0);
Attribute = __decorate([
    Entity('attributes')
], Attribute);
export { Attribute };
//# sourceMappingURL=attribute.entity.js.map