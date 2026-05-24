import type { Request, Response, NextFunction } from 'express';
import { getTransactions } from './transaction.service';
import { sendSuccess } from '@/utils/response';

export async function getTransactionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await getTransactions(req.user!.id);
    sendSuccess(res, result, 'Transactions retrieved successfully.');
  } catch (err) {
    next(err);
  }
}
