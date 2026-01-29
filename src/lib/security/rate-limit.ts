import { NextRequest } from 'next/server';

/**
 * In-Memory Rate Limiter
 * Tracks requests per IP address using a sliding window algorithm
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   * @default 100
   */
  maxRequests?: number;
  
  /**
   * Time window in milliseconds
   * @default 60000 (1 minute)
   */
  windowMs?: number;
  
  /**
   * Custom identifier function (defaults to IP)
   */
  identifier?: (request: NextRequest) => string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  // Check common headers for real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  if (cfIP) {
    return cfIP.trim();
  }
  
  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Rate limiter middleware
 * Returns true if request is allowed, false if rate limited
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = {}
): RateLimitResult {
  const maxRequests = config.maxRequests ?? 100;
  const windowMs = config.windowMs ?? 60000; // 1 minute
  const identifier = config.identifier?.(request) ?? getClientIP(request);
  
  const now = Date.now();
  const resetTime = now + windowMs;
  
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    // No entry or expired entry - create new
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime
    });
    
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetTime
    };
  }
  
  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }
  
  // Increment counter
  entry.count += 1;
  
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime
  };
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
  };
}

/**
 * Different rate limit configs for different endpoints
 */
export const RATE_LIMITS = {
  // Strict limit for write operations
  WRITE: {
    maxRequests: 20,
    windowMs: 60000 // 20 requests per minute
  },
  
  // Normal limit for read operations
  READ: {
    maxRequests: 100,
    windowMs: 60000 // 100 requests per minute
  },
  
  // Relaxed limit for health checks
  HEALTH: {
    maxRequests: 200,
    windowMs: 60000 // 200 requests per minute
  }
} as const;
