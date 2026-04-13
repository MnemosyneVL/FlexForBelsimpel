// GraphQL client using urql.
//
// urql is a lightweight GraphQL client (~5KB gzipped vs Apollo's ~30KB).
// It handles sending queries to our Laravel backend and caching results.
//
// We chose urql over Apollo because:
//   1. Smaller bundle size — important for page load speed
//   2. Simpler API — less boilerplate for the same functionality
//   3. Built-in normalized caching via the cacheExchange

import { createClient, cacheExchange, fetchExchange } from "urql";

// Create the urql client.
// The URL "/graphql" is relative — in development, Vite's proxy forwards it
// to the Laravel backend. In production, Nginx handles the routing.
export const graphqlClient = createClient({
  url: "/graphql",
  exchanges: [
    // cacheExchange: stores query results in memory so repeated queries
    // don't hit the server again. Automatically invalidates on mutations.
    cacheExchange,
    // fetchExchange: actually sends HTTP requests to the GraphQL endpoint
    fetchExchange,
  ],
});

// Helper function to execute a GraphQL query from route loaders.
// Loaders run on the server during SSR, so we need a direct fetch approach
// rather than React hooks (which only work in components).
export async function queryGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const result = await graphqlClient.query(query, variables ?? {}).toPromise();

  if (result.error) {
    throw new Error(`GraphQL Error: ${result.error.message}`);
  }

  return result.data as T;
}
