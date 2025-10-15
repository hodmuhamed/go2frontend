import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const link = new HttpLink({
  uri: "https://muhamed.dev/graphql", // 🔗 tvoj GraphQL endpoint
  fetch,
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;

