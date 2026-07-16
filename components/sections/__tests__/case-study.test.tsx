import {
  describe,
  it,
  expect,
  renderWithProviders,
  screen,
} from "@/test/integration"
import { CaseStudy } from "../case-study"

describe("CaseStudy", () => {
  it("renders the section heading", () => {
    renderWithProviders(<CaseStudy />)

    expect(screen.getByText("(Featured)")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Case study" })
    ).toBeInTheDocument()
  })

  it("renders the featured project's meta and results", () => {
    renderWithProviders(<CaseStudy />)

    expect(screen.getByText("Design & Build")).toBeInTheDocument()
    expect(screen.getByText("+240%")).toBeInTheDocument()
    expect(screen.getByText("Signup conversion")).toBeInTheDocument()
  })

  it("exposes a way to open the full case study", () => {
    renderWithProviders(<CaseStudy />)

    expect(
      screen.getByRole("button", { name: /read the full case study/i })
    ).toBeInTheDocument()
  })
})
