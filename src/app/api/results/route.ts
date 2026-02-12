import { NextRequest } from 'next/server';
import { desc, eq } from 'drizzle-orm';
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
import { db } from '@/lib/db/client';
import { results } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();

    logger.apiRequest('POST', '/api/results');

    let body: any;

    try {
      body = await request.json();
    } catch {
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
        category: validatedData.category,
        level: validatedData.level,
        score: validatedData.score,
        totalQuestions: validatedData.totalQuestions,
        correctAnswers: validatedData.correctAnswers,
        incorrectAnswers: validatedData.incorrectAnswers,
        timeSpent: validatedData.timeSpent,
        date: new Date(),
        answers: validatedData.answers,
      };

      await db.insert(results).values(result);

      const duration = Date.now() - startTime;
      logger.apiResponse('POST', '/api/results', 200, duration);

      return createSuccessResponse(
        {
          id: result.id,
          timestamp: result.date.toISOString(),
          score: result.score,
          category: result.category,
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
      const query = db.select().from(results);
      const withLevel = level ? query.where(eq(results.level, level)) : query;

      const rows = await withLevel
        .orderBy(sortBy === 'score' ? desc(results.score) : desc(results.date))
        .limit(limit);

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/results', 200, duration);

      return createSuccessResponse(rows, {
        total: rows.length,
        showing: rows.length,
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
