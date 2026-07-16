import {
  describe,
  it,
  expect,
  renderWithProviders,
  screen,
} from "@/test/integration"
import { Hero } from "../hero"

describe("Hero", () => {
  it("renders the headline", () => {
    renderWithProviders(<Hero />)

    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent(/we build/i)
    expect(heading).toHaveTextContent(/digital/i)
    expect(heading).toHaveTextContent(/experiences/i)
  })

  it("renders the availability badge and scroll cue", () => {
    renderWithProviders(<Hero />)

    expect(screen.getByText(/available for new projects/i)).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /scroll to explore/i })
    ).toHaveAttribute("href", "#services")
  })

  it("renders each stat label", () => {
    renderWithProviders(<Hero />)

    expect(screen.getByText("Projects shipped")).toBeInTheDocument()
    expect(screen.getByText("Countries reached")).toBeInTheDocument()
    expect(screen.getByText("Industry awards")).toBeInTheDocument()
  })
})
