import { GraphQLClient } from "graphql-request"

// Single configured GraphQL client, reused by every service. The endpoint comes
// from the environment (see `.env.example`) rather than being hardcoded.
const endpoint = process.env.NEXT_PUBLIC_API_URL

if (!endpoint) {
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable")
}

export const graphqlClient = new GraphQLClient(endpoint)
