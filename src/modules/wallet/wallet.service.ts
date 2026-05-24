import prisma from '@/prisma';
import { AppError } from '@/utils/errors';
import { TransactionType, TransactionStatus } from '@/utils/constants';
import { generateReference, ReferencePrefix } from '@/utils/reference';
import type { FundInput } from './wallet.schema';

export async function fundWallet(userId: string, input: FundInput) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new AppError('Wallet not found.', 404);

  // Increment balance and record the transaction atomically so they never diverge.
  const { updatedWallet, transaction } = await prisma.$transaction(async (tx) => {
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: input.amount } },
    });

    const transaction = await tx.transaction.create({
      data: {
        type: TransactionType.FUND,
        status: TransactionStatus.SUCCESS,
        amount: input.amount,
        reference: generateReference(ReferencePrefix.FUND),
        receiverWalletId: wallet.id,
      },
    });

    return { updatedWallet, transaction };
  });

  return {
    balance: updatedWallet.balance,
    transaction: {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      reference: transaction.reference,
      createdAt: transaction.createdAt,
    },
  };
}
