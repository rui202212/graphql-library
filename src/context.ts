// src/context.ts
import { PrismaClient } from "@prisma/client";

/* if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
} */

export const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
};

export function createContext(): Context {
  return { prisma };
}
