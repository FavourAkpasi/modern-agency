import Link from "next/link"
import { cn } from "@/lib/utils"
import { navItems } from "./nav-items"
import { ThemeToggle } from "./theme-toggle"

// Desktop navigation. Hidden below the md breakpoint, where MobileNav takes over.
export function WebNav({ className }: { className?: string }) {
  return (
    <header
      className={cn("mb-32 hidden items-center justify-between md:flex", className)}
    >
      <Link
        href="#top"
        className="text-xl font-bold tracking-tighter uppercase"
      >
        Agency.
      </Link>

      <nav className="flex items-center gap-10">
        <ul className="flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="tracking-widest uppercase transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <ThemeToggle />

        <Link
          href="#contact"
          className="border border-border px-5 py-2 text-sm font-medium transition-colors duration-300 hover:bg-foreground hover:text-background"
        >
          Let&apos;s Talk
        </Link>
      </nav>
    </header>
  )
}
