import type { Request, Response, NextFunction } from 'express';
import { getTransactions } from './transaction.service';
import { sendSuccess } from '@/utils/response';

export async function getTransactionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const result = await getTransactions(req.user!.id, page, limit);
    sendSuccess(res, result, 'Transactions retrieved successfully.');
  } catch (err) {
    next(err);
  }
}
