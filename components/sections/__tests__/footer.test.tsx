import {
  describe,
  it,
  expect,
  renderWithProviders,
  screen,
} from "@/test/integration"
import { Footer } from "../footer"

describe("Footer", () => {
  it("renders the call to action", () => {
    renderWithProviders(<Footer />)

    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading).toHaveTextContent(/got a project/i)
    expect(heading).toHaveTextContent(/let's talk/i)
  })

  it("renders the mailto link", () => {
    renderWithProviders(<Footer />)

    expect(
      screen.getByRole("link", { name: /hello@agency.com/i })
    ).toHaveAttribute("href", "mailto:hello@agency.com")
  })

  it("renders the socials and current year", () => {
    renderWithProviders(<Footer />)

    ;["Instagram", "X", "LinkedIn"].forEach((social) => {
      expect(screen.getByRole("link", { name: social })).toBeInTheDocument()
    })

    expect(
      screen.getByText(new RegExp(`${new Date().getFullYear()}`))
    ).toBeInTheDocument()
  })
})
