import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateMatchInsight(matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { homeTeam: true, awayTeam: true }
    });

    if (!match) return null;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      this.logger.error('GROQ_API_KEY is missing');
      return null;
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: 'You are a sports analyst. Keep it under 2 sentences.' },
            { role: 'user', content: `Give a brief pre-match analysis for ${match.homeTeam.name} vs ${match.awayTeam.name}.` }
          ]
        })
      });

      const data = await response.json();
      const insight = data.choices[0]?.message?.content || 'No insight available.';

      return { insight };
    } catch (e) {
      this.logger.error('Groq API error:', e);
      return null;
    }
  }
}
