import Link from "next/link";
import { getProjects, getProjectsForComparison } from "@/lib/projects";
import { DemoDataBanner } from "@/components/DemoDataBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getStatusBadge } from "@/lib/workflow";
import { getTrustScoreTier, SCORE_WEIGHTS } from "@/lib/trust-score";
import {
  Scale,
  Plus,
  Trash2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

interface ComparePageProps {
  searchParams: {
    ids?: string;
  };
}

export const metadata = {
  title: "Compare Carbon Projects | CarbonZ",
  description:
    "Side-by-side comparison of carbon projects across methodology, evidence quality, and Trust Score breakdowns.",
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  // If no IDs provided, default to two prominent demo projects for an immediate comparison experience
  const requestedIds = searchParams.ids
    ? searchParams.ids.split(",").map((s) => s.trim()).filter(Boolean)
    : [
        "amazon-rainforest-corridor-restoration",
        "gujarat-rural-dairy-methane-recovery",
      ];

  const { projects: comparedProjects, isDemoData } = await getProjectsForComparison(
    requestedIds
  );

  // Also fetch list of published projects so users can add other projects to the comparison
  const { projects: allProjects } = await getProjects({ page: 1, page_size: 20 });

  return (
    <div>
      {isDemoData && <DemoDataBanner />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: "Project Comparison" }]} />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest-700 mb-1">
              <Scale className="w-4 h-4" />
              Side-by-Side Analysis
            </div>
            <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
              Compare Carbon Projects
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Inspect methodology differences, evidence density, and component-by-component Trust Score contributions across audited initiatives.
            </p>
          </div>

          <div className="text-xs text-slate-500">
            Comparing <strong className="text-navy-950">{comparedProjects.length}</strong> of 3 max projects
          </div>
        </div>

        {/* Honest Comparison Nuance Banner */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-950 block mb-0.5">
              Honest Assessment Guidance:
            </strong>
            A higher Carbon Trust Score indicates superior documentation completeness, audit currency, and verified evidence transparency. It does <strong>not</strong> necessarily mean greater total atmospheric CO2 removal, nor does it guarantee equivalence between nature-based and technological removal methodologies.
          </div>
        </div>

        {/* Project Selector Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-600">Add to comparison:</span>
          {allProjects
            .filter((p) => !comparedProjects.some((cp) => cp.id === p.id || cp.slug === p.slug))
            .slice(0, 5)
            .map((p) => {
              const currentIds = comparedProjects.map((cp) => cp.id);
              const newIds = [...currentIds, p.id].slice(0, 3);
              return (
                <Link
                  key={p.id}
                  href={`/compare?ids=${newIds.join(",")}`}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-forest-50 hover:text-forest-800 text-slate-700 border border-slate-200 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  {p.project_code} ({p.project_type.replace("_", " ")})
                </Link>
              );
            })}
        </div>

        {/* Comparison Matrix Table */}
        {comparedProjects.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <Scale className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Projects Selected</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Select at least one project from the Explorer to inspect detailed comparison metrics.
            </p>
            <Link
              href="/projects"
              className="mt-4 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-forest-700 text-white text-xs font-semibold"
            >
              Go to Explorer
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="p-4 sm:p-5 w-48 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                    Metric / Attribute
                  </th>
                  {comparedProjects.map((p) => {
                    const removeLink = `/compare?ids=${comparedProjects
                      .filter((cp) => cp.id !== p.id)
                      .map((cp) => cp.id)
                      .join(",")}`;

                    return (
                      <th key={p.id} className="p-4 sm:p-5 min-w-[260px] align-top">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-mono text-[11px] text-slate-400 font-semibold">
                            {p.project_code}
                          </span>
                          {comparedProjects.length > 1 && (
                            <Link
                              href={removeLink}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Remove from comparison"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>

                        <Link
                          href={`/projects/${p.slug}`}
                          className="font-bold text-sm text-navy-950 hover:text-forest-700 block mt-1 line-clamp-2"
                        >
                          {p.name}
                        </Link>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* Row: Status */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">
                    Verification Status
                  </td>
                  {comparedProjects.map((p) => {
                    const badge = getStatusBadge(p.verification_status);
                    return (
                      <td key={p.id} className="p-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${badge.badgeBg} ${badge.badgeColor}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Row: Project Type */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">
                    Project Type
                  </td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 font-medium uppercase text-slate-800">
                      {p.project_type.replace("_", " ")}
                    </td>
                  ))}
                </tr>

                {/* Row: Country & Region */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">
                    Geography
                  </td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4">
                      {p.region}, <strong>{p.country}</strong>
                    </td>
                  ))}
                </tr>

                {/* Row: Methodology */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">
                    Methodology
                  </td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 font-mono text-xs">
                      {p.methodology}
                    </td>
                  ))}
                </tr>

                {/* Row: Annual Reduction */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">
                    Est. CO2 Reduction
                  </td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 font-mono font-bold text-navy-950">
                      {p.estimated_reduction
                        ? `${p.estimated_reduction.toLocaleString()} ${p.units}`
                        : "Pending Verification"}
                    </td>
                  ))}
                </tr>

                {/* Row: Total Carbon Trust Score */}
                <tr className="bg-forest-50/40">
                  <td className="p-4 font-bold text-forest-900 bg-forest-100/50">
                    Carbon Trust Score
                  </td>
                  {comparedProjects.map((p) => {
                    const score = p.trust_score?.calculated_score;
                    const tier = score !== undefined ? getTrustScoreTier(score) : null;
                    return (
                      <td key={p.id} className="p-4">
                        {score !== undefined ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-navy-950 font-mono">
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
                          <span className="text-slate-400 italic">Score not yet calculated</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Row: D - Documentation (30%) */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">
                    Documentation (30%)
                  </td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 font-mono">
                      {p.trust_score ? (
                        <div>
                          <span className="font-bold">{p.trust_score.documentation_score}</span>/100
                          <span className="text-slate-400 text-[10px] block">
                            Contrib: +{(p.trust_score.documentation_score * SCORE_WEIGHTS.documentation).toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row: V - Verification (25%) */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">
                    Verification (25%)
                  </td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 font-mono">
                      {p.trust_score ? (
                        <div>
                          <span className="font-bold">{p.trust_score.verification_score}</span>/100
                          <span className="text-slate-400 text-[10px] block">
                            Contrib: +{(p.trust_score.verification_score * SCORE_WEIGHTS.verification).toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row: E - Evidence (20%) */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">
                    Evidence Quality (20%)
                  </td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 font-mono">
                      {p.trust_score ? (
                        <div>
                          <span className="font-bold">{p.trust_score.evidence_score}</span>/100
                          <span className="text-slate-400 text-[10px] block">
                            Contrib: +{(p.trust_score.evidence_score * SCORE_WEIGHTS.evidence).toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row: H - History (15%) */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">
                    History & Traceability (15%)
                  </td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 font-mono">
                      {p.trust_score ? (
                        <div>
                          <span className="font-bold">{p.trust_score.history_score}</span>/100
                          <span className="text-slate-400 text-[10px] block">
                            Contrib: +{(p.trust_score.history_score * SCORE_WEIGHTS.history).toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row: T - Transparency (10%) */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">
                    Transparency (10%)
                  </td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 font-mono">
                      {p.trust_score ? (
                        <div>
                          <span className="font-bold">{p.trust_score.transparency_score}</span>/100
                          <span className="text-slate-400 text-[10px] block">
                            Contrib: +{(p.trust_score.transparency_score * SCORE_WEIGHTS.transparency).toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row: Action Links */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">
                    Actions
                  </td>
                  {comparedProjects.map((p) => (
                    <td key={p.id} className="p-4 space-y-2">
                      <Link
                        href={`/projects/${p.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 hover:text-forest-800"
                      >
                        Inspect Full Dossier
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <div>
                        <Link
                          href={`/projects/${p.slug}/passport`}
                          className="inline-flex items-center gap-1 text-[11px] text-navy-800 hover:text-navy-950 font-semibold"
                        >
                          <ShieldCheck className="w-3 h-3 text-accent-cyan" />
                          View Passport
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

