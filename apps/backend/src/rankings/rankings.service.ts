import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGlobalRanking() {
    return this.prisma.user.findMany({
      orderBy: { totalPoints: 'desc' },
      take: 100,
      select: {
        id: true,
        fullName: true,
        profileImageUrl: true,
        totalPoints: true,
      }
    });
  }

  async getRoomRanking(roomId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                profileImageUrl: true,
                totalPoints: true,
              }
            }
          }
        }
      }
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Sort room members by user's total points descending
    return room.members
      .map(m => m.user)
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }
}
