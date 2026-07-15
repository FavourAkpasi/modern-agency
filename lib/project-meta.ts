import type { Project } from "@/types/project"

// The demo API only returns id/title/body, so we deterministically synthesize
// case-study-style metadata (category, year, tags, accent) from the project id.
// It's fabricated for the demo, but stable per project across renders.

const categories = [
  "Branding",
  "Web Platform",
  "E-Commerce",
  "Product Design",
  "Campaign",
  "Editorial",
]

const accents = ["#f59e0b", "#8b5cf6", "#06b6d4", "#10b981", "#ec4899", "#3b82f6"]

const tagPool = [
  "Strategy",
  "Identity",
  "Web",
  "Motion",
  "Art Direction",
  "Development",
  "UX",
  "Design System",
]

export type ProjectMeta = {
  category: string
  year: number
  tags: string[]
  accent: string
  image?: string
}

export function deriveMeta(project: Project, index: number): ProjectMeta {
  const seed = Number(project.id) || index + 1
  return {
    category: categories[seed % categories.length],
    year: 2025 - (seed % 5),
    tags: [tagPool[seed % tagPool.length], tagPool[(seed + 3) % tagPool.length]],
    accent: accents[seed % accents.length],
    // Demo: only the first two projects carry an image so you can compare the
    // image treatment against the type/gradient fallback. Real data would set
    // this per project.
    image:
      index < 8
        ? `https://picsum.photos/seed/${project.id}-agency/1200/900`
        : undefined,
  }
}

// Trim the API's lorem titles to a punchy few words.
export function shortTitle(title: string, words = 3): string {
  return title.split(" ").slice(0, words).join(" ")
}
