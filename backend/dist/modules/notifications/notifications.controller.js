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
import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CurrentTenantId } from '../../common/decorators/tenant.decorator.js';
import { CurrentUser } from '../../common/decorators/user.decorator.js';
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async getNotifications(tenantId, userId, page, limit) {
        return this.notificationsService.getNotifications(tenantId, userId, page || 1, limit || 20);
    }
    async getUnreadCount(tenantId, userId) {
        return this.notificationsService.getUnreadCount(tenantId, userId);
    }
    async markAsRead(tenantId, userId, id) {
        return this.notificationsService.markAsRead(tenantId, userId, id);
    }
    async markAllAsRead(tenantId, userId) {
        return this.notificationsService.markAllAsRead(tenantId, userId);
    }
};
__decorate([
    Get(),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get notifications' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __param(2, Query('page')),
    __param(3, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotifications", null);
__decorate([
    Get('unread-count'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get unread notification count' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    Patch(':id/read'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Mark notification as read' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __param(2, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    Patch('read-all'),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Mark all notifications as read' }),
    __param(0, CurrentTenantId()),
    __param(1, CurrentUser('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
NotificationsController = __decorate([
    ApiTags('Notifications'),
    Controller('api/v1/notifications'),
    __metadata("design:paramtypes", [NotificationsService])
], NotificationsController);
export { NotificationsController };
//# sourceMappingURL=notifications.controller.js.map