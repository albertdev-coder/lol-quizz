import { NextRequest } from 'next/server';
import Database from 'better-sqlite3';
import { createSuccessResponse, handleDatabaseError, withErrorHandler } from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { getDB } from '@/lib/db-singleton';

/**
 * Get Quiz Metadata
 * GET /api/metadata
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();
    
    logger.apiRequest('GET', '/api/metadata');
    
    try {
      const db = getDB();
      
      const rows = db.prepare(`
        SELECT key, value, type
        FROM metadata
      `).all();

      const metadata: Record<string, any> = {};

      // Reconstruct metadata object
      rows.forEach((row: any) => {
        try {
          if (row.type === 'json') {
            metadata[row.key] = JSON.parse(row.value);
          } else if (row.type === 'number') {
            metadata[row.key] = Number(row.value);
          } else if (row.type === 'boolean') {
            metadata[row.key] = row.value === 'true';
          } else {
            metadata[row.key] = row.value;
          }
        } catch (parseError) {
          logger.warn(`Failed to parse metadata key: ${row.key}`, { error: parseError });
          metadata[row.key] = row.value; // Fallback to raw value
        }
      });

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/metadata', 200, duration);

      return createSuccessResponse(metadata);
    } catch (error: any) {
      logger.databaseError('Get metadata', error);
      return handleDatabaseError(error);
    }
  });
}
