"use client"

import { useEffect, useState } from "react"

// Scroll-spy: returns the id of whichever observed section is currently crossing
// a thin band near the top of the viewport. Used to highlight the active nav
// link. `ids` should be a stable reference (e.g. module-level) to avoid
// re-subscribing on every render.
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      // Band sits ~25%–45% down the viewport, so a section "activates" as its
      // top scrolls into the upper third.
      { rootMargin: "-25% 0px -55% 0px", threshold: 0 }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [ids])

  return active
}
