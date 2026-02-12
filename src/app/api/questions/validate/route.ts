import { NextRequest } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { createSuccessResponse, handleDatabaseError, withErrorHandler } from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { db } from '@/lib/db/client';
import { categories, metadata, questions } from '@/lib/db/schema';
import { toAppLevel } from '@/constants/quiz-levels';

export async function GET(_request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();
    logger.apiRequest('GET', '/api/questions/validate');

    try {
      const categoryRows = await db.select({ id: categories.id, slug: categories.slug }).from(categories);

      const distribution: Record<string, Record<string, number>> = {};

      for (const category of categoryRows) {
        const levelRows = await db
          .select({ level: questions.level, count: sql<number>`count(*)::int` })
          .from(questions)
          .where(eq(questions.categoryId, category.id))
          .groupBy(questions.level);

        distribution[category.slug] = levelRows.reduce<Record<string, number>>((acc, row) => {
          acc[toAppLevel(row.level)] = row.count;
          return acc;
        }, {});
      }

      const metadataRows = await db.select().from(metadata);
      const meta = metadataRows.reduce<Record<string, unknown>>((acc, row) => {
        if (row.type === 'json') acc[row.key] = JSON.parse(row.value);
        else if (row.type === 'number') acc[row.key] = Number(row.value);
        else acc[row.key] = row.value;
        return acc;
      }, {});

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/questions/validate', 200, duration);

      return createSuccessResponse({
        valid: true,
        distribution,
        metadata: meta,
      });
    } catch (error: any) {
      logger.databaseError('Validate questions', error);
      return handleDatabaseError(error);
    }
  });
}
