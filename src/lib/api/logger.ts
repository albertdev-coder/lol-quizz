/**
 * Simple Logger Utility
 * Provides structured logging with levels
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

class Logger {
  private minLevel: LogLevel;
  
  constructor() {
    // Set minimum log level based on environment
    this.minLevel = process.env.NODE_ENV === 'production' 
      ? LogLevel.INFO 
      : LogLevel.DEBUG;
  }
  
  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }
  
  private formatLog(level: string, message: string, context?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context })
    };
  }
  
  private log(level: LogLevel, levelName: string, message: string, context?: Record<string, any>) {
    if (!this.shouldLog(level)) {
      return;
    }
    
    const entry = this.formatLog(levelName, message, context);
    
    // In production, you would send this to a logging service
    // For now, we'll use console with structured output
    const logFn = level === LogLevel.ERROR ? console.error : 
                  level === LogLevel.WARN ? console.warn : 
                  console.log;
    
    if (process.env.NODE_ENV === 'production') {
      // JSON format for production (easier to parse)
      logFn(JSON.stringify(entry));
    } else {
      // Human-readable format for development
      logFn(`[${entry.timestamp}] ${entry.level}: ${entry.message}`, context || '');
    }
  }
  
  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, 'DEBUG', message, context);
  }
  
  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, 'INFO', message, context);
  }
  
  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, 'WARN', message, context);
  }
  
  error(message: string, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, 'ERROR', message, context);
  }
  
  /**
   * Log API request
   */
  apiRequest(method: string, path: string, context?: Record<string, any>) {
    this.info(`API ${method} ${path}`, context);
  }
  
  /**
   * Log API response
   */
  apiResponse(method: string, path: string, statusCode: number, duration?: number) {
    this.info(`API ${method} ${path} - ${statusCode}`, { statusCode, duration });
  }
  
  /**
   * Log rate limit hit
   */
  rateLimitHit(ip: string, endpoint: string) {
    this.warn('Rate limit exceeded', { ip, endpoint });
  }
  
  /**
   * Log validation error
   */
  validationError(endpoint: string, errors: any) {
    this.warn('Validation error', { endpoint, errors });
  }
  
  /**
   * Log database error
   */
  databaseError(operation: string, error: any) {
    this.error('Database error', { 
      operation, 
      error: error.message,
      code: error.code 
    });
  }
}

// Export singleton instance
export const logger = new Logger();
