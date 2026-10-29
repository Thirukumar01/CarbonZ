"use client";

import { useState } from "react";
import Link from "next/link";
import { FullProject } from "@/types/project";
import { recordReviewDecisionAction } from "@/app/actions/projects";
import { calculateCarbonTrustScore, SCORE_WEIGHTS } from "@/lib/trust-score";
import { getStatusBadge } from "@/lib/workflow";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  X,
  Award,
  Sliders,
} from "lucide-react";

interface ReviewerDashboardClientProps {
  initialProjects: FullProject[];
  reviewerDisplayName: string;
}

export function ReviewerDashboardClient({
  initialProjects,
  reviewerDisplayName,
}: ReviewerDashboardClientProps) {
  const [projects, setProjects] = useState<FullProject[]>(initialProjects);
  const [activeReviewProject, setActiveReviewProject] = useState<FullProject | null>(null);
  const [decision, setDecision] = useState<"approved" | "changes_requested" | "rejected">("approved");
  const [reviewNotes, setReviewNotes] = useState("");
  const [requestedChanges, setRequestedChanges] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  // Score Component Inputs
  const [scores, setScores] = useState({
    documentation: 80,
    verification: 90,
    evidence: 70,
    history: 60,
    transparency: 75,
  });

  const previewCalc = calculateCarbonTrustScore(scores);

  const handleOpenReview = (project: FullProject) => {
    setActiveReviewProject(project);
    setDecision("approved");
    setReviewNotes("");
    setRequestedChanges("");
  };

  const handleRecordDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReviewProject) return;

    if (reviewNotes.trim().length < 15) {
      alert("Review notes must contain at least 15 characters of substantiated findings.");
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const res = await recordReviewDecisionAction({
      projectId: activeReviewProject.id,
      decision,
      reviewNotes,
      requestedChanges: decision === "changes_requested" ? requestedChanges : undefined,
      scores: decision === "approved" ? scores : undefined,
    });

    setIsSubmitting(false);

    if (res.success) {
      setFeedback({
        type: "success",
        message: `Review decision successfully recorded for ${activeReviewProject.project_code}: ${decision.toUpperCase()}!`,
      });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeReviewProject.id
            ? {
                ...p,
                verification_status:
                  decision === "approved"
                    ? "verified"
                    : decision === "changes_requested"
                    ? "changes_requested"
                    : "rejected",
              }
            : p
        )
      );
      setActiveReviewProject(null);
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Failed to record review decision.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-start gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Reviewer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">
            Verification Reviewer Bureau
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Active Auditor: <strong className="text-slate-700">{reviewerDisplayName}</strong> • Accredited Bureau Standard
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Pending Review Queue:{" "}
          <strong className="text-navy-950">
            {projects.filter((p) => p.verification_status === "under_review" || p.verification_status === "submitted").length}
          </strong>
        </div>
      </div>

      {/* Submissions Queue Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Audit & Verification Queue
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => {
            const badge = getStatusBadge(project.verification_status);
            const isAuditable =
              project.verification_status === "under_review" ||
              project.verification_status === "submitted" ||
              project.verification_status === "changes_requested";

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-slate-400 font-semibold">
                      {project.project_code}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {project.project_type.replace("_", " ")}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${badge.badgeBg} ${badge.badgeColor}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-navy-950">
                    {project.name}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-500">
                    <span>Methodology: <strong className="text-slate-700 font-mono">{project.methodology}</strong></span>
                    <span>Country: <strong>{project.country}</strong></span>
                    <span>
                      Evidence Documents: <strong>{project.documents?.length || 0} attached</strong>
                    </span>
                  </div>
                </div>

                {/* Audit Action Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                  >
                    Examine Files
                  </Link>

                  {isAuditable && (
                    <button
                      onClick={() => handleOpenReview(project)}
                      className="px-3.5 py-1.5 rounded bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Record Audit Decision
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review & Score Assignment Modal */}
      {activeReviewProject && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {activeReviewProject.project_code}
                </span>
                <h3 className="text-lg font-bold text-navy-950">
                  Independent Verification Audit
                </h3>
              </div>
              <button
                onClick={() => setActiveReviewProject(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordDecision} className="space-y-5">
              {/* Decision Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Verification Decision *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecision("approved")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      decision === "approved"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    ✓ Approve & Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecision("changes_requested")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      decision === "changes_requested"
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    ⚠ Request Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecision("rejected")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      decision === "rejected"
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    ✕ Reject Project
                  </button>
                </div>
              </div>

              {/* Review Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Substantiated Technical Review Findings * (min 15 chars)
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Summarize evidence analysis, remote sensing GIS cross-referencing, and baseline conformity..."
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              {/* Changes Requested Textarea (if changes_requested) */}
              {decision === "changes_requested" && (
                <div>
                  <label className="block text-xs font-semibold text-amber-900 mb-1">
                    Specific Required Modifications for Developer *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={requestedChanges}
                    onChange={(e) => setRequestedChanges(e.target.value)}
                    placeholder="List missing soil core sampling depths, missing deeds, or methodology calibrations..."
                    className="w-full text-xs py-2 px-3 rounded-lg border border-amber-300 bg-amber-50/50"
                  />
                </div>
              )}

              {/* Trust Score Assessment Sliders (if approved) */}
              {decision === "approved" && (
                <div className="p-4 rounded-xl border border-forest-200 bg-forest-50/40 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-forest-200/60">
                    <div>
                      <h4 className="text-xs font-bold text-forest-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5" />
                        Carbon Trust Score Component Scoring
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Formula: 0.30D + 0.25V + 0.20E + 0.15H + 0.10T
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-navy-950 font-mono">
                        {previewCalc.roundedScore}
                      </span>
                      <span className="text-xs text-slate-400">/100</span>
                    </div>
                  </div>

                  {/* 5 Component Sliders */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Documentation (D - 30%):</span>
                        <span className="font-mono font-bold">{scores.documentation}/100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scores.documentation}
                        onChange={(e) => setScores({ ...scores, documentation: parseInt(e.target.value, 10) })}
                        className="w-full accent-forest-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Verification Status & Currency (V - 25%):</span>
                        <span className="font-mono font-bold">{scores.verification}/100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scores.verification}
                        onChange={(e) => setScores({ ...scores, verification: parseInt(e.target.value, 10) })}
                        className="w-full accent-forest-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Evidence Quality (E - 20%):</span>
                        <span className="font-mono font-bold">{scores.evidence}/100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scores.evidence}
                        onChange={(e) => setScores({ ...scores, evidence: parseInt(e.target.value, 10) })}
                        className="w-full accent-forest-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>History & Traceability (H - 15%):</span>
                        <span className="font-mono font-bold">{scores.history}/100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scores.history}
                        onChange={(e) => setScores({ ...scores, history: parseInt(e.target.value, 10) })}
                        className="w-full accent-forest-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Transparency (T - 10%):</span>
                        <span className="font-mono font-bold">{scores.transparency}/100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scores.transparency}
                        onChange={(e) => setScores({ ...scores, transparency: parseInt(e.target.value, 10) })}
                        className="w-full accent-forest-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveReviewProject(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-lg text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Recording..." : "Finalize Review Decision"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
