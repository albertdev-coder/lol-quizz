import { NextRequest } from 'next/server';
import {
  createSuccessResponse,
  handleDatabaseError,
  withErrorHandler
} from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { getDB } from '@/lib/db-singleton';

/**
 * Validate Questions Integrity
 * GET /api/questions/validate
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();
    
    logger.apiRequest('GET', '/api/questions/validate');

    try {
      const db = getDB();
      
      const questions = db.prepare('SELECT * FROM questions').all() as any[];

      // Parse choices safely
      const parsedQuestions = questions.map((q) => {
        try {
          return {
            ...q,
            choices: typeof q.choices === 'string' ? JSON.parse(q.choices) : q.choices
          };
        } catch {
          return {
            ...q,
            choices: []
          };
        }
      });

      // Load metadata from SQLite
      const metadataRows = db.prepare('SELECT key, value, type FROM metadata').all() as any[];
      const metadata: any = {};

      metadataRows.forEach((row) => {
        try {
          if (row.type === 'json') {
            metadata[row.key] = JSON.parse(row.value);
          } else if (row.type === 'number') {
            metadata[row.key] = Number(row.value);
          } else {
            metadata[row.key] = row.value;
          }
        } catch {
          metadata[row.key] = row.value;
        }
      });

      // Validate unique IDs
      const ids = parsedQuestions.map((q) => q.id);
      const uniqueIds = new Set(ids);
      const hasDuplicates = ids.length !== uniqueIds.size;
      const duplicates = hasDuplicates 
        ? ids.filter((id, idx) => ids.indexOf(id) !== idx)
        : [];

      // Validate level distribution
      const levelCounts: Record<string, number> = { niño: 0, joven: 0, adulto: 0 };
      parsedQuestions.forEach((q) => {
        if (q.level !== 'mixto' && levelCounts.hasOwnProperty(q.level)) {
          levelCounts[q.level] = (levelCounts[q.level] || 0) + 1;
        }
      });

      // Validate structure
      const invalidQuestions: Array<{ id: string; issues: string[] }> = [];

      parsedQuestions.forEach((q) => {
        const issues: string[] = [];

        if (!q.id) issues.push('Missing id');
        if (!q.level) issues.push('Missing level');
        if (!q.text) issues.push('Missing text');

        if (!Array.isArray(q.choices) || q.choices.length !== 4) {
          issues.push('Invalid choices array (must have 4 options)');
        }

        if (
          typeof q.correctIndex !== 'number' ||
          q.correctIndex < 0 ||
          q.correctIndex > 3
        ) {
          issues.push('Invalid correctIndex (must be 0-3)');
        }

        if (!q.explanation) issues.push('Missing explanation');

        if (issues.length > 0) {
          invalidQuestions.push({ id: q.id || 'unknown', issues });
        }
      });

      // Validate metadata
      const metadataValid =
        metadata.totalQuestions === parsedQuestions.length &&
        metadata.levels?.niño === levelCounts.niño &&
        metadata.levels?.joven === levelCounts.joven &&
        metadata.levels?.adulto === levelCounts.adulto;

      const allValid = !hasDuplicates && invalidQuestions.length === 0 && metadataValid;

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/questions/validate', 200, duration);

      const validationResult = {
        valid: allValid,
        summary: {
          totalQuestions: parsedQuestions.length,
          expectedQuestions: metadata.totalQuestions,
          uniqueIds: uniqueIds.size,
          hasDuplicates,
          ...(duplicates.length > 0 && { duplicates })
        },
        levelDistribution: levelCounts,
        expectedDistribution: metadata.levels || {},
        metadataValid,
        ...(invalidQuestions.length > 0 && { invalidQuestions }),
        checks: {
          uniqueIds: !hasDuplicates,
          correctCount: parsedQuestions.length === metadata.totalQuestions,
          validStructure: invalidQuestions.length === 0,
          metadataMatch: metadataValid
        }
      };

      return createSuccessResponse(validationResult);
    } catch (error: any) {
      logger.databaseError('Validate questions', error);
      return handleDatabaseError(error);
    }
  });
}
