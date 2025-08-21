import { Injectable, ConsoleLogger, LogLevel } from '@nestjs/common';

@Injectable()
export class AppLogger extends ConsoleLogger {
  private static readonly logLevels: Record<string, LogLevel[]> = {
    development: ['log', 'error', 'warn', 'debug', 'verbose'],
    production: ['log', 'error', 'warn'],
    test: ['error', 'warn'],
  };

  constructor() {
    const environment = process.env.NODE_ENV || 'development';
    super('CatManagementSystem', {
      logLevels:
        AppLogger.logLevels[environment] || AppLogger.logLevels.development,
    });
  }

  formatMessage(
    level: string,
    message: string,
    context?: string,
    stack?: string,
  ) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    const stackStr = stack ? `\n${stack}` : '';

    return `[${timestamp}] [${level.toUpperCase()}]${contextStr} ${message}${stackStr}`;
  }

  log(message: any, context?: string) {
    console.log(this.formatMessage('log', message, context));
  }

  error(message: any, stack?: string, context?: string) {
    console.error(this.formatMessage('error', message, context, stack));
  }

  warn(message: any, context?: string) {
    console.warn(this.formatMessage('warn', message, context));
  }

  debug(message: any, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  verbose(message: any, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatMessage('verbose', message, context));
    }
  }
}
