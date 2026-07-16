// All demo project data lives here. The GraphQL client/service are kept for
// reference but are no longer used by the UI — swap this for a real API
// (ideally one with images) when ready.

export type ProjectSection = { label: string; body: string }
export type ProjectResult = { value: string; label: string }

export type Project = {
  id: string
  title: string
  category: string
  year: number
  accent: string
  tags: string[]
  image?: string
  excerpt: string
  sections: ProjectSection[]
  results: ProjectResult[]
}

const img = (seed: string) => `https://picsum.photos/seed/${seed}/1200/900`

const baseSections = (
  title: string,
  category: string,
  overview: string
): ProjectSection[] => [
  { label: "Overview", body: overview },
  {
    label: "Challenge",
    body: `${title} came to us with a fragmented ${category.toLowerCase()} presence — inconsistent across touchpoints and hard to scale. The brief: unify it into one confident system without slowing the team down.`,
  },
  {
    label: "Approach",
    body: "We ran a focused discovery sprint, set the visual and technical foundations, then designed and built in tight weekly loops — shipping real work stakeholders could react to instead of static decks.",
  },
  {
    label: "Outcome",
    body: "A fast, accessible, unmistakably premium experience the team can extend on their own — with metrics that moved in the right direction from launch.",
  },
]

export const projects: Project[] = [
  {
    id: "orbit",
    title: "Orbit Commerce",
    category: "E-Commerce",
    year: 2025,
    accent: "#06b6d4",
    tags: ["Web", "Design System", "Development"],
    image: img("orbit-commerce"),
    excerpt:
      "A headless storefront that turned a slow catalogue into a fast, editorial shopping experience.",
    sections: baseSections(
      "Orbit Commerce",
      "E-Commerce",
      "Orbit sells design-led homeware to a global audience. We rebuilt their storefront as a headless, edge-rendered experience that loads instantly and merchandises like a magazine."
    ),
    results: [
      { value: "+64%", label: "Conversion" },
      { value: "0.9s", label: "Largest paint" },
      { value: "8 wks", label: "To launch" },
    ],
  },
  {
    id: "halo",
    title: "Halo Health",
    category: "Product Design",
    year: 2024,
    accent: "#10b981",
    tags: ["UX", "Product", "Motion"],
    image: img("halo-health"),
    excerpt:
      "A calm, trustworthy patient app that makes managing care feel effortless.",
    sections: baseSections(
      "Halo Health",
      "Product Design",
      "Halo helps people manage chronic care from their phone. We designed a product language that stays calm under pressure and guides patients through anxious moments with clarity."
    ),
    results: [
      { value: "+120%", label: "Weekly active" },
      { value: "4.8★", label: "App rating" },
      { value: "10 wks", label: "To beta" },
    ],
  },
  {
    id: "vertex",
    title: "Vertex Studio",
    category: "Branding",
    year: 2025,
    accent: "#f59e0b",
    tags: ["Identity", "Art Direction", "Web"],
    image: img("vertex-studio"),
    excerpt:
      "A bold identity system for an architecture studio that builds the impossible.",
    sections: baseSections(
      "Vertex Studio",
      "Branding",
      "Vertex designs landmark buildings. Their brand needed the same ambition — a confident wordmark, a flexible grid, and a site that lets the work breathe."
    ),
    results: [
      { value: "3×", label: "Inbound leads" },
      { value: "12", label: "Awards" },
      { value: "6 wks", label: "To rollout" },
    ],
  },
  {
    id: "monogram",
    title: "Monogram",
    category: "Editorial",
    year: 2023,
    accent: "#8b5cf6",
    tags: ["Editorial", "Web", "Motion"],
    image: img("monogram-mag"),
    excerpt: "An online magazine where typography does the heavy lifting.",
    sections: baseSections(
      "Monogram",
      "Editorial",
      "Monogram is a culture publication for designers. We built a reading experience that treats type as the interface — fluid, fast, and unmistakably editorial."
    ),
    results: [
      { value: "+90%", label: "Read time" },
      { value: "250k", label: "Monthly reads" },
      { value: "7 wks", label: "To launch" },
    ],
  },
  {
    id: "flux",
    title: "Flux Labs",
    category: "Web Platform",
    year: 2024,
    accent: "#ec4899",
    tags: ["Web", "Development", "Motion"],
    image: img("flux-labs"),
    excerpt:
      "A developer platform site that makes complex infrastructure feel approachable.",
    sections: baseSections(
      "Flux Labs",
      "Web Platform",
      "Flux ships real-time infrastructure for engineers. We turned a dense technical story into an interactive site that demonstrates the product instead of just describing it."
    ),
    results: [
      { value: "+140%", label: "Signups" },
      { value: "1.2s", label: "Largest paint" },
      { value: "9 wks", label: "To launch" },
    ],
  },
  {
    id: "atlas",
    title: "Atlas Bank",
    category: "Campaign",
    year: 2025,
    accent: "#3b82f6",
    tags: ["Campaign", "Art Direction", "Web"],
    image: img("atlas-bank"),
    excerpt:
      "A launch campaign that repositioned a legacy bank for a new generation.",
    sections: baseSections(
      "Atlas Bank",
      "Campaign",
      "Atlas needed to feel modern without losing decades of trust. We built a campaign and microsite that balanced heritage with momentum — and gave the internal team a system to keep it going."
    ),
    results: [
      { value: "+230%", label: "Engagement" },
      { value: "18M", label: "Impressions" },
      { value: "5 wks", label: "To live" },
    ],
  },
]

// The Case Study section's featured project.
export const featuredProject: Project = {
  id: "nova",
  title: "Nova Finance",
  category: "Fintech · Rebrand",
  year: 2025,
  accent: "#8b5cf6",
  tags: ["Strategy", "Identity", "Web", "Product"],
  image: img("nova-finance"),
  excerpt:
    "We rebuilt Nova from the ground up — a new identity, a marketing site, and a product dashboard — unifying a fragmented experience into one confident, fast, and unmistakably premium platform.",
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
