import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AchievementsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.seedAchievements();
  }

  async seedAchievements() {
    this.logger.log('Seeding default achievements in DB...');
    const defaultAchievements = [
      { id: '00000000-0000-0000-0000-000000000001', title: 'First Kick', description: 'Submit your first prediction.', requiredValue: 1 },
      { id: '00000000-0000-0000-0000-000000000002', title: 'Good Start', description: 'Make your first successful prediction.', requiredValue: 1 },
      { id: '00000000-0000-0000-0000-000000000003', title: 'Perfect Shot', description: 'Predict your first exact score.', requiredValue: 1 },
      
      { id: '00000000-0000-0000-0000-000000000004', title: 'On Fire', description: 'Get 3 consecutive successful predictions.', requiredValue: 3 },
      { id: '00000000-0000-0000-0000-000000000005', title: 'Hot Predictor', description: 'Get 5 consecutive successful predictions.', requiredValue: 5 },
      { id: '00000000-0000-0000-0000-000000000006', title: 'Prediction Machine', description: 'Get 10 consecutive successful predictions.', requiredValue: 10 },
      { id: '00000000-0000-0000-0000-000000000007', title: 'Unstoppable', description: 'Get 20 consecutive successful predictions.', requiredValue: 20 },
      
      { id: '00000000-0000-0000-0000-000000000008', title: 'Committed Player', description: 'Submit 10 predictions.', requiredValue: 10 },
      { id: '00000000-0000-0000-0000-000000000009', title: 'Dedicated Analyst', description: 'Submit 50 predictions.', requiredValue: 50 },
      { id: '00000000-0000-0000-0000-000000000010', title: 'Football Addict', description: 'Submit 100 predictions.', requiredValue: 100 },
      { id: '00000000-0000-0000-0000-000000000011', title: 'Prediction Veteran', description: 'Submit 250 predictions.', requiredValue: 250 },
      
      { id: '00000000-0000-0000-0000-000000000012', title: 'Silver Precision', description: 'Maintain a 60% prediction accuracy (min. 5 predictions).', requiredValue: 60 },
      { id: '00000000-0000-0000-0000-000000000013', title: 'Gold Precision', description: 'Maintain a 70% prediction accuracy (min. 5 predictions).', requiredValue: 70 },
      { id: '00000000-0000-0000-0000-000000000014', title: 'Diamond Precision', description: 'Maintain an 80% prediction accuracy (min. 5 predictions).', requiredValue: 80 },
      
      { id: '00000000-0000-0000-0000-000000000015', title: 'Exact 10', description: 'Score 10 exact predictions.', requiredValue: 10 },
      { id: '00000000-0000-0000-0000-000000000016', title: 'Exact 25', description: 'Score 25 exact predictions.', requiredValue: 25 },
      { id: '00000000-0000-0000-0000-000000000017', title: 'Exact 50', description: 'Score 50 exact predictions.', requiredValue: 50 },
      { id: '00000000-0000-0000-0000-000000000018', title: 'Exact 100', description: 'Score 100 exact predictions.', requiredValue: 100 },
    ];

    try {
      for (const ach of defaultAchievements) {
        await this.prisma.achievement.upsert({
          where: { id: ach.id },
          update: {
            title: ach.title,
            description: ach.description,
            requiredValue: ach.requiredValue,
          },
          create: {
            id: ach.id,
            title: ach.title,
            description: ach.description,
            requiredValue: ach.requiredValue,
          },
        });
      }
      this.logger.log('Default achievements seeded successfully.');
    } catch (err) {
      this.logger.error('Error seeding achievements:', err);
    }
  }

  async checkAndUnlockAchievements(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userAchievements: true }
    });
    if (!user) return;

    const unlockedIds = new Set(user.userAchievements.map(a => a.achievementId));

    const unlock = async (achievementId: string) => {
      if (unlockedIds.has(achievementId)) return;
      try {
        await this.prisma.userAchievement.create({
          data: {
            userId,
            achievementId
          }
        });
        const achievement = await this.prisma.achievement.findUnique({ where: { id: achievementId } });
        if (achievement) {
          await this.prisma.notification.create({
            data: {
              userId,
              title: `🏆 ¡Logro desbloqueado: ${achievement.title}!`,
              message: `Has obtenido el logro: "${achievement.title}". ${achievement.description}`,
              notificationType: 'ACHIEVEMENT_UNLOCKED',
            }
          });
          this.logger.log(`User ${userId} unlocked achievement: ${achievement.title}`);
        }
      } catch (err) {
        this.logger.error(`Failed to unlock achievement ${achievementId} for user ${userId}`, err);
      }
    };

    const totalPreds = user.totalPredictions;
    const correctPreds = user.correctPredictions;
    const accuracy = user.accuracyRate.toNumber();
    const maxStreak = user.maxStreak;

    // Predictions count
    if (totalPreds >= 1) await unlock('00000000-0000-0000-0000-000000000001'); // FIRST_PREDICTION
    if (totalPreds >= 10) await unlock('00000000-0000-0000-0000-000000000008'); // PREDICTIONS_10
    if (totalPreds >= 50) await unlock('00000000-0000-0000-0000-000000000009'); // PREDICTIONS_50
    if (totalPreds >= 100) await unlock('00000000-0000-0000-0000-000000000010'); // PREDICTIONS_100
    if (totalPreds >= 250) await unlock('00000000-0000-0000-0000-000000000011'); // PREDICTIONS_250

    // Correct predictions count
    if (correctPreds >= 1) await unlock('00000000-0000-0000-0000-000000000002'); // FIRST_CORRECT

    // Exact score count
    const exactCount = await this.prisma.prediction.count({
      where: { userId, isExactScore: true }
    });

    if (exactCount >= 1) await unlock('00000000-0000-0000-0000-000000000003'); // FIRST_EXACT
    if (exactCount >= 10) await unlock('00000000-0000-0000-0000-000000000015'); // EXACT_10
    if (exactCount >= 25) await unlock('00000000-0000-0000-0000-000000000016'); // EXACT_25
    if (exactCount >= 50) await unlock('00000000-0000-0000-0000-000000000017'); // EXACT_50
    if (exactCount >= 100) await unlock('00000000-0000-0000-0000-000000000018'); // EXACT_100

    // Streaks
    if (maxStreak >= 3) await unlock('00000000-0000-0000-0000-000000000004'); // STREAK_3
    if (maxStreak >= 5) await unlock('00000000-0000-0000-0000-000000000005'); // STREAK_5
    if (maxStreak >= 10) await unlock('00000000-0000-0000-0000-000000000006'); // STREAK_10
    if (maxStreak >= 20) await unlock('00000000-0000-0000-0000-000000000007'); // STREAK_20

    // Accuracy
    if (totalPreds >= 5) {
      if (accuracy >= 60) await unlock('00000000-0000-0000-0000-000000000012'); // ACCURACY_60
      if (accuracy >= 70) await unlock('00000000-0000-0000-0000-000000000013'); // ACCURACY_70
      if (accuracy >= 80) await unlock('00000000-0000-0000-0000-000000000014'); // ACCURACY_80
    }
  }

  async getMyAchievements(userId: string) {
    return this.prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true }
    });
  }
}
