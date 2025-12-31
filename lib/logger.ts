/**
 * Structured logging system for Native Resource Hub
 * Provides consistent logging across the application with
 * JSON output for production and human-readable output for development.
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
  operation?: string
  duration?: number
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

/**
 * Log level priority for filtering
 */
const LOG_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
}

class Logger {
  private serviceName: string = 'native-resource-hub'
  private environment: string = process.env.NODE_ENV || 'development'
  private minLevel: LogLevel = this.environment === 'production' ? LogLevel.INFO : LogLevel.DEBUG

  private shouldLog(level: LogLevel): boolean {
    return LOG_PRIORITY[level] >= LOG_PRIORITY[this.minLevel]
  }

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
        stack: this.environment === 'development' ? error.stack : undefined,
      }
    }

    return entry
  }

  private formatForConsole(entry: LogEntry): string {
    if (this.environment === 'production') {
      // JSON format for production (easier to parse in log aggregators)
      return JSON.stringify({
        level: entry.level,
        msg: entry.message,
        time: entry.timestamp,
        service: this.serviceName,
        ...entry.context,
        ...(entry.error ? { error: entry.error } : {}),
      })
    }

    // Human-readable format for development
    const levelColors: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: '\x1b[36m', // cyan
      [LogLevel.INFO]: '\x1b[32m',  // green
      [LogLevel.WARN]: '\x1b[33m',  // yellow
      [LogLevel.ERROR]: '\x1b[31m', // red
    }
    const reset = '\x1b[0m'
    const color = levelColors[entry.level]

    let output = `${color}[${entry.level.toUpperCase()}]${reset} ${entry.message}`

    if (entry.context && Object.keys(entry.context).length > 0) {
      output += ` ${JSON.stringify(entry.context)}`
    }

    if (entry.error) {
      output += `\n${color}Error:${reset} ${entry.error.message}`
      if (entry.error.stack) {
        output += `\n${entry.error.stack}`
      }
    }

    return output
  }

  private async log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    if (!this.shouldLog(level)) {
      return
    }

    const entry = this.formatLog(level, message, context, error)

    // In production, send to external logging service (Axiom)
    if (this.environment === 'production') {
      // Fire and forget - don't await to avoid blocking
      this.sendToLoggingService(entry).catch(() => {
        // Silently ignore failures
      })
    }

    // Console output
    const logString = this.formatForConsole(entry)

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
      // In development, log the error
      if (this.environment === 'development') {
        console.error('Failed to send log to Axiom:', error)
      }
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

  error(message: string, errorOrContext?: Error | LogContext, context?: LogContext) {
    // Handle overloaded signature: error(msg, error, context) or error(msg, context)
    if (errorOrContext instanceof Error) {
      this.log(LogLevel.ERROR, message, context, errorOrContext)
    } else {
      this.log(LogLevel.ERROR, message, errorOrContext)
    }
  }

  /**
   * Create a child logger with default context
   */
  child(defaultContext: LogContext) {
    const parent = this
    return {
      debug: (message: string, context?: LogContext) =>
        parent.debug(message, { ...defaultContext, ...context }),
      info: (message: string, context?: LogContext) =>
        parent.info(message, { ...defaultContext, ...context }),
      warn: (message: string, context?: LogContext) =>
        parent.warn(message, { ...defaultContext, ...context }),
      error: (message: string, errorOrContext?: Error | LogContext, context?: LogContext) =>
        parent.error(message, errorOrContext, { ...defaultContext, ...context }),
    }
  }

  /**
   * Time an async operation
   */
  async time<T>(label: string, fn: () => Promise<T>, context?: LogContext): Promise<T> {
    const start = Date.now()
    try {
      const result = await fn()
      const duration = Date.now() - start
      this.debug(`${label} completed`, { ...context, duration })
      return result
    } catch (error) {
      const duration = Date.now() - start
      this.error(`${label} failed`, error instanceof Error ? error : undefined, {
        ...context,
        duration,
      })
      throw error
    }
  }

  // Convenience methods for common scenarios
  apiRequest(method: string, path: string, context?: LogContext) {
    this.info(`API Request: ${method} ${path}`, {
      ...context,
      action: 'api_request',
    })
  }

  apiResponse(method: string, path: string, statusCode: number, duration: number, context?: LogContext) {
    const level = statusCode >= 500 ? LogLevel.ERROR : statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO
    this.log(level, `API Response: ${method} ${path} - ${statusCode}`, {
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
    const level = severity === 'critical' || severity === 'high' ? LogLevel.ERROR : LogLevel.WARN
    this.log(level, `Security Event: ${event}`, {
      ...context,
      action: 'security_event',
      severity,
    })
  }

  /**
   * Log an admin operation
   */
  adminOperation(operation: string, userId: string, context?: LogContext) {
    this.info(`Admin: ${operation}`, {
      ...context,
      userId,
      action: 'admin_operation',
      operation,
    })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export type for child loggers
export type ChildLogger = ReturnType<Logger['child']>

// Export helper for request tracking
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
