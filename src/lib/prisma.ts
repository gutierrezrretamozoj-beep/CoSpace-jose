// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Declaración global para evitar múltiples instancias de Prisma durante el hot reload
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Reutilizamos la conexión existente o creamos una nueva
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}