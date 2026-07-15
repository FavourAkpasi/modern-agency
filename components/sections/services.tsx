"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import {
  Code2,
  Compass,
  PenTool,
  RefreshCw,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionHeading } from "./section-heading"

type Step = {
  n: string
  title: string
  desc: string
  icon: LucideIcon
  color: string
}

// The journey we take a client through — ordered, each with its own accent.
const steps: Step[] = [
  {
    n: "01",
    title: "Art Direction",
    desc: "Every engagement starts with a point of view. We define the visual language, mood, and creative direction everything is built on.",
    icon: Compass,
    color: "#f59e0b",
  },
  {
    n: "02",
    title: "Brand Strategy",
    desc: "Positioning, narrative, and identity systems that make ambitious brands impossible to ignore.",
    icon: Target,
    color: "#8b5cf6",
  },
  {
    n: "03",
    title: "Web Design",
    desc: "Editorial, conversion-focused interfaces designed pixel by pixel for clarity and impact.",
    icon: PenTool,
    color: "#06b6d4",
  },
  {
    n: "04",
    title: "Development",
    desc: "Fast, accessible, production-grade builds in modern React, Next.js, and headless stacks.",
    icon: Code2,
    color: "#10b981",
  },
  {
    n: "05",
    title: "Motion Design",
    desc: "Purposeful animation and interaction that give the product life and guide the eye.",
    icon: Sparkles,
    color: "#ec4899",
  },
  {
    n: "06",
    title: "Maintenance",
    desc: "We don't disappear at launch. Ongoing iteration, monitoring, and support keep the work sharp as you grow.",
    icon: RefreshCw,
    color: "#3b82f6",
  },
]

const n = steps.length
const NODE_INSET = 24 // % of width each node sits from its outer edge
const CORNER = 28 // rounded-elbow radius, px
const SPIN_SPEED = 0.28 // degrees of ring rotation per px scrolled

const nodeXPct = (i: number) => (i % 2 === 0 ? NODE_INSET : 100 - NODE_INSET)
const nodeYPct = (i: number) => ((i + 0.5) / n) * 100

// Vertical gradient blending each node's colour, used for both line layouts.
const railGradientCss = `linear-gradient(to bottom, ${steps
  .map((s) => s.color)
  .join(", ")})`

// Build the rectilinear (vertical → horizontal → vertical) path with rounded
// elbows in real pixels, plus the cumulative length at each node so the line
// can fill exactly up to a node.
function buildPath(w: number, h: number) {
  const pts = steps.map((_, i) => ({
    x: (nodeXPct(i) / 100) * w,
    y: (nodeYPct(i) / 100) * h,
  }))

  let d = `M ${pts[0].x} ${pts[0].y}`
  const cumLen = [0]
  let len = 0

  for (let i = 0; i < n - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    const midY = (a.y + b.y) / 2
    const dir = Math.sign(b.x - a.x) || 1
    const r = Math.min(CORNER, midY - a.y, Math.abs(b.x - a.x) / 2, b.y - midY)

    // down → round → across → round → down
    d +=
      ` L ${a.x} ${midY - r}` +
      ` Q ${a.x} ${midY} ${a.x + dir * r} ${midY}` +
      ` L ${b.x - dir * r} ${midY}` +
      ` Q ${b.x} ${midY} ${b.x} ${midY + r}` +
      ` L ${b.x} ${b.y}`

    const arc = (Math.PI / 2) * r
    len +=
      midY -
      r -
      a.y +
      arc +
      (Math.abs(b.x - a.x) - 2 * r) +
      arc +
      (b.y - midY - r)
    cumLen.push(len)
  }

  return { d, cumLen, total: len }
}

// Hand-authored abstract motif: concentric rings + orbiting dots.
function StepMotif() {
  return (
    <svg viewBox="0 0 120 120" className="size-full" fill="none" aria-hidden>
      <g stroke="currentColor" strokeWidth="1.25" opacity="0.7">
        <circle cx="60" cy="60" r="56" />
        <circle cx="60" cy="60" r="40" />
        <circle cx="60" cy="60" r="24" />
      </g>
      <g fill="currentColor">
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2
          // Round so server/client serialize the same string (avoids a
          // float-precision hydration mismatch).
          return (
            <circle
              key={i}
              cx={+(60 + Math.cos(a) * 56).toFixed(3)}
              cy={+(60 + Math.sin(a) * 56).toFixed(3)}
              r="3.5"
            />
          )
        })}
      </g>
    </svg>
  )
}

function NodeIcon({ step, active }: { step: Step; active: boolean }) {
  const Icon = step.icon
  return (
    <span className="relative">
      <span className="pointer-events-none absolute top-1/2 left-1/2 size-28 -translate-x-1/2 -translate-y-1/2 md:size-48">
        <span
          className="step-motif block size-full text-muted-foreground transition-[color,opacity] duration-500"
          style={
            active ? { color: step.color, opacity: 0.4 } : { opacity: 0.12 }
          }
        >
          <StepMotif />
        </span>
      </span>
      <span
        className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-muted-foreground transition-[color,border-color,transform] duration-500 group-hover:scale-110"
        style={
          active ? { borderColor: step.color, color: step.color } : undefined
        }
      >
        <Icon className="size-6" />
      </span>
    </span>
  )
}

