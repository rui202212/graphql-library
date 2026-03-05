// src/context.ts
import { PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaMariaDb({
  url: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });

export type Context = {
  prisma: PrismaClient;
};

export function createContext(): Context {
  return { prisma };
}