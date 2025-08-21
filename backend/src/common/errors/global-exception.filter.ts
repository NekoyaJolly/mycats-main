/**
 * 共通エラーハンドリングモジュール
 * アプリケーション全体で使用する統一的なエラー処理
 */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

// カスタムエラータイプ
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

// 標準化されたエラーレスポンス形式
export interface StandardErrorResponse {
  success: false;
  error: {
    type: ErrorType;
    message: string;
    code: string;
    details?: any;
    timestamp: string;
    path?: string;
    requestId?: string;
  };
}

// カスタムエラークラス
export class CatManagementError extends Error {
  constructor(
    public readonly type: ErrorType,
    public readonly code: string,
    message: string,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'CatManagementError';
  }
}

// Prismaエラーのマッピング
export class PrismaErrorMapper {
  static mapError(
    error: Prisma.PrismaClientKnownRequestError,
  ): CatManagementError {
    switch (error.code) {
      case 'P2000':
        return new CatManagementError(
          ErrorType.VALIDATION_ERROR,
          'INVALID_INPUT_LENGTH',
          '入力値が長すぎます',
          { field: error.meta?.target },
        );

      case 'P2001':
        return new CatManagementError(
          ErrorType.NOT_FOUND,
          'RECORD_NOT_FOUND',
          '指定されたレコードが見つかりません',
          { where: error.meta?.cause },
        );

      case 'P2002':
        return new CatManagementError(
          ErrorType.VALIDATION_ERROR,
          'UNIQUE_CONSTRAINT_VIOLATION',
          '一意制約に違反しています',
          { fields: error.meta?.target },
        );

      case 'P2003':
        return new CatManagementError(
          ErrorType.BUSINESS_RULE_VIOLATION,
          'FOREIGN_KEY_CONSTRAINT',
          '関連するレコードが存在しません',
          { field: error.meta?.field_name },
        );

      case 'P2025':
        return new CatManagementError(
          ErrorType.NOT_FOUND,
          'RECORD_TO_UPDATE_NOT_FOUND',
          '更新対象のレコードが見つかりません',
          error.meta,
        );

      default:
        return new CatManagementError(
          ErrorType.DATABASE_ERROR,
          'DATABASE_OPERATION_FAILED',
          'データベース操作でエラーが発生しました',
          { prismaCode: error.code, details: error.meta },
        );
    }
  }
}

// グローバルエラーフィルター
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const standardError = this.createStandardErrorResponse(
      exception,
      request.url,
      request.headers['x-request-id'] as string,
    );

    // ログ出力
    this.logError(exception, standardError, request);

    response
      .status(this.getHttpStatus(standardError.error.type))
      .json(standardError);
  }

  private createStandardErrorResponse(
    exception: unknown,
    path: string,
    requestId?: string,
  ): StandardErrorResponse {
    // CatManagementErrorの場合
    if (exception instanceof CatManagementError) {
      return {
        success: false,
        error: {
          type: exception.type,
          code: exception.code,
          message: exception.message,
          details: exception.details,
          timestamp: new Date().toISOString(),
          path,
          requestId,
        },
      };
    }

    // HttpExceptionの場合
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const message =
        typeof response === 'string' ? response : (response as any).message;

      return {
        success: false,
        error: {
          type: this.mapHttpStatusToErrorType(exception.getStatus()),
          code: `HTTP_${exception.getStatus()}`,
          message: Array.isArray(message) ? message.join(', ') : message,
          timestamp: new Date().toISOString(),
          path,
          requestId,
        },
      };
    }

    // PrismaErrorの場合
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mappedError = PrismaErrorMapper.mapError(exception);
      return {
        success: false,
        error: {
          type: mappedError.type,
          code: mappedError.code,
          message: mappedError.message,
          details: mappedError.details,
          timestamp: new Date().toISOString(),
          path,
          requestId,
        },
      };
    }

    // その他のエラー（予期しないエラー）
    return {
      success: false,
      error: {
        type: ErrorType.INTERNAL_SERVER_ERROR,
        code: 'INTERNAL_ERROR',
        message: '内部サーバーエラーが発生しました',
        timestamp: new Date().toISOString(),
        path,
        requestId,
      },
    };
  }

  private mapHttpStatusToErrorType(status: number): ErrorType {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorType.VALIDATION_ERROR;
      case HttpStatus.NOT_FOUND:
        return ErrorType.NOT_FOUND;
      case HttpStatus.FORBIDDEN:
        return ErrorType.PERMISSION_DENIED;
      default:
        return ErrorType.INTERNAL_SERVER_ERROR;
    }
  }

  private getHttpStatus(errorType: ErrorType): number {
    switch (errorType) {
      case ErrorType.VALIDATION_ERROR:
        return HttpStatus.BAD_REQUEST;
      case ErrorType.NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case ErrorType.PERMISSION_DENIED:
        return HttpStatus.FORBIDDEN;
      case ErrorType.BUSINESS_RULE_VIOLATION:
        return HttpStatus.CONFLICT;
      case ErrorType.EXTERNAL_SERVICE_ERROR:
        return HttpStatus.BAD_GATEWAY;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private logError(
    exception: unknown,
    standardError: StandardErrorResponse,
    request: any,
  ) {
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';

    const logData = {
      timestamp: standardError.error.timestamp,
      method,
      url,
      ip,
      userAgent,
      error: standardError.error,
      stack: exception instanceof Error ? exception.stack : 'No stack trace',
    };

    if (standardError.error.type === ErrorType.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        'Internal Server Error',
        JSON.stringify(logData, null, 2),
      );
    } else {
      this.logger.warn('Application Error', JSON.stringify(logData, null, 2));
    }
  }
}

// エラーヘルパー関数
export class ErrorHelper {
  static throwNotFound(resource: string, identifier: string | number): never {
    throw new CatManagementError(
      ErrorType.NOT_FOUND,
      'RESOURCE_NOT_FOUND',
      `${resource} (${identifier}) が見つかりません`,
      { resource, identifier },
    );
  }

  static throwValidationError(message: string, details?: any): never {
    throw new CatManagementError(
      ErrorType.VALIDATION_ERROR,
      'VALIDATION_FAILED',
      message,
      details,
    );
  }

  static throwBusinessRuleViolation(rule: string, message: string): never {
    throw new CatManagementError(
      ErrorType.BUSINESS_RULE_VIOLATION,
      'BUSINESS_RULE_VIOLATION',
      message,
      { rule },
    );
  }

  static throwPermissionDenied(action: string, resource: string): never {
    throw new CatManagementError(
      ErrorType.PERMISSION_DENIED,
      'INSUFFICIENT_PERMISSIONS',
      `${resource}に対する${action}の権限がありません`,
      { action, resource },
    );
  }
}
