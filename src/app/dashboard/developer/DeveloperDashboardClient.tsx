"use client";

import { useState } from "react";
import Link from "next/link";
import { FullProject } from "@/types/project";
import { createProjectAction, submitProjectForReviewAction } from "@/app/actions/projects";
import { getStatusBadge } from "@/lib/workflow";
import {
  Plus,
  FileText,
  Send,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  Building2,
  MapPin,
} from "lucide-react";

interface DeveloperDashboardClientProps {
  initialProjects: FullProject[];
  userDisplayName: string;
}

export function DeveloperDashboardClient({
  initialProjects,
  userDisplayName,
}: DeveloperDashboardClientProps) {
  const [projects, setProjects] = useState<FullProject[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  // New Project Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    project_type: "reforestation",
    country: "",
    region: "",
    methodology: "",
    estimated_reduction: "",
    units: "tCO2e/year",
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    const payload = {
      ...formData,
      estimated_reduction: formData.estimated_reduction
        ? parseFloat(formData.estimated_reduction)
        : null,
    };

    const res = await createProjectAction(payload);
    setIsSubmitting(false);

    if (res.success && res.data) {
      setFeedback({
        type: "success",
        message: "Project successfully created in draft status! You may now attach supporting evidence dossiers.",
      });
      setIsModalOpen(false);
      setFormData({
        name: "",
        description: "",
        project_type: "reforestation",
        country: "",
        region: "",
        methodology: "",
        estimated_reduction: "",
        units: "tCO2e/year",
      });
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Failed to create project.",
      });
    }
  };

  const handleSubmitForReview = async (projectId: string) => {
    if (!confirm("Are you sure you want to formally submit this project for independent technical review?")) {
      return;
    }

    setFeedback(null);
    const res = await submitProjectForReviewAction(projectId);

    if (res.success) {
      setFeedback({
        type: "success",
        message: "Project dossier successfully submitted! An accredited reviewer will be assigned.",
      });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, verification_status: "submitted" } : p
        )
      );
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Failed to submit project for review.",
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

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">
            Developer Dossier Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registered as developer: <strong className="text-slate-700">{userDisplayName}</strong>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-forest-700 hover:bg-forest-800 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Register New Project
        </button>
      </div>

      {/* Developer Project Table / Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Your Project Submissions ({projects.length})
        </h3>

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">No Projects Registered</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Get started by registering your first carbon project to submit baseline methodologies and GIS evidence.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-lg bg-forest-700 text-white text-xs font-semibold"
            >
              Register First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => {
              const badge = getStatusBadge(project.verification_status);
              const canSubmit =
                project.verification_status === "draft" ||
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

                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-base font-bold text-navy-950 hover:text-forest-700 block transition-colors"
                    >
                      {project.name}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-500">
                      <span>Methodology: <strong className="text-slate-700">{project.methodology}</strong></span>
                      <span>Country: <strong>{project.country}</strong></span>
                      {project.estimated_reduction && (
                        <span>
                          Reduction: <strong>{project.estimated_reduction.toLocaleString()} {project.units}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      View Dossier
                    </Link>

                    {canSubmit && (
                      <button
                        onClick={() => handleSubmitForReview(project.id)}
                        className="px-3.5 py-1.5 rounded bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Submit for Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-navy-950">
                  Register New Carbon Project
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in baseline methodological parameters for independent verification.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bio-Corridor Native Forest Restoration Phase I"
                  className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Scope (min 30 characters) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed breakdown of ecological intervention, geographic baseline, and community impact..."
                  className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Type *
                  </label>
                  <select
                    value={formData.project_type}
                    onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                    className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="reforestation">Reforestation / ARR</option>
                    <option value="blue_carbon">Blue Carbon</option>
                    <option value="methane_capture">Methane Capture</option>
                    <option value="direct_air_capture">Direct Air Capture</option>
                    <option value="soil_carbon">Soil Carbon</option>
                    <option value="renewable_energy">Renewable Energy</option>
                    <option value="improved_forest_management">Improved Forest Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Methodology Standard *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.methodology}
                    onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                    placeholder="e.g. VM0007 / ACM0002"
                    className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. Colombia"
                    className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Region / Biome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="e.g. Orinoco River Basin"
                    className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Annual Reduction (tCO2e/year)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.estimated_reduction}
                  onChange={(e) => setFormData({ ...formData, estimated_reduction: e.target.value })}
                  placeholder="e.g. 50000"
                  className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Save Draft Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
