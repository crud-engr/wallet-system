import type { Request, Response, NextFunction } from 'express';
import { withdraw } from './withdraw.service';
import { sendSuccess } from '@/utils/response';
import type { WithdrawInput } from './withdraw.schema';

export async function withdrawHandler(
  req: Request<object, object, WithdrawInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await withdraw(req.user!.id, req.body);
    sendSuccess(res, result, 'Withdrawal successful.');
  } catch (err) {
    next(err);
  }
}
