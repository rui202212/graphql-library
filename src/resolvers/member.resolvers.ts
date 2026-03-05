import type { Context } from "../context";

export const memberResolvers = {
  Query: {
    members: (_: unknown, __: unknown, ctx: Context) => ctx.prisma.member.findMany(),
    member: (_: unknown, args: { memberId: string }, ctx: Context) =>
      ctx.prisma.member.findUnique({ where: { memberId: args.memberId } }),
    memberByEmail: (_: unknown, args: { email: string }, ctx: Context) =>
      ctx.prisma.member.findUnique({ where: { email: args.email } }),
    membersByLibrary: (_: unknown, args: { libraryId: string }, ctx: Context) =>
      ctx.prisma.member.findMany({ where: { libraryId: args.libraryId } }),
    activeMembers: (_: unknown, __: unknown, ctx: Context) =>
      ctx.prisma.member.findMany({ where: { active: true } }),
  },

  Mutation: {
    // NOTE: le SDL a un `passWord` pour Member, mais notre modèle Prisma `Member` n'a PAS de password.
    // Ici on ignore donc l'argument `passWord`. Pour une vraie auth, mets un `User` séparé (ce qu'on a déjà).
    createMember: (
      _: unknown,
      args: {
        lastName: string; firstName: string; address: string; postalCode: string; city: string;
        email: string; phone: string; passWord: string; libraryId: string; // passWord ignoré ici
      },
      ctx: Context
    ) =>
      ctx.prisma.member.create({
        data: {
          lastName: args.lastName,
          firstName: args.firstName,
          address: args.address,
          postalCode: args.postalCode,
          city: args.city,
          email: args.email,
          phone: args.phone,
          active: true,
          libraryId: args.libraryId,
        },
      }),

    updateMember: (
      _: unknown,
      args: { memberId: string; address?: string | null; city?: string | null; phone?: string | null; active?: boolean | null },
      ctx: Context
    ) =>
      ctx.prisma.member.update({
        where: { memberId: args.memberId },
        data: {
          address: args.address ?? undefined,
          city: args.city ?? undefined,
          phone: args.phone ?? undefined,
          active: args.active ?? undefined,
        },
      }),

    deleteMember: async (_: unknown, args: { memberId: string }, ctx: Context) => {
      try {
        await ctx.prisma.member.delete({ where: { memberId: args.memberId } });
        return true;
      } catch {
        return false;
      }
    },
  },

  Member: {
    library: (parent: { libraryId: string }, _: unknown, ctx: Context) =>
      ctx.prisma.library.findUnique({ where: { libraryId: parent.libraryId } }),
  },
};