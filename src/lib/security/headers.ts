import { NextResponse } from 'next/server';

/**
 * Security Headers Configuration
 * Implements OWASP recommendations
 */

export function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Enable XSS protection (legacy browsers)
    'X-XSS-Protection': '1; mode=block',

    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Remove powered by header
    'X-Powered-By': '',

    // Permissions policy (restrict features)
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  };
}

/**
 * CORS headers for API routes
 */
export function getCORSHeaders(origin?: string): Record<string, string> {
  // In production, you should validate the origin against a whitelist
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];

  const isAllowed = allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin));

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin || '*' : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  const headers = getSecurityHeaders();

  for (const [key, value] of Object.entries(headers)) {
    if (value) {
      response.headers.set(key, value);
    }
  }

  return response;
}

/**
 * Apply CORS headers to response
 */
export function applyCORSHeaders(response: NextResponse, origin?: string): NextResponse {
  const headers = getCORSHeaders(origin);

  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }

  return response;
}

/**
 * Create OPTIONS response for CORS preflight
 */
export function createCORSPreflightResponse(origin?: string): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  return applyCORSHeaders(response, origin);
}
