import { WebNav } from "@/components/layout/web-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Hero } from "@/components/sections/hero"
import { Projects } from "@/components/sections/projects"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main
      id="top"
      className="mx-auto min-h-screen max-w-screen-2xl px-6 py-12 md:px-24 md:py-24"
    >
      <WebNav />
      <MobileNav />

      <Hero />
      <Projects />
      <Footer />
    </main>
  )
}
