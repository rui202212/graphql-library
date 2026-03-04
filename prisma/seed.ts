// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("  Seeding...");

  const [fantasy, scifi, policier] = await Promise.all([
    prisma.genre.upsert({
      where: { genreId: "g1" },
      update: {},
      create: { genreId: "g1", genre: "Fantasy" },
    }),
    prisma.genre.upsert({
      where: { genreId: "g2" },
      update: {},
      create: { genreId: "g2", genre: "Science-Fiction" },
    }),
    prisma.genre.upsert({
      where: { genreId: "g3" },
      update: {},
      create: { genreId: "g3", genre: "Policier" },
    }),
  ]);

  const [roman, essai] = await Promise.all([
    prisma.type.upsert({
      where: { typeId: "t1" },
      update: {},
      create: { typeId: "t1", type: "Roman" },
    }),
    prisma.type.upsert({
      where: { typeId: "t2" },
      update: {},
      create: { typeId: "t2", type: "Essai" },
    }),
  ]);

  const edition = await prisma.edition.upsert({
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

  const [aRowling, aHerbert, aChristie] = await Promise.all([
    prisma.author.upsert({
      where: { authorId: "a1" },
      update: {},
      create: { authorId: "a1", firstName: "J.K.", lastName: "Rowling", country: "UK" },
    }),
    prisma.author.upsert({
      where: { authorId: "a2" },
      update: {},
      create: { authorId: "a2", firstName: "Frank", lastName: "Herbert", country: "USA" },
    }),
    prisma.author.upsert({
      where: { authorId: "a3" },
      update: {},
      create: { authorId: "a3", firstName: "Agatha", lastName: "Christie", country: "UK" },
    }),
  ]);

  const lib = await prisma.library.upsert({
    where: { libraryId: "l1" },
    update: {},
    create: {
      libraryId: "l1",
      libraryName: "Bibliothèque Centrale",
      createDate: "2000-01-01",
      location: "1 rue des livres",
      city: "Lannilis",
      nature: "Municipale",
    },
  });

  const hp = await prisma.book.upsert({
    where: { isbn: "9782070643028" },
    update: {},
    create: {
      bookId: "b1",
      isbn: "9782070643028",
      title: "Harry Potter à l'école des sorciers",
      publishDate: "1997-06-26",
      authorId: aRowling.authorId,
      editionId: edition.editionId,
      genreId: fantasy.genreId,
      typeId: roman.typeId
    }
  });

  const dune = await prisma.book.upsert({
    where: { isbn: "9782070368228" },
    update: {},
    create: {
      bookId: "b2",
      isbn: "9782070368228",
      title: "Dune",
      publishDate: "1965-08-01",
      authorId: aHerbert.authorId,
      editionId: edition.editionId,
      genreId: scifi.genreId,
      typeId: roman.typeId
    }
  });

  const orient = await prisma.book.upsert({
    where: { isbn: "9782253004223" },
    update: {},
    create: {
      bookId: "b3",
      isbn: "9782253004223",
      title: "Le Crime de l'Orient-Express",
      publishDate: "1934-01-01",
      authorId: aChristie.authorId,
      editionId: edition.editionId,
      genreId: policier.genreId,
      typeId: roman.typeId
    }
  });

  const c1 = await prisma.copy.upsert({
    where: { copyId: "c1" },
    update: {},
    create: {
      copyId: "c1",
      acquisitionDate: "2020-01-01",
      bookId: hp.bookId,
      libraryId: lib.libraryId
    }
  });

  const m1 = await prisma.member.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      memberId: "m1",
      lastName: "Durand",
      firstName: "Alice",
      address: "2 rue de la paix",
      postalCode: "29870",
      city: "Lannilis",
      email: "alice@example.com",
      phone: "0600000000",
      active: true,
      libraryId: lib.libraryId
    }
  });

  await prisma.loan.upsert({
    where: { loanId: "lo1" },
    update: {},
    create: {
      loanId: "lo1",
      loanDate: "2024-10-01",
      dueDate: "2024-10-21",
      copyId: c1.copyId,
      memberId: m1.memberId
    }
  });

  const rAdmin = await prisma.rang.upsert({
    where: { rangId: "r1" },
    update: {},
    create: { rangId: "r1", rang: "Admin" }
  });

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      userId: "u1",
      lastName: "Admin",
      firstName: "Kevin",
      address: "3 place de l'hôtel de ville",
      postalCode: "29870",
      city: "Lannilis",
      email: "admin@example.com",
      phone: "0612345678",
      passWord: "secret",
      rangId: rAdmin.rangId
    }
  });

  console.log("  Seed done.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});