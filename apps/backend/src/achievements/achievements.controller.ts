import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('achievements')
@UseGuards(JwtAuthGuard)
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get('me')
  async getMyAchievements(@Req() req: any) {
    return this.achievementsService.getMyAchievements(req.user.id);
  }
}
