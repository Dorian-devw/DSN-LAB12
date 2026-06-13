import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        favoriteRoom: true,
        userAchievements: {
          include: { achievement: true }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(id: string, data: { fullName: string }) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { fullName: data.fullName },
    });
    return user;
  }
}
