import {
  describe,
  it,
  expect,
  renderWithProviders,
  screen,
  fireEvent,
} from "@/test/integration"
import { MobileNav } from "../mobile-nav"
import { navItems } from "../nav-items"

describe("MobileNav", () => {
  it("renders the logo and a closed menu by default", () => {
    renderWithProviders(<MobileNav />)

    expect(screen.getByText("Agency.")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /open menu/i })
    ).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: navItems[0].label })).toBeNull()
  })

  it("reveals the nav links once the menu is opened", () => {
    renderWithProviders(<MobileNav />)

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }))

    navItems.forEach((item) => {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        item.href
      )
    })
    expect(
      screen.getByRole("button", { name: /close menu/i })
    ).toBeInTheDocument()
  })
})
