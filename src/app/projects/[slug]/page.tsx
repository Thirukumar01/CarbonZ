import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug } from "@/lib/projects";
import { ScoreBreakdownCard } from "@/components/ScoreBreakdownCard";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getStatusBadge } from "@/lib/workflow";
import {
  MapPin,
  Calendar,
  Building2,
  FileText,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  ExternalLink,
  Lock,
  Download,
  AlertCircle,
  Clock,
} from "lucide-react";

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { project } = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found | CarbonZ" };

  return {
    title: `${project.name} | CarbonZ Project Detail`,
    description: project.description.slice(0, 160),
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { project, isDemoData } = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const statusBadge = getStatusBadge(project.verification_status);

  return (
    <div>
      {isDemoData && <DemoDataBanner />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: "Projects Explorer", href: "/projects" },
            { label: project.name },
          ]}
        />

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {project.project_code}
                </span>

                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-50 text-forest-800 border border-forest-200 uppercase tracking-wide">
                  {project.project_type.replace("_", " ")}
                </span>

                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${statusBadge.badgeBg} ${statusBadge.badgeColor}`}
                >
                  {statusBadge.label}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight leading-snug">
                {project.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {project.region}, {project.country}
                </span>

                {project.developer && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    Developer: <strong className="text-slate-700">{project.developer.organization || project.developer.display_name}</strong>
                  </span>
                )}

                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Registered: {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Quick Actions / Passport Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href={`/projects/${project.slug}/passport`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-accent-cyan" />
                View Carbon Passport
              </Link>

              <Link
                href={`/compare?ids=${project.id}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
              >
                <Layers className="w-4 h-4" />
                Compare Metrics
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Left 2 cols overview & evidence, Right 1 col Trust Score */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            {/* Project Overview */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                <FileText className="w-5 h-5 text-forest-700" />
                Project Description & Scope
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Methodology Standard
                  </span>
                  <span className="text-sm font-bold text-navy-950 font-mono mt-1 block">
                    {project.methodology}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Estimated Annual Reduction
                  </span>
                  <span className="text-sm font-bold text-navy-950 font-mono mt-1 block">
                    {project.estimated_reduction
                      ? `${project.estimated_reduction.toLocaleString()} ${project.units}`
                      : "Pending Verification"}
                  </span>
                </div>
              </div>
            </section>

            {/* Distinction Box: Submitted Claims vs Verified Evidence */}
            <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2 text-xs text-blue-900 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-blue-950">
                <AlertCircle className="w-4 h-4 text-blue-700" />
                Data Integrity Notice: Claims vs. Audited Evidence
              </div>
              <p>
                CarbonZ strictly separates <strong>developer-submitted claims</strong> (such as proposed methodology and self-reported reduction estimates) from <strong>independently verified evidence</strong>. Supporting evidence documents below have been checked by accredited reviewers against physical GIS telemetry and audit reports.
              </p>
            </div>

            {/* Supporting Evidence Documents */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                  <Award className="w-5 h-5 text-forest-700" />
                  Supporting Evidence & Audit Reports
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {project.documents?.length || 0} documents on file
                </span>
              </div>

              {!project.documents || project.documents.length === 0 ? (
                <div className="p-6 rounded-lg border border-dashed border-slate-200 text-center bg-slate-50">
                  <p className="text-xs text-slate-500">
                    No public audit documents have been published for this project dossier yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.documents.map((doc) => {
                    const isPublic = doc.visibility === "public";
                    const sizeMb = (doc.file_size / (1024 * 1024)).toFixed(2);

                    return (
                      <div
                        key={doc.id}
                        className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-navy-900 truncate max-w-sm">
                              {doc.original_filename}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                              {doc.evidence_category.replace("_", " ")}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 flex items-center gap-3">
                            <span>Size: {sizeMb} MB</span>
                            <span>Status: <strong className="text-forest-700 uppercase">{doc.review_status}</strong></span>
                            <span>Visibility: {doc.visibility}</span>
                          </div>
                        </div>

                        {isPublic ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white text-forest-700 hover:text-forest-800 text-xs font-semibold border border-slate-200 shadow-xs">
                            <Download className="w-3.5 h-3.5" />
                            Public Audit Dossier
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                            <Lock className="w-3.5 h-3.5" />
                            Confidential Reviewer Record
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Public Verification History / Reviewer Audit Notes */}
            {project.reviews && project.reviews.length > 0 && (
              <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-forest-700" />
                  Technical Review Decision Record
                </h2>

                <div className="space-y-3">
                  {project.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-2 py-0.5 rounded">
                          Decision: {rev.decision}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(rev.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-slate-900">Findings:</strong> {rev.review_notes}
                      </p>
                      {rev.requested_changes && (
                        <p className="text-xs text-amber-900 bg-amber-50 p-2 rounded border border-amber-200">
                          <strong>Requested Revisions:</strong> {rev.requested_changes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Carbon Trust Score Breakdown Card */}
          <div className="lg:col-span-5 space-y-6">
            <ScoreBreakdownCard score={project.trust_score} />

            {/* Passport Callout Card */}
            <div className="p-6 rounded-xl border border-navy-900 bg-gradient-to-br from-navy-950 to-navy-900 text-white shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent-cyan" />
                <h3 className="font-bold text-white text-base">Carbon Passport Traceability</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inspect public timeline milestones, historical status transitions, and data integrity proofs recorded for this project on the CarbonZ Passport ledger.
              </p>
              <Link
                href={`/projects/${project.slug}/passport`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-cyan hover:text-white transition-colors pt-2"
              >
                Inspect Public Carbon Passport
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

