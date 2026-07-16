import type { ReactElement, ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { render, type RenderOptions } from "@testing-library/react"

// Fresh client per render so no query cache leaks between tests, and no retries
// to slow failures down.
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })

type ProvidersProps = {
  children: ReactNode
}

/**
 * Renders a component inside the app's real provider stack (TanStack Query +
 * next-themes) so hooks resolve. Always use this instead of RTL's raw `render`.
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: ProvidersProps) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper, ...options })
}

// Re-exported so test files only ever import from `@/test/integration`.
export { describe, it, test, expect, vi, beforeEach, afterEach } from "vitest"
export * from "@testing-library/react"
export { default as userEvent } from "@testing-library/user-event"
