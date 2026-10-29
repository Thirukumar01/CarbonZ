import { z } from "zod";

export const projectTypes = [
  "reforestation",
  "afforestation",
  "renewable_energy",
  "methane_capture",
  "direct_air_capture",
  "blue_carbon",
  "soil_carbon",
  "improved_forest_management",
  "other",
] as const;

export const evidenceCategories = [
  "baseline_study",
  "monitoring_report",
  "pdd",
  "audit_report",
  "land_tenure",
  "satellite_imagery",
  "legal_ownership",
  "financial_additionality",
  "other",
] as const;

export const documentVisibilities = ["private", "restricted", "public"] as const;

export const reviewDecisions = ["approved", "changes_requested", "rejected"] as const;

export const userRoles = ["public", "user", "developer", "reviewer", "admin"] as const;

// 1. Project Creation Schema
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(5, "Project name must be at least 5 characters")
    .max(120, "Project name cannot exceed 120 characters"),
  description: z
    .string()
    .min(30, "Description must be at least 30 characters explaining the project scope")
    .max(2500, "Description cannot exceed 2500 characters"),
  project_type: z.enum(projectTypes, {
    errorMap: () => ({ message: "Please select a valid carbon project type" }),
  }),
  country: z
    .string()
    .min(2, "Country name is required")
    .max(80, "Country name too long"),
  region: z
    .string()
    .min(2, "Region or biome is required")
    .max(100, "Region name too long"),
  methodology: z
    .string()
    .min(3, "Methodology reference is required (e.g. VM0007 / ACM0002)")
    .max(150, "Methodology reference too long"),
  estimated_reduction: z
    .number({ invalid_type_error: "Estimated reduction must be a number" })
    .positive("Estimated reduction must be greater than zero")
    .nullable()
    .optional(),
  units: z.string().default("tCO2e/year"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// 2. Project Update Schema
export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string().uuid("Invalid project ID"),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// 3. Verification Review Schema
export const createReviewSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  decision: z.enum(reviewDecisions, {
    errorMap: () => ({ message: "Decision must be 'approved', 'changes_requested', or 'rejected'" }),
  }),
  review_notes: z
    .string()
    .min(15, "Review notes must contain at least 15 characters of substantiated findings"),
  requested_changes: z.string().optional().nullable(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// 4. Trust Score Calculation Schema
export const scoreCalculationSchema = z.object({
  documentation: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score cannot exceed 100"),
  verification: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score cannot exceed 100"),
  evidence: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score cannot exceed 100"),
  history: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score cannot exceed 100"),
  transparency: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score cannot exceed 100"),
});

export type ScoreCalculationInput = z.infer<typeof scoreCalculationSchema>;

// 5. Document Metadata & Upload Validation Schema
export const documentMetadataSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  original_filename: z.string().min(1, "Filename is required"),
  content_type: z
    .string()
    .refine(
      (val) =>
        [
          "application/pdf",
          "image/png",
          "image/jpeg",
          "application/geo+json",
          "application/json",
          "text/csv",
        ].includes(val),
      {
        message: "Only PDF, PNG, JPG, GeoJSON, and CSV documents are permitted.",
      }
    ),
  file_size: z
    .number()
    .positive("File must not be empty")
    .max(25 * 1024 * 1024, "Maximum file size is 25 MB"),
  evidence_category: z.enum(evidenceCategories),
  visibility: z.enum(documentVisibilities).default("restricted"),
});

export type DocumentMetadataInput = z.infer<typeof documentMetadataSchema>;

// 6. User Authentication Schemas
export const registerSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  display_name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["user", "developer", "reviewer"]).default("user"),
  organization: z.string().max(100).optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter your email"),
  password: z.string().min(1, "Password is required"),
});

export const passwordRecoverySchema = z.object({
  email: z.string().email("Please enter a valid email address to receive reset instructions"),
});
