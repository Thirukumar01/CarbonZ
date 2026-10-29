import { createServerSupabaseClient, isServerSupabaseConfigured } from "./supabase/server";
import { createAdminClient, isSupabaseAdminConfigured } from "./supabase/admin";

export const STORAGE_BUCKET = "project-documents";
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/geo+json",
  "application/json",
  "text/csv",
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
}

/**
 * Validates file properties before storage upload.
 */
export function validateDocumentFile(
  filename: string,
  contentType: string,
  size: number
): FileValidationResult {
  if (size <= 0) {
    return { valid: false, error: "File cannot be empty." };
  }

  if (size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File exceeds maximum limit of 25 MB (${(size / 1024 / 1024).toFixed(1)} MB provided).` };
  }

  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    return {
      valid: false,
      error: `Unsupported file type '${contentType}'. Permitted types: PDF, PNG, JPG, GeoJSON, CSV.`,
    };
  }

  // Sanitize filename to prevent directory traversal
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

  return { valid: true, sanitizedFilename: sanitized };
}

/**
 * Generates an isolated, non-guessable storage path.
 * Format: projects/{projectId}/{evidenceCategory}/{randomId}_{sanitizedFilename}
 */
export function generateStoragePath(
  projectId: string,
  category: string,
  filename: string
): string {
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `projects/${projectId}/${category}/${Date.now()}_${randomSuffix}_${cleanFilename}`;
}

/**
 * Creates a short-lived signed URL for an authorized user to view a private document.
 * Default expiration: 10 minutes (600 seconds).
 */
export async function getDocumentSignedUrl(
  storagePath: string,
  expiresInSeconds: number = 600
): Promise<{ url: string | null; error?: string }> {
  if (!isServerSupabaseConfigured()) {
    return {
      url: null,
      error: "Supabase storage is not configured in this environment.",
    };
  }

  try {
    // If admin is configured, use it, or use server supabase client
    const supabase = isSupabaseAdminConfigured()
      ? createAdminClient()
      : createServerSupabaseClient();

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      return { url: null, error: error?.message || "Failed to generate signed download URL." };
    }

    return { url: data.signedUrl };
  } catch (err) {
    return { url: null, error: (err as Error).message };
  }
}

