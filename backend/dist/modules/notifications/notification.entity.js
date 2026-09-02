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
let Notification = class Notification {
    id;
    user_id;
    user;
    tenant_id;
    store;
    title;
    body;
    data;
    type;
    is_read;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], Notification.prototype, "user_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'user_id' }),
    __metadata("design:type", User)
], Notification.prototype, "user", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], Notification.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], Notification.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    Column({ type: 'text' }),
    __metadata("design:type", String)
], Notification.prototype, "body", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "data", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'in_app', enum: ['in_app', 'push', 'sms', 'email'] }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'is_read' }),
    __metadata("design:type", Boolean)
], Notification.prototype, "is_read", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Notification.prototype, "created_at", void 0);
Notification = __decorate([
    Entity('notifications')
], Notification);
export { Notification };
//# sourceMappingURL=notification.entity.js.map