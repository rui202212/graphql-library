import type { Context } from "../context";

export const bookResolvers = {
  Query: {
    books: (_: unknown, __: unknown, ctx: Context) =>
      ctx.prisma.book.findMany(),
    book: (_: unknown, args: { bookId: string }, ctx: Context) =>
      ctx.prisma.book.findUnique({ where: { bookId: args.bookId } }),
    booksByGenre: (_: unknown, args: { genreId: string }, ctx: Context) =>
      ctx.prisma.book.findMany({ where: { genreId: args.genreId } }),
    bookByIsbn: (_: unknown, args: { isbn: string }, ctx: Context) =>
      ctx.prisma.book.findUnique({ where: { isbn: args.isbn } }),
    booksByTitle: (_: unknown, args: { title: string }, ctx: Context) =>
      ctx.prisma.book.findMany({ where: { title: { contains: args.title } } }),
    booksByAuthor: (_: unknown, args: { authorId: string }, ctx: Context) =>
      ctx.prisma.book.findMany({ where: { authorId: args.authorId } }),
  },
  Mutation: {
    createBook: (
      _: unknown,
      args: {
        isbn: string;
        title: string;
        publishDate: string;
        authorId: string;
        editionId: string;
        genreId: string;
        typeId: string;
      },
      ctx: Context
    ) =>
      ctx.prisma.book.create({
        data: {
          isbn: args.isbn,
          title: args.title,
          publishDate: args.publishDate,
          authorId: args.authorId,
          editionId: args.editionId,
          genreId: args.genreId,
          typeId: args.typeId,
        },
      }),
    updateBook: (
      _: unknown,
      args: { bookId: string; title?: string; publishDate?: string },
      ctx: Context
    ) =>
      ctx.prisma.book.update({
        where: { bookId: args.bookId },
        data: {
          title: args.title ?? undefined,
          publishDate: args.publishDate ?? undefined,
        },
      }),
    deleteBook: (_: unknown, args: { bookId: string }, ctx: Context) =>
      ctx.prisma.book
        .delete({ where: { bookId: args.bookId } })
        .then(() => true)
        .catch(() => false),
  },
  Book: {
    author: (parent: { authorId: string }, _: unknown, ctx: Context) =>
      ctx.prisma.author.findUnique({ where: { authorId: parent.authorId } }),
    edition: (parent: { editionId: string }, _: unknown, ctx: Context) =>
      ctx.prisma.edition.findUnique({ where: { editionId: parent.editionId } }),
    genre: (parent: { genreId: string }, _: unknown, ctx: Context) =>
      ctx.prisma.genre.findUnique({ where: { genreId: parent.genreId } }),
    type: (parent: { typeId: string }, _: unknown, ctx: Context) =>
      ctx.prisma.type.findUnique({ where: { typeId: parent.typeId } }),
  },
};