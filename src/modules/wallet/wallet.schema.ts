import { z } from 'zod';
import { MIN_FUND_AMOUNT } from '@/utils/constants';

export const FundSchema = z.object({
  amount: z.number().min(MIN_FUND_AMOUNT, `Minimum top-up amount is ₦${MIN_FUND_AMOUNT}`),
});

export type FundInput = z.infer<typeof FundSchema>;
