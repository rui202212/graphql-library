import type { Context } from "../context";

export const copyResolvers = {
  Query: {
    copies: (_: unknown, __: unknown, ctx: Context) => ctx.prisma.copy.findMany(),
    copiesByBook: (_: unknown, args: { bookId: string }, ctx: Context) =>
      ctx.prisma.copy.findMany({ where: { bookId: args.bookId } }),
    copiesByLibrary: (_: unknown, args: { libraryId: string }, ctx: Context) =>
      ctx.prisma.copy.findMany({ where: { libraryId: args.libraryId } }),
    isCopyAvailable: async (_: unknown, args: { copyId: string }, ctx: Context) => {
      const activeLoan = await ctx.prisma.loan.findFirst({
        where: { copyId: args.copyId, returnDate: null },
        select: { loanId: true },
      });
      return !activeLoan;
    },
  },

  Mutation: {
    createCopy: (_: unknown, args: { bookId: string; libraryId: string; acquisitionDate: string }, ctx: Context) =>
      ctx.prisma.copy.create({
        data: {
          bookId: args.bookId,
          libraryId: args.libraryId,
          acquisitionDate: args.acquisitionDate,
        },
      }),
  },

  Copy: {
    book: (parent: { bookId: string }, _: unknown, ctx: Context) =>
      ctx.prisma.book.findUnique({ where: { bookId: parent.bookId } }),
    library: (parent: { libraryId: string }, _: unknown, ctx: Context) =>
      ctx.prisma.library.findUnique({ where: { libraryId: parent.libraryId } }),
  },
};