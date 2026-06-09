import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('insights/:matchId')
  async getMatchInsight(@Param('matchId') matchId: string) {
    return this.aiService.generateMatchInsight(matchId);
  }
}
