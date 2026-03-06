import type { Context } from "../context";

export const typeResolvers = {
  Query: {
    types: (_: unknown, __: unknown, ctx: Context) => ctx.prisma.type.findMany(),
  },

  Mutation: {
    createType: (_: unknown, args: { type: string }, ctx: Context) =>
      ctx.prisma.type.create({ data: { type: args.type } }),

    updateType: (_: unknown, args: { typeId: string; type: string }, ctx: Context) =>
      ctx.prisma.type.update({
        where: { typeId: args.typeId },
        data: { type: args.type },
      }),

    deleteType: async (_: unknown, args: { typeId: string }, ctx: Context) => {
      try {
        await ctx.prisma.type.delete({ where: { typeId: args.typeId } });
        return true;
      } catch {
        return false;
      }
    },
  },
  Type: {},
};