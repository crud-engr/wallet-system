import { z } from 'zod';
import { MIN_TRANSFER_AMOUNT } from '@/utils/constants';

export const TransferSchema = z.object({
  recipient_email: z.string().email('Invalid recipient email'),
  amount: z.number().min(MIN_TRANSFER_AMOUNT, `Minimum transfer amount is ₦${MIN_TRANSFER_AMOUNT}`),
});

export type TransferInput = z.infer<typeof TransferSchema>;
