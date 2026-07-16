import {
  describe,
  it,
  expect,
  afterEach,
  renderWithProviders,
  screen,
} from "@/test/integration"
import { featuredProject } from "@/lib/constants/projects"
import { useProjectDrawer } from "@/stores/project-drawer"
import { ProjectDrawer } from "../project-drawer"

// The drawer is driven entirely by the Zustand store, so drive it directly
// rather than clicking through a section.
afterEach(() => {
  useProjectDrawer.setState({ project: null, isOpen: false })
})

describe("ProjectDrawer", () => {
  it("renders nothing while closed", () => {
    renderWithProviders(<ProjectDrawer />)

    expect(screen.queryByText(featuredProject.title)).toBeNull()
  })

  it("renders the project's long-form content once opened", () => {
    useProjectDrawer.setState({ project: featuredProject, isOpen: true })
    renderWithProviders(<ProjectDrawer />)

    expect(screen.getAllByText(featuredProject.title).length).toBeGreaterThan(0)

    featuredProject.sections.forEach((section) => {
      expect(screen.getByText(`(${section.label})`)).toBeInTheDocument()
    })

    featuredProject.results.forEach((result) => {
      expect(screen.getByText(result.value)).toBeInTheDocument()
    })
  })
})
