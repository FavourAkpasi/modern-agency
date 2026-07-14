"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useActiveSection } from "@/hooks/use-active-section"
import { navItems, sectionIds } from "./nav-items"
import { ThemeToggle } from "./theme-toggle"

// Desktop navigation. Fixed to the top; morphs into a floating pill once the
// page is scrolled, and highlights the section currently in view.
export function WebNav() {
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 hidden justify-center md:flex">
      <nav
        className={cn(
          "flex w-full max-w-screen-2xl items-center justify-between px-6 py-6 transition-all duration-500 ease-out md:px-24",
          scrolled &&
            "mt-4 w-[min(92%,64rem)] rounded-full border border-border bg-background/70 px-6 py-3 shadow-lg backdrop-blur-xl md:px-6"
        )}
      >
        <Link
          href="#top"
          className="text-xl font-bold tracking-tighter uppercase"
        >
          Agency.
        </Link>

        <ul className="flex items-center gap-1 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = active === item.href.slice(1)
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    "relative z-10 block px-4 py-2 tracking-widest uppercase transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 z-0 rounded-full bg-muted"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="#contact"
            className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors duration-300 hover:bg-foreground hover:text-background"
          >
            Let&apos;s Talk
          </Link>
        </div>
      </nav>
    </header>
  )
}
