"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabaseClient, isServerSupabaseConfigured } from "@/lib/supabase/server";
import { createProjectSchema } from "@/lib/validators";
import { canTransitionStatus } from "@/lib/workflow";
import { calculateCarbonTrustScore, ScoreComponents } from "@/lib/trust-score";
import { VerificationStatus } from "@/types/database";

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Creates a new draft carbon project dossier.
 */
export async function createProjectAction(
  formData: unknown
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const session = await getCurrentUser();

    if (!session.isAuthenticated || !session.user) {
      return {
        success: false,
        error: "Authentication required. Please sign in to create projects.",
      };
    }

    if (session.role !== "developer" && session.role !== "admin") {
      return {
        success: false,
        error: "Only registered Developers and Administrators can register new projects.",
      };
    }

    // Validate inputs with Zod
    const parsed = createProjectSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((i) => i.message).join(", "),
      };
    }

    const { name, description, project_type, country, region, methodology, estimated_reduction, units } =
      parsed.data;

    // Generate unique slug and project code
    const slugBase = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${slugBase}-${randomSuffix}`;

    const countryCode = country.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "XXX");
    const year = new Date().getFullYear();
    const codeNum = Math.floor(100 + Math.random() * 900);
    const projectCode = `CZ-${countryCode}-${year}-${codeNum}`;

    if (isServerSupabaseConfigured()) {
      const supabase = createServerSupabaseClient();

      const { data, error } = await (supabase as any)
        .from("projects")
        .insert({
          project_code: projectCode,
          name,
          slug,
          description,
          project_type,
          country,
          region,
          developer_id: session.user.id,
          methodology,
          estimated_reduction: estimated_reduction ?? null,
          units,
          verification_status: "draft",
          publication_status: "draft",
        })
        .select("id, slug")
        .single();

      if (error || !data) {
        return { success: false, error: error?.message || "Failed to create project in database." };
      }

      // Append initial passport event
      await (supabase as any).from("passport_events").insert({
        project_id: data.id,
        event_type: "creation",
        public_description: `Project registered in draft status by ${session.profile?.display_name || "developer"}.`,
        metadata: { actor: session.user.email, role: session.role },
        created_by: session.user.id,
      });

      // Audit log
      await (supabase as any).from("audit_logs").insert({
        actor_id: session.user.id,
        action: "project_created",
        entity_type: "projects",
        entity_id: data.id,
        metadata: { project_code: projectCode, name },
      });

      revalidatePath("/projects");
      revalidatePath("/dashboard/developer");

      return { success: true, data: { id: data.id, slug: data.slug } };
    }

    // Fallback for demonstration / local offline mode
    revalidatePath("/projects");
    return {
      success: true,
      data: {
        id: `demo-${randomSuffix}`,
        slug,
      },
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Submits a project for independent verification review.
 */
export async function submitProjectForReviewAction(
  projectId: string
): Promise<ActionResult> {
  try {
    const session = await getCurrentUser();

    if (!session.isAuthenticated || !session.user) {
      return { success: false, error: "Authentication required." };
    }

    if (!isServerSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = createServerSupabaseClient();
    const { data: project, error: fetchErr } = await (supabase as any)
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (fetchErr || !project) {
      return { success: false, error: "Project not found." };
    }

    const isOwner = project.developer_id === session.user.id;
    const transitionCheck = canTransitionStatus({
      currentStatus: project.verification_status,
      targetStatus: "submitted",
      userRole: session.role,
      isDeveloperOwner: isOwner,
    });

    if (!transitionCheck.allowed) {
      return { success: false, error: transitionCheck.reason };
    }

    const { error: updateErr } = await (supabase as any)
      .from("projects")
      .update({
        verification_status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    // Append passport event
    await (supabase as any).from("passport_events").insert({
      project_id: projectId,
      event_type: "submission",
      public_description: "Project dossier formally submitted for verification review.",
      metadata: { methodology: project.methodology },
      created_by: session.user.id,
    });

    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/dashboard/developer");

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Records an independent reviewer decision (approve, request changes, reject).
 */
export async function recordReviewDecisionAction({
  projectId,
  decision,
  reviewNotes,
  requestedChanges,
  scores,
}: {
  projectId: string;
  decision: "approved" | "changes_requested" | "rejected";
  reviewNotes: string;
  requestedChanges?: string;
  scores?: ScoreComponents;
}): Promise<ActionResult> {
  try {
    const session = await getCurrentUser();

    if (!session.isAuthenticated || !session.user) {
      return { success: false, error: "Authentication required." };
    }

    if (session.role !== "reviewer" && session.role !== "admin") {
      return { success: false, error: "Only Reviewers and Admins can record review decisions." };
    }

    if (!isServerSupabaseConfigured()) {
      return { success: true };
    }

    const supabase = createServerSupabaseClient();
    const { data: project, error: fetchErr } = await (supabase as any)
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (fetchErr || !project) {
      return { success: false, error: "Project not found." };
    }

    // Conflict of interest check: Developer cannot verify their own project!
    const isOwner = project.developer_id === session.user.id;
    if (isOwner && session.role !== "admin") {
      return {
        success: false,
        error: "Conflict of Interest: You cannot review or verify a project you own.",
      };
    }

    const targetStatus: VerificationStatus =
      decision === "approved"
        ? "verified"
        : decision === "changes_requested"
        ? "changes_requested"
        : "rejected";

    // Insert verification review record
    const { error: reviewErr } = await (supabase as any).from("verification_reviews").insert({
      project_id: projectId,
      reviewer_id: session.user.id,
      decision,
      review_notes: reviewNotes,
      requested_changes: requestedChanges || null,
    });

    if (reviewErr) {
      return { success: false, error: reviewErr.message };
    }

    // Update project status
    const updatePayload: any = {
      verification_status: targetStatus,
    };
    if (decision === "approved") {
      updatePayload.verified_at = new Date().toISOString();
      updatePayload.publication_status = "published";
    }

    const { error: updateErr } = await (supabase as any)
      .from("projects")
      .update(updatePayload)
      .eq("id", projectId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    // If approved and scores provided, calculate and store trust score
    if (decision === "approved" && scores) {
      const calcResult = calculateCarbonTrustScore(scores);
      if (calcResult.isValid) {
        await (supabase as any).from("trust_scores").insert({
          project_id: projectId,
          documentation_score: scores.documentation,
          verification_score: scores.verification,
          evidence_score: scores.evidence,
          history_score: scores.history,
          transparency_score: scores.transparency,
          calculated_score: calcResult.score,
          formula_version: calcResult.formulaVersion,
          calculation_status: "valid",
          calculated_by: session.profile?.display_name || "reviewer",
        });
      }
    }

    // Append passport event
    await (supabase as any).from("passport_events").insert({
      project_id: projectId,
      event_type:
        decision === "approved"
          ? "verification"
          : decision === "changes_requested"
          ? "changes_requested"
          : "rejection",
      public_description: `Technical review decision recorded: ${decision.toUpperCase()}. ${reviewNotes}`,
      metadata: { decision, reviewer_role: session.role },
      created_by: session.user.id,
    });

    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/dashboard/reviewer");
    revalidatePath("/dashboard/developer");

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
