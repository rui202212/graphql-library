import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema";
import { createContext } from "./context";

async function start() {
  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4003 },
    context: async () => createContext(),
  });

  console.log(`GraphQL "Gestion Bibliothèques" ready at: ${url}`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});