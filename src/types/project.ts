import { Database, ProjectType, VerificationStatus, PublicationStatus, EvidenceCategory, DocumentVisibility, DocumentReviewStatus, PassportEventType } from "./database";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type TrustScoreRow = Database["public"]["Tables"]["trust_scores"]["Row"];
export type ProjectDocumentRow = Database["public"]["Tables"]["project_documents"]["Row"];
export type PassportEventRow = Database["public"]["Tables"]["passport_events"]["Row"];
export type VerificationReviewRow = Database["public"]["Tables"]["verification_reviews"]["Row"];
export type SavedProjectRow = Database["public"]["Tables"]["saved_projects"]["Row"];
export type AuditLogRow = Database["public"]["Tables"]["audit_logs"]["Row"];

export interface FullProject extends ProjectRow {
  developer?: {
    id: string;
    display_name: string;
    organization: string | null;
  } | null;
  trust_score?: TrustScoreRow | null;
  documents?: ProjectDocumentRow[];
  passport_events?: PassportEventRow[];
  reviews?: VerificationReviewRow[];
  is_saved?: boolean;
}

export interface ProjectFilters {
  search?: string;
  project_type?: ProjectType | "all";
  verification_status?: VerificationStatus | "all";
  country?: string | "all";
  min_score?: number;
  max_score?: number;
  sort_by?: "newest" | "oldest" | "score_desc" | "score_asc" | "reduction_desc";
  page?: number;
  page_size?: number;
}
