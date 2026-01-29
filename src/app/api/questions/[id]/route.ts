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
import { getDB } from '@/lib/db-singleton';

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
    
    // Sanitize ID
    const sanitizedId = sanitizeQuestionId(id);
    
    if (!sanitizedId) {
      logger.validationError(`/api/questions/${id}`, { message: 'Invalid question ID format' });
      return createNotFoundError('Question');
    }
    
    // Validate with Zod
    const validationResult = QuestionIdSchema.safeParse(sanitizedId);
    
    if (!validationResult.success) {
      logger.validationError(`/api/questions/${id}`, validationResult.error);
      return handleZodError(validationResult.error);
    }

    try {
      const db = getDB();
      
      const row = db.prepare('SELECT * FROM questions WHERE id = ?').get(sanitizedId);

      if (!row) {
        const duration = Date.now() - startTime;
        logger.apiResponse('GET', `/api/questions/${id}`, 404, duration);
        return createNotFoundError('Question');
      }

      // Parse choices field safely
      let question: any;
      try {
        question = {
          ...row,
          choices: typeof (row as any).choices === 'string' 
            ? JSON.parse((row as any).choices) 
            : (row as any).choices
        };
      } catch (parseError) {
        logger.warn(`Failed to parse choices for question ${id}`, { error: parseError });
        question = {
          ...row,
          choices: []
        };
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
