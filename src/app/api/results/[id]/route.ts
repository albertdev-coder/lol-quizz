import { NextRequest } from 'next/server';
import {
  createSuccessResponse,
  createNotFoundError,
  handleDatabaseError,
  handleZodError,
  withErrorHandler
} from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { ResultIdSchema } from '@/lib/validation/schemas';
import { sanitizeResultId } from '@/lib/security/sanitize';
import { getResultById } from '@/lib/db';

/**
 * Get Result by ID
 * GET /api/results/[id]
 */
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
      const result = await getResultById(sanitizedId);

      if (!result) {
        const duration = Date.now() - startTime;
        logger.apiResponse('GET', `/api/results/${id}`, 404, duration);
        return createNotFoundError('Result');
      }

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', `/api/results/${id}`, 200, duration);

      return createSuccessResponse(result);
    } catch (error: any) {
      logger.databaseError(`Get result ${id}`, error);
      return handleDatabaseError(error);
    }
  });
}
