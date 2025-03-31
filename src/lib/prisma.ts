import { PrismaClient } from '@prisma/client';

// Add prisma to the global type
declare global {
  var _prisma: PrismaClient | undefined;
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
export const _prisma = global._prisma || new PrismaClient();

// Export for actual usage in the application
export const prisma = _prisma;

if (process.env.NODE_ENV !== 'production') global._prisma = _prisma;
