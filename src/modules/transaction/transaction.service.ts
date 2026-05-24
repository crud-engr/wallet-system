import prisma from '@/prisma';
import { AppError } from '@/utils/errors';

export async function getTransactions(userId: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new AppError('Wallet not found.', 404);

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [{ senderWalletId: wallet.id }, { receiverWalletId: wallet.id }],
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      amount: true,
      type: true,
      status: true,
      createdAt: true,
    },
  });

  return transactions.map((tx) => ({
    id: tx.id,
    amount: tx.amount,
    type: tx.type,
    status: tx.status,
    created_at: tx.createdAt,
  }));
}
