import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const response = exceptionResponse as any;
        message = response.message || response.error || message;
        error = response.error || error;
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      // Handle Prisma-specific errors
      status = HttpStatus.BAD_REQUEST;

      switch (exception.code) {
        case 'P2002':
          message = 'Unique constraint violation';
          error = 'Conflict';
          status = HttpStatus.CONFLICT;
          break;
        case 'P2025':
          message = 'Record not found';
          error = 'Not Found';
          status = HttpStatus.NOT_FOUND;
          break;
        case 'P2003':
          message = 'Foreign key constraint failed';
          error = 'Bad Request';
          break;
        default:
          message = 'Database error';
          error = 'Database Error';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log the error
    this.logger.error(
      `HTTP Status: ${status} Error Message: ${message}`,
      exception instanceof Error ? exception.stack : 'No stack trace',
    );

    // Send the error response
    const errorResponse = {
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    // Don't include sensitive information in production
    if (process.env.NODE_ENV !== 'production') {
      (errorResponse as any).stack =
        exception instanceof Error ? exception.stack : undefined;
    }

    response.status(status).json(errorResponse);
  }
}
