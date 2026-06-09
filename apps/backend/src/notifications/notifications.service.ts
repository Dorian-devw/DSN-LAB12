import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsGateway } from './events/events.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly eventsGateway: EventsGateway,
    private readonly prisma: PrismaService,
  ) {}

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'MATCH_REMINDER' | 'RANKING_UPDATE' | 'ACHIEVEMENT_UNLOCKED' | 'SYSTEM',
  ) {
    const notif = await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        notificationType: type,
      },
    });

    // Send via WebSocket (best effort)
    try {
      this.eventsGateway.sendUserNotification(userId, {
        type,
        data: notif,
      });
    } catch (e) {
      console.warn('Failed to emit WebSocket notification:', e.message);
    }

    return notif;
  }

  async getMyNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(userId: string, notifId: string) {
    const notif = await this.prisma.notification.findUnique({
      where: { id: notifId },
    });

    if (!notif || notif.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notifId },
      data: { isRead: true },
    });
  }

  // Legacy/compatibility methods
  async notifyMatchUpdate(matchId: string, payload: any) {
    this.eventsGateway.sendMatchUpdate(matchId, payload);
  }

  async notifyUserAchievement(userId: string, achievementId: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id: achievementId },
    });
    if (achievement) {
      await this.createNotification(
        userId,
        `🏆 ¡Logro desbloqueado: ${achievement.title}!`,
        achievement.description || 'Has desbloqueado un nuevo logro.',
        'ACHIEVEMENT_UNLOCKED',
      );
    }
  }
}
