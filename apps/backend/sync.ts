import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { MatchesService } from './src/matches/matches.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const matchesService = app.get(MatchesService);
  console.log('Running syncMatches()...');
  const result = await matchesService.syncMatches();
  console.log('Result:', result);
  await app.close();
}
bootstrap();
