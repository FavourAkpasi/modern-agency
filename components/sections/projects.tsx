"use client"

import { useQuery } from "@tanstack/react-query"
import { motion, type Variants } from "framer-motion"
import { getAllProjects } from "@/services/project.service"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut", duration: 0.6 },
  },
}

// "Selected Work" grid. Data comes from TanStack Query; entrance animation from
// Framer Motion's staggered variants.
export function Projects() {
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getAllProjects(),
  })

  return (
    <section id="work">
      <h2 className="mb-8 text-sm tracking-widest text-muted-foreground uppercase">
        Selected Work
      </h2>

      {isLoading && (
        <div className="animate-pulse text-primary">
          Loading architecture...
        </div>
      )}
      {isError && (
        <div className="text-destructive">Failed to load projects.</div>
      )}

      {projects && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.article
              key={project.id}
              variants={cardVariants}
              className="group flex min-h-[300px] cursor-pointer flex-col justify-between border border-border p-8 transition-colors duration-500 hover:border-primary"
            >
              <div>
                <h3 className="mb-4 text-2xl font-bold capitalize transition-colors group-hover:text-primary">
                  {project.title.substring(0, 20)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.body.substring(0, 100)}...
                </p>
              </div>

              {/* Custom Arrow for Neo-Brutalist Feel */}
              <div className="mt-8 flex justify-end overflow-hidden">
                <div className="text-2xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  )
}
