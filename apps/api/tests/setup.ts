import { beforeAll, afterAll } from 'vitest';
import { prisma } from '../src/app';

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
