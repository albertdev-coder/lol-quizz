import { NextRequest } from 'next/server';
import {
  createSuccessResponse,
  createValidationError,
  handleDatabaseError,
  handleZodError,
  withErrorHandler,
} from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { SaveResultBodySchema, GetResultsQuerySchema } from '@/lib/validation/schemas';
import { sanitizeObject } from '@/lib/security/sanitize';
import { saveResult, getResults } from '@/lib/db';

/**
 * Save Quiz Result
 * POST /api/results
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();

    logger.apiRequest('POST', '/api/results');

    let body: any;

    try {
      body = await request.json();
    } catch (error) {
      logger.validationError('/api/results POST', { message: 'Invalid JSON body' });
      return createValidationError('Invalid JSON body');
    }

    const sanitizedBody = sanitizeObject(body);

    const validationResult = SaveResultBodySchema.safeParse(sanitizedBody);

    if (!validationResult.success) {
      logger.validationError('/api/results POST', validationResult.error);
      return handleZodError(validationResult.error);
    }

    const validatedData = validationResult.data;

    try {
      const result = {
        id: `result-${Date.now()}`,
        level: validatedData.level,
        score: validatedData.score,
        totalQuestions: validatedData.totalQuestions,
        correctAnswers: validatedData.correctAnswers,
        incorrectAnswers: validatedData.incorrectAnswers,
        timeSpent: validatedData.timeSpent,
        date: new Date().toISOString(),
        answers: validatedData.answers,
      };

      await saveResult(result);

      const duration = Date.now() - startTime;
      logger.apiResponse('POST', '/api/results', 200, duration);

      return createSuccessResponse(
        {
          id: result.id,
          timestamp: result.date,
          score: result.score,
          level: result.level,
        },
        { message: 'Result saved successfully' }
      );
    } catch (error: any) {
      logger.databaseError('Save result', error);
      return handleDatabaseError(error);
    }
  });
}

/**
 * Get Quiz Results
 * GET /api/results?level={level}&limit={limit}&sortBy={sortBy}
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();
    const { searchParams } = new URL(request.url);

    logger.apiRequest('GET', '/api/results', {
      level: searchParams.get('level'),
      limit: searchParams.get('limit'),
      sortBy: searchParams.get('sortBy'),
    });

    const validationResult = GetResultsQuerySchema.safeParse({
      level: searchParams.get('level'),
      limit: searchParams.get('limit'),
      sortBy: searchParams.get('sortBy'),
    });

    if (!validationResult.success) {
      logger.validationError('/api/results GET', validationResult.error);
      return handleZodError(validationResult.error);
    }

    const { level, limit, sortBy } = validationResult.data;

    try {
      const results = await getResults(level, limit, sortBy);

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/results', 200, duration);

      return createSuccessResponse(results, {
        total: results.length,
        showing: results.length,
        filters: {
          level: level || 'all',
          limit,
          sortBy,
        },
      });
    } catch (error: any) {
      logger.databaseError('Get results', error);
      return handleDatabaseError(error);
    }
  });
}
