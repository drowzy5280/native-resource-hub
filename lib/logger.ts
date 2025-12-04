/**
 * Structured logging system for Native Resource Hub
 * Provides consistent logging across the application
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  userId?: string
  requestId?: string
  action?: string
  resourceId?: string
  [key: string]: unknown
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
}

class Logger {
  private serviceName: string = 'native-resource-hub'
  private environment: string = process.env.NODE_ENV || 'development'

  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
    }

    if (context) {
      entry.context = context
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }

    return entry
  }

  private async log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    const entry = this.formatLog(level, message, context, error)

    // In production, send to external logging service (Axiom)
    if (this.environment === 'production') {
      try {
        await this.sendToLoggingService(entry)
      } catch (err) {
        // Fallback to console if logging service fails
        console.error('Failed to send log to external service:', err)
      }
    }

    // Console output for development and as fallback
    const logString = JSON.stringify(entry, null, 2)

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logString)
        break
      case LogLevel.INFO:
        console.info(logString)
        break
      case LogLevel.WARN:
        console.warn(logString)
        break
      case LogLevel.ERROR:
        console.error(logString)
        break
    }
  }

  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    // Check if Axiom is configured
    const axiomDataset = process.env.AXIOM_DATASET
    const axiomToken = process.env.AXIOM_TOKEN

    if (!axiomDataset || !axiomToken) {
      return // Silently skip if not configured
    }

    try {
      const response = await fetch(
        `https://api.axiom.co/v1/datasets/${axiomDataset}/ingest`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${axiomToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{
            ...entry,
            service: this.serviceName,
            environment: this.environment,
          }]),
        }
      )

      if (!response.ok) {
        throw new Error(`Axiom API error: ${response.statusText}`)
      }
    } catch (error) {
      // Don't let logging failures crash the application
      console.error('Failed to send log to Axiom:', error)
    }
  }

  debug(message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.log(LogLevel.ERROR, message, context, error)
  }

  // Convenience methods for common scenarios
  apiRequest(method: string, path: string, context?: LogContext) {
    this.info(`API Request: ${method} ${path}`, {
      ...context,
      action: 'api_request',
    })
  }

  apiResponse(method: string, path: string, statusCode: number, duration: number, context?: LogContext) {
    this.info(`API Response: ${method} ${path} - ${statusCode}`, {
      ...context,
      action: 'api_response',
      statusCode,
      duration,
    })
  }

  databaseQuery(query: string, duration: number, context?: LogContext) {
    this.debug(`Database Query: ${query}`, {
      ...context,
      action: 'database_query',
      duration,
    })
  }

  authEvent(event: string, userId?: string, context?: LogContext) {
    this.info(`Auth Event: ${event}`, {
      ...context,
      userId,
      action: 'auth_event',
    })
  }

  securityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: LogContext) {
    this.warn(`Security Event: ${event}`, {
      ...context,
      action: 'security_event',
      severity,
    })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export helper for request tracking
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
