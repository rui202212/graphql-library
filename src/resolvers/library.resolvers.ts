import type { Context } from "../context";

export const libraryResolvers = {
  Query: {
    libraries: (_: unknown, __: unknown, ctx: Context) => ctx.prisma.library.findMany(),
    library: (_: unknown, args: { libraryId: string }, ctx: Context) =>
      ctx.prisma.library.findUnique({ where: { libraryId: args.libraryId } }),
    librariesByCity: (_: unknown, args: { city: string }, ctx: Context) =>
      ctx.prisma.library.findMany({ where: { city: args.city } }),
  },

  Mutation: {
    createLibrary: (
      _: unknown,
      args: { libraryName: string; createDate: string; location: string; city: string; nature: string },
      ctx: Context
    ) =>
      ctx.prisma.library.create({
        data: {
          libraryName: args.libraryName,
          createDate: args.createDate,
          location: args.location,
          city: args.city,
          nature: args.nature,
        },
      }),

    updateLibrary: (
      _: unknown,
      args: { libraryId: string; libraryName?: string | null; location?: string | null; city?: string | null },
      ctx: Context
    ) =>
      ctx.prisma.library.update({
        where: { libraryId: args.libraryId },
        data: {
          libraryName: args.libraryName ?? undefined,
          location: args.location ?? undefined,
          city: args.city ?? undefined,
        },
      }),
  },
};