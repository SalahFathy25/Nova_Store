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
let AuditLog = class AuditLog {
    id;
    tenant_id;
    store;
    user_id;
    user;
    action;
    entity;
    entity_id;
    old_values;
    new_values;
    ip_address;
    user_agent;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], AuditLog.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], AuditLog.prototype, "store", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'user_id' }),
    __metadata("design:type", String)
], AuditLog.prototype, "user_id", void 0);
__decorate([
    ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true }),
    JoinColumn({ name: 'user_id' }),
    __metadata("design:type", User)
], AuditLog.prototype, "user", void 0);
__decorate([
    Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    Column({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], AuditLog.prototype, "entity", void 0);
__decorate([
    Column({ type: 'uuid', nullable: true, name: 'entity_id' }),
    __metadata("design:type", String)
], AuditLog.prototype, "entity_id", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true, name: 'old_values' }),
    __metadata("design:type", Object)
], AuditLog.prototype, "old_values", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true, name: 'new_values' }),
    __metadata("design:type", Object)
], AuditLog.prototype, "new_values", void 0);
__decorate([
    Column({ type: 'inet', nullable: true, name: 'ip_address' }),
    __metadata("design:type", String)
], AuditLog.prototype, "ip_address", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "user_agent", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], AuditLog.prototype, "created_at", void 0);
AuditLog = __decorate([
    Entity('audit_logs')
], AuditLog);
export { AuditLog };
//# sourceMappingURL=audit-log.entity.js.map