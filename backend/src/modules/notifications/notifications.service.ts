import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity.js';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async getNotifications(
    tenantId: string,
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: Notification[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.notificationRepo.findAndCount({
      where: { tenant_id: tenantId, user_id: userId },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async getUnreadCount(tenantId: string, userId: string): Promise<{ count: number }> {
    const count = await this.notificationRepo.count({
      where: { tenant_id: tenantId, user_id: userId, is_read: false },
    });

    return { count };
  }

  async markAsRead(tenantId: string, userId: string, notificationId: string): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId, tenant_id: tenantId, user_id: userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.is_read = true;
    return this.notificationRepo.save(notification);
  }

  async markAllAsRead(tenantId: string, userId: string): Promise<{ affected: number }> {
    const result = await this.notificationRepo.update(
      { tenant_id: tenantId, user_id: userId, is_read: false },
      { is_read: true },
    );

    return { affected: result.affected || 0 };
  }

  async createNotification(
    tenantId: string,
    userId: string,
    title: string,
    body: string,
    type: string = 'in_app',
    data?: Record<string, any>,
  ): Promise<Notification> {
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
}
