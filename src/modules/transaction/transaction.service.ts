import prisma from '@/prisma';

export async function getTransactions(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const where = {
    OR: [
      { senderWallet: { userId } },
      { receiverWallet: { userId } },
    ],
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        amount: true,
        type: true,
        status: true,
        reference: true,
        createdAt: true,
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
