"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useProjects } from "@/hooks/use-projects"
import { deriveMeta, shortTitle } from "@/lib/project-meta"
import type { Project } from "@/types/project"
import { SectionHeading } from "./section-heading"
import { ProjectsEmpty, ProjectsError } from "./projects-states"

function PreviewPanel({ project, index }: { project: Project; index: number }) {
  const meta = deriveMeta(project, index)
  return (
    <div
      className="relative flex aspect-4/5 flex-col justify-between overflow-hidden rounded-3xl border border-border p-8"
      style={{
        background: `radial-gradient(120% 100% at 0% 0%, ${meta.accent}26, transparent 55%)`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-sm tracking-widest uppercase"
          style={{ color: meta.accent }}
        >
          {meta.category}
        </span>
        <span className="font-mono text-sm text-muted-foreground">
          {meta.year}
        </span>
      </div>

      <div>
        <span
          className="block text-[6rem] leading-none font-black tracking-tighter text-transparent"
          style={{ WebkitTextStroke: `2px ${meta.accent}` }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-4 text-4xl font-black tracking-tighter uppercase md:text-5xl">
          {shortTitle(project.title, 4)}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-3 py-1 text-xs tracking-widest text-muted-foreground uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Projects2() {
  const { data: projects, isPending, isError, refetch } = useProjects()
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <section id="projects-2" className="mb-32">
      <SectionHeading label="Selected work" title="Projects II" />

      {isError ? (
        <ProjectsError onRetry={() => refetch()} />
      ) : isPending ? (
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl border border-border bg-muted/40"
              />
            ))}
          </div>
          <div className="hidden aspect-4/5 animate-pulse rounded-3xl border border-border bg-muted/40 md:block" />
        </div>
      ) : projects.length === 0 ? (
        <ProjectsEmpty />
      ) : (
        <div className="grid gap-12 md:grid-cols-2">
          {/* Index list */}
          <ul>
            {projects.map((project, i) => {
              const meta = deriveMeta(project, i)
              const activeRow = i === activeIdx
              return (
                <li key={project.id}>
                  <a
                    href="#contact"
                    onMouseEnter={() => setActiveIdx(i)}
                    onFocus={() => setActiveIdx(i)}
                    className="group flex items-baseline justify-between gap-4 border-b border-border py-6"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-2xl font-black tracking-tighter uppercase transition-colors duration-300 md:text-4xl",
                          activeRow
                            ? "text-foreground"
                            : "text-foreground md:text-muted-foreground md:group-hover:text-foreground"
                        )}
                      >
                        {shortTitle(project.title, 4)}
                      </span>
                    </span>
                    <span className="hidden text-xs tracking-widest text-muted-foreground uppercase sm:block">
                      {meta.category}
                    </span>
                  </a>
                  {/* Mobile inline preview */}
                  <div className="py-6 md:hidden">
                    <PreviewPanel project={project} index={i} />
                  </div>
                </li>
              )
            })}
          </ul>

          {/* Sticky preview (desktop) */}
          <div className="hidden md:block">
            <div className="sticky top-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={projects[activeIdx].id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <PreviewPanel
                    project={projects[activeIdx]}
                    index={activeIdx}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
