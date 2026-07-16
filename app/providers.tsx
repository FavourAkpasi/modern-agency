"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { ProjectDrawer } from "@/components/ui/project-drawer"
import { ReactNode, Suspense, useState } from "react"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <Suspense>{children}</Suspense>
        <ProjectDrawer />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
