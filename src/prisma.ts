import { PrismaClient } from "@prisma/client";

// Singleton pattern: reuse one PrismaClient across the app rather than opening
// a new connection pool on every import, which would exhaust DB connections fast.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
});

export default prisma;
