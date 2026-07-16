import {
  describe,
  it,
  expect,
  renderWithProviders,
  screen,
} from "@/test/integration"
import { Services } from "../services"

// Services renders a desktop (snake) and a mobile (rail) copy of every step, so
// step text is always duplicated in the DOM — use `getAllByText`.
describe("Services", () => {
  it("renders the section heading", () => {
    renderWithProviders(<Services />)

    expect(screen.getByText("(Process)")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "What we do" })
    ).toBeInTheDocument()
  })

  it("renders every step of the journey", () => {
    renderWithProviders(<Services />)

    const steps = [
      "Art Direction",
      "Brand Strategy",
      "Web Design",
      "Development",
      "Motion Design",
      "Maintenance",
    ]

    steps.forEach((step) => {
      expect(screen.getAllByText(step).length).toBeGreaterThan(0)
    })
  })
})
