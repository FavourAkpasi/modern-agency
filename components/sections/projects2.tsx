"use client"

import { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { projects, type Project } from "@/lib/constants/projects"
import { ProjectsListSkeleton } from "@/components/skeletons"
import { useSimulatedLoading } from "@/hooks/use-simulated-loading"
import { useProjectDrawer } from "@/stores/project-drawer"
import { SectionHeading } from "./section-heading"

type PreviewPanelProps = {
  project: Project
  index: number
}

const PreviewPanel = ({ project, index }: PreviewPanelProps) => {
  const onImage = Boolean(project.image)
  return (
    <div
      className="group/panel relative flex aspect-4/5 flex-col justify-between overflow-hidden rounded-3xl border border-border p-8"
      style={
        onImage
          ? undefined
          : {
              background: `radial-gradient(120% 100% at 0% 0%, ${project.accent}26, transparent 55%)`,
            }
      }
    >
      {onImage && (
        <>
          <Image
            src={project.image!}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover/panel:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10"
          />
        </>
      )}

      <div className="relative flex items-center justify-between">
        <span
          className="text-sm tracking-widest uppercase"
          style={{ color: project.accent }}
        >
          {project.category}
        </span>
        <span
          className={cn(
            "font-mono text-sm",
            onImage ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {project.year}
        </span>
      </div>

      <div className="relative">
        <span
          className="block text-[6rem] leading-none font-black tracking-tighter text-transparent"
          style={{ WebkitTextStroke: `2px ${project.accent}` }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3
          className={cn(
            "mt-4 text-4xl font-black tracking-tighter uppercase md:text-5xl",
            onImage && "text-white"
          )}
        >
          {project.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-full border px-3 py-1 text-xs tracking-widest uppercase",
                onImage
                  ? "border-white/30 text-white/80"
                  : "border-border text-muted-foreground"
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export const Projects2 = () => {
  const open = useProjectDrawer((s) => s.open)
  const [activeIdx, setActiveIdx] = useState(0)
  const loading = useSimulatedLoading()

  if (loading) {
    return (
      <section id="projects-2" className="mb-32">
        <SectionHeading label="Selected work" title="Projects II" />
        <ProjectsListSkeleton count={projects.length} />
      </section>
    )
  }

  return (
    <section id="projects-2" className="mb-32">
      <SectionHeading label="Selected work" title="Projects II" />

      <div className="grid gap-12 md:grid-cols-2">
        {/* Index list */}
        <ul>
          {projects.map((project, i) => {
            const activeRow = i === activeIdx
            return (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => open(project)}
                  onMouseEnter={() => setActiveIdx(i)}
                  onFocus={() => setActiveIdx(i)}
                  className="group flex w-full items-baseline justify-between gap-4 border-b border-border py-6 text-left"
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
                      {project.title}
                    </span>
                  </span>
                  <span className="hidden text-xs tracking-widest text-muted-foreground uppercase sm:block">
                    {project.category}
                  </span>
                </button>
                {/* Mobile inline preview */}
                <button
                  type="button"
                  onClick={() => open(project)}
                  className="block w-full py-6 text-left md:hidden"
                >
                  <PreviewPanel project={project} index={i} />
                </button>
              </li>
            )
          })}
        </ul>

        {/* Sticky preview (desktop) */}
        <div className="hidden md:block">
          <button
            type="button"
            onClick={() => open(projects[activeIdx])}
            className="sticky top-32 block w-full cursor-pointer text-left"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={projects[activeIdx].id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <PreviewPanel project={projects[activeIdx]} index={activeIdx} />
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </section>
  )
}
