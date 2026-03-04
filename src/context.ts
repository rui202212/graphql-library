import { PrismaClient } from "@prisma/client";

export type Context = {
  prisma: PrismaClient;
};

export const prisma = new PrismaClient();

export function createContext(): Context {
  return { prisma };
}