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

// Determine the GraphQL URL based on where the code is running:
//   - Server-side (Node.js SSR): use the full internal Docker URL
//     "http://nginx/graphql" — Node talks to Nginx inside the Docker network
//   - Client-side (browser): use "/graphql" — the browser adds the hostname
//     automatically, and Nginx routes it to PHP-FPM
//
// Why the difference? In a browser, "/graphql" becomes "http://localhost:8080/graphql".
// But in Node.js there's no browser — "/graphql" is just a path with no host.
// Node doesn't know where to send the request, so we must give it the full URL.
const GRAPHQL_URL =
  typeof window === "undefined"
    ? (process.env.VITE_GRAPHQL_URL || "http://nginx/graphql")
    : "/graphql";

// Create the urql client for use in React components (client-side).
// Uses "/graphql" since it always runs in the browser.
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
// Loaders run on the server during SSR, so we use fetch() with the
// full internal URL instead of the urql client.
export async function queryGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: variables ?? {} }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL HTTP Error: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors?.length) {
    throw new Error(`GraphQL Error: ${json.errors[0].message}`);
  }

  return json.data as T;
}
