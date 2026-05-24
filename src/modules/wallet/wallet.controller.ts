import type { Request, Response, NextFunction } from 'express';
import { fundWallet } from './wallet.service';
import { sendSuccess } from '@/utils/response';
import type { FundInput } from './wallet.schema';

export async function fundWalletHandler(
  req: Request<object, object, FundInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await fundWallet(req.user!.id, req.body);
    sendSuccess(res, result, 'Wallet funded successfully.');
  } catch (err) {
    next(err);
  }
}
