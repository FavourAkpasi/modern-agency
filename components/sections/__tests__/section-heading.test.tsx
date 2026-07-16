import {
  describe,
  it,
  expect,
  renderWithProviders,
  screen,
} from "@/test/integration"
import { SectionHeading } from "../section-heading"

describe("SectionHeading", () => {
  it("renders the label and title", () => {
    renderWithProviders(<SectionHeading label="About" title="Who we are" />)

    expect(screen.getByText("(About)")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Who we are" })
    ).toBeInTheDocument()
  })
})
