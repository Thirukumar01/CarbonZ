import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug } from "@/lib/projects";
import { PassportTimeline } from "@/components/PassportTimeline";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getStatusBadge } from "@/lib/workflow";
import { getTrustScoreTier } from "@/lib/trust-score";
import {
  ShieldCheck,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  FileText,
  Share2,
  Printer,
  Lock,
  ArrowLeft,
} from "lucide-react";

interface PassportPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PassportPageProps) {
  const { project } = await getProjectBySlug(params.slug);
  if (!project) return { title: "Passport Not Found | CarbonZ" };

  return {
    title: `Carbon Passport — ${project.project_code} | CarbonZ`,
    description: `Public traceability ledger and verification milestone history for ${project.name}.`,
  };
}

export default async function PassportPage({ params }: PassportPageProps) {
  const { project, isDemoData } = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  // Prevent viewing unpublished passport unless verified
  if (project.publication_status !== "published") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Lock className="w-12 h-12 text-slate-400 mx-auto" />
        <h1 className="text-2xl font-bold text-navy-950">Passport Not Published</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          The Carbon Passport for this project has not been published to the public ledger yet. Passports are activated upon project verification and publication.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explorer
        </Link>
      </div>
    );
  }

  const statusBadge = getStatusBadge(project.verification_status);
  const score = project.trust_score?.calculated_score;
  const tier = score !== undefined ? getTrustScoreTier(score) : null;

  return (
    <div>
      {isDemoData && <DemoDataBanner />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: "Projects Explorer", href: "/projects" },
            { label: project.name, href: `/projects/${project.slug}` },
            { label: "Carbon Passport" },
          ]}
        />

        {/* Official Passport Certificate Card */}
        <div className="bg-white rounded-2xl border-2 border-forest-900/20 shadow-md p-6 sm:p-10 relative overflow-hidden">
          {/* Subtle watermark background icon */}
          <ShieldCheck className="w-72 h-72 text-forest-50/60 absolute -right-16 -bottom-16 pointer-events-none" />

          {/* Top Security Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-forest-900 text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-7 h-7 text-accent-cyan" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
                  Public Traceability Ledger
                </span>
                <h1 className="text-2xl font-black text-navy-950 tracking-tight">
                  Carbon Passport
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1 rounded-md border border-slate-200 font-bold">
                ID: {project.project_code}
              </span>
            </div>
          </div>

          {/* Project Summary in Passport Header */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
            <div className="md:col-span-2 space-y-2">
              <h2 className="text-xl font-bold text-navy-950 leading-snug">
                {project.name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {project.region}, {project.country}
                </span>
                <span>Type: <strong className="text-slate-700 uppercase">{project.project_type.replace("_", " ")}</strong></span>
                <span>Methodology: <strong className="text-slate-700 font-mono">{project.methodology}</strong></span>
              </div>
            </div>

            <div className="flex flex-col justify-center items-start md:items-end space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Audited Carbon Trust Score
              </span>
              {score !== undefined ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-navy-950 font-mono">
                    {Math.round(score)}
                  </span>
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                  {tier && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tier.badgeBg}`}>
                      {tier.tier}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">Score Pending Audit</span>
              )}
              <span className="text-[10px] text-slate-400">Formula Version v1.0</span>
            </div>
          </div>

          {/* Traceability Timeline Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-navy-950">
                  Chronological Verification Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Public immutable record of milestones, audit decisions, and telemetry confirmations.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-forest-50 text-forest-800 border border-forest-200">
                {project.passport_events?.length || 0} Events Recorded
              </span>
            </div>

            <PassportTimeline events={project.passport_events} />
          </div>

          {/* Privacy & Safe Disclosure Notice */}
          <div className="mt-10 pt-6 border-t border-slate-200 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span>
              <strong>Safe Disclosure Guarantee:</strong> Private developer records, unredacted land titles, and internal deliberations are protected from public disclosure.
            </span>
            <Link
              href={`/projects/${project.slug}`}
              className="text-forest-700 hover:text-forest-800 font-semibold shrink-0"
            >
              View Full Project Dossier →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
