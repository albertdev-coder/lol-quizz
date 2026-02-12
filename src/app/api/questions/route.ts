import { NextRequest } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';
import {
  createSuccessResponse,
  handleDatabaseError,
  handleZodError,
  withErrorHandler,
} from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { GetQuestionsQuerySchema } from '@/lib/validation/schemas';
import { sanitizeSQLInput } from '@/lib/security/sanitize';
import { db } from '@/lib/db/client';
import { categories, questions } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();
    const { searchParams } = new URL(request.url);

    logger.apiRequest('GET', '/api/questions', {
      level: searchParams.get('level'),
      category: searchParams.get('category'),
      count: searchParams.get('count'),
    });

    const validationResult = GetQuestionsQuerySchema.safeParse({
      level: searchParams.get('level'),
      category: searchParams.get('category') ?? undefined,
      count: searchParams.get('count'),
    });

    if (!validationResult.success) {
      logger.validationError('/api/questions', validationResult.error);
      return handleZodError(validationResult.error);
    }

    const { level, count, category = 'ciencia' } = validationResult.data;

    try {
      const categoryRow = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, category)).limit(1);
      if (categoryRow.length === 0) {
        return createSuccessResponse([], { total: 0, requested: count, level: level || 'all', category });
      }

      const whereClause = [eq(questions.categoryId, categoryRow[0].id)];

      if (level) {
        const sanitizedLevel = sanitizeSQLInput(level);
        whereClause.push(eq(questions.level, sanitizedLevel as any));
      }

      const rows = await db
        .select()
        .from(questions)
        .where(and(...whereClause))
        .orderBy(sql`RANDOM()`)
        .limit(Math.min(count, 50));

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/questions', 200, duration);

      return createSuccessResponse(rows, {
        total: rows.length,
        requested: count,
        level: level || 'all',
        category,
      });
    } catch (error: any) {
      logger.databaseError('Get questions', error);
      return handleDatabaseError(error);
    }
  });
}
