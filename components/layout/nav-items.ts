// Shared navigation targets. Each `href` points at a section `id` rendered on
// the home page so both the web and mobile navs stay in sync.
export type NavItem = {
  label: string
  href: string
}

export const navItems: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
]
