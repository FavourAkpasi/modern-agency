// Shared navigation targets. Each `href` points at a section `id` rendered on
// the home page so both the web and mobile navs stay in sync.
export type NavItem = {
  label: string
  href: string
}

export const navItems: NavItem[] = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

// Section ids the scroll-spy watches (stable module-level reference).
export const sectionIds = navItems.map((item) => item.href.slice(1))
