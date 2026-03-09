import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/** Shape of Prisma known request errors (e.g. P2002, P2025) */
interface PrismaKnownRequestError {
  code: string;
  meta?: Record<string, unknown>;
  message: string;
}

export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path?: string;
}

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, error, message } = this.normalizeException(exception);

    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} ${statusCode}`,
        exception instanceof Error ? exception.stack : String(exception)
      );
    }

    const body: ErrorResponse = {
      statusCode,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(body);
  }

  private normalizeException(exception: unknown): {
    statusCode: number;
    error: string;
    message: string | string[];
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const error: string =
        typeof res === 'object' && res !== null && 'error' in res
          ? ((res as { error?: string }).error ?? HttpStatus[status] ?? 'Error')
          : (HttpStatus[status] ?? 'Error');
      const message =
        typeof res === 'object' && res !== null && 'message' in res
          ? (res as { message?: string | string[] }).message
          : exception.message;
      return { statusCode: status, error, message: message ?? exception.message };
    }

    if (this.isPrismaError(exception)) {
      return this.mapPrismaError(exception);
    }

    const message = exception instanceof Error ? exception.message : 'Internal server error';
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message,
    };
  }

  private isPrismaError(e: unknown): e is PrismaKnownRequestError {
    return (
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      typeof (e as { code: string }).code === 'string'
    );
  }

  private mapPrismaError(error: PrismaKnownRequestError): {
    statusCode: number;
    error: string;
    message: string;
  } {
    switch (error.code) {
      case 'P2002': {
        const target = (error.meta?.target as string[] | undefined)?.[0];
        const field = target ?? 'field';
        return {
          statusCode: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: `A record with this ${field} already exists.`,
        };
      }
      case 'P2025':
        return {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: 'The requested record was not found.',
        };
      case 'P2003':
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'Invalid reference: related record does not exist.',
        };
      default:
        this.logger.warn(`Unhandled Prisma error code: ${error.code}`, error);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'The request could not be processed. Please check your input.',
        };
    }
  }
}
