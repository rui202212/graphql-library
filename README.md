# Projet pédagogique — *graphql-library*

> **API GraphQL** pour la gestion de bibliothèques, basée sur **Apollo Server**, **Prisma**, et **MySQL/MariaDB**, avec un environnement **DevContainer** reproductible.

### Sommaire

*   \#aperçu
*   \#stack-technique
*   \#architecture--organisation
*   \#pré-requis
*   \#mise-en-route-rapide
*   \#configuration
*   \#base-de-données--prisma
*   \#lancer-le-serveur
*   \#tester-avec-le-client
*   \#fonctionnalités-graphql
*   \#pourquoi-apollo-server-
*   \#persistance-des-données-volumes-docker
*   \#dépannage
*   \#licence

---  

## Aperçu

**graphql-library** implémente un **schéma GraphQL** pour gérer une bibliothèque :

*   **Référentiels** : `Genre`, `Type`, `Edition`, `Author`
*   **Catalogue** : `Book`
*   **Ressources** : `Library`, `Copy` (exemplaires)
*   **Usagers** : `Member`, `User` (avec `Rang`)
*   **Circulation** : `Loan` (emprunt / retour)


Le projet inclut :

*   un **schéma GraphQL** (`src/schema.graphql`)
*   des **résolveurs** par domaine (`src/resolvers/*.resolvers.ts`)
*   un **client TypeScript** (`src/client.ts`) qui **simule un scénario réel** (inscription d’un membre, création d’un livre, ajout d’un exemplaire, emprunt, retour, requêtes de contrôle)
*   une **intégration Prisma** (MariaDB/MySQL) + **migrations** + **seed**
*   un **DevContainer VS Code** + **Docker Compose** pour un environnement reproductible


## Stack technique

*   **Node.js** + **TypeScript**
*   **Apollo Server 5** (standalone)
*   **GraphQL 16**
*   **Prisma ORM 5**
*   **MariaDB 11.x** (ou MySQL)
*   **VS Code Dev Containers** + **Docker Compose**
*   (Optionnel) **mise** pour gérer les versions d’outils


## Architecture & organisation

    / (racine)
      .devcontainer/
        devcontainer.json
        scripts/
          postStartCommand.sh      # setup automatisé: deps, prisma generate/migrate/seed
      prisma/
        migrations/                # migrations Prisma
        schema.prisma              # modèle de données
        seed.ts                    # jeu de données initial
      src/
        resolvers/
          author.resolvers.ts
          book.resolvers.ts
          copy.resolvers.ts
          edition.resolvers.ts
          genre.resolvers.ts
          library.resolvers.ts
          loan.resolvers.ts
          member.resolvers.ts
          type.resolvers.ts
          index.ts                 # agrégation des resolvers
        schema.graphql             # schéma GraphQL (SDL)
        schema.ts                  # build du schema exécutable
        context.ts                 # injection de PrismaClient dans le contexte
        server.apollo.ts           # serveur Apollo standalone
        client.ts                  # client de test end-to-end
        types.ts                   # types utilitaires (Context, Resolver, etc.)
      .env                         # URLs base de données (dev)
      docker-compose.yml           # services app + db (+ shadow-init)
      package.json
      tsconfig.json
      README.md


## Pré-requis

*   **Docker** + **Docker Compose**
*   **VS Code** + extension **Dev Containers**
*   Accès réseau local aux ports **4003** (GraphQL) et **3307** (DB exposée)


## Mise en route rapide

1.  **Ouvre le dossier** dans VS Code.
2.  **Reopen in Container** (Dev Containers)  
    *ou depuis l'hôte* :
    ```bash
    docker compose up -d --build
    ```
3.  Le script **postStart** va :
    *   installer les dépendances
    *   attendre MariaDB
    *   **créer la base shadow** si absente
    *   `prisma generate` / `prisma migrate dev` / `prisma db seed`


## Configuration

**.env** (dev) — à la racine :

```env
# Prisma (MariaDB en conteneur "db")
DATABASE_URL="mysql://app:app@db:3306/library"
SHADOW_DATABASE_URL="mysql://root:root@db:3306/library_shadow"

# Optionnel: URL du serveur GraphQL pour le client
# GRAPHQL_URL="http://localhost:4003/"
```

> **Note** : `GRAPHQL_URL` est **optionnelle**. Le client utilise par défaut `http://localhost:4003/`, via :  
> `process.env.GRAPHQL_URL ?? "http://localhost:4003/"`


## Base de données & Prisma

*   Modèle : `prisma/schema.prisma`
*   Migrations : `prisma/migrations/*`
*   Seed : `prisma/seed.ts` (création d’IDs fixes g1/g2/g3, etc. + échantillons)

**Commandes utiles dans le DevContainer :**

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations (dev)
npx prisma migrate dev

