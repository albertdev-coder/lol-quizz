/**
 * Security Utilities - Barrel Export
 * Centralized exports for all security-related functions
 */

// Rate Limiting
export {
  rateLimit,
  getClientIP,
  createRateLimitHeaders,
  RATE_LIMITS,
  type RateLimitConfig,
  type RateLimitResult,
} from './rate-limit';

// Input Sanitization
export {
  sanitizeString,
  sanitizeSQLInput,
  sanitizeNumber,
  sanitizeInteger,
  sanitizeLevel,
  sanitizeQuestionId,
  sanitizeResultId,
  sanitizeObject,
  sanitizeURL,
  sanitizeEmail,
} from './sanitize';

// Security Headers
export {
  getSecurityHeaders,
  getCORSHeaders,
  applySecurityHeaders,
  applyCORSHeaders,
  createCORSPreflightResponse,
} from './headers';
