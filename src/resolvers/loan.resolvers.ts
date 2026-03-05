import type { Context } from "../context";

export const loanResolvers = {
  Query: {
    loans: (_: unknown, __: unknown, ctx: Context) => ctx.prisma.loan.findMany(),
    loan: (_: unknown, args: { loanId: string }, ctx: Context) =>
      ctx.prisma.loan.findUnique({ where: { loanId: args.loanId } }),
    loansByMember: (_: unknown, args: { email: string }, ctx: Context) =>
      ctx.prisma.loan.findMany({ where: { member: { email: args.email } } }),
    activeLoans: (_: unknown, __: unknown, ctx: Context) =>
      ctx.prisma.loan.findMany({ where: { returnDate: null } }),
  },

  Mutation: {
    createLoan: async (
      _: unknown,
      args: { copyId: string; memberId: string; loanDate: string; dueDate: string },
      ctx: Context
    ) => {
      // 1) Vérifier la disponibilité
      const active = await ctx.prisma.loan.findFirst({
        where: { copyId: args.copyId, returnDate: null },
        select: { loanId: true },
      });
      if (active) {
        throw new Error(`Copy ${args.copyId} is not available`);
      }

      // 2) Créer le prêt
      return ctx.prisma.loan.create({
        data: {
          copyId: args.copyId,
          memberId: args.memberId,
          loanDate: args.loanDate,
          dueDate: args.dueDate,
          returnDate: null,
        },
      });
    },

    returnLoan: (_: unknown, args: { loanId: string; returnDate: string }, ctx: Context) =>
      ctx.prisma.loan.update({
        where: { loanId: args.loanId },
        data: { returnDate: args.returnDate },
      }),
  },

  Loan: {
    copy: (parent: { copyId: string }, _: unknown, ctx: Context) =>
      ctx.prisma.copy.findUnique({ where: { copyId: parent.copyId } }),
    member: (parent: { memberId: string }, _: unknown, ctx: Context) =>
      ctx.prisma.member.findUnique({ where: { memberId: parent.memberId } }),
  },
};