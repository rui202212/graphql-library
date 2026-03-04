import { authorResolvers } from "./author.resolvers";
import { bookResolvers } from "./book.resolvers";
import { genreResolvers } from "./genre.resolvers";
import { editionResolvers } from "./edition.resolvers";
import { typeResolvers } from "./type.resolvers";
import { libraryResolvers } from "./library.resolvers";
import { memberResolvers } from "./member.resolvers";
import { copyResolvers } from "./copy.resolvers";
import { loanResolvers } from "./loan.resolvers";
import { userResolvers } from "./user.resolvers";
import { rangResolvers } from "./rang.resolvers";

export const resolvers = {
  Query: {
    ...authorResolvers.Query,
    ...bookResolvers.Query,
    ...genreResolvers.Query,
    ...typeResolvers.Query,
    ...libraryResolvers.Query,
    ...memberResolvers.Query,
    ...copyResolvers.Query,
    ...loanResolvers.Query,
    ...userResolvers.Query,
    ...editionResolvers.Query,
    ...rangResolvers.Query,
  },
  Mutation: {
    ...authorResolvers.Mutation,
    ...bookResolvers.Mutation,
    ...genreResolvers.Mutation,
    ...typeResolvers.Mutation,
    ...libraryResolvers.Mutation,
    ...memberResolvers.Mutation,
    ...copyResolvers.Mutation,
    ...loanResolvers.Mutation,
    ...userResolvers.Mutation,
    ...editionResolvers.Mutation,
    ...rangResolvers.Mutation,
  },
  // Field resolvers
  Author: authorResolvers.Author,
  Book: bookResolvers.Book,
  Genre: genreResolvers.Genre,
  Type: typeResolvers.Type,
  Edition: editionResolvers.Edition,
  Library: libraryResolvers.Library,
  Member: memberResolvers.Member,
  Copy: copyResolvers.Copy,
  Loan: loanResolvers.Loan,
  User: userResolvers.User,
  Rang: rangResolvers.Rang,
};