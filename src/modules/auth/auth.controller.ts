import type { Request, Response, NextFunction } from "express";
import { register, login } from "./auth.service";
import { sendSuccess } from "@/utils/response";
import type { RegisterInput, LoginInput } from "./auth.schema";

export async function registerHandler(
  req: Request<object, object, RegisterInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await register(req.body);
    sendSuccess(res, result, "Account created successfully.", 201);
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(
  req: Request<object, object, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await login(req.body);
    sendSuccess(res, result, "Login successful.");
  } catch (err) {
    next(err);
  }
}
