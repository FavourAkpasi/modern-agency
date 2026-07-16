import {
  describe,
  it,
  expect,
  renderWithProviders,
  screen,
} from "@/test/integration"
import { About } from "../about"

describe("About", () => {
  it("renders the section heading", () => {
    renderWithProviders(<About />)

    expect(screen.getByText("(About)")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Who we are" })
    ).toBeInTheDocument()
  })

  it("renders the manifesto with its accent keywords", () => {
    const { container } = renderWithProviders(<About />)

    // The manifesto is split into per-word spans for the scroll reveal, so
    // assert on the paragraph's combined text rather than a single node.
    expect(container.textContent).toContain("compact studio of designers")
    expect(screen.getByText("craft")).toBeInTheDocument()
    expect(screen.getByText("technology")).toBeInTheDocument()
  })

  it("renders the studio facts and values", () => {
    renderWithProviders(<About />)

    expect(screen.getByText("Founded")).toBeInTheDocument()
    expect(screen.getByText("People")).toBeInTheDocument()
    expect(screen.getByText("Continents")).toBeInTheDocument()

    ;["Craft", "Candor", "Momentum", "Ownership"].forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument()
    })
  })
})
