import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('stats')
  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const totalPredictions = await this.prisma.prediction.count();
    const totalRooms = await this.prisma.room.count();
    const totalMatches = await this.prisma.match.count();

    return {
      totalUsers,
      totalPredictions,
      totalRooms,
      totalMatches,
    };
  }
}
