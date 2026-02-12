import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import {
  createSuccessResponse,
  createNotFoundError,
  handleDatabaseError,
  handleZodError,
  withErrorHandler,
} from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { ResultIdSchema } from '@/lib/validation/schemas';
import { sanitizeResultId } from '@/lib/security/sanitize';
import { db } from '@/lib/db/client';
import { results } from '@/lib/db/schema';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    const startTime = Date.now();
    const { id } = await context.params;

    logger.apiRequest('GET', `/api/results/${id}`);

    const sanitizedId = sanitizeResultId(id);

    if (!sanitizedId) {
      logger.validationError(`/api/results/${id}`, { message: 'Invalid result ID format' });
      return createNotFoundError('Result');
    }

    const validationResult = ResultIdSchema.safeParse(sanitizedId);

    if (!validationResult.success) {
      logger.validationError(`/api/results/${id}`, validationResult.error);
      return handleZodError(validationResult.error);
    }

    try {
      const row = await db.select().from(results).where(eq(results.id, sanitizedId)).limit(1);

      if (!row[0]) {
        const duration = Date.now() - startTime;
        logger.apiResponse('GET', `/api/results/${id}`, 404, duration);
        return createNotFoundError('Result');
      }

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', `/api/results/${id}`, 200, duration);

      return createSuccessResponse(row[0]);
    } catch (error: any) {
      logger.databaseError(`Get result ${id}`, error);
      return handleDatabaseError(error);
    }
  });
}
