import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events/events.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly eventsGateway: EventsGateway,
    private readonly prisma: PrismaService,
  ) {}

  async notifyMatchUpdate(matchId: string, payload: any) {
    this.eventsGateway.sendMatchUpdate(matchId, payload);
  }

  async notifyUserAchievement(userId: string, achievementId: string) {
    const achievement = await this.prisma.achievement.findUnique({ where: { id: achievementId } });
    if (achievement) {
      this.eventsGateway.sendUserNotification(userId, {
        type: 'ACHIEVEMENT_UNLOCKED',
        data: achievement,
      });
    }
  }
}
