import { describe, it, expect } from "vitest";
import {
  createProjectSchema,
  createReviewSchema,
  scoreCalculationSchema,
  documentMetadataSchema,
  registerSchema,
} from "./validators";

describe("Input Validation Schemas (Zod)", () => {
  describe("createProjectSchema", () => {
    it("accepts a valid project payload", () => {
      const valid = {
        name: "Bio-Carbon Biochar Sequestration Project",
        description: "Permanent biochar production from invasive acacia species to rebuild soil organic carbon across 5,000 hectares.",
        project_type: "soil_carbon",
        country: "Namibia",
        region: "Otjozondjupa",
        methodology: "VM0044 / Methodology for Biochar Utilization",
        estimated_reduction: 35000,
        units: "tCO2e/year",
      };
      const res = createProjectSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("rejects projects with too short descriptions", () => {
      const invalid = {
        name: "Test Project",
        description: "Too short",
        project_type: "reforestation",
        country: "Brazil",
        region: "Amazon",
        methodology: "VM0007",
      };
      const res = createProjectSchema.safeParse(invalid);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain("at least 30 characters");
      }
    });

    it("rejects invalid project types", () => {
      const invalid = {
        name: "Solar Farm Carbon",
        description: "Detailed description of a clean energy solar farm project exceeding 30 characters.",
        project_type: "nuclear_fusion", // invalid enum
        country: "France",
        region: "Rhone",
        methodology: "ACM0002",
      };
      const res = createProjectSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("createReviewSchema", () => {
    it("accepts valid review decisions", () => {
      const valid = {
        project_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        decision: "approved",
        review_notes: "Audit of canopy remote sensing logs confirms 95% survival rate.",
      };
      const res = createReviewSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("rejects invalid decisions", () => {
      const invalid = {
        project_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        decision: "maybe_later",
        review_notes: "Notes that are long enough but with invalid decision enum.",
      };
      const res = createReviewSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("documentMetadataSchema", () => {
    it("accepts valid PDF documents within size limit", () => {
      const valid = {
        project_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        original_filename: "audit_report_2024.pdf",
        content_type: "application/pdf",
        file_size: 4500000, // 4.5 MB
        evidence_category: "audit_report",
        visibility: "restricted",
      };
      const res = documentMetadataSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("rejects executable or unsupported file types", () => {
      const invalid = {
        project_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        original_filename: "script.exe",
        content_type: "application/x-msdownload",
        file_size: 1000,
        evidence_category: "audit_report",
      };
      const res = documentMetadataSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("validates password strength rules", () => {
      // Weak password: no uppercase, no number
      const weak = {
        email: "user@example.com",
        password: "password",
        display_name: "John Doe",
        role: "user",
      };
      const res = registerSchema.safeParse(weak);
      expect(res.success).toBe(false);

      // Strong password
      const strong = {
        email: "user@example.com",
        password: "Password123",
        display_name: "John Doe",
        role: "user",
      };
      const strongRes = registerSchema.safeParse(strong);
      expect(strongRes.success).toBe(true);
    });
  });
});

