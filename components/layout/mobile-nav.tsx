"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems } from "./nav-items"
import { ThemeToggle } from "./theme-toggle"

// Mobile navigation. Shown below the md breakpoint; a hamburger toggles a
// full-screen overlay that shares its links with WebNav via `navItems`.
export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <>
      <header
        className={cn("mb-32 flex items-center justify-between md:hidden", className)}
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
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="text-5xl font-black tracking-tighter uppercase transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={close}
                className="mt-8 w-fit border border-border px-5 py-3 text-sm font-medium tracking-widest uppercase transition-colors hover:bg-foreground hover:text-background"
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
