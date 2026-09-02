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
let Category = class Category {
    id;
    tenant_id;
    store;
    name;
    slug;
    description;
    image_url;
    parent_id;
    parent;
    display_order;
    is_active;
    is_featured;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], Category.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], Category.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Category.prototype, "slug", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'image_url' }),
    __metadata("design:type", String)
], Category.prototype, "image_url", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'parent_id' }),
    __metadata("design:type", String)
], Category.prototype, "parent_id", void 0);
__decorate([
    ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true }),
    JoinColumn({ name: 'parent_id' }),
    __metadata("design:type", Category)
], Category.prototype, "parent", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'display_order' }),
    __metadata("design:type", Number)
], Category.prototype, "display_order", void 0);
__decorate([
    Column({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], Category.prototype, "is_active", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'is_featured' }),
    __metadata("design:type", Boolean)
], Category.prototype, "is_featured", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Category.prototype, "created_at", void 0);
Category = __decorate([
    Entity('categories')
], Category);
export { Category };
//# sourceMappingURL=category.entity.js.map