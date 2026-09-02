import { Repository } from 'typeorm';
import { Notification } from './notification.entity.js';
export declare class NotificationsService {
    private readonly notificationRepo;
    constructor(notificationRepo: Repository<Notification>);
    getNotifications(tenantId: string, userId: string, page?: number, limit?: number): Promise<{
        data: Notification[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUnreadCount(tenantId: string, userId: string): Promise<{
        count: number;
    }>;
    markAsRead(tenantId: string, userId: string, notificationId: string): Promise<Notification>;
    markAllAsRead(tenantId: string, userId: string): Promise<{
        affected: number;
    }>;
    createNotification(tenantId: string, userId: string, title: string, body: string, type?: string, data?: Record<string, any>): Promise<Notification>;
}
