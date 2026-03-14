import { NextRequest } from 'next/server';
import {
  createSuccessResponse,
  handleDatabaseError,
  handleZodError,
  withErrorHandler,
} from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { GetQuestionsQuerySchema } from '@/lib/validation/schemas';
import { getQuestions } from '@/lib/db';

/**
 * Get Questions
 * GET /api/questions?level={level}&count={count}
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();
    const { searchParams } = new URL(request.url);

    logger.apiRequest('GET', '/api/questions', {
      level: searchParams.get('level'),
      count: searchParams.get('count'),
    });

    const validationResult = GetQuestionsQuerySchema.safeParse({
      level: searchParams.get('level'),
      count: searchParams.get('count'),
    });

    if (!validationResult.success) {
      logger.validationError('/api/questions', validationResult.error);
      return handleZodError(validationResult.error);
    }

    const { level, count } = validationResult.data;

    try {
      const questions = await getQuestions(level, count);

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/questions', 200, duration);

      return createSuccessResponse(questions, {
        total: questions.length,
        requested: count,
        level: level || 'all',
      });
    } catch (error: any) {
      logger.databaseError('Get questions', error);
      return handleDatabaseError(error);
    }
  });
}
