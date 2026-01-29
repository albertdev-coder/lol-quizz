/**
 * Input Sanitization Utilities
 * Prevents XSS, SQL Injection, and other malicious inputs
 */

/**
 * Remove potentially dangerous characters from strings
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/\0/g, '') // Remove null bytes
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .slice(0, 1000); // Limit length
}

/**
 * Sanitize SQL-like inputs (for SQLite queries)
 */
export function sanitizeSQLInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/;\s*(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE|EXEC|EXECUTE)\s/gi, '')
    .replace(/\0/g, '')
    .slice(0, 500);
}

/**
 * Sanitize numeric inputs
 */
export function sanitizeNumber(input: any): number | null {
  const num = Number(input);

  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  return num;
}

/**
 * Sanitize integer inputs with bounds
 */
export function sanitizeInteger(
  input: any,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
): number | null {
  const num = sanitizeNumber(input);

  if (num === null) {
    return null;
  }

  const int = Math.floor(num);

  if (int < min || int > max) {
    return null;
  }

  return int;
}

/**
 * Sanitize level enum
 */
export function sanitizeLevel(input: string): 'niño' | 'joven' | 'adulto' | 'mixto' | null {
  const normalized = sanitizeString(input).toLowerCase();

  if (['niño', 'joven', 'adulto', 'mixto'].includes(normalized)) {
    return normalized as 'niño' | 'joven' | 'adulto' | 'mixto';
  }

  return null;
}

/**
 * Sanitize question ID
 */
export function sanitizeQuestionId(input: string): string | null {
  const sanitized = sanitizeString(input);

  if (!/^q-\d{3}$/.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Sanitize result ID
 */
export function sanitizeResultId(input: string): string | null {
  const sanitized = sanitizeString(input);

  if (!/^result-\d+$/.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Sanitize object by recursively sanitizing all string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeString(value) as any;
    } else if (typeof value === 'number') {
      sanitized[key as keyof T] = value as any;
    } else if (typeof value === 'boolean') {
      sanitized[key as keyof T] = value as any;
    } else if (Array.isArray(value)) {
      sanitized[key as keyof T] = value.map(item =>
        typeof item === 'string' ? sanitizeString(item) : item
      ) as any;
    } else if (value && typeof value === 'object') {
      sanitized[key as keyof T] = sanitizeObject(value) as any;
    } else {
      sanitized[key as keyof T] = value as any;
    }
  }

  return sanitized;
}

/**
 * Validate and sanitize URL
 */
export function sanitizeURL(input: string): string | null {
  try {
    const sanitized = sanitizeString(input);
    const url = new URL(sanitized);

    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize email (basic validation)
 */
export function sanitizeEmail(input: string): string | null {
  const sanitized = sanitizeString(input).toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized) || sanitized.length > 254) {
    return null;
  }

  return sanitized;
}
