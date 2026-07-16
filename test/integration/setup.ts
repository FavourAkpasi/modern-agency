import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

// --- jsdom gaps -------------------------------------------------------------
// jsdom implements none of these, but the app leans on all three: GSAP's
// matchMedia gating, Framer's `whileInView`, the scroll-spy, and the Services
// section's container measurement.

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    // `false` means "no-preference" queries don't match, so GSAP skips its
    // animations and components render their static, assertable state.
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

class MockObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
}

vi.stubGlobal("IntersectionObserver", MockObserver)
vi.stubGlobal("ResizeObserver", MockObserver)

// Used by the nav's smooth-scroll helper.
Element.prototype.scrollIntoView = vi.fn()

// --- app-level stubs --------------------------------------------------------
// The app fakes a ~1s load while it runs on static data. Skip it globally so
// components render their real content immediately instead of a skeleton.
vi.mock("@/hooks/use-simulated-loading", () => ({
  useSimulatedLoading: () => false,
}))

afterEach(() => {
  cleanup()
})
