import type { Context } from "../context";

export const authorResolvers = {
  Query: {
    authors: (_: unknown, __: unknown, ctx: Context) =>
      ctx.prisma.author.findMany(),
    author: (_: unknown, args: { authorId: string }, ctx: Context) =>
      ctx.prisma.author.findUnique({ where: { authorId: args.authorId } }),
    authorsByCountry: (_: unknown, args: { country: string }, ctx: Context) =>
      ctx.prisma.author.findMany({ where: { country: args.country } }),
  },

  Mutation: {
    createAuthor: (
      _: unknown,
      args: {
        firstName: string;
        lastName: string;
        country?: string | null;
        birthDate?: string | null;
        deathDate?: string | null;
      },
      ctx: Context
    ) =>
      ctx.prisma.author.create({
        data: {
          firstName: args.firstName,
          lastName: args.lastName,
          country: args.country ?? null,
          birthDate: args.birthDate ?? null,
          deathDate: args.deathDate ?? null,
        },
      }),

    updateAuthor: (
      _: unknown,
      args: {
        authorId: string;
        firstName?: string | null;
        lastName?: string | null;
        country?: string | null;
      },
      ctx: Context
    ) =>
      ctx.prisma.author.update({
        where: { authorId: args.authorId },
        data: {
          firstName: args.firstName ?? undefined,
          lastName: args.lastName ?? undefined,
          country: args.country ?? undefined,
        },
      }),

    deleteAuthor: async (_: unknown, args: { authorId: string }, ctx: Context) => {
      try {
        await ctx.prisma.author.delete({ where: { authorId: args.authorId } });
        return true;
      } catch {
        return false;
      }
    },
  },

  Author: {
    books: (parent: { authorId: string }, _: unknown, ctx: Context) =>
      ctx.prisma.book.findMany({ where: { authorId: parent.authorId } }),
  },
};