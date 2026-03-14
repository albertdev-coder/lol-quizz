import { NextRequest } from 'next/server';
import { createSuccessResponse, withErrorHandler } from '@/lib/api/response';
import { logger } from '@/lib/api/logger';

/**
 * Health Check Endpoint
 * GET /api/health
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const startTime = Date.now();

    logger.apiRequest('GET', '/api/health');

    const healthData = {
      ok: true,
      status: 'healthy',
      service: 'quiz-api',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    };

    const duration = Date.now() - startTime;
    logger.apiResponse('GET', '/api/health', 200, duration);

    return createSuccessResponse(healthData);
  });
}
