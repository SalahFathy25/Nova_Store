var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity.js';
let NotificationsService = class NotificationsService {
    notificationRepo;
    constructor(notificationRepo) {
        this.notificationRepo = notificationRepo;
    }
    async getNotifications(tenantId, userId, page = 1, limit = 20) {
        const [data, total] = await this.notificationRepo.findAndCount({
            where: { tenant_id: tenantId, user_id: userId },
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }
    async getUnreadCount(tenantId, userId) {
        const count = await this.notificationRepo.count({
            where: { tenant_id: tenantId, user_id: userId, is_read: false },
        });
        return { count };
    }
    async markAsRead(tenantId, userId, notificationId) {
        const notification = await this.notificationRepo.findOne({
            where: { id: notificationId, tenant_id: tenantId, user_id: userId },
        });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        notification.is_read = true;
        return this.notificationRepo.save(notification);
    }
    async markAllAsRead(tenantId, userId) {
        const result = await this.notificationRepo.update({ tenant_id: tenantId, user_id: userId, is_read: false }, { is_read: true });
        return { affected: result.affected || 0 };
    }
    async createNotification(tenantId, userId, title, body, type = 'in_app', data) {
        const notification = this.notificationRepo.create({
            tenant_id: tenantId,
            user_id: userId,
            title,
            body,
            type,
            data,
        });
        return this.notificationRepo.save(notification);
    }
};
NotificationsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Notification)),
    __metadata("design:paramtypes", [Repository])
], NotificationsService);
export { NotificationsService };
//# sourceMappingURL=notifications.service.js.map