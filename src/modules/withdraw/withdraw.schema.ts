import { z } from 'zod';
import { MIN_WITHDRAWAL_AMOUNT } from '@/utils/constants';

export const WithdrawSchema = z.object({
  amount: z.number().min(MIN_WITHDRAWAL_AMOUNT, `Minimum withdrawal amount is ₦${MIN_WITHDRAWAL_AMOUNT}`),
});

export type WithdrawInput = z.infer<typeof WithdrawSchema>;
