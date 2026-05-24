import type { Response } from "express";

interface SuccessPayload<T> {
  success: true;
  message: string;
  data: T;
}

interface ErrorPayload {
  success: false;
  message: string;
}

/**
 * Sends a uniform success envelope.
 * Keeping the shape consistent lets clients parse responses predictably
 * without branching on different field names across endpoints.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
): Response<SuccessPayload<T>> {
  return res.status(statusCode).json({ success: true, message, data });
}

/**
 * Sends a uniform error envelope.
 * The `success: false` flag gives clients a single boolean to branch on
 * instead of relying solely on HTTP status codes.
 */
export function sendError(
  res: Response,
  message: string,
  statusCode = 500
): Response<ErrorPayload> {
  return res.status(statusCode).json({ success: false, message });
}
