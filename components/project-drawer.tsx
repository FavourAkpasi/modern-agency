"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { ArrowUpRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { CaseStudyData } from "@/lib/case-study"

type ProjectDrawerContextValue = { open: (data: CaseStudyData) => void }

const ProjectDrawerContext = createContext<ProjectDrawerContextValue | null>(null)

export function useProjectDrawer() {
  const ctx = useContext(ProjectDrawerContext)
  if (!ctx) {
    throw new Error("useProjectDrawer must be used within ProjectDrawerProvider")
  }
  return ctx
}

// Stagger the hero block in as the drawer settles.
const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}
const heroItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export function ProjectDrawerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CaseStudyData | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const open = useCallback((next: CaseStudyData) => {
    setData(next)
    setIsOpen(true)
  }, [])

  const handleOpenChange = useCallback((next: boolean) => {
    setIsOpen(next)
    // Drives the page's scale-back effect (see globals.css).
    if (next) document.body.dataset.drawerOpen = "true"
    else delete document.body.dataset.drawerOpen
  }, [])

  const goToContact = useCallback(() => {
    handleOpenChange(false)
    requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
    })
  }, [handleOpenChange])

  const value = useMemo(() => ({ open }), [open])

  return (
    <ProjectDrawerContext.Provider value={value}>
      {children}

      <Drawer open={isOpen} onOpenChange={handleOpenChange} showSwipeHandle>
        <DrawerContent className="[--drawer-height:calc(100dvh-6rem)]">
          {data && (
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain"
            >
              {/* Hero */}
              <div
                className={cn(
                  "relative overflow-hidden px-6 md:px-12",
                  data.image ? "flex min-h-[45vh] items-end pt-20 pb-14" : "pt-12 pb-14"
                )}
                style={
                  data.image
                    ? undefined
                    : {
                        background: `radial-gradient(120% 90% at 0% 0%, ${data.accent}22, transparent 55%)`,
                      }
                }
              >
                {data.image && (
                  <>
                    <Image
                      src={data.image}
                      alt={data.title}
                      fill
                      sizes="100vw"
                      priority
                      className="object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/20"
                    />
                  </>
                )}

                <DrawerClose
                  aria-label="Close"
                  className="absolute top-6 right-6 z-10 flex size-10 items-center justify-center rounded-full border border-border bg-background/60 backdrop-blur transition-colors hover:bg-foreground hover:text-background"
                >
                  <X className="size-5" />
                </DrawerClose>

                <motion.div
                  variants={heroContainer}
                  initial="hidden"
                  animate="show"
                  className="relative mx-auto w-full max-w-3xl"
                >
                  <motion.div
                    variants={heroItem}
                    className="flex items-center gap-3 text-sm tracking-widest uppercase"
                  >
                    <span style={{ color: data.accent }}>{data.category}</span>
                    <span className={data.image ? "text-white/70" : "text-muted-foreground"}>
                      · {data.year}
                    </span>
                  </motion.div>

                  <motion.h2
                    variants={heroItem}
                    className={cn(
                      "mt-5 text-5xl font-black tracking-tighter uppercase md:text-7xl",
                      data.image && "text-white"
                    )}
                  >
                    {data.title}
                  </motion.h2>
                  <DrawerTitle className="sr-only">{data.title}</DrawerTitle>
                  <DrawerDescription className="sr-only">
                    {data.category} case study
                  </DrawerDescription>

                  <motion.div
                    variants={heroItem}
                    className="mt-6 flex flex-wrap gap-2"
                  >
                    {data.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs tracking-widest uppercase",
                          data.image
                            ? "border-white/30 text-white/80"
                            : "border-border text-muted-foreground"
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                </motion.div>
              </div>

              {/* Long-form body */}
              <div className="mx-auto max-w-3xl px-6 pb-16 md:px-0">
                {data.sections.map((section) => (
                  <motion.div
                    key={section.label}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{
                      root: scrollRef,
                      once: true,
                      margin: "0px 0px -12% 0px",
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="grid gap-4 border-t border-border py-10 md:grid-cols-[10rem_1fr] md:gap-10"
                  >
                    <span className="text-sm tracking-widest text-muted-foreground uppercase">
                      ({section.label})
                    </span>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {section.body}
                    </p>
                  </motion.div>
                ))}

                {/* Results */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ root: scrollRef, once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="grid grid-cols-3 gap-6 border-t border-border pt-10"
                >
                  {data.results.map((result) => (
                    <div key={result.label}>
                      <p className="text-3xl font-black tracking-tighter md:text-5xl">
                        {result.value}
                      </p>
                      <p className="mt-2 text-xs tracking-widest text-muted-foreground uppercase">
                        {result.label}
                      </p>
                    </div>
                  ))}
                </motion.div>

                {/* CTA */}
                <div className="mt-14 border-t border-border pt-10">
                  <button
                    type="button"
                    onClick={goToContact}
                    className="group inline-flex items-center gap-3 rounded-full border border-border px-6 py-3 text-sm tracking-widest uppercase transition-colors hover:bg-foreground hover:text-background"
                  >
                    Start a project like this
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </ProjectDrawerContext.Provider>
  )
}
