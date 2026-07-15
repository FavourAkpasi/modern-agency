import type { Project } from "@/types/project"
import { deriveMeta, shortTitle } from "./project-meta"

export type CaseStudySection = { label: string; body: string }
export type CaseStudyResult = { value: string; label: string }

// Unified shape the project drawer renders — built from either a fetched
// project or the hand-authored featured case study.
export type CaseStudyData = {
  title: string
  category: string
  year: number | string
  accent: string
  tags: string[]
  image?: string
  sections: CaseStudySection[]
  results: CaseStudyResult[]
}

// Expand a fetched project into a long-form case study. Overview uses the real
// body; the rest is templated for the demo (deterministic per project).
export function caseStudyFromProject(
  project: Project,
  index: number
): CaseStudyData {
  const meta = deriveMeta(project, index)
  const title = shortTitle(project.title, 5)

  return {
    title,
    category: meta.category,
    year: meta.year,
    accent: meta.accent,
    tags: meta.tags,
    image: meta.image,
    sections: [
      { label: "Overview", body: project.body },
      {
        label: "Challenge",
        body: `${title} came to us with a fragmented ${meta.category.toLowerCase()} presence — inconsistent across touchpoints and hard to scale. The brief: unify it into one confident system without slowing the team down.`,
      },
      {
        label: "Approach",
        body: "We ran a focused discovery sprint, set the visual and technical foundations, then designed and built in tight weekly loops — shipping real work stakeholders could react to instead of static decks.",
      },
      {
        label: "Outcome",
        body: "A fast, accessible, unmistakably premium experience the team can extend on their own — with metrics that moved in the right direction from launch.",
      },
    ],
    results: [
      { value: `+${(index + 2) * 40}%`, label: "Engagement" },
      { value: `${(index % 3) + 1}.${index % 9}s`, label: "Load time" },
      { value: `${(index % 6) + 6} wks`, label: "To launch" },
    ],
  }
}

// The Case Study section's featured project.
export const featuredCaseStudy: CaseStudyData = {
  title: "Nova Finance",
  category: "Fintech · Rebrand",
  year: 2025,
  accent: "#8b5cf6",
  tags: ["Strategy", "Identity", "Web", "Product"],
  image: "https://picsum.photos/seed/nova-finance/1600/1000",
  sections: [
    {
      label: "Overview",
      body: "Nova Finance is a next-generation money app for a generation that expects software to feel effortless. We partnered end-to-end — brand, marketing site, and product dashboard — to make a fragmented experience feel like one confident platform.",
    },
    {
      label: "Challenge",
      body: "Rapid growth had left Nova with three disconnected design languages and a marketing site that couldn't keep up. Trust was leaking at exactly the moments that mattered most: onboarding and first deposit.",
    },
    {
      label: "Approach",
      body: "We rebuilt from first principles — a new identity system, a component library shared across web and product, and a conversion-focused site. Everything shipped in weekly increments the Nova team could pressure-test with real users.",
    },
    {
      label: "Outcome",
      body: "A cohesive, premium platform that reads as trustworthy at a glance and scales without us. Signups climbed, load times dropped, and the team now ships new surfaces on the system by themselves.",
    },
  ],
  results: [
    { value: "+240%", label: "Signup conversion" },
    { value: "1.8s", label: "Largest paint" },
    { value: "12 wks", label: "Concept to launch" },
  ],
}
