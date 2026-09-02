import { NotificationsService } from './notifications.service.js';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(tenantId: string, userId: string, page?: number, limit?: number): Promise<{
        data: import("./notification.entity.js").Notification[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUnreadCount(tenantId: string, userId: string): Promise<{
        count: number;
    }>;
    markAsRead(tenantId: string, userId: string, id: string): Promise<import("./notification.entity.js").Notification>;
    markAllAsRead(tenantId: string, userId: string): Promise<{
        affected: number;
    }>;
}
