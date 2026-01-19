export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: any;
  userId?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  tags?: string[];
}

export interface ErrorLog extends LogEntry {
  error: Error;
  stack?: string;
  component?: string;
  action?: string;
}

export interface SecurityLog extends LogEntry {
  eventType: 'auth_attempt' | 'auth_success' | 'auth_failure' | 'permission_denied' | 'suspicious_activity';
  details: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logLevel = process.env.LOG_LEVEL || 'info';
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private createLogEntry(level: LogEntry['level'], message: string, context?: any, additional?: Partial<LogEntry>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      requestId: this.generateRequestId(),
      ...additional
    };
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private log(entry: LogEntry) {
    if (!this.shouldLog(entry.level)) return;

    // Add to memory logs
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output for development
    if (this.isDevelopment) {
      const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase()}`;
      
      switch (entry.level) {
        case 'error':
          console.error(prefix, entry.message, entry.context || '');
          break;
        case 'warn':
          console.warn(prefix, entry.message, entry.context || '');
          break;
        case 'info':
          console.log(prefix, entry.message, entry.context || '');
          break;
        case 'debug':
          console.debug(prefix, entry.message, entry.context || '');
          break;
      }
    }

    // In production, send to external logging service
    if (!this.isDevelopment) {
      this.sendToExternalService(entry);
    }
  }

  private async sendToExternalService(entry: LogEntry) {
    try {
      // Send to your logging service (Sentry, LogRocket, etc.)
      if (process.env.SENTRY_DSN && entry.level === 'error') {
        // Send to Sentry
        await this.sendToSentry(entry as ErrorLog);
      }

      // Send to custom webhook
      if (process.env.ERROR_WEBHOOK_URL && entry.level === 'error') {
        await this.sendToWebhook(entry);
      }
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  private async sendToSentry(entry: ErrorLog) {
    // Implementation for Sentry logging
    // This would require @sentry/nextjs package
    console.log('Sending to Sentry:', entry);
  }

  private async sendToWebhook(entry: LogEntry) {
    try {
      await fetch(process.env.ERROR_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.error('Failed to send webhook:', error);
    }
  }

  // Public logging methods
  info(message: string, context?: any, additional?: Partial<LogEntry>) {
    const entry = this.createLogEntry('info', message, context, additional);
    this.log(entry);
  }

  warn(message: string, context?: any, additional?: Partial<LogEntry>) {
    const entry = this.createLogEntry('warn', message, context, additional);
    this.log(entry);
  }

  error(message: string, error?: Error, context?: any, additional?: Partial<LogEntry>) {
    const entry: ErrorLog = {
      ...this.createLogEntry('error', message, context, additional),
      error: error || new Error(message),
      stack: error?.stack,
      tags: ['error']
    };
    this.log(entry);
  }

  debug(message: string, context?: any, additional?: Partial<LogEntry>) {
    const entry = this.createLogEntry('debug', message, context, additional);
    this.log(entry);
  }

  // Security-specific logging
  security(eventType: SecurityLog['eventType'], details: any, userId?: string, additional?: Partial<LogEntry>) {
    const entry: SecurityLog = {
      ...this.createLogEntry('warn', `Security Event: ${eventType}`, details, additional),
      eventType,
      details,
      userId,
      tags: ['security']
    };
    this.log(entry);
  }

  // Performance logging
  performance(operation: string, duration: number, context?: any) {
    const entry = this.createLogEntry('info', `Performance: ${operation}`, {
      duration,
      ...context
    }, { tags: ['performance'] });
    this.log(entry);
  }

  // Request logging
  request(method: string, url: string, userId?: string, ip?: string, userAgent?: string) {
    const entry = this.createLogEntry('info', `${method} ${url}`, null, {
      userId,
      ip,
      userAgent,
      tags: ['request']
    });
    this.log(entry);
  }

  // Get recent logs
  getLogs(level?: LogEntry['level'], limit: number = 100): LogEntry[] {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }

    return filteredLogs.slice(-limit);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Get logs by tag
  getLogsByTag(tag: string, limit: number = 100): LogEntry[] {
    const filteredLogs = this.logs.filter(log => 
      log.tags && log.tags.includes(tag)
    );
    return filteredLogs.slice(-limit);
  }
}

// Create singleton instance
export const logger = new Logger();

// Helper functions for common logging patterns
export const logAuth = {
  attempt: (email: string, ip?: string) => {
    logger.security('auth_attempt', { email }, undefined);
  },
  success: (userId: string, email: string) => {
    logger.security('auth_success', { email }, userId);
  },
  failure: (email: string, reason: string, ip?: string) => {
    logger.security('auth_failure', { email, reason }, undefined, { ip });
  }
};

export const logPerformance = {
  apiCall: (endpoint: string, duration: number) => {
    logger.performance(`API: ${endpoint}`, duration, { type: 'api' });
  },
  databaseQuery: (query: string, duration: number) => {
    logger.performance(`DB: ${query}`, duration, { type: 'database' });
  },
  pageLoad: (url: string, duration: number) => {
    logger.performance(`Page: ${url}`, duration, { type: 'page' });
  }
};

export const logSecurity = {
  permissionDenied: (userId: string, resource: string, action: string) => {
    logger.security('permission_denied', { resource, action }, userId);
  },
  suspiciousActivity: (details: any, userId?: string, ip?: string) => {
    logger.security('suspicious_activity', details, userId, { ip });
  }
};

export default logger;