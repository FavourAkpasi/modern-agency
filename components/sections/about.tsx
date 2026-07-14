"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "./section-heading"

const values = [
  {
    title: "Craft",
    desc: "We sweat the details others skip — the easing curve, the empty state, the last 5%.",
  },
  {
    title: "Candor",
    desc: "Direct, senior collaborators. No account-manager telephone, no hidden roadmaps.",
  },
  {
    title: "Momentum",
    desc: "Small teams, short loops, real work shipping every week — never a black box.",
  },
  {
    title: "Ownership",
    desc: "We treat your product like ours: outcomes over deliverables, always.",
  },
]

const facts = [
  { value: "2020", label: "Founded" },
  { value: "14", label: "People" },
  { value: "3", label: "Continents" },
]

export function About() {
  return (
    <section id="about" className="mb-32">
      <SectionHeading label="About" title="Who we are" />

      <div className="grid gap-16 md:grid-cols-[1.4fr_1fr]">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-3xl leading-[1.15] font-bold tracking-tight md:text-5xl"
        >
          We&apos;re a compact studio of designers and engineers who believe
          great digital work lives where{" "}
          <span className="text-primary">craft</span> meets{" "}
          <span className="text-primary">commerce</span> — building brands and
          products that feel inevitable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="flex items-center"
        >
          <div className="grid w-full grid-cols-3 gap-6">
            {facts.map((fact) => (
              <div key={fact.label}>
                <p className="text-4xl font-black tracking-tighter md:text-5xl">
                  {fact.value}
                </p>
                <p className="mt-2 text-xs tracking-widest text-muted-foreground uppercase">
                  {fact.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value, i) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="flex flex-col gap-3 bg-background p-8"
          >
            <span className="text-lg font-black tracking-tighter uppercase">
              {value.title}
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {value.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
