"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

// Hero section with an imperative GSAP intro timeline.
export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // We use gsap.context for easy cleanup in React
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from(headingRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      }).from(
        lineRef.current,
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1,
          ease: "power3.inOut",
        },
        "-=0.8"
      )
    }, heroRef)

    return () => ctx.revert() // Standard React cleanup
  }, [])

  return (
    <section ref={heroRef} className="mb-32">
      <h1
        ref={headingRef}
        className="mb-8 text-6xl leading-[0.9] font-black tracking-tighter md:text-8xl"
      >
        WE BUILD <br />
        <span className="text-transparent [-webkit-text-stroke:2px_var(--foreground)]">
          DIGITAL
        </span>{" "}
        EXPERIENCES.
      </h1>
      <div ref={lineRef} className="mt-16 h-px w-full bg-border"></div>
    </section>
  )
}
