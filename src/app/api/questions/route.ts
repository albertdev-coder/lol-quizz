import { NextRequest } from 'next/server';
import { 
  createSuccessResponse, 
  handleDatabaseError, 
  handleZodError,
  withErrorHandler 
} from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { GetQuestionsQuerySchema } from '@/lib/validation/schemas';
import { sanitizeSQLInput } from '@/lib/security/sanitize';
import { getDB } from '@/lib/db-singleton';

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
      count: searchParams.get('count')
    });
    
    // Validate query parameters
    const validationResult = GetQuestionsQuerySchema.safeParse({
      level: searchParams.get('level'),
      count: searchParams.get('count')
    });
    
    if (!validationResult.success) {
      logger.validationError('/api/questions', validationResult.error);
      return handleZodError(validationResult.error);
    }
    
    const { level, count } = validationResult.data;
    
    try {
      const db = getDB();
      
      let query = 'SELECT * FROM questions';
      const params: any[] = [];

      if (level && level !== 'mixto') {
        // Sanitize level input (even though Zod validated it)
        const sanitizedLevel = sanitizeSQLInput(level);
        query += ' WHERE level = ?';
        params.push(sanitizedLevel);
      }

      const rows = db.prepare(query).all(...params) as any[];

      // Parse JSON fields safely
      const questions = rows.map((q) => {
        try {
          return {
            ...q,
            choices: typeof q.choices === 'string' ? JSON.parse(q.choices) : q.choices
          };
        } catch (parseError) {
          logger.warn(`Failed to parse choices for question ${q.id}`, { error: parseError });
          // Return with empty choices array as fallback
          return {
            ...q,
            choices: []
          };
        }
      });

      // Shuffle questions using Fisher-Yates algorithm
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }

      // Limit results
      const selected = questions.slice(0, Math.min(count, questions.length));

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/questions', 200, duration);

      return createSuccessResponse(selected, {
        total: selected.length,
        requested: count,
        level: level || 'all'
      });
    } catch (error: any) {
      logger.databaseError('Get questions', error);
      return handleDatabaseError(error);
    }
  });
}
