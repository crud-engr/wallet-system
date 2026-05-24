import { Prisma } from '@prisma/client';
import prisma from '@/prisma';
import { AppError } from '@/utils/errors';
import { TransactionType, TransactionStatus } from '@/utils/constants';
import { generateReference, ReferencePrefix } from '@/utils/reference';
import type { TransferInput } from './transfer.schema';

export async function transfer(senderId: string, input: TransferInput) {
  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    include: { wallet: true },
  });

  if (!sender?.wallet) throw new AppError('Sender wallet not found.', 404);

  if (sender.email === input.recipient_email) {
    throw new AppError('You cannot transfer funds to yourself.', 400);
  }

  const recipient = await prisma.user.findUnique({
    where: { email: input.recipient_email },
    include: { wallet: true },
  });

  if (!recipient) throw new AppError('Recipient not found.', 404);
  if (!recipient.wallet) throw new AppError('Recipient wallet not found.', 404);

  if (sender.wallet.balance.lessThan(new Prisma.Decimal(input.amount))) {
    throw new AppError('Insufficient balance.', 400);
  }

  const senderWalletId = sender.wallet.id;
  const recipientWalletId = recipient.wallet.id;

  // Debit sender, credit recipient, and record a single transaction — all atomic.
  const { updatedSenderWallet, transaction } = await prisma.$transaction(async (tx) => {
    const updatedSenderWallet = await tx.wallet.update({
      where: { id: senderWalletId },
      data: { balance: { decrement: input.amount } },
    });

    await tx.wallet.update({
      where: { id: recipientWalletId },
      data: { balance: { increment: input.amount } },
    });

    const transaction = await tx.transaction.create({
      data: {
        type: TransactionType.TRANSFER,
        status: TransactionStatus.SUCCESS,
        amount: input.amount,
        reference: generateReference(ReferencePrefix.TRANSFER),
        senderWalletId,
        receiverWalletId: recipientWalletId,
      },
    });

    return { updatedSenderWallet, transaction };
  });

  return {
    balance: updatedSenderWallet.balance,
    transaction: {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      reference: transaction.reference,
      recipient: { name: recipient.name, email: recipient.email },
      createdAt: transaction.createdAt,
    },
  };
}
