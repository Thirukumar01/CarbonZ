import { describe, it, expect } from "vitest";
import { getProjects, getProjectBySlug, getProjectsForComparison } from "./projects";
import { validateDocumentFile, generateStoragePath } from "./storage";
import { canTransitionStatus } from "./workflow";

describe("Data Access & Domain Integration Tests", () => {
  it("fetches projects with pagination, sorting, and demo mode flags", async () => {
    const result = await getProjects({ page: 1, page_size: 2, sort_by: "newest" });

    expect(result.projects.length).toBeLessThanOrEqual(2);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(2);
    expect(result.totalCount).toBeGreaterThanOrEqual(1);
    expect(result.projects[0]).toHaveProperty("project_code");
    expect(result.projects[0]).toHaveProperty("trust_score");
  });

  it("filters projects by search term across name and project code", async () => {
    const result = await getProjects({ search: "CZ-BRA-2024-001" });
    expect(result.projects.length).toBe(1);
    expect(result.projects[0].project_code).toBe("CZ-BRA-2024-001");
  });

  it("filters projects by project type", async () => {
    const result = await getProjects({ project_type: "methane_capture" });
    expect(result.projects.length).toBeGreaterThanOrEqual(1);
    expect(result.projects.every((p) => p.project_type === "methane_capture")).toBe(true);
  });

  it("retrieves a single project by slug with full relational data", async () => {
    const { project } = await getProjectBySlug("amazon-rainforest-corridor-restoration");

    expect(project).not.toBeNull();
    expect(project?.project_code).toBe("CZ-BRA-2024-001");
    expect(project?.trust_score).toBeDefined();
    expect(project?.trust_score?.calculated_score).toBe(83);
    expect(project?.documents).toBeDefined();
    expect(project?.passport_events).toBeDefined();
    expect(project?.reviews).toBeDefined();
  });

  it("returns null for non-existent project slugs", async () => {
    const { project } = await getProjectBySlug("non-existent-carbon-project-xyz");
    expect(project).toBeNull();
  });

  it("retrieves multiple projects for side-by-side comparison", async () => {
    const { projects } = await getProjectsForComparison([
      "amazon-rainforest-corridor-restoration",
      "gujarat-rural-dairy-methane-recovery",
    ]);

    expect(projects.length).toBe(2);
    expect(projects.map((p) => p.project_code)).toContain("CZ-BRA-2024-001");
    expect(projects.map((p) => p.project_code)).toContain("CZ-IND-2024-003");
  });

  describe("Document Storage Security & Path Validation", () => {
    it("validates allowed document formats and sizes", () => {
      const valid = validateDocumentFile("baseline_gis_map.pdf", "application/pdf", 1024 * 1024);
      expect(valid.valid).toBe(true);
      expect(valid.sanitizedFilename).toBe("baseline_gis_map.pdf");

      const tooLarge = validateDocumentFile("giant_file.pdf", "application/pdf", 30 * 1024 * 1024);
      expect(tooLarge.valid).toBe(false);
      expect(tooLarge.error).toContain("exceeds maximum limit");

      const disallowed = validateDocumentFile("malicious.sh", "application/x-sh", 500);
      expect(disallowed.valid).toBe(false);
      expect(disallowed.error).toContain("Unsupported file type");
    });

    it("generates isolated non-guessable storage paths", () => {
      const path = generateStoragePath("proj-123", "baseline_study", "my file (1).pdf");
      expect(path).toContain("projects/proj-123/baseline_study/");
      expect(path).toContain("my_file__1_.pdf");
      expect(path).not.toContain(" ");
    });
  });

  describe("Security & Cross-Role Access Rules", () => {
    it("disallows developers from approving/verifying their own project", () => {
      const res = canTransitionStatus({
        currentStatus: "under_review",
        targetStatus: "verified",
        userRole: "developer",
        isDeveloperOwner: true,
      });
      expect(res.allowed).toBe(false);
      expect(res.reason).toContain("Conflict of Interest");
    });

    it("disallows non-owners from submitting draft projects", () => {
      const res = canTransitionStatus({
        currentStatus: "draft",
        targetStatus: "submitted",
        userRole: "developer",
        isDeveloperOwner: false,
      });
      expect(res.allowed).toBe(false);
    });
  });
});
