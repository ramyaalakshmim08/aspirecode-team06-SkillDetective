// =============================================================================
// Skill Detective — Notification Service
// Persistent notification delivery, unread count tracking, and alerts
// =============================================================================

import { AppNotification } from '../types';
import { StorageAdapter } from './storageAdapter';

export class NotificationService {
  public static getNotifications(userId: string): AppNotification[] {
    return StorageAdapter.getNotifications(userId);
  }

  public static getUnreadCount(userId: string): number {
    const list = StorageAdapter.getNotifications(userId);
    return list.filter((n) => !n.isRead).length;
  }

  public static markAsRead(userId: string, notifId: string): void {
    StorageAdapter.markNotificationAsRead(userId, notifId);
  }

  public static markAllAsRead(userId: string): void {
    StorageAdapter.markAllNotificationsAsRead(userId);
  }

  public static pushNotification(
    userId: string,
    notification: Omit<AppNotification, 'id' | 'createdAt'>
  ): void {
    StorageAdapter.addNotification(userId, notification);
  }
}