# Lancer le seed
npm run db:seed
```

**Shadow DB** (pour Migrate) :

*   Configurée via `SHADOW_DATABASE_URL`.
*   Est **créée automatiquement** au démarrage (service d’init).
*   Idempotent : si elle existe, rien n’est cassé.


## Lancer le serveur

```bash
npm run lib:apollo
# -> GraphQL "Gestion Bibliothèques" ready at: http://localhost:4003/
```

**Test rapide** :

```bash
curl -s -X POST http://localhost:4003/ \
  -H 'content-type: application/json' \
  --data '{"query":"query { __typename }"}'
```


## Tester avec le client

Le **client TypeScript** (`src/client.ts`) simule un **parcours réel** :

1.  Crée les **référentiels** : `Genre`, `Type`, `Edition`, `Author`
2.  Crée un **Book** (référence les IDs créés)
3.  Crée une **Library**
4.  Inscrit un **Member** (le SDL exige `passWord` → stocké côté `User` en vrai)
5.  Ajoute un **Copy** (exemplaire) du livre dans la bibliothèque
6.  Crée un **Loan** (emprunt)
7.  Requêtes de contrôle : `books`, `loansByMember(email)`, `copiesByLibrary(libraryId)`
8.  **Retour** du livre avec `returnLoan`

**Lancer** :

```bash
npm run lib:client
# ou pour une URL différente
GRAPHQL_URL=http://localhost:4003/ npm run lib:client
```

**Logs attendus** (extrait) :

    CLIENT: Vérifier si l'API répond
    { __typename: 'Query' }

    CLIENT: Créer Genre / Type / Edition / Author
    CLIENT: Créer Book
    CLIENT: Créer Library
    CLIENT: Inscrire un Member rattaché à la bibliothèque (avec passWord)
    CLIENT: Ajouter un Copy du livre dans la bibliothèque
    CLIENT: Créer un Loan (emprunt)
    CLIENT: Lister les Books
    { books: [...] }
    CLIENT: Lister les Loans du membre (par email)
    { loansByMember: [...] }
    CLIENT: Lister les Copies de la bibliothèque
    { copiesByLibrary: [...] }
    CLIENT: Retour du livre (returnLoan)
    { returnLoan: { ... } }

    CLIENT: OK Scénario terminé avec succès.


## Fonctionnalités GraphQL

### Exemples de Queries

*   `books`, `book(bookId)`, `bookByIsbn(isbn)`, `booksByTitle(title)`, `booksByAuthor(authorId)`, `booksByGenre(genreId)`
*   `libraries`, `library(libraryId)`, `librariesByCity(city)`
*   `members`, `member(memberId)`, `memberByEmail(email)`, `membersByLibrary(libraryId)`, `activeMembers`
*   `copies`, `copiesByBook(bookId)`, `copiesByLibrary(libraryId)`, `isCopyAvailable(copyId)`
*   `loans`, `loan(loanId)`, `loansByMember(email)`, `activeLoans`
*   `authors`, `authorsByCountry(country)`
*   `genres`, `types`, `rangs`, `editions`

### Exemples de Mutations

*   **Catalogue** : `createBook`, `updateBook`, `deleteBook`
*   **Circulation** : `createLoan`, `returnLoan`
*   **Référentiels** : `createEdition`, `updateEdition`, `createGenre`, `updateGenre`, `createType`, `updateType`, `createAuthor`, `updateAuthor`
*   **Usagers** : `createMember`, `updateMember`, `deleteMember`
*   **Infrastructures** : `createLibrary`, `updateLibrary`


## Pourquoi Apollo Server ?

*   **Simplicité** : serveur standalone (`@apollo/server/standalone`) très rapide à mettre en place
*   **Écosystème riche** : outils, plugins, tooling GraphQL matures
*   **Typage** : intégration facile avec TypeScript et codegen
*   **Observabilité** : extensions et formats d’erreurs bien pensés
*   **Pédagogie** : clair pour introduire **SDL → resolvers → contexte → exécution**


## Persistance des données (volumes Docker)

*   Le service `db` monte un **volume nommé** (ex. `db-data`).
*   `docker compose down` **n’efface pas** le volume → **les données restent**.
*   `docker compose down -v` **efface** aussi les volumes → **DB réinitialisée**.
*   Le **seed** est **rejouable** s’il utilise des `upsert`; sinon, il faut le prendre en compte (doublons).


## Dépannage

*   **Erreur Prisma `P1003: shadow DB does not exist`**  
    → La base `library_shadow` doit exister. Le projet la **crée automatiquement** (service d’init / postStart).  
    → Déjà intégré dans docker-compose `shadowdb-init`; à la main si besoin : se connecter sur `db` et `CREATE DATABASE library_shadow;`.

*   **DevContainer ne se relance pas**  
    → Vérifier `.devcontainer/devcontainer.json` → `dockerComposeFile` pointe bien sur `../docker-compose.yml` si `docker-compose.yml` est à la racine.  
    → Commande : **Dev Containers: Rebuild and Reopen in Container**.

*   **Port déjà occupé**  
    → Adapter `4003` (GraphQL) et `3307` (exposition DB) dans `docker-compose.yml`.


## Licence

Usage pédagogique.