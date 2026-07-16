"use client"

import { useEffect, useRef } from "react"
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
import { ProjectDrawerSkeleton } from "@/components/skeletons"
import { useSimulatedLoading } from "@/hooks/use-simulated-loading"
import { useProjectDrawer } from "@/stores/project-drawer"

// Stagger the hero block in as the drawer settles.
const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const heroItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export const ProjectDrawer = () => {
  const project = useProjectDrawer((s) => s.project)
  const isOpen = useProjectDrawer((s) => s.isOpen)
  const close = useProjectDrawer((s) => s.close)
  const scrollRef = useRef<HTMLDivElement>(null)
  // Restarts on open and whenever the project changes.
  const loading = useSimulatedLoading(`${isOpen}-${project?.id ?? ""}`)

  // Drives the page's scale-back effect (see globals.css).
  useEffect(() => {
    if (isOpen) document.body.dataset.drawerOpen = "true"
    else delete document.body.dataset.drawerOpen
  }, [isOpen])

  const goToContact = () => {
    close()
    requestAnimationFrame(() => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
    })
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) close()
      }}
      showSwipeHandle
    >
      <DrawerContent className="[--drawer-height:calc(100dvh-6rem)]">
        {project && (
          <>
            <DrawerClose
              aria-label="Close"
              className="absolute top-4 right-4 z-20 flex size-10 items-center justify-center rounded-full border border-border bg-background/60 backdrop-blur transition-colors hover:bg-foreground hover:text-background"
            >
              <X className="size-5" />
            </DrawerClose>
            <DrawerTitle className="sr-only">{project.title}</DrawerTitle>
            <DrawerDescription className="sr-only">
              {project.category} case study
            </DrawerDescription>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain"
            >
              {loading ? (
                <ProjectDrawerSkeleton />
              ) : (
                <>
                  {/* Hero */}
                  <div
                    className={cn(
                      "relative overflow-hidden px-6 md:px-12",
                      project.image
                        ? "flex min-h-[45vh] items-end pt-20 pb-14"
                        : "pt-12 pb-14"
                    )}
                    style={
                      project.image
                        ? undefined
                        : {
                            background: `radial-gradient(120% 90% at 0% 0%, ${project.accent}22, transparent 55%)`,
                          }
                    }
                  >
                    {project.image && (
                      <>
                        <Image
                          src={project.image}
                          alt={project.title}
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
                        <span style={{ color: project.accent }}>
                          {project.category}
                        </span>
                        <span
                          className={
                            project.image
                              ? "text-white/70"
                              : "text-muted-foreground"
                          }
                        >
                          · {project.year}
                        </span>
                      </motion.div>

                      <motion.h2
                        variants={heroItem}
                        className={cn(
                          "mt-5 text-5xl font-black tracking-tighter uppercase md:text-7xl",
                          project.image && "text-white"
                        )}
                      >
                        {project.title}
                      </motion.h2>

                      <motion.div
                        variants={heroItem}
                        className="mt-6 flex flex-wrap gap-2"
                      >
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className={cn(
                              "rounded-full border px-3 py-1 text-xs tracking-widest uppercase",
                              project.image
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
                    {project.sections.map((section) => (
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
                      {project.results.map((result) => (
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
                </>
              )}
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