function StepText({
  step,
  align,
  active,
}: {
  step: Step
  align: "left" | "right"
  active: boolean
}) {
  return (
    <div className={cn("ml-12 w-64", align === "right" && "mr-12 text-right")}>
      <div
        className={cn(
          "flex items-center gap-3",
          align === "right" && "flex-row-reverse"
        )}
      >
        <span
          className="font-mono text-sm text-muted-foreground transition-colors duration-500"
          style={active ? { color: step.color } : undefined}
        >
          {step.n}
        </span>
        <span
          className="h-px w-8 bg-border transition-colors duration-500"
          style={active ? { backgroundColor: step.color } : undefined}
        />
      </div>
      <h3
        className={cn(
          "mt-3 text-3xl font-black tracking-tighter uppercase transition-colors duration-500 md:text-4xl",
          active ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {step.title}
      </h3>
      <p
        className={cn(
          "mt-3 text-sm leading-relaxed transition-colors duration-500",
          active ? "text-muted-foreground" : "text-muted-foreground/40"
        )}
      >
        {step.desc}
      </p>
    </div>
  )
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
} as const

export function Services() {
  const snakeRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const rotations = useRef<number[]>(steps.map(() => 0))
  const lastScroll = useRef(0)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [active, setActive] = useState<boolean[]>(() => steps.map(() => false))

  const path = useMemo(
    () => (size.w > 0 && size.h > 0 ? buildPath(size.w, size.h) : null),
    [size]
  )

  // Measure the desktop container so the pixel geometry stays crisp.
  useEffect(() => {
    const el = snakeRef.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Activate steps whose node has reached the screen middle (reactive both
  // ways), and advance each active ring's rotation with scroll.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    lastScroll.current = window.scrollY
    let frame = 0

    const measure = () => {
      frame = 0
      const mid = window.innerHeight / 2
      const delta = window.scrollY - lastScroll.current
      lastScroll.current = window.scrollY

      setActive((prev) => {
        const next = [...prev]
        document.querySelectorAll<HTMLElement>("[data-step]").forEach((el) => {
          if (el.offsetParent === null) return // hidden layout
          const i = Number(el.dataset.index)
          const rect = el.getBoundingClientRect()
          const on = rect.top + rect.height / 2 <= mid
          next[i] = on
          // Scroll-linked spin, but only while the node is coloured.
          if (on && !reduce && delta !== 0) {
            rotations.current[i] += delta * SPIN_SPEED
            const motif = el.querySelector<HTMLElement>(".step-motif")
            if (motif) gsap.set(motif, { rotation: rotations.current[i] })
          }
        })
        return next.some((v, i) => v !== prev[i]) ? next : prev
      })
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Fill the line up to the furthest active node (desktop path + mobile rail).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const lastActive = active.lastIndexOf(true)

    if (pathRef.current && path) {
      const target =
        lastActive >= 0 ? path.total - path.cumLen[lastActive] : path.total
      gsap.to(pathRef.current, {
        strokeDashoffset: target,
        duration: reduce ? 0 : 0.6,
        ease: "power2.out",
        overwrite: true,
      })
    }
    if (fillRef.current) {
      gsap.to(fillRef.current, {
        scaleY: lastActive >= 0 ? (lastActive + 1) / n : 0,
        duration: reduce ? 0 : 0.6,
        ease: "power2.out",
        overwrite: true,
      })
    }
  }, [active, path])

  return (
    <section id="services" className="mb-32 overflow-x-clip">
      <SectionHeading label="Process" title="What we do" />

      {/* Desktop: rectilinear snake */}
      <div
        ref={snakeRef}
        className="relative hidden md:block"
        style={{ height: `${n * 20}rem` }}
      >
        {path && (
          <svg
            className="absolute inset-0 size-full"
            viewBox={`0 0 ${size.w} ${size.h}`}
            fill="none"
            aria-hidden
          >
            <defs>
              <linearGradient
                id="services-line-gradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="0"
                y2={size.h}
              >
                {steps.map((s, i) => (
                  <stop
                    key={s.title}
                    offset={(i + 0.5) / n}
                    stopColor={s.color}
                  />
                ))}
              </linearGradient>
            </defs>
            <path
              d={path.d}
              className="stroke-border"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              ref={pathRef}
              d={path.d}
              stroke="url(#services-line-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              pathLength={path.total}
              strokeDasharray={path.total}
              strokeDashoffset={path.total}
            />
          </svg>
        )}

        {steps.map((step, i) => {
          const left = i % 2 === 0
          return (
            <div
              key={step.title}
              data-step
              data-index={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${nodeXPct(i)}%`, top: `${nodeYPct(i)}%` }}
            >
              <motion.div {...reveal} className="group relative">
                <NodeIcon step={step} active={active[i]} />
                <div
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2",
                    left ? "left-19" : "right-19"
                  )}
                >
                  <StepText
                    step={step}
                    align={left ? "left" : "right"}
                    active={active[i]}
                  />
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* Mobile: vertical rail */}
      <div ref={railRef} className="relative md:hidden">
        <span
          aria-hidden
          className="absolute top-6 bottom-10 left-7 w-0.5 bg-border"
        />
        <span
          ref={fillRef}
          aria-hidden
          className="absolute top-6 bottom-10 left-7 w-0.5 origin-top scale-y-0"
          style={{ backgroundImage: railGradientCss }}
        />
        <div className="space-y-14">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              data-step
              data-index={i}
              {...reveal}
              className="group grid grid-cols-[3.5rem_1fr] items-start gap-6"
            >
              <NodeIcon step={step} active={active[i]} />
              <StepText step={step} align="left" active={active[i]} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
