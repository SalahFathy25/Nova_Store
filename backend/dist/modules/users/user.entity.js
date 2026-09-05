var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, } from 'typeorm';
import { Store } from '../stores/store.entity.js';
let User = class User {
    id;
    tenant_id;
    store;
    full_name;
    email;
    phone;
    password_hash;
    role;
    avatar_url;
    fcm_token;
    is_active;
    is_verified;
    auth_provider;
    provider_uid;
    last_login_at;
    created_at;
    updated_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'tenant_id' }),
    __metadata("design:type", String)
], User.prototype, "tenant_id", void 0);
__decorate([
    ManyToOne(() => Store, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'tenant_id' }),
    __metadata("design:type", Store)
], User.prototype, "store", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "full_name", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true, name: 'password_hash' }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    Column({
        type: 'varchar',
        length: 50,
        enum: ['customer', 'admin', 'driver', 'vendor_admin'],
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'avatar_url' }),
    __metadata("design:type", String)
], User.prototype, "avatar_url", void 0);
__decorate([
    Column({ type: 'text', nullable: true, name: 'fcm_token' }),
    __metadata("design:type", String)
], User.prototype, "fcm_token", void 0);
__decorate([
    Column({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    Column({ type: 'boolean', default: false, name: 'is_verified' }),
    __metadata("design:type", Boolean)
], User.prototype, "is_verified", void 0);
__decorate([
    Column({ type: 'varchar', length: 50, default: 'email', name: 'auth_provider' }),
    __metadata("design:type", String)
], User.prototype, "auth_provider", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true, name: 'provider_uid' }),
    __metadata("design:type", String)
], User.prototype, "provider_uid", void 0);
__decorate([
    Column({ type: 'timestamptz', nullable: true, name: 'last_login_at' }),
    __metadata("design:type", Date)
], User.prototype, "last_login_at", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
User = __decorate([
    Entity('users'),
    Index(['tenant_id', 'email'], { unique: true })
], User);
export { User };
//# sourceMappingURL=user.entity.js.map