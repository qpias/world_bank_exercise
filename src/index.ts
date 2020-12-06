// Using Promises without this module might cause file descriptor and memory leaks: https://github.com/mcollina/make-promises-safe
import 'make-promises-safe';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from "apollo-server";
import express from 'express';
//type-graphql uses reflection magick to infer the graphql schema from class definitions
import 'reflect-metadata';
import { resolvers } from "./resolver";

//first the apollo graphql server
async function bootstrap() {
  // ... Building schema here
  const schema = await buildSchema({ resolvers, validate: false });

  //create the server
  const server = new ApolloServer({
    schema,
    playground: true,
  });

  // Start the server
  const { url } = await server.listen(7000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();

//and now the express server to serve the UI
const app = express();
const PORT = 8000;

app.use('/', express.static('dist'));

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
