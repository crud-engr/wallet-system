import type { Request, Response, NextFunction } from 'express';
import { transfer } from './transfer.service';
import { sendSuccess } from '@/utils/response';
import type { TransferInput } from './transfer.schema';

export async function transferHandler(
  req: Request<object, object, TransferInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await transfer(req.user!.id, req.body);
    sendSuccess(res, result, 'Transfer successful.');
  } catch (err) {
    next(err);
  }
}
