import { NextRequest } from 'next/server';
import {
  createSuccessResponse,
  handleDatabaseError,
  withErrorHandler
} from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { getDB } from '@/lib/db-singleton';
import { questions, metadata } from '@/db/schema';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();
    
    logger.apiRequest('GET', '/api/questions/validate');

    try {
      const db = getDB();
      
      const allQuestions = await db.select().from(questions);

      const metadataRows = await db.select().from(metadata);
      const metadataObj: Record<string, unknown> = {};

      metadataRows.forEach((row) => {
        try {
          if (row.type === 'json') {
            metadataObj[row.key] = JSON.parse(row.value);
          } else if (row.type === 'number') {
            metadataObj[row.key] = Number(row.value);
          } else {
            metadataObj[row.key] = row.value;
          }
        } catch {
          metadataObj[row.key] = row.value;
        }
      });

      const ids = allQuestions.map((q) => q.id);
      const uniqueIds = new Set(ids);
      const hasDuplicates = ids.length !== uniqueIds.size;
      const duplicates = hasDuplicates 
        ? ids.filter((id, idx) => ids.indexOf(id) !== idx)
        : [];

      const levelCounts: Record<string, number> = { niño: 0, joven: 0, adulto: 0 };
      allQuestions.forEach((q) => {
        if (q.level !== 'mixto' && levelCounts.hasOwnProperty(q.level)) {
          levelCounts[q.level] = (levelCounts[q.level] || 0) + 1;
        }
      });

      const allValid = !hasDuplicates && metadataObj.totalQuestions === allQuestions.length;

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/questions/validate', 200, duration);

      const validationResult = {
        valid: allValid,
        summary: {
          totalQuestions: allQuestions.length,
          expectedQuestions: metadataObj.totalQuestions,
          uniqueIds: uniqueIds.size,
          hasDuplicates,
          ...(duplicates.length > 0 && { duplicates })
        },
        levelDistribution: levelCounts,
        expectedDistribution: metadataObj.levels || {},
        checks: {
          uniqueIds: !hasDuplicates,
          correctCount: allQuestions.length === metadataObj.totalQuestions,
        }
      };

      return createSuccessResponse(validationResult);
    } catch (error: unknown) {
      logger.databaseError('Validate questions', error);
      return handleDatabaseError(error);
    }
  });
}
