"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const stats = [
  { value: 150, suffix: "+", label: "Projects shipped" },
  { value: 27, suffix: "", label: "Countries reached" },
  { value: 15, suffix: "", label: "Industry awards" },
]

const services = [
  "Brand Strategy",
  "Web Design",
  "Development",
  "Motion Design",
  "Art Direction",
]

// Hero section. All animation is imperative GSAP, gated behind
// `prefers-reduced-motion` so it degrades to static content gracefully.
export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const outlineRef = useRef<HTMLSpanElement>(null)
  const starRef = useRef<HTMLSpanElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Only animate for users who haven't asked to reduce motion.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // globals.css pre-hides the hero (opacity:0) so the prerendered HTML
        // can't flash the final layout before this runs. Take ownership: park
        // the transforms while things are still hidden, then clear the CSS hide
        // by writing opacity inline. CSS only ever sets opacity — every
        // transform is GSAP's alone, so an interrupted tween can leave
        // something invisible but never mispositioned.
        gsap.set(".hero-line-inner", { yPercent: 115 })
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" })
        gsap.set([".hero-mask", lineRef.current], { opacity: 1 })

        // Intro timeline: masked line reveals + a drawn divider.
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

        // fromTo()/to(), never from(): from() reads the element's current value
        // as its destination, which the CSS pre-hide has already set to 0.
        tl.fromTo(
          ".hero-top",
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
          .to(
            ".hero-line-inner",
            { yPercent: 0, duration: 1.1, stagger: 0.12 },
            "-=0.3"
          )
          // Reveal done — unclip the masks so mouse parallax isn't cut off.
          .set(".hero-mask", { overflow: "visible" })
          .fromTo(
            ".hero-sub",
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 },
            "-=0.7"
          )
          .to(
            lineRef.current,
            { scaleX: 1, duration: 1, ease: "power3.inOut" },
            "-=0.9"
          )
          .fromTo(
            ".hero-scroll",
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.6"
          )
          .fromTo(
            ".hero-stat",
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
            "-=0.4"
          )
          .fromTo(
            ".hero-marquee",
            { opacity: 0 },
            { opacity: 1, duration: 0.8 },
            "-=0.3"
          )

        // Count up each stat number from zero.
        gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
          const target = Number(el.dataset.value)
          const counter = { v: 0 }
          gsap.to(counter, {
            v: target,
            duration: 2.0,
            delay: 1.0,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(counter.v).toString()
            },
          })
        })

        // Continuously rotating decorative asterisk.
        gsap.to(starRef.current, {
          rotate: 360,
          duration: 14,
          ease: "none",
          repeat: -1,
        })

        // Seamless infinite marquee (track holds the list twice).
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          duration: 24,
          ease: "none",
          repeat: -1,
        })

        // Scroll parallax: headline lifts and fades out quickly and early.
        gsap.to(headingRef.current, {
          yPercent: -24,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "45% top",
            scrub: true,
          },
        })

        // Mouse parallax on the outlined word (fine pointers only).
        mm.add("(pointer: fine)", () => {
          const xTo = gsap.quickTo(outlineRef.current, "x", {
            duration: 0.7,
            ease: "power3",
          })
          const yTo = gsap.quickTo(outlineRef.current, "y", {
            duration: 0.7,
            ease: "power3",
          })

          const onMove = (e: MouseEvent) => {
            const relX = e.clientX / window.innerWidth - 0.5
            const relY = e.clientY / window.innerHeight - 0.5
            xTo(relX * 26)
            yTo(relY * 16)
          }

          window.addEventListener("mousemove", onMove)
          return () => window.removeEventListener("mousemove", onMove)
        })
      })
    }, heroRef)

    return () => ctx.revert() // reverts tweens, ScrollTriggers, and listeners
  }, [])

  return (
    <section ref={heroRef} className="relative mb-32">
      {/* Rotating decorative motif */}
      <span
        ref={starRef}
        aria-hidden
        className="pointer-events-none absolute top-4 right-0 hidden text-6xl text-primary md:block"
      >
        ✳
      </span>

      {/* Top row: availability + studio label */}
      <div className="hero-top mb-12 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs tracking-widest uppercase">
          <span className="size-2 rounded-full bg-primary motion-safe:animate-pulse" />
          Available for new projects
        </span>
        <span className="hidden text-xs tracking-widest text-muted-foreground uppercase sm:inline">
          Digital Product Studio — Est. 2020
        </span>
      </div>

      <h1
        ref={headingRef}
        className="text-6xl leading-[0.95] font-black tracking-tighter md:text-8xl lg:text-9xl"
      >
        <span className="hero-mask block overflow-hidden pb-[0.1em]">
          <span className="hero-line-inner block">WE BUILD</span>
        </span>
        <span className="hero-mask block overflow-hidden pb-[0.1em]">
          <span className="hero-line-inner block">
            <span
              ref={outlineRef}
              className="inline-block text-transparent will-change-transform [-webkit-text-stroke:2px_var(--foreground)]"
            >
              DIGITAL
            </span>{" "}
            EXPERIENCES.
          </span>
        </span>
      </h1>

      <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <p className="hero-sub max-w-md text-base leading-relaxed text-muted-foreground">
          We partner with ambitious brands to design and build websites,
          products, and experiences that move people — and move numbers.
        </p>

        <a
          href="#services"
          className="hero-scroll group flex items-center gap-3 text-sm tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          Scroll to explore
          <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">
            ↓
          </span>
        </a>
      </div>

      <div
        ref={lineRef}
        className="hero-line mt-16 h-px w-full bg-border"
      ></div>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-2 justify-items-center gap-8 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="hero-stat">
            <div className="flex items-baseline text-4xl font-black tracking-tighter md:text-5xl">
              <span className="stat-value" data-value={stat.value}>
                {stat.value}
              </span>
              <span className="text-primary">{stat.suffix}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Infinite services marquee */}
      <div className="hero-marquee mt-16 overflow-hidden border-y border-border py-6">
        <div
          ref={marqueeRef}
          className="flex w-max items-center gap-10 whitespace-nowrap will-change-transform"
        >
          {[...services, ...services].map((service, i) => (
            <span
              key={i}
              className="flex items-center gap-10 text-3xl font-black tracking-tighter uppercase md:text-5xl"
            >
              {service}
              <span className="text-primary">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
