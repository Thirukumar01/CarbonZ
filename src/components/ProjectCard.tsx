import Link from "next/link";
import { FullProject } from "@/types/project";
import { getStatusBadge } from "@/lib/workflow";
import { getTrustScoreTier } from "@/lib/trust-score";
import { MapPin, Globe, ShieldCheck, ArrowRight, BookOpen, Layers } from "lucide-react";

interface ProjectCardProps {
  project: FullProject;
  showCompareToggle?: boolean;
  isCompared?: boolean;
  onToggleCompare?: (projectId: string) => void;
}

export function ProjectCard({
  project,
  showCompareToggle = true,
  isCompared = false,
  onToggleCompare,
}: ProjectCardProps) {
  const statusBadge = getStatusBadge(project.verification_status);
  const score = project.trust_score?.calculated_score;
  const tier = score !== undefined ? getTrustScoreTier(score) : null;

  const formatProjectType = (type: string) => {
    return type
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Banner / Type & Status */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-forest-50 text-forest-800 border border-forest-200">
            {formatProjectType(project.project_type)}
          </span>

          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${statusBadge.badgeBg} ${statusBadge.badgeColor}`}
          >
            {statusBadge.label}
          </span>
        </div>

        {/* Project Code & Title */}
        <div className="text-[11px] font-mono text-slate-400 font-medium mb-1">
          {project.project_code}
        </div>
        <Link href={`/projects/${project.slug}`}>
          <h3 className="text-base font-bold text-navy-950 group-hover:text-forest-700 transition-colors line-clamp-2 leading-snug">
            {project.name}
          </h3>
        </Link>

        {/* Location & Developer */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {project.country}, {project.region}
          </span>
          {project.developer && (
            <span className="text-slate-400">
              • {project.developer.organization || project.developer.display_name}
            </span>
          )}
        </div>

        {/* Description Snippet */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Middle Stats: CO2 Reduction & Trust Score */}
      <div className="px-5 py-3 bg-slate-50 border-y border-slate-100 flex items-center justify-between">
        <div>
          <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Est. Reduction
          </span>
          <span className="text-sm font-bold text-slate-800 font-mono">
            {project.estimated_reduction
              ? `${project.estimated_reduction.toLocaleString()} ${project.units}`
              : "In Validation"}
          </span>
        </div>

        <div className="text-right">
          <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Trust Score
          </span>
          {score !== undefined ? (
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-sm font-extrabold text-navy-950 font-mono">
                {Math.round(score)}
                <span className="text-xs font-normal text-slate-400">/100</span>
              </span>
              {tier && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${tier.badgeBg}`}>
                  {tier.tier}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">Pending review</span>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 pt-3 flex items-center justify-between text-xs">
        {showCompareToggle && onToggleCompare ? (
          <button
            onClick={() => onToggleCompare(project.id)}
            className={`flex items-center gap-1.5 font-medium px-2 py-1 rounded transition-colors ${
              isCompared
                ? "bg-forest-100 text-forest-800"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {isCompared ? "In Comparison" : "+ Compare"}
          </button>
        ) : (
          <Link
            href={`/projects/${project.slug}/passport`}
            className="text-forest-700 hover:text-forest-800 font-medium flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Passport
          </Link>
        )}

        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-forest-700 transition-colors"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

