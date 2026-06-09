import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rankings')
@UseGuards(JwtAuthGuard)
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get('global')
  async getGlobalRanking() {
    return this.rankingsService.getGlobalRanking();
  }

  @Get('room/:roomId')
  async getRoomRanking(@Param('roomId') roomId: string) {
    return this.rankingsService.getRoomRanking(roomId);
  }
}
