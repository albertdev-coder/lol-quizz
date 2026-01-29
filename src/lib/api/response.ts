import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standardized API Response Builder
 * Ensures all API responses follow the same format
 */

export interface ApiSuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
  timestamp: string;
  [key: string]: any;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  errorCode?: string;
  details?: any;
  timestamp: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Create success response
 */
export function createSuccessResponse<T = any>(
  data?: T,
  extras?: Record<string, any>
): NextResponse<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    timestamp: new Date().toISOString(),
    ...extras
  };
  
  if (data !== undefined) {
    response.data = data;
  }
  
  return NextResponse.json(response, { status: 200 });
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: string,
  statusCode: number = 500,
  extras?: {
    errorCode?: string;
    details?: any;
  }
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
    ...extras
  };
  
  return NextResponse.json(response, { status: statusCode });
}

/**
 * Error codes enum
 */
export const ErrorCodes = {
  // Client errors (400-499)
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Server errors (500-599)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: ZodError): NextResponse<ApiErrorResponse> {
  const firstError = error.errors[0];
  const field = firstError.path.join('.');
  const message = firstError.message;
  
  return createErrorResponse(
    `Validation error: ${field ? `${field} - ` : ''}${message}`,
    400,
    {
      errorCode: ErrorCodes.VALIDATION_ERROR,
      details: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    }
  );
}

/**
 * Handle database errors
 */
export function handleDatabaseError(error: any): NextResponse<ApiErrorResponse> {
  console.error('Database error:', error);
  
  // Don't expose internal database errors to client
  return createErrorResponse(
    'Database operation failed',
    500,
    {
      errorCode: ErrorCodes.DATABASE_ERROR,
      // Only include error message in development
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }
  );
}

/**
 * Handle generic errors
 */
export function handleGenericError(error: any): NextResponse<ApiErrorResponse> {
  console.error('Unhandled error:', error);
  
  // Check if it's a known error type
  if (error instanceof ZodError) {
    return handleZodError(error);
  }
  
  // Check for database errors (better-sqlite3)
  if (error?.code?.startsWith('SQLITE_')) {
    return handleDatabaseError(error);
  }
  
  // Generic error
  return createErrorResponse(
    'An unexpected error occurred',
    500,
    {
      errorCode: ErrorCodes.UNKNOWN_ERROR,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }
  );
}

/**
 * Create rate limit error response
 */
export function createRateLimitError(
  resetTime: number
): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    'Too many requests. Please try again later.',
    429,
    {
      errorCode: ErrorCodes.RATE_LIMIT_EXCEEDED,
      details: {
        resetAt: new Date(resetTime).toISOString()
      }
    }
  );
}

/**
 * Create not found error response
 */
export function createNotFoundError(
  resource: string
): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    `${resource} not found`,
    404,
    {
      errorCode: ErrorCodes.NOT_FOUND
    }
  );
}

/**
 * Create validation error response
 */
export function createValidationError(
  message: string,
  details?: any
): NextResponse<ApiErrorResponse> {
  return createErrorResponse(
    message,
    400,
    {
      errorCode: ErrorCodes.VALIDATION_ERROR,
      details
    }
  );
}

/**
 * Wrap API handler with error handling
 */
export function withErrorHandler<T = any>(
  handler: () => Promise<NextResponse<T>>
): Promise<NextResponse<T | ApiErrorResponse>> {
  return handler().catch((error) => {
    return handleGenericError(error);
  });
}
