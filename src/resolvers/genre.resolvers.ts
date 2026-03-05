import type { Context } from "../context";

export const genreResolvers = {
  Query: {
    genres: (_: unknown, __: unknown, ctx: Context) => ctx.prisma.genre.findMany(),
  },

  Mutation: {
    createGenre: (_: unknown, args: { genre: string }, ctx: Context) =>
      ctx.prisma.genre.create({ data: { genre: args.genre } }),

    updateGenre: (_: unknown, args: { genreId: string; genre: string }, ctx: Context) =>
      ctx.prisma.genre.update({
        where: { genreId: args.genreId },
        data: { genre: args.genre },
      }),

    deleteGenre: async (_: unknown, args: { genreId: string }, ctx: Context) => {
      try {
        await ctx.prisma.genre.delete({ where: { genreId: args.genreId } });
        return true;
      } catch {
        return false;
      }
    },
  },
};