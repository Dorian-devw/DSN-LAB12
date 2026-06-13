import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { calculatePoints } from '../utils/scoring.util';
import { AchievementsService } from '../achievements/achievements.service';

function getLevel(points: number): number {
  if (points >= 1200) return 10;
  if (points >= 850) return 9;
  if (points >= 600) return 8;
  if (points >= 400) return 7;
  if (points >= 250) return 6;
  if (points >= 150) return 5;
  if (points >= 100) return 4;
  if (points >= 50) return 3;
  if (points >= 25) return 2;
  return 1;
}

@Injectable()
export class MatchesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly achievementsService: AchievementsService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Bootstrapping MatchesService: Syncing matches on startup...');
    await this.syncMatches();
  }

  async getMatches() {
    return this.prisma.match.findMany({
      include: { homeTeam: true, awayTeam: true },
      orderBy: { kickoffTime: 'asc' },
    });
  }

  async getMatch(id: string) {
    return this.prisma.match.findUnique({
      where: { id },
      include: { homeTeam: true, awayTeam: true },
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncMatches() {
    this.logger.log('Starting automated Match Sync from football-data.org...');
    
    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    if (!apiKey) {
      this.logger.error('FOOTBALL_DATA_API_KEY is missing');
      return { success: false, message: 'API Key missing' };
    }

    try {
      // Competition WC in football-data.org corresponds to the FIFA World Cup
      const response = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
        headers: { 'X-Auth-Token': apiKey }
      });
      
      const data = await response.json();
      
      if (!data.matches || data.matches.length === 0) {
        this.logger.warn('No matches found from football-data.org for FIFA World Cup');
        return { success: true, count: 0 };
      }

      let updatedCount = 0;
      
      const tournament = await this.prisma.tournament.findFirst({
        where: { apiTournamentId: 1 }
      });
      const tournamentId = tournament ? tournament.id : '00000000-0000-0000-0000-000000000001';
      if (!tournament) {
        await this.prisma.tournament.create({
          data: {
            id: tournamentId,
            apiTournamentId: 1,
            name: 'FIFA World Cup 2026',
            startDate: new Date('2026-06-11'),
            endDate: new Date('2026-07-19')
          }
        });
      }
      
      for (const matchData of data.matches) {
        if (!matchData.homeTeam?.id || !matchData.awayTeam?.id) {
          continue;
        }

        // Upsert Teams
        await this.prisma.team.upsert({
          where: { apiTeamId: matchData.homeTeam.id },
          update: { name: matchData.homeTeam.name, logoUrl: matchData.homeTeam.crest },
          create: { apiTeamId: matchData.homeTeam.id, name: matchData.homeTeam.name, logoUrl: matchData.homeTeam.crest }
        });
        
        await this.prisma.team.upsert({
          where: { apiTeamId: matchData.awayTeam.id },
          update: { name: matchData.awayTeam.name, logoUrl: matchData.awayTeam.crest },
          create: { apiTeamId: matchData.awayTeam.id, name: matchData.awayTeam.name, logoUrl: matchData.awayTeam.crest }
        });

        const hTeam = await this.prisma.team.findUnique({ where: { apiTeamId: matchData.homeTeam.id } });
        const aTeam = await this.prisma.team.findUnique({ where: { apiTeamId: matchData.awayTeam.id } });

        if(!hTeam || !aTeam) continue;

        let status: any = 'SCHEDULED';
        if (matchData.status === 'FINISHED') status = 'FINISHED';
        else if (['IN_PLAY', 'PAUSED', 'LIVE'].includes(matchData.status)) status = 'IN_PROGRESS';

        const homeScore = matchData.score?.fullTime?.home ?? null;
        const awayScore = matchData.score?.fullTime?.away ?? null;

        const match = await this.prisma.match.upsert({
          where: { apiMatchId: matchData.id },
          update: {
            status,
            homeScore,
            awayScore,
          },
          create: {
            apiMatchId: matchData.id,
            tournamentId: tournamentId,
            homeTeamId: hTeam.id,
            awayTeamId: aTeam.id,
            kickoffTime: new Date(matchData.utcDate),
            predictionDeadline: new Date(new Date(matchData.utcDate).getTime() - 15 * 60000), // 15 mins before
            status,
            homeScore,
            awayScore,
          }
        });

        updatedCount++;

        // If match finished, calculate user points
        if (status === 'FINISHED' && match.homeScore !== null && match.awayScore !== null) {
          await this.processPredictions(match.id, match.homeScore, match.awayScore);
        }
      }

      this.logger.log(`Sync complete. Updated ${updatedCount} matches.`);
      return { success: true, count: updatedCount };
    } catch (e) {
      this.logger.error('Error syncing matches:', e);
      return { success: false, message: 'Sync failed' };
    }
  }

  private async processPredictions(matchId: string, actualHome: number, actualAway: number) {
    const predictions = await this.prisma.prediction.findMany({
      where: { matchId }
    });

    for (const pred of predictions) {
      const basePoints = calculatePoints(
        pred.predictedHomeScore,
        pred.predictedAwayScore,
        actualHome,
        actualAway
      );

      await this.prisma.prediction.update({
        where: {
          userId_matchId: { userId: pred.userId, matchId }
        },
        data: {
          pointsAwarded: basePoints,
          isExactScore: basePoints === 5,
          isCorrectWinner: basePoints === 3 || basePoints === 2,
          isCorrectDifference: basePoints === 2
        }
      });

      await this.recalculateUserStats(pred.userId);
    }
  }

  async recalculateUserStats(userId: string) {
    const finishedMatches = await this.prisma.match.findMany({
      where: { status: 'FINISHED' },
      orderBy: { kickoffTime: 'asc' }
    });

    const userPreds = await this.prisma.prediction.findMany({
      where: { userId }
    });
    const userPredsMap = new Map(userPreds.map(p => [p.matchId, p]));

    let currentStreak = 0;
    let maxStreak = 0;
    let streakBonusPoints = 0;
    let basePointsTotal = 0;
    let earlyBonusPoints = 0;
    let correctPredictionsCount = 0;

    for (const match of finishedMatches) {
      const pred = userPredsMap.get(match.id);
      if (pred) {
        const isCorrect = pred.pointsAwarded > 0;
        if (isCorrect) {
          currentStreak++;
          if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
          }
          if (currentStreak > 0 && currentStreak % 3 === 0) {
            streakBonusPoints += 2;
          }
          correctPredictionsCount++;
        } else {
          currentStreak = 0;
        }
        basePointsTotal += pred.pointsAwarded;
        if (pred.earlyBonusAwarded) {
          earlyBonusPoints += 1;
        }
      } else {
        currentStreak = 0;
      }
    }

    const totalPredictionsCount = userPreds.length;
    const accuracyRate = totalPredictionsCount > 0 
      ? (correctPredictionsCount / totalPredictionsCount) * 100 
      : 0;
    
    const totalPoints = basePointsTotal + earlyBonusPoints + streakBonusPoints;
    const level = getLevel(totalPoints);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints,
        accuracyRate,
        currentStreak,
        maxStreak,
        level,
        totalPredictions: totalPredictionsCount,
        correctPredictions: correctPredictionsCount
      }
    });

    await this.achievementsService.checkAndUnlockAchievements(userId);
  }
}
