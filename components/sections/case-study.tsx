"use client"

import { motion } from "framer-motion"
import { featuredCaseStudy } from "@/lib/case-study"
import { useProjectDrawer } from "@/components/project-drawer"
import { SectionHeading } from "./section-heading"

const meta = [
  { label: "Client", value: "Nova Finance" },
  { label: "Year", value: "2025" },
  { label: "Role", value: "Design & Build" },
  { label: "Scope", value: "Brand · Web · Product" },
]

const results = [
  { value: "+240%", label: "Signup conversion" },
  { value: "1.8s", label: "Largest paint" },
  { value: "12 wks", label: "Concept to launch" },
]

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
}

export function CaseStudy() {
  const { open } = useProjectDrawer()

  return (
    <section id="case-study" className="mb-32">
      <SectionHeading label="Featured" title="Case study" />

      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        {/* Visual */}
        <motion.button
          {...reveal}
          type="button"
          onClick={() => open(featuredCaseStudy)}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="group relative flex aspect-4/5 flex-col justify-between overflow-hidden rounded-3xl border border-border bg-linear-to-br from-muted to-background p-8 text-left transition-colors hover:border-foreground"
        >
          <span className="text-sm tracking-widest text-muted-foreground uppercase">
            Fintech · Rebrand
          </span>
          <div>
            <span className="block text-[7rem] leading-none font-black tracking-tighter text-transparent [-webkit-text-stroke:2px_var(--muted-foreground)]">
              01
            </span>
            <h3 className="mt-4 text-4xl font-black tracking-tighter uppercase md:text-5xl">
              Nova Finance
            </h3>
          </div>
        </motion.button>

        {/* Details */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <div className="grid grid-cols-2 gap-6 border-b border-border pb-8">
            {meta.map((item) => (
              <div key={item.label}>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  {item.label}
                </p>
                <p className="mt-1 font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            We rebuilt Nova from the ground up — a new identity, a marketing
            site, and a product dashboard — unifying a fragmented experience
            into one confident, fast, and unmistakably premium platform.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {results.map((result) => (
              <div key={result.label}>
                <p className="text-3xl font-black tracking-tighter md:text-4xl">
                  {result.value}
                </p>
                <p className="mt-2 text-xs tracking-widest text-muted-foreground uppercase">
                  {result.label}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => open(featuredCaseStudy)}
            className="group mt-10 inline-flex w-fit items-center gap-3 text-sm tracking-widest uppercase transition-colors hover:text-primary"
          >
            Read the full case study
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
