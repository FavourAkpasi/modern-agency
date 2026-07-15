import { WebNav } from "@/components/layout/web-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Hero } from "@/components/sections/hero"
import { Services } from "@/components/sections/services"
import { Projects1 } from "@/components/sections/projects1"
import { Projects2 } from "@/components/sections/projects2"
import { CaseStudy } from "@/components/sections/case-study"
import { About } from "@/components/sections/about"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <>
      <WebNav />
      <MobileNav />

      <main
        id="top"
        className="mx-auto min-h-screen max-w-screen-2xl px-6 pt-28 pb-12 md:px-24 md:pt-32 md:pb-24"
      >
        <Hero />
        <Services />
        <Projects1 />
        <Projects2 />
        <CaseStudy />
        <About />
        <Footer />
      </main>
    </>
  )
}
