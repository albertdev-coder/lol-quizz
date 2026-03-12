import { NextRequest } from 'next/server';
import { createSuccessResponse, handleDatabaseError, withErrorHandler } from '@/lib/api/response';
import { logger } from '@/lib/api/logger';
import { getDB } from '@/lib/db-singleton';
import { metadata } from '@/db/schema';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();
    
    logger.apiRequest('GET', '/api/metadata');
    
    try {
      const db = getDB();
      
      const rows = await db.select().from(metadata);

      const metadataObj: Record<string, unknown> = {};

      rows.forEach((row) => {
        try {
          if (row.type === 'json') {
            metadataObj[row.key] = JSON.parse(row.value);
          } else if (row.type === 'number') {
            metadataObj[row.key] = Number(row.value);
          } else if (row.type === 'boolean') {
            metadataObj[row.key] = row.value === 'true';
          } else {
            metadataObj[row.key] = row.value;
          }
        } catch {
          metadataObj[row.key] = row.value;
        }
      });

      const duration = Date.now() - startTime;
      logger.apiResponse('GET', '/api/metadata', 200, duration);

      return createSuccessResponse(metadataObj);
    } catch (error: unknown) {
      logger.databaseError('Get metadata', error);
      return handleDatabaseError(error);
    }
  });
}
