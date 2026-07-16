import {
  describe,
  it,
  expect,
  renderWithProviders,
  screen,
} from "@/test/integration"
import { projects } from "@/lib/constants/projects"
import { Projects1 } from "../projects1"

describe("Projects1", () => {
  it("renders the section heading", () => {
    renderWithProviders(<Projects1 />)

    expect(screen.getByText("(Selected work)")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Projects" })
    ).toBeInTheDocument()
  })

  it("renders a clickable tile per project", () => {
    renderWithProviders(<Projects1 />)

    expect(screen.getAllByRole("button")).toHaveLength(projects.length)

    projects.forEach((project) => {
      expect(
        screen.getByRole("heading", { name: project.title })
      ).toBeInTheDocument()
    })
  })
})
