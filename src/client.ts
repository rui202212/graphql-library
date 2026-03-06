// src/client.ts
import { GraphQLClient, gql } from "graphql-request";

const ENDPOINT = process.env.GRAPHQL_URL ?? "http://localhost:4003/";
const client = new GraphQLClient(ENDPOINT);

const log = (msg: string) => console.log(`\nCLIENT: ${msg}`);

// ---- Queries ----
const Q_PING = gql`query { __typename }`;

const Q_BOOKS = gql`
  query GetBooks {
    books {
      bookId
      isbn
      title
      publishDate
      author { authorId firstName lastName }
      edition { editionId editionName }
      genre { genreId genre }
      type { typeId type }
    }
  }
`;

const Q_LOANS_BY_MEMBER = gql`
  query LoansByMember($email: String!) {
    loansByMember(email: $email) {
      loanId
      loanDate
      dueDate
      returnDate
      copy { copyId book { title isbn } library { libraryName } }
      member { memberId firstName lastName email }
    }
  }
`;

const Q_COPIES_BY_LIBRARY = gql`
  query CopiesByLibrary($libraryId: ID!) {
    copiesByLibrary(libraryId: $libraryId) {
      copyId
      acquisitionDate
      book { bookId title isbn }
      library { libraryId libraryName }
    }
  }
`;

// ---- Mutations ----
const M_CREATE_GENRE = gql`
  mutation CreateGenre($genre: String!) {
    createGenre(genre: $genre) { genreId genre }
  }
`;

const M_CREATE_TYPE = gql`
  mutation CreateType($type: String!) {
    createType(type: $type) { typeId type }
  }
`;

const M_CREATE_EDITION = gql`
  mutation CreateEdition($editionName: String!, $createDate: String!, $city: String!, $country: String!) {
    createEdition(editionName: $editionName, createDate: $createDate, city: $city, country: $country) {
      editionId
      editionName
      createDate
      city
      country
    }
  }
`;

const M_CREATE_AUTHOR = gql`
  mutation CreateAuthor($firstName: String!, $lastName: String!, $country: String, $birthDate: String, $deathDate: String) {
    createAuthor(firstName: $firstName, lastName: $lastName, country: $country, birthDate: $birthDate, deathDate: $deathDate) {
      authorId
      firstName
      lastName
    }
  }
`;

const M_CREATE_BOOK = gql`
  mutation CreateBook(
    $isbn: String!, $title: String!, $publishDate: String!,
    $authorId: ID!, $editionId: ID!, $genreId: ID!, $typeId: ID!
  ) {
    createBook(
      isbn: $isbn, title: $title, publishDate: $publishDate,
      authorId: $authorId, editionId: $editionId, genreId: $genreId, typeId: $typeId
    ) {
      bookId
      isbn
      title
      publishDate
      author { authorId firstName lastName }
      edition { editionId editionName }
      genre { genreId genre }
      type { typeId type }
    }
  }
`;

const M_CREATE_LIBRARY = gql`
  mutation CreateLibrary($libraryName: String!, $createDate: String!, $location: String!, $city: String!, $nature: String!) {
    createLibrary(libraryName: $libraryName, createDate: $createDate, location: $location, city: $city, nature: $nature) {
      libraryId
      libraryName
      city
      nature
    }
  }
`;

const M_CREATE_MEMBER = gql`
  mutation CreateMember(
    $lastName: String!, $firstName: String!, $address: String!, $postalCode: String!,
    $city: String!, $email: String!, $phone: String!, $passWord: String!, $libraryId: ID!
  ) {
    createMember(
      lastName: $lastName, firstName: $firstName, address: $address, postalCode: $postalCode,
      city: $city, email: $email, phone: $phone, passWord: $passWord, libraryId: $libraryId
    ) {
      memberId
      firstName
      lastName
      email
      active
      library { libraryId libraryName }
    }
  }
`;

const M_CREATE_COPY = gql`
  mutation CreateCopy($bookId: ID!, $libraryId: ID!, $acquisitionDate: String!) {
    createCopy(bookId: $bookId, libraryId: $libraryId, acquisitionDate: $acquisitionDate) {
      copyId
      acquisitionDate
      book { bookId title isbn }
      library { libraryId libraryName }
    }
  }
`;

