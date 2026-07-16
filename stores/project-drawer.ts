import { create } from "zustand"
import type { Project } from "@/lib/constants/projects"

type ProjectDrawerState = {
  project: Project | null
  isOpen: boolean
  open: (project: Project) => void
  close: () => void
}

// Global drawer state. `project` is kept on close so content stays visible
// through the exit animation.
export const useProjectDrawer = create<ProjectDrawerState>((set) => ({
  project: null,
  isOpen: false,
  open: (project) => set({ project, isOpen: true }),
  close: () => set({ isOpen: false }),
}))
