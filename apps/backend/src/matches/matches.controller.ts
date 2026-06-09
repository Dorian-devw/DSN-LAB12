import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMatches() {
    return this.matchesService.getMatches();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMatch(@Param('id') id: string) {
    return this.matchesService.getMatch(id);
  }

  // Usually an admin or cron endpoint
  @Post('sync')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async syncMatches() {
    return this.matchesService.syncMatches();
  }
}
