/**
 * Structured Logger
 * Provides consistent, structured logging for the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  requestId?: string
  userId?: string
  path?: string
  method?: string
  duration?: number
  statusCode?: number
  [key: string]: unknown
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
}

class StructuredLogger {
  private static instance: StructuredLogger
  private isProduction = process.env.NODE_ENV === 'production'

  private constructor() {}

  static getInstance(): StructuredLogger {
    if (!StructuredLogger.instance) {
      StructuredLogger.instance = new StructuredLogger()
    }
    return StructuredLogger.instance
  }

  private formatEntry(entry: LogEntry): string {
    if (this.isProduction) {
      // JSON format for production (better for log aggregators)
      return JSON.stringify(entry)
    } else {
      // Pretty format for development
      const { timestamp, level, message, context, error } = entry
      let output = `[${timestamp}] ${level.toUpperCase()}: ${message}`

      if (context && Object.keys(context).length > 0) {
        output += ` | ${JSON.stringify(context)}`
      }

      if (error) {
        output += `\n  Error: ${error.name} - ${error.message}`
        if (error.stack && !this.isProduction) {
          output += `\n  Stack: ${error.stack}`
        }
      }

      return output
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }

    const formattedEntry = this.formatEntry(entry)

    switch (level) {
      case 'debug':
        if (!this.isProduction) console.debug(formattedEntry)
        break
      case 'info':
        console.info(formattedEntry)
        break
      case 'warn':
        console.warn(formattedEntry)
        break
      case 'error':
        console.error(formattedEntry)
        break
    }

    // In production, you could send to external services here
    // Example: Send to Axiom, Sentry, etc.
    if (this.isProduction && level === 'error' && error) {
      this.reportToExternalService(entry)
    }
  }

  private async reportToExternalService(entry: LogEntry) {
    // Placeholder for external error reporting
    // Example integrations:
    // - Sentry: Sentry.captureException(entry.error)
    // - Axiom: await axiom.ingest('logs', [entry])
    // - Custom webhook: await fetch(webhookUrl, { method: 'POST', body: JSON.stringify(entry) })

    // For now, just log that we would report
    if (process.env.AXIOM_TOKEN) {
      try {
        // Axiom integration example (uncomment when ready)
        // const axiom = new Axiom({ token: process.env.AXIOM_TOKEN })
        // await axiom.ingest('tribal-resource-hub-logs', [entry])
      } catch (e) {
        // Silently fail external reporting
      }
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context)
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.log('error', message, context, error)
  }

  /**
   * Log an API request
   */
  logRequest(method: string, path: string, requestId: string, context?: Partial<LogContext>) {
    this.info(`${method} ${path}`, {
      requestId,
      method,
      path,
      ...context,
    })
  }

  /**
   * Log an API response
   */
  logResponse(
    method: string,
    path: string,
    requestId: string,
    statusCode: number,
    duration: number,
    context?: Partial<LogContext>
  ) {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info'
    this.log(level, `${method} ${path} ${statusCode} ${duration}ms`, {
      requestId,
      method,
      path,
      statusCode,
      duration,
      ...context,
    })
  }

  /**
   * Log a database operation
   */
  logDatabase(operation: string, table: string, duration?: number, context?: Partial<LogContext>) {
    this.debug(`DB: ${operation} on ${table}`, {
      operation,
      table,
      duration,
      ...context,
    })
  }

  /**
   * Log a security event
   */
  logSecurity(event: string, context?: Partial<LogContext>) {
    this.warn(`Security: ${event}`, context)
  }
}

// Export singleton instance
export const logger = StructuredLogger.getInstance()

/**
 * Helper to create a request context
 */
export function createRequestContext(
  requestId: string,
  request: Request
): LogContext {
  const url = new URL(request.url)
  return {
    requestId,
    method: request.method,
    path: url.pathname,
  }
}

/**
 * Middleware helper to log requests
 */
export function withLogging<T>(
  handler: (request: Request) => Promise<T>,
  handlerName: string
): (request: Request) => Promise<T> {
  return async (request: Request) => {
    const requestId = crypto.randomUUID()
    const start = Date.now()
    const url = new URL(request.url)

    logger.logRequest(request.method, url.pathname, requestId)

    try {
      const result = await handler(request)
      const duration = Date.now() - start

      // Assuming result has a status property if it's a Response
      const statusCode = result instanceof Response ? result.status : 200
      logger.logResponse(request.method, url.pathname, requestId, statusCode, duration)

      return result
    } catch (error) {
      const duration = Date.now() - start
      logger.error(
        `Handler ${handlerName} failed`,
        error instanceof Error ? error : new Error(String(error)),
        { requestId, path: url.pathname, duration }
      )
      throw error
    }
  }
}
