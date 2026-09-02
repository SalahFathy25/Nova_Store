var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, } from 'typeorm';
let UserSession = class UserSession {
    id;
    user_id;
    refresh_token_hash;
    device_info;
    ip_address;
    expires_at;
    created_at;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], UserSession.prototype, "id", void 0);
__decorate([
    Column({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], UserSession.prototype, "user_id", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, name: 'refresh_token_hash' }),
    __metadata("design:type", String)
], UserSession.prototype, "refresh_token_hash", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true, name: 'device_info' }),
    __metadata("design:type", Object)
], UserSession.prototype, "device_info", void 0);
__decorate([
    Column({ type: 'inet', nullable: true, name: 'ip_address' }),
    __metadata("design:type", String)
], UserSession.prototype, "ip_address", void 0);
__decorate([
    Column({ type: 'timestamptz', name: 'expires_at' }),
    __metadata("design:type", Date)
], UserSession.prototype, "expires_at", void 0);
__decorate([
    CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], UserSession.prototype, "created_at", void 0);
UserSession = __decorate([
    Entity('user_sessions')
], UserSession);
export { UserSession };
//# sourceMappingURL=user-session.entity.js.map