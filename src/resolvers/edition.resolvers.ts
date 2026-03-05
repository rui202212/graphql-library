import type { Context } from "../context";

export const editionResolvers = {
  Query: {
    editions: (_: unknown, __: unknown, ctx: Context) => ctx.prisma.edition.findMany(),
  },

  Mutation: {
    createEdition: (
      _: unknown,
      args: { editionName: string; createDate: string; city: string; country: string },
      ctx: Context
    ) =>
      ctx.prisma.edition.create({
        data: {
          editionName: args.editionName,
          createDate: args.createDate,
          city: args.city,
          country: args.country,
        },
      }),

    updateEdition: (
      _: unknown,
      args: { editionId: string; editionName?: string | null; city?: string | null; country?: string | null },
      ctx: Context
    ) =>
      ctx.prisma.edition.update({
        where: { editionId: args.editionId },
        data: {
          editionName: args.editionName ?? undefined,
          city: args.city ?? undefined,
          country: args.country ?? undefined,
        },
      }),

    deleteEdition: async (_: unknown, args: { editionId: string }, ctx: Context) => {
      try {
        await ctx.prisma.edition.delete({ where: { editionId: args.editionId } });
        return true;
      } catch {
        return false;
      }
    },
  },
};