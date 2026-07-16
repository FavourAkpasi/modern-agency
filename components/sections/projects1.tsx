"use client"

import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import { projects } from "@/lib/constants/projects"
import { ProjectsBentoSkeleton } from "@/components/skeletons"
import { useSimulatedLoading } from "@/hooks/use-simulated-loading"
import { useProjectDrawer } from "@/stores/project-drawer"
import { SectionHeading } from "./section-heading"

// Asymmetric bento spans — repeats if there are more projects than entries.
const spans = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "sm:row-span-2",
  "sm:col-span-2",
  "",
]

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const tile: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export const Projects1 = () => {
  const open = useProjectDrawer((s) => s.open)
  const loading = useSimulatedLoading()

  return (
    <section id="projects" className="mb-32">
      <SectionHeading label="Selected work" title="Projects" />

      {loading ? (
        <ProjectsBentoSkeleton />
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-flow-dense auto-rows-[170px] grid-cols-2 gap-4 sm:grid-cols-3"
        >
          {projects.map((project, i) => {
            const onImage = Boolean(project.image)
            return (
              <motion.button
                key={project.id}
                type="button"
                onClick={() => open(project)}
                variants={tile}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border p-6 text-left transition-all duration-300 hover:scale-102",
                  spans[i % spans.length]
                )}
              >
                {onImage ? (
                  <>
                    <Image
                      src={project.image!}
                      alt={project.title}
                      fill
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10"
                    />
                  </>
                ) : (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(120% 120% at 100% 0%, ${project.accent}22, transparent 80%)`,
                    }}
                  />
                )}

                <div className="relative flex items-start justify-between">
                  <span
                    className="text-xs tracking-widest uppercase"
                    style={{ color: project.accent }}
                  >
                    {project.category}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-xs",
                      onImage ? "text-white/70" : "text-muted-foreground"
                    )}
                  >
                    {project.year}
                  </span>
                </div>

                <div className="relative">
                  <h3
                    className={cn(
                      "text-2xl font-black tracking-tighter uppercase md:text-3xl",
                      onImage && "text-white"
                    )}
                  >
                    {project.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[10px] tracking-widest uppercase",
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

                <span
                  className={cn(
                    "relative self-end text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1",
                    onImage && "text-white"
                  )}
                >
                  ↗
                </span>
              </motion.button>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
