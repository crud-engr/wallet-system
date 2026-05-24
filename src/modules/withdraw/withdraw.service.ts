import { Prisma } from '@prisma/client';
import prisma from '@/prisma';
import { AppError } from '@/utils/errors';
import { TransactionType, TransactionStatus } from '@/utils/constants';
import { generateReference, ReferencePrefix } from '@/utils/reference';
import type { WithdrawInput } from './withdraw.schema';

export async function withdraw(userId: string, input: WithdrawInput) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new AppError('Wallet not found.', 404);

  if (wallet.balance.lessThan(new Prisma.Decimal(input.amount))) {
    throw new AppError('Insufficient balance.', 400);
  }

  const { updatedWallet, transaction } = await prisma.$transaction(async (tx) => {
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: input.amount } },
    });

    const transaction = await tx.transaction.create({
      data: {
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.SUCCESS,
        amount: input.amount,
        reference: generateReference(ReferencePrefix.WITHDRAWAL),
        senderWalletId: wallet.id,
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
