import { NextRequest } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import {
  createSuccessResponse,
  handleDatabaseError,
  withErrorHandler,
} from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { db } from '@/lib/db/client';
import { categories, metadata, questions } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();

    logger.apiRequest('GET', '/api/questions/validate');

    try {
      const [scienceCategory] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, 'ciencia'))
        .limit(1);

      const parsedQuestions = scienceCategory
        ? await db.select().from(questions).where(eq(questions.categoryId, scienceCategory.id))
        : [];

      const metadataRows = await db.select().from(metadata);
      const meta: Record<string, any> = {};

      metadataRows.forEach((row) => {
        if (row.type === 'json') {
          meta[row.key] = JSON.parse(row.value);
        } else if (row.type === 'number') {
          meta[row.key] = Number(row.value);
        } else {
          meta[row.key] = row.value;
        }
      });

      const ids = parsedQuestions.map((q) => q.id);
      const uniqueIds = new Set(ids);
      const hasDuplicates = ids.length !== uniqueIds.size;
      const duplicates = hasDuplicates
        ? ids.filter((id, idx) => ids.indexOf(id) !== idx)
        : [];

      const levelRows = scienceCategory
        ? await db
            .select({ level: questions.level, count: sql<number>`count(*)::int` })
            .from(questions)
            .where(eq(questions.categoryId, scienceCategory.id))
            .groupBy(questions.level)
        : [];

      const levelCounts: Record<string, number> = { niño: 0, joven: 0, adulto: 0 };
      levelRows.forEach((row) => {
        levelCounts[row.level] = row.count;
      });

      const invalidQuestions: Array<{ id: string; issues: string[] }> = [];

      parsedQuestions.forEach((q) => {
        const issues: string[] = [];

        if (!q.id) issues.push('Missing id');
        if (!q.level) issues.push('Missing level');
        if (!q.text) issues.push('Missing text');
        if (!Array.isArray(q.choices) || q.choices.length !== 4) {
          issues.push('Invalid choices array (must have 4 options)');
        }

        if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
          issues.push('Invalid correctIndex (must be 0-3)');
        }

        if (!q.explanation) issues.push('Missing explanation');

        if (issues.length > 0) {
          invalidQuestions.push({ id: q.id || 'unknown', issues });
        }
      });

      const metadataValid =
        (!meta.totalQuestions || meta.totalQuestions === parsedQuestions.length) &&
        (!meta.levels ||
          (meta.levels?.niño === levelCounts.niño &&
            meta.levels?.joven === levelCounts.joven &&
            meta.levels?.adulto === levelCounts.adulto));

      const allValid = !hasDuplicates && invalidQuestions.length === 0 && metadataValid;

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/questions/validate', 200, duration);

      return createSuccessResponse({
        valid: allValid,
        summary: {
          totalQuestions: parsedQuestions.length,
          expectedQuestions: meta.totalQuestions ?? parsedQuestions.length,
          uniqueIds: uniqueIds.size,
          hasDuplicates,
          ...(duplicates.length > 0 && { duplicates }),
        },
        levelDistribution: levelCounts,
        expectedDistribution: meta.levels || levelCounts,
        metadataValid,
        ...(invalidQuestions.length > 0 && { invalidQuestions }),
        checks: {
          uniqueIds: !hasDuplicates,
          correctCount: parsedQuestions.length === (meta.totalQuestions ?? parsedQuestions.length),
          validStructure: invalidQuestions.length === 0,
          metadataMatch: metadataValid,
        },
      });
    } catch (error: any) {
      logger.databaseError('Validate questions', error);
      return handleDatabaseError(error);
    }
  });
}
