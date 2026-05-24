import type { Request, Response, NextFunction } from "express";
import { verifyToken, type TokenPayload } from "@/utils/jwt";
import { AppError } from "@/utils/errors";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Authentication token required.", 401);
  }

  const token = authHeader.slice(7);
  const payload: TokenPayload = verifyToken(token);
  req.user = { id: payload.sub };
  next();
}
