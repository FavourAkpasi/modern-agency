import { gql } from "graphql-request"

// GraphQL query documents ("order tickets") for the projects domain. Each one
// only declares WHAT data to request — executing it is the service's job.

export const GET_PROJECTS = gql`
  query GetProjects($limit: Int = 6) {
    posts(options: { paginate: { limit: $limit } }) {
      data {
        id
        title
        body
      }
    }
  }
`

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    post(id: $id) {
      id
      title
      body
    }
  }
`
