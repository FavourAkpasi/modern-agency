import type { MouseEvent } from "react"

// Reliable in-page anchor navigation. Next's <Link> is flaky with same-page
// hash scrolling, so we handle it ourselves: scroll to the target element
// (respecting its scroll-margin and the user's motion preference) and sync the
// URL hash without a full navigation.
export function scrollToSection(e: MouseEvent, href: string) {
  if (!href.startsWith("#")) return
  const el = document.getElementById(href.slice(1))
  if (!el) return

  e.preventDefault()
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
  window.history.replaceState(null, "", href)
}
