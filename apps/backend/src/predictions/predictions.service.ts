import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePredictionDto } from './dto/predictions.dto';

@Injectable()
export class PredictionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdate(userId: string, matchId: string, dto: CreatePredictionDto) {
    const match = await this.prisma.match.findUnique({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Match not found');

    if (new Date() > match.predictionDeadline) {
      throw new BadRequestException('Prediction deadline has passed');
    }

    const isEarly = (match.kickoffTime.getTime() - new Date().getTime()) > 24 * 60 * 60 * 1000;

    const existing = await this.prisma.prediction.findUnique({
      where: {
        userId_matchId: { userId, matchId }
      }
    });

    if (existing) {
      throw new BadRequestException('Ya tienes una predicción guardada para este partido. No es posible modificarla.');
    }

    return this.prisma.prediction.create({
      data: {
        userId,
        matchId,
        predictedHomeScore: dto.predictedHomeScore,
        predictedAwayScore: dto.predictedAwayScore,
        earlyBonusAwarded: isEarly,
      }
    });
  }

  async getMyPredictions(userId: string) {
    return this.prisma.prediction.findMany({
      where: { userId },
      include: { match: { include: { homeTeam: true, awayTeam: true } } },
      orderBy: { match: { kickoffTime: 'desc' } }
    });
  }
}
