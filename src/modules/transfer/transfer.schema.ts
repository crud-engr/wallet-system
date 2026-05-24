import { z } from 'zod';

export const TransferSchema = z.object({
  recipient_email: z.string().email('Invalid recipient email'),
  amount: z.number().positive('Amount must be a positive number'),
});

export type TransferInput = z.infer<typeof TransferSchema>;
