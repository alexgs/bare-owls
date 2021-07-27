import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

// Add prisma to the NodeJS global type
interface PrismaGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}
declare const global: PrismaGlobal;

if (!global.prisma) {
  global.prisma = mockDeep<PrismaClient>();
}
const prisma = global.prisma;

export default prisma;
