"use client"

import { motion } from "framer-motion"
import { SectionHeading } from "./section-heading"

const services = [
  {
    n: "01",
    title: "Brand Strategy",
    desc: "Positioning, narrative, and identity systems that make ambitious brands impossible to ignore.",
  },
  {
    n: "02",
    title: "Web Design",
    desc: "Editorial, conversion-focused interfaces designed pixel by pixel for clarity and impact.",
  },
  {
    n: "03",
    title: "Development",
    desc: "Fast, accessible, production-grade builds in modern React, Next.js, and headless stacks.",
  },
  {
    n: "04",
    title: "Motion Design",
    desc: "Purposeful animation and interaction that give products life and guide the eye.",
  },
  {
    n: "05",
    title: "Art Direction",
    desc: "A cohesive visual language across every surface — from launch film to social.",
  },
]

export function Services() {
  return (
    <section id="services" className="mb-32">
      <SectionHeading label="Services" title="What we do" />

      <div className="border-t border-border">
        {services.map((service, i) => (
          <motion.div
            key={service.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
            className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-6 border-b border-border py-8 transition-colors hover:bg-muted/30 md:grid-cols-[5rem_1fr_1.1fr] md:gap-10"
          >
            <span className="font-mono text-sm text-muted-foreground">
              {service.n}
            </span>
            <h3 className="text-3xl font-black tracking-tighter uppercase transition-transform duration-300 group-hover:translate-x-2 md:text-5xl">
              {service.title}
            </h3>
            <p className="col-start-2 max-w-md text-sm leading-relaxed text-muted-foreground md:col-start-3 md:text-base">
              {service.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
