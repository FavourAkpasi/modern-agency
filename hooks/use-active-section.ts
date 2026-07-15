"use client"

import { useEffect, useState } from "react"

// Scroll-spy: returns the id of the section currently occupying the top third of
// the viewport, or null when above the first section (e.g. the hero). Reactive
// in both scroll directions. `ids` must be in document order and a stable
// reference (e.g. module-level) to avoid re-subscribing on every render.
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const line = window.innerHeight * 0.3
      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        // ids are in document order, so once a section's top is below the
        // line, every later one is too.
        if (el.getBoundingClientRect().top <= line) current = id
        else break
      }
      setActive((prev) => (prev === current ? prev : current))
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
  }, [ids])

  return active
}
