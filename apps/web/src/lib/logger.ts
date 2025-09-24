export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: any;
  error?: Error;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private formatMessage(level: LogLevel, message: string, context?: any, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } as Error : undefined
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private log(level: LogLevel, message: string, context?: any, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry = this.formatMessage(level, message, context, error);
    
    // Console logging for development
    if (this.isDevelopment) {
      const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
      const levelName = levelNames[level];
      const style = this.getConsoleStyle(level);
      
      console.log(
        `%c[${levelName}] ${logEntry.timestamp}`,
        style,
        message,
        context || '',
        error || ''
      );
    }

    // In production, you would send logs to an external service
    if (!this.isDevelopment) {
      this.sendToExternalService(logEntry);
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'color: #6B7280; font-weight: normal;';
      case LogLevel.INFO:
        return 'color: #3B82F6; font-weight: normal;';
      case LogLevel.WARN:
        return 'color: #F59E0B; font-weight: bold;';
      case LogLevel.ERROR:
        return 'color: #EF4444; font-weight: bold;';
      default:
        return 'color: #000000; font-weight: normal;';
    }
  }

  private sendToExternalService(logEntry: LogEntry): void {
    // In production, integrate with services like:
    // - Sentry for error tracking
    // - LogRocket for session replay
    // - DataDog for monitoring
    // - Custom logging endpoint
    
    // For now, just store in localStorage for demo purposes
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(logEntry);
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to store log:', error);
    }
  }

  debug(message: string, context?: any): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: any): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: any): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: any): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  // API request logging
  logApiRequest(method: string, url: string, status?: number, duration?: number): void {
    const message = `API ${method} ${url}`;
    const context = {
      method,
      url,
      status,
      duration: duration ? `${duration}ms` : undefined
    };
    
    if (status && status >= 400) {
      this.error(message, undefined, context);
    } else {
      this.info(message, context);
    }
  }

  // User action logging
  logUserAction(action: string, userId?: number, context?: any): void {
    this.info(`User action: ${action}`, {
      userId,
      action,
      ...context
    });
  }

  // Performance logging
  logPerformance(operation: string, duration: number, context?: any): void {
    this.info(`Performance: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      ...context
    });
  }

  // Get stored logs (for debugging)
  getStoredLogs(): LogEntry[] {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch (error) {
      return [];
    }
  }

  // Clear stored logs
  clearStoredLogs(): void {
    localStorage.removeItem('app_logs');
  }
}

// Create singleton instance
export const logger = new Logger();

// Convenience functions
export const logDebug = (message: string, context?: any) => logger.debug(message, context);
export const logInfo = (message: string, context?: any) => logger.info(message, context);
export const logWarn = (message: string, context?: any) => logger.warn(message, context);
export const logError = (message: string, error?: Error, context?: any) => logger.error(message, error, context);

// React hook for logging
export function useLogger(componentName: string) {
  return {
    debug: (message: string, context?: any) => logger.debug(`[${componentName}] ${message}`, context),
    info: (message: string, context?: any) => logger.info(`[${componentName}] ${message}`, context),
    warn: (message: string, context?: any) => logger.warn(`[${componentName}] ${message}`, context),
    error: (message: string, error?: Error, context?: any) => logger.error(`[${componentName}] ${message}`, error, context),
    logUserAction: (action: string, userId?: number, context?: any) => logger.logUserAction(action, userId, context),
    logPerformance: (operation: string, duration: number, context?: any) => logger.logPerformance(operation, duration, context)
  };
}
