import {
  describe,
  it,
  expect,
  renderWithProviders,
  screen,
} from "@/test/integration"
import { ThemeToggle } from "../theme-toggle"

describe("ThemeToggle", () => {
  it("renders an accessible toggle button", () => {
    renderWithProviders(<ThemeToggle />)

    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument()
  })

  it("forwards a custom className", () => {
    renderWithProviders(<ThemeToggle className="test-class" />)

    expect(screen.getByRole("button", { name: /toggle theme/i })).toHaveClass(
      "test-class"
    )
  })
})
