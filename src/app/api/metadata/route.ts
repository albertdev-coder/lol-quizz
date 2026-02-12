import { NextRequest } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { createSuccessResponse, handleDatabaseError, withErrorHandler } from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { db } from '@/lib/db/client';
import { categories, metadata, questions } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();

    logger.apiRequest('GET', '/api/metadata');

    try {
      const rows = await db.select().from(metadata);
      const metadataResponse: Record<string, any> = {};

      rows.forEach((row) => {
        if (row.type === 'json') {
          metadataResponse[row.key] = JSON.parse(row.value);
          return;
        }

        if (row.type === 'number') {
          metadataResponse[row.key] = Number(row.value);
          return;
        }

        if (row.type === 'boolean') {
          metadataResponse[row.key] = row.value === 'true';
          return;
        }

        metadataResponse[row.key] = row.value;
      });

      if (!metadataResponse.totalQuestions) {
        const [questionCount] = await db.select({ count: sql<number>`count(*)::int` }).from(questions);
        const [scienceCategory] = await db
          .select({ id: categories.id })
          .from(categories)
          .where(eq(categories.slug, 'ciencia'))
          .limit(1);

        const levelRows = scienceCategory
          ? await db
              .select({ level: questions.level, count: sql<number>`count(*)::int` })
              .from(questions)
              .where(eq(questions.categoryId, scienceCategory.id))
              .groupBy(questions.level)
          : [];

        metadataResponse.totalQuestions = questionCount?.count ?? 0;
        metadataResponse.levels = levelRows.reduce(
          (acc, row) => ({ ...acc, [row.level]: row.count }),
          {} as Record<string, number>
        );
      }

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/metadata', 200, duration);

      return createSuccessResponse(metadataResponse);
    } catch (error: any) {
      logger.databaseError('Get metadata', error);
      return handleDatabaseError(error);
    }
  });
}
