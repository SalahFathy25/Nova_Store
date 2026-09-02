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
let Banner = class Banner {
    id;
    tenant_id;
    store;
    title;
    image_url;
    link_type;
    link_value;
    position;
    display_order;
    starts_at;
    expires_at;
    is_active;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Banner.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], Banner.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], Banner.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Banner.prototype, "title", void 0);
__decorate([
    Column({ type: 'text', name: 'image_url' }),
    __metadata("design:type", String)
], Banner.prototype, "image_url", void 0);
__decorate([
    Column({
        type: 'varchar',
        length: 50,
        nullable: true,
        name: 'link_type',
        enum: ['product', 'category', 'url', 'none'],
    }),
    __metadata("design:type", String)
], Banner.prototype, "link_type", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'link_value' }),
    __metadata("design:type", String)
], Banner.prototype, "link_value", void 0);
__decorate([
    Column({ type: 'varchar', length: 100, default: 'home_top' }),
    __metadata("design:type", String)
], Banner.prototype, "position", void 0);
__decorate([
    Column({ type: 'int', default: 0, name: 'display_order' }),
    __metadata("design:type", Number)
], Banner.prototype, "display_order", void 0);
__decorate([
    Column({ type: 'timestamptz', nullable: true, name: 'starts_at' }),
    __metadata("design:type", Date)
], Banner.prototype, "starts_at", void 0);
__decorate([
    Column({ type: 'timestamptz', nullable: true, name: 'expires_at' }),
    __metadata("design:type", Date)
], Banner.prototype, "expires_at", void 0);
__decorate([
    Column({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], Banner.prototype, "is_active", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Banner.prototype, "created_at", void 0);
Banner = __decorate([
    Entity('banners')
], Banner);
export { Banner };
//# sourceMappingURL=banner.entity.js.map