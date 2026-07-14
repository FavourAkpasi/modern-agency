// Shape of a project as returned by the GraphQL API. Shared across the service
// layer and the UI components.
export type Project = {
  id: string
  title: string
  body: string
}
