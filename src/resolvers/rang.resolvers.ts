import type { Context } from "../context";

export const rangResolvers = {
  Query: {
    rangs: (_: unknown, __: unknown, ctx: Context) => ctx.prisma.rang.findMany(),
  },

  Mutation: {
    createRang: (_: unknown, args: { rang: string }, ctx: Context) =>
      ctx.prisma.rang.create({ data: { rang: args.rang } }),

    updateRang: (_: unknown, args: { rangId: string; rang: string }, ctx: Context) =>
      ctx.prisma.rang.update({ where: { rangId: args.rangId }, data: { rang: args.rang } }),

    deleteRang: async (_: unknown, args: { rangId: string }, ctx: Context) => {
      try {
        await ctx.prisma.rang.delete({ where: { rangId: args.rangId } });
        return true;
      } catch {
        return false;
      }
    },
  },
  Rang: {},
};