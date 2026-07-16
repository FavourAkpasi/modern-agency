import {
  describe,
  it,
  expect,
  renderWithProviders,
  screen,
} from "@/test/integration"
import { projects } from "@/lib/constants/projects"
import { Projects2 } from "../projects2"

// Each project appears in the index row and again in its preview panel, so
// titles are duplicated — use `getAllByText`.
describe("Projects2", () => {
  it("renders the section heading", () => {
    renderWithProviders(<Projects2 />)

    expect(screen.getByText("(Selected work)")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Projects II" })
    ).toBeInTheDocument()
  })

  it("renders every project title", () => {
    renderWithProviders(<Projects2 />)

    projects.forEach((project) => {
      expect(screen.getAllByText(project.title).length).toBeGreaterThan(0)
    })
  })
})
