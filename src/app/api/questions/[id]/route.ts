import { NextRequest } from 'next/server';
import {
  createSuccessResponse,
  createNotFoundError,
  handleDatabaseError,
  handleZodError,
  withErrorHandler
} from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { QuestionIdSchema } from '@/lib/validation/schemas';
import { sanitizeQuestionId } from '@/lib/security/sanitize';
import { getQuestionById } from '@/lib/db';

/**
 * Get Question by ID
 * GET /api/questions/[id]
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    const startTime = Date.now();
    const { id } = await context.params;
    
    logger.apiRequest('GET', `/api/questions/${id}`);
    
    const sanitizedId = sanitizeQuestionId(id);
    
    if (!sanitizedId) {
      logger.validationError(`/api/questions/${id}`, { message: 'Invalid question ID format' });
      return createNotFoundError('Question');
    }
    
    const validationResult = QuestionIdSchema.safeParse(sanitizedId);
    
    if (!validationResult.success) {
      logger.validationError(`/api/questions/${id}`, validationResult.error);
      return handleZodError(validationResult.error);
    }

    try {
      const question = await getQuestionById(sanitizedId);

      if (!question) {
        const duration = Date.now() - startTime;
        logger.apiResponse('GET', `/api/questions/${id}`, 404, duration);
        return createNotFoundError('Question');
      }

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', `/api/questions/${id}`, 200, duration);

      return createSuccessResponse(question);
    } catch (error: any) {
      logger.databaseError(`Get question ${id}`, error);
      return handleDatabaseError(error);
    }
  });
}
