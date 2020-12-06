// Using Promises without this module might cause file descriptor and memory leaks: https://github.com/mcollina/make-promises-safe
import 'make-promises-safe';
//import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from "apollo-server";
import express from 'express';
import 'reflect-metadata';
import { resolvers } from "./resolver";

async function bootstrap() {
  // ... Building schema here
  const schema = await buildSchema({ resolvers, validate: false });

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    playground: true,
  });

  // Start the server
  const { url } = await server.listen(7000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();


/**
class Measure {
  country: string;

  constructor(country: string) {
    this.country = country;
  }

  gdp() {
    return 5;
  }

  population() {
    return 6;
  }

}

var schema = buildSchema(`

  type Measure {
    gdp: Int
    population: Int
  }

  type Query {
    measures(countries: [String]): [Measure]
  }
`);
*/

// The root provides a resolver function for each API endpoint
/**
var root = {
  measures: (args) => {
    const measures = args.countries.map(c => new Measure(c));
    return measures;
  },
};
*/
const app = express();
const PORT = 8000;

app.use('/', express.static('dist'));

/**
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/api', async (req, res, next) => {
  const query = req.query.countries;
  try {
    //validate the query
    if (query == undefined || query == '') throw new Error('missing param "countries"');
    const countryCodes = query.split(";");
    const json = await Controller.getValues(countryCodes);
    res.send(json);
  }
  catch(e) {
    next(e);
  }
});
*/
app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send({error : err.message});
});
