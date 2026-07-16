"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllProjects } from "@/services/project.service"

// Shared projects query. Both Projects variants call this, so TanStack Query
// dedupes it into a single request and cache entry.
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => getAllProjects(),
    staleTime: 60_000,
    retry: 2,
  })
}
