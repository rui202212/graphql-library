// src/types.ts
import type { GraphQLResolveInfo } from "graphql";
import type { PrismaClient } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
  userId?: string | null;
}

export type Resolver<
  Result,
  Args = Record<string, unknown>,
  Parent = unknown
> = (
  parent: Parent,
  args: Args,
  ctx: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export type Maybe<T> = T | null | undefined;
export type ID = string | number;