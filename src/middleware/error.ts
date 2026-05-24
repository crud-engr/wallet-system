import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '@/utils/errors';
import { sendError } from '@/utils/response';

/**
 * Global error handler — must be registered LAST in Express (4 parameters).
 *
 * Priority order:
 *  1. AppError - use its statusCode directly (operational, expected error)
 *  2. Prisma known request errors - map to 400/409 HTTP codes
 *  3. Everything else - 500 (unexpected, hide internals from the client)
 */
export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Prisma surfaces constraint violations, missing records, etc. as typed errors.
  // Map them to meaningful HTTP codes so clients get actionable feedback.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        sendError(res, 'A record with that value already exists.', 409);
        return;
      case 'P2025':
        sendError(res, 'The requested resource was not found.', 404);
        return;
      default:
        sendError(res, 'A database error occurred.', 400);
        return;
    }
  }

  console.error('[Unhandled Error]', err);
  sendError(res, 'An unexpected error occurred. Please try again later.', 500);
}
