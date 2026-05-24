import bcrypt from 'bcryptjs';
import prisma from '@/prisma';
import { signToken } from '@/utils/jwt';
import { AppError } from '@/utils/errors';
import type { RegisterInput, LoginInput } from './auth.schema';

// strong enough to resist brute-force, fast enough for login latency.
const SALT_ROUNDS = 12;

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError('Account already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  // Atomic transaction: user + wallet are always created together or not at all.
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
    });

    await tx.wallet.create({ data: { userId: newUser.id } });

    return newUser;
  });

  const token = signToken(user.id);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Compare even when user is not found to prevent timing-based user enumeration.
  const passwordMatch = user
    ? await bcrypt.compare(input.password, user.password)
    : await bcrypt.compare(
        input.password,
        '$2b$12$invalidhashpadding000000000000000000000000000000000000'
      );

  if (!user || !passwordMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = signToken(user.id);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}
