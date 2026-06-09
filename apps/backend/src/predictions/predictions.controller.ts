import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePredictionDto } from './dto/predictions.dto';

@Controller('predictions')
@UseGuards(JwtAuthGuard)
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Post(':matchId')
  async createOrUpdate(
    @Req() req: any,
    @Param('matchId') matchId: string,
    @Body() dto: CreatePredictionDto
  ) {
    return this.predictionsService.createOrUpdate(req.user.id, matchId, dto);
  }

  @Get()
  async getMyPredictions(@Req() req: any) {
    return this.predictionsService.getMyPredictions(req.user.id);
  }
}
