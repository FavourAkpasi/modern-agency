import { graphqlClient } from "@/lib/graphql/client"
import { GET_PROJECT, GET_PROJECTS } from "@/lib/graphql/queries/projects"
import type { Project } from "@/types/project"

// Projects API. Components call these functions (usually via TanStack Query) and
// never touch the GraphQL client or query documents directly.

export async function getAllProjects(limit = 6): Promise<Project[]> {
  const data = await graphqlClient.request<{ posts: { data: Project[] } }>(
    GET_PROJECTS,
    { limit }
  )
  return data.posts.data
}

export async function getProject(id: string): Promise<Project> {
  const data = await graphqlClient.request<{ post: Project }>(GET_PROJECT, {
    id,
  })
  return data.post
}