const M_CREATE_LOAN = gql`
  mutation CreateLoan($copyId: ID!, $memberId: ID!, $loanDate: String!, $dueDate: String!) {
    createLoan(copyId: $copyId, memberId: $memberId, loanDate: $loanDate, dueDate: $dueDate) {
      loanId
      loanDate
      dueDate
      returnDate
      member { memberId email }
      copy { copyId }
    }
  }
`;

const M_RETURN_LOAN = gql`
  mutation ReturnLoan($loanId: ID!, $returnDate: String!) {
    returnLoan(loanId: $loanId, returnDate: $returnDate) {
      loanId
      loanDate
      dueDate
      returnDate
      member { memberId email }
      copy { copyId }
    }
  }
`;

// Helpers dates
const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

async function main() {
  try {
    log("Vérifier si l'API répond");
    console.log(await client.request(Q_PING));

    // 1) Référentiels
    log("Créer Genre / Type / Edition / Author");
    const { createGenre } = await client.request(M_CREATE_GENRE, { genre: "Histoire" });
    const { createType } = await client.request(M_CREATE_TYPE, { type: "Documentaire" });
    const { createEdition } = await client.request(M_CREATE_EDITION, {
      editionName: "Folio",
      createDate: "2020-01-01",
      city: "Paris",
      country: "FR",
    });
    const { createAuthor } = await client.request(M_CREATE_AUTHOR, {
      firstName: "Jean",
      lastName: "Dupont",
      country: "FR",
      birthDate: "1975-05-20",
      deathDate: null,
    });

    // 2) Livre
    log("Créer Book");
    const isbn = `9782070${Math.floor(100000 + Math.random() * 899999)}`;
    const { createBook } = await client.request(M_CREATE_BOOK, {
      isbn,
      title: "Le Mystère de la Bibliothèque",
      publishDate: "2021-03-01",
      authorId: createAuthor.authorId,
      editionId: createEdition.editionId,
      genreId: createGenre.genreId,
      typeId: createType.typeId,
    });

    // 3) Bibliothèque
    log("Créer Library");
    const { createLibrary } = await client.request(M_CREATE_LIBRARY, {
      libraryName: "Bibliothèque de la rue",
      createDate: today(),
      location: "10 rue des Livres",
      city: "Lannilis",
      nature: "Municipale",
    });

    // 4) Membre
    log("Inscrire un Member rattaché à la bibliothèque (avec passWord)");
    const email = `jane.doe+${Date.now()}@example.com`;
    const { createMember } = await client.request(M_CREATE_MEMBER, {
      lastName: "Doe",
      firstName: "Jane",
      address: "1 rue de la Paix",
      postalCode: "29870",
      city: "Lannilis",
      email,
      phone: "0600000000",
      passWord: "secret",
      libraryId: createLibrary.libraryId,
    });

    // 5) Exemplaire
    log("Ajouter un Copy du livre dans la bibliothèque");
    const { createCopy } = await client.request(M_CREATE_COPY, {
      bookId: createBook.bookId,
      libraryId: createLibrary.libraryId,
      acquisitionDate: today(),
    });

    // 6) Emprunt
    log("Créer un Loan (emprunt)");
    const { createLoan } = await client.request(M_CREATE_LOAN, {
      copyId: createCopy.copyId,
      memberId: createMember.memberId,
      loanDate: today(),
      dueDate: plusDays(14),
    });

    // 7) Vérifs
    log("Lister les Books");
    console.dir(await client.request(Q_BOOKS), { depth: null });

    log("Lister les Loans du membre (par email)");
    console.dir(await client.request(Q_LOANS_BY_MEMBER, { email }), { depth: null });

    log("Lister les Copies de la bibliothèque");
    console.dir(await client.request(Q_COPIES_BY_LIBRARY, { libraryId: createLibrary.libraryId }), { depth: null });

    // 8) Retour
    log("Retour du livre (returnLoan)");
    console.dir(await client.request(M_RETURN_LOAN, {
      loanId: createLoan.loanId,
      returnDate: plusDays(7),
    }), { depth: null });

    console.log("\nCLIENT-Scénario terminé avec succès.");
  } catch (err: any) {
    console.error("CLIENT: Erreur client:", err?.response?.errors ?? err);
    process.exit(1);
  }
}

main();