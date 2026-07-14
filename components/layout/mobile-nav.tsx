"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useActiveSection } from "@/hooks/use-active-section"
import { navItems, sectionIds } from "./nav-items"
import { ThemeToggle } from "./theme-toggle"

// Mobile navigation. Fixed to the top and morphs into a floating pill on
// scroll (mirroring WebNav); a hamburger toggles a full-screen overlay that
// shares its links — and active-section highlight — with the desktop nav.
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(sectionIds)

  const close = () => setOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center md:hidden">
        <div
          className={cn(
            "flex w-full items-center justify-between px-6 py-5 transition-all duration-500 ease-out",
            scrolled &&
              "mt-3 w-[92%] rounded-full border border-border bg-background/70 px-5 py-3 shadow-lg backdrop-blur-xl"
          )}
        >
          <Link
            href="#top"
            onClick={close}
            className="text-xl font-bold tracking-tighter uppercase"
          >
            Agency.
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="p-1"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-background px-6 py-12 text-foreground md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold tracking-tighter uppercase">
                Agency.
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="p-1"
              >
                <X className="size-6" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-8">
              {navItems.map((item) => {
                const isActive = active === item.href.slice(1)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={cn(
                      "flex items-center gap-4 text-5xl font-black tracking-tighter uppercase transition-colors hover:text-primary",
                      !isActive && "text-muted-foreground"
                    )}
                  >
                    {isActive && (
                      <span className="size-3 rounded-full bg-primary" />
                    )}
                    {item.label}
                  </Link>
                )
              })}
              <Link
                href="#contact"
                onClick={close}
                className="mt-8 w-fit rounded-full border border-border px-5 py-3 text-sm font-medium tracking-widest uppercase transition-colors hover:bg-foreground hover:text-background"
              >
                Let&apos;s Talk
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
