import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly prisma: PrismaService) { }

  async generateMatchInsight(matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { homeTeam: true, awayTeam: true }
    });

    if (!match) return null;

    const summaryType = `INSIGHT_${matchId}`;

    const existingInsight = await this.prisma.aiSummary.findFirst({
      where: { summaryType }
    });

    if (existingInsight) {
      return { insight: existingInsight.content };
    }

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
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Eres un experto analista deportivo. Redacta un análisis previo al partido de forma detallada e interesante (máximo 4 oraciones completas). RESPONDE SIEMPRE EN ESPAÑOL.' },
            { role: 'user', content: `Realiza un análisis táctico y pronóstico breve para el partido entre ${match.homeTeam.name} y ${match.awayTeam.name}.` }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        this.logger.error(`Groq API Error: ${JSON.stringify(data.error || data)}`);
        return { insight: 'No hay análisis disponible por el momento.' };
      }

      const insight = data.choices?.[0]?.message?.content || 'No hay análisis disponible por el momento.';

      if (insight !== 'No hay análisis disponible por el momento.') {
        await this.prisma.aiSummary.create({
          data: {
            summaryType,
            content: insight
          }
        });
      }

      return { insight };
    } catch (e) {
      this.logger.error('Groq API catch error:', e);
      return null;
    }
  }
}
