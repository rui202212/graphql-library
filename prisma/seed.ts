// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Prisma Seeding...");

  // GENRES (IDs fixes g1, g2, g3)
  const g1 = await prisma.genre.upsert({
    where: { genreId: "g1" },
    update: {},
    create: { genreId: "g1", genre: "Fantasy" },
  });
  const g2 = await prisma.genre.upsert({
    where: { genreId: "g2" },
    update: {},
    create: { genreId: "g2", genre: "Science-Fiction" },
  });
  const g3 = await prisma.genre.upsert({
    where: { genreId: "g3" },
    update: {},
    create: { genreId: "g3", genre: "Policier" },
  });

  // TYPES (IDs fixes t1, t2)
  const t1 = await prisma.type.upsert({
    where: { typeId: "t1" },
    update: {},
    create: { typeId: "t1", type: "Roman" },
  });
  const t2 = await prisma.type.upsert({
    where: { typeId: "t2" },
    update: {},
    create: { typeId: "t2", type: "Essai" },
  });

  // EDITION (ID fixe e1)
  const e1 = await prisma.edition.upsert({
    where: { editionId: "e1" },
    update: {},
    create: {
      editionId: "e1",
      editionName: "Gallimard",
      createDate: "1911-01-01",
      city: "Paris",
      country: "France",
    },
  });

  // AUTHORS (IDs fixes a1, a2, a3)
  const a1 = await prisma.author.upsert({
    where: { authorId: "a1" },
    update: {},
    create: {
      authorId: "a1",
      firstName: "J.K.",
      lastName: "Rowling",
      country: "UK",
    },
  });
  const a2 = await prisma.author.upsert({
    where: { authorId: "a2" },
    update: {},
    create: {
      authorId: "a2",
      firstName: "Frank",
      lastName: "Herbert",
      country: "USA",
    },
  });
  const a3 = await prisma.author.upsert({
    where: { authorId: "a3" },
    update: {},
    create: {
      authorId: "a3",
      firstName: "Agatha",
      lastName: "Christie",
      country: "UK",
    },
  });

  // LIBRARY (ID fixe l1) — valeurs demandées
  const l1 = await prisma.library.upsert({
    where: { libraryId: "l1" },
    update: {},
    create: {
      libraryId: "l1",
      libraryName: "Médiathèque - L'Apostrophe",
      createDate: "2018-01-01",
      location: "5 allée verte",
      city: "Lannilis",
      nature: "Municipale",
    },
  });

  // BOOKS (IDs fixes b1, b2, b3 via upsert by unique isbn)
  const b1 = await prisma.book.upsert({
    where: { isbn: "9782070643028" },
    update: {},
    create: {
      bookId: "b1",
      isbn: "9782070643028",
      title: "Harry Potter à l'école des sorciers",
      publishDate: "1997-06-26",
      authorId: a1.authorId,
      editionId: e1.editionId,
      genreId: g1.genreId,
      typeId: t1.typeId,
    },
  });

  const b2 = await prisma.book.upsert({
    where: { isbn: "9782070368228" },
    update: {},
    create: {
      bookId: "b2",
      isbn: "9782070368228",
      title: "Dune",
      publishDate: "1965-08-01",
      authorId: a2.authorId,
      editionId: e1.editionId,
      genreId: g2.genreId,
      typeId: t1.typeId,
    },
  });

  const b3 = await prisma.book.upsert({
    where: { isbn: "9782253004223" },
    update: {},
    create: {
      bookId: "b3",
      isbn: "9782253004223",
      title: "Le Crime de l'Orient-Express",
      publishDate: "1934-01-01",
      authorId: a3.authorId,
      editionId: e1.editionId,
      genreId: g3.genreId,
      typeId: t1.typeId,
    },
  });

  // COPY (ID fixe c1)
  const c1 = await prisma.copy.upsert({
    where: { copyId: "c1" },
    update: {},
    create: {
      copyId: "c1",
      acquisitionDate: "2020-01-01",
      bookId: b1.bookId,
      libraryId: l1.libraryId,
    },
  });

  // MEMBER (ID fixe m1)
  const m1 = await prisma.member.upsert({
    where: { email: "aurore@example.com" },
    update: {},
    create: {
      memberId: "m1",
      lastName: "Millefeuille",
      firstName: "Aurore",
      address: "8 rue de la paix",
      postalCode: "29870",
      city: "Lannilis",
      email: "aurore@example.com",
      phone: "0700000000",
      active: true,
      libraryId: l1.libraryId,
    },
  });

  // LOAN (ID fixe lo1)
  await prisma.loan.upsert({
    where: { loanId: "lo1" },
    update: {},
    create: {
      loanId: "lo1",
      loanDate: "2024-10-01",
      dueDate: "2024-10-21",
      copyId: c1.copyId,
      memberId: m1.memberId,
    },
  });

  // RANG (ID fixe r1)
  const r1 = await prisma.rang.upsert({
    where: { rangId: "r1" },
    update: {},
    create: { rangId: "r1", rang: "Admin" },
  });

  // USER (ID fixe u1) — valeurs demandées
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      userId: "u1",
      lastName: "Admin",
      firstName: "Jean",
      address: "19 rue de la mairie",
      postalCode: "29870",
      city: "Lannilis",
      email: "admin@example.com",
      phone: "0612345678",
      passWord: "secret", // en clair pour le seed, à ne pas faire en prod
      rangId: r1.rangId,
    },
  });

  console.log("Prisma Seed done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });