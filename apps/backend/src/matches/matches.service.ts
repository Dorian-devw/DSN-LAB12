import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { calculatePoints } from '../utils/scoring.util';

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(private readonly prisma: PrismaService) {}

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
    this.logger.log('Starting automated Match Sync from API-Football...');
    
    const apiKey = process.env.API_FOOTBALL_KEY;
    if (!apiKey) {
      this.logger.error('API_FOOTBALL_KEY is missing');
      return { success: false, message: 'API Key missing' };
    }

    try {
      // League ID 1 in API-Football corresponds to the FIFA World Cup
      const response = await fetch('https://v3.football.api-sports.io/fixtures?league=1&season=2026', {
        headers: { 'x-apisports-key': apiKey }
      });
      
      const data = await response.json();
      
      if (!data.response || data.response.length === 0) {
        this.logger.warn('No matches found from API-Football for FIFA World Cup');
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
      
      for (const fixture of data.response) {
        // Upsert Teams
        await this.prisma.team.upsert({
          where: { apiTeamId: fixture.teams.home.id },
          update: { name: fixture.teams.home.name, logoUrl: fixture.teams.home.logo },
          create: { apiTeamId: fixture.teams.home.id, name: fixture.teams.home.name, logoUrl: fixture.teams.home.logo }
        });
        
        await this.prisma.team.upsert({
          where: { apiTeamId: fixture.teams.away.id },
          update: { name: fixture.teams.away.name, logoUrl: fixture.teams.away.logo },
          create: { apiTeamId: fixture.teams.away.id, name: fixture.teams.away.name, logoUrl: fixture.teams.away.logo }
        });

        const hTeam = await this.prisma.team.findUnique({ where: { apiTeamId: fixture.teams.home.id } });
        const aTeam = await this.prisma.team.findUnique({ where: { apiTeamId: fixture.teams.away.id } });

        if(!hTeam || !aTeam) continue;

        let status: any = 'SCHEDULED';
        if (fixture.fixture.status.short === 'FT') status = 'FINISHED';
        else if (['1H', '2H', 'HT'].includes(fixture.fixture.status.short)) status = 'IN_PROGRESS';

        const match = await this.prisma.match.upsert({
          where: { apiMatchId: fixture.fixture.id },
          update: {
            status,
            homeScore: fixture.goals.home,
            awayScore: fixture.goals.away,
          },
          create: {
            apiMatchId: fixture.fixture.id,
            tournamentId: tournamentId,
            homeTeamId: hTeam.id,
            awayTeamId: aTeam.id,
            kickoffTime: new Date(fixture.fixture.date),
            predictionDeadline: new Date(new Date(fixture.fixture.date).getTime() - 15 * 60000), // 15 mins before
            status,
            homeScore: fixture.goals.home,
            awayScore: fixture.goals.away,
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
      const points = calculatePoints(
        pred.predictedHomeScore,
        pred.predictedAwayScore,
        actualHome,
        actualAway
      );

      if (points > 0 && pred.pointsAwarded !== points) {
        await this.prisma.prediction.update({
          where: {
            userId_matchId: { userId: pred.userId, matchId }
          },
          data: { pointsAwarded: points }
        });

        const userPreds = await this.prisma.prediction.findMany({ where: { userId: pred.userId } });
        const total = userPreds.reduce((sum, p) => sum + (p.pointsAwarded || 0), 0);
        
        await this.prisma.user.update({
          where: { id: pred.userId },
          data: { totalPoints: total }
        });
      }
    }
  }
}
