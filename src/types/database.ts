export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "public" | "user" | "developer" | "reviewer" | "admin";

export type ProjectType =
  | "reforestation"
  | "afforestation"
  | "renewable_energy"
  | "methane_capture"
  | "direct_air_capture"
  | "blue_carbon"
  | "soil_carbon"
  | "improved_forest_management"
  | "other";

export type VerificationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "verified"
  | "changes_requested"
  | "rejected";

export type PublicationStatus = "draft" | "published" | "archived";

export type EvidenceCategory =
  | "baseline_study"
  | "monitoring_report"
  | "pdd"
  | "audit_report"
  | "land_tenure"
  | "satellite_imagery"
  | "legal_ownership"
  | "financial_additionality"
  | "other";

export type DocumentVisibility = "private" | "restricted" | "public";
export type DocumentReviewStatus = "pending" | "accepted" | "flagged" | "rejected";
export type ReviewDecision = "approved" | "changes_requested" | "rejected";
export type PassportEventType =
  | "creation"
  | "submission"
  | "review_started"
  | "changes_requested"
  | "resubmission"
  | "verification"
  | "rejection"
  | "issuance"
  | "monitoring_update";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          role: UserRole;
          organization: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          role?: UserRole;
          organization?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          role?: UserRole;
          organization?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          project_code: string;
          name: string;
          slug: string;
          description: string;
          project_type: ProjectType;
          country: string;
          region: string;
          developer_id: string;
          methodology: string;
          estimated_reduction: number | null;
          units: string;
          verification_status: VerificationStatus;
          publication_status: PublicationStatus;
          created_at: string;
          updated_at: string;
          submitted_at: string | null;
          verified_at: string | null;
        };
        Insert: {
          id?: string;
          project_code: string;
          name: string;
          slug: string;
          description: string;
          project_type: ProjectType;
          country: string;
          region: string;
          developer_id: string;
          methodology: string;
          estimated_reduction?: number | null;
          units?: string;
          verification_status?: VerificationStatus;
          publication_status?: PublicationStatus;
          created_at?: string;
          updated_at?: string;
          submitted_at?: string | null;
          verified_at?: string | null;
        };
        Update: {
          id?: string;
          project_code?: string;
          name?: string;
          slug?: string;
          description?: string;
          project_type?: ProjectType;
          country?: string;
          region?: string;
          developer_id?: string;
          methodology?: string;
          estimated_reduction?: number | null;
          units?: string;
          verification_status?: VerificationStatus;
          publication_status?: PublicationStatus;
          updated_at?: string;
          submitted_at?: string | null;
          verified_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "projects_developer_id_fkey";
            columns: ["developer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      project_documents: {
        Row: {
          id: string;
          project_id: string;
          uploaded_by: string;
          storage_path: string;
          original_filename: string;
          content_type: string;
          file_size: number;
          evidence_category: EvidenceCategory;
          visibility: DocumentVisibility;
          review_status: DocumentReviewStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          uploaded_by: string;
          storage_path: string;
          original_filename: string;
          content_type: string;
          file_size: number;
          evidence_category: EvidenceCategory;
          visibility?: DocumentVisibility;
          review_status?: DocumentReviewStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          uploaded_by?: string;
          storage_path?: string;
          original_filename?: string;
          content_type?: string;
          file_size?: number;
          evidence_category?: EvidenceCategory;
          visibility?: DocumentVisibility;
          review_status?: DocumentReviewStatus;
        };
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      verification_reviews: {
        Row: {
          id: string;
          project_id: string;
          reviewer_id: string;
          decision: ReviewDecision;
          review_notes: string;
          requested_changes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          reviewer_id: string;
          decision: ReviewDecision;
          review_notes: string;
          requested_changes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          reviewer_id?: string;
          decision?: ReviewDecision;
          review_notes?: string;
          requested_changes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "verification_reviews_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      trust_scores: {
        Row: {
          id: string;
          project_id: string;
          documentation_score: number;
          verification_score: number;
          evidence_score: number;
          history_score: number;
          transparency_score: number;
          calculated_score: number;
          formula_version: string;
          calculation_status: "valid" | "stale" | "incomplete" | "error";
          calculated_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          documentation_score: number;
          verification_score: number;
          evidence_score: number;
          history_score: number;
          transparency_score: number;
          calculated_score: number;
          formula_version?: string;
          calculation_status?: "valid" | "stale" | "incomplete" | "error";
          calculated_by?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          documentation_score?: number;
          verification_score?: number;
          evidence_score?: number;
          history_score?: number;
          transparency_score?: number;
          calculated_score?: number;
          formula_version?: string;
          calculation_status?: "valid" | "stale" | "incomplete" | "error";
          calculated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trust_scores_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      passport_events: {
        Row: {
          id: string;
          project_id: string;
          event_type: PassportEventType;
          public_description: string;
          metadata: Json;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          event_type: PassportEventType;
          public_description: string;
          metadata?: Json;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          event_type?: PassportEventType;
          public_description?: string;
          metadata?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "passport_events_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          metadata?: Json;
        };
        Relationships: [];
      };
      saved_projects: {
        Row: {
          user_id: string;
          project_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          project_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          project_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_projects_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
