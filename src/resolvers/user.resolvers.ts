import type { Context } from "../context";

// ⚠️ Démo pédagogique : on compare des mots de passe en clair.
// En production : stocke un hash (bcrypt/argon2), et compare via hash.

export const userResolvers = {
  Query: {
    users: (_: unknown, __: unknown, ctx: Context) => ctx.prisma.user.findMany(),
    user: (_: unknown, args: { userId: string }, ctx: Context) =>
      ctx.prisma.user.findUnique({ where: { userId: args.userId } }),
    userByEmail: (_: unknown, args: { email: string }, ctx: Context) =>
      ctx.prisma.user.findUnique({ where: { email: args.email } }),
  },

  Mutation: {
    createUser: (
      _: unknown,
      args: {
        lastName: string; firstName: string; address: string; postalCode: string; city: string;
        email: string; phone: string; passWord: string; rangId: string;
      },
      ctx: Context
    ) =>
      ctx.prisma.user.create({
        data: {
          lastName: args.lastName,
          firstName: args.firstName,
          address: args.address,
          postalCode: args.postalCode,
          city: args.city,
          email: args.email,
          phone: args.phone,
          passWord: args.passWord, // ⚠️ à hasher en prod !
          rangId: args.rangId,
        },
      }),

    updateUser: (
      _: unknown,
      args: { userId: string; lastName?: string | null; firstName?: string | null; email?: string | null; city?: string | null },
      ctx: Context
    ) =>
      ctx.prisma.user.update({
        where: { userId: args.userId },
        data: {
          lastName: args.lastName ?? undefined,
          firstName: args.firstName ?? undefined,
          email: args.email ?? undefined,
          city: args.city ?? undefined,
        },
      }),

    deleteUser: async (_: unknown, args: { userId: string }, ctx: Context) => {
      try {
        await ctx.prisma.user.delete({ where: { userId: args.userId } });
        return true;
      } catch {
        return false;
      }
    },

    login: async (_: unknown, args: { email: string; passWord: string }, ctx: Context) => {
      const u = await ctx.prisma.user.findUnique({ where: { email: args.email } });
      if (!u) throw new Error("Invalid credentials");
      // Démo : comparaison en clair. En prod : compare hashés.
      if (u.passWord !== args.passWord) throw new Error("Invalid credentials");
      return u;
    },
  },

  User: {
    rang: (parent: { rangId: string }, _: unknown, ctx: Context) =>
      ctx.prisma.rang.findUnique({ where: { rangId: parent.rangId } }),
  },
};
