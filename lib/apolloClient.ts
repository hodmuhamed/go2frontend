import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const uri =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ??
  "https://go2njemacka.de/graphql";

const link = new HttpLink({
  uri,
  fetch,
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;

