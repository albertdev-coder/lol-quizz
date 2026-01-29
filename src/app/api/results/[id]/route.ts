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
import { getDB } from '@/lib/db-singleton';

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
    
    // Sanitize ID
    const sanitizedId = sanitizeResultId(id);
    
    if (!sanitizedId) {
      logger.validationError(`/api/results/${id}`, { message: 'Invalid result ID format' });
      return createNotFoundError('Result');
    }
    
    // Validate with Zod
    const validationResult = ResultIdSchema.safeParse(sanitizedId);
    
    if (!validationResult.success) {
      logger.validationError(`/api/results/${id}`, validationResult.error);
      return handleZodError(validationResult.error);
    }

    try {
      const db = getDB();
      
      const row = db.prepare('SELECT * FROM results WHERE id = ?').get(sanitizedId);

      if (!row) {
        const duration = Date.now() - startTime;
        logger.apiResponse('GET', `/api/results/${id}`, 404, duration);
        return createNotFoundError('Result');
      }

      // Parse answers field safely
      let result: any;
      try {
        result = {
          ...row,
          answers: typeof (row as any).answers === 'string' 
            ? JSON.parse((row as any).answers) 
            : (row as any).answers
        };
      } catch (parseError) {
        logger.warn(`Failed to parse answers for result ${id}`, { error: parseError });
        result = {
          ...row,
          answers: []
        };
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
