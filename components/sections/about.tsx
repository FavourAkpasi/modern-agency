"use client"

import { useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
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
  { value: 2020, label: "Founded", count: false },
  { value: 14, label: "People", count: true },
  { value: 3, label: "Continents", count: true },
]

// Splits a chunk of the manifesto into per-word spans the scroll timeline can
// brighten one at a time.
function RevealWords({ text }: { text: string }) {
  return (
    <>
      {text
        .trim()
        .split(/\s+/)
        .map((word, i) => (
          <span key={i} className="reveal-word">
            {word}{" "}
          </span>
        ))}
    </>
  )
}

function StatNumber({ value, count }: { value: number; count: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!count) {
      el.textContent = String(value)
      return
    }
    if (!inView) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(value)
      return
    }
    const counter = { v: 0 }
    const tween = gsap.to(counter, {
      v: value,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = String(Math.round(counter.v))
      },
    })
    return () => {
      tween.kill()
    }
  }, [inView, count, value])

  return <span ref={ref}>{count ? 0 : value}</span>
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        // Brighten the manifesto word-by-word, scrubbed to scroll position —
        // over a range that spans the paragraph's travel through the viewport.
        gsap.fromTo(
          ".reveal-word",
          { opacity: 0.3 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.4,
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 80%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        )
      })
    }, sectionRef)

    // Content above (e.g. the async Projects sections) grows after fetch and
    // pushes this section down, invalidating the trigger's cached positions.
    // Recompute them whenever the page height changes.
    let raf = 0
    const ro = new ResizeObserver(() => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        ScrollTrigger.refresh()
      })
    })
    ro.observe(document.body)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} id="about" className="mb-32">
      <SectionHeading label="About" title="Who we are" />

      <p
        ref={textRef}
        className="mx-auto max-w-5xl text-center text-3xl leading-[1.2] font-bold tracking-tight md:text-6xl md:leading-[1.15]"
      >
        <RevealWords text="We're a compact studio of designers and engineers who believe great digital work lives where" />
        <span className="font-sans text-primary">craft</span>{" "}
        <RevealWords text="meets" />
        <span className="font-sans text-primary">technology</span>{" "}
        <RevealWords text="— building brands and products that feel inevitable." />
      </p>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-10">
        {facts.map((fact, i) => (
          <motion.div
            key={fact.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            className="text-center"
          >
            <p className="text-4xl font-black tracking-tighter md:text-6xl">
              <StatNumber value={fact.value} count={fact.count} />
            </p>
            <p className="mt-2 text-xs tracking-widest text-muted-foreground uppercase">
              {fact.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Values */}
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
