import { TrustScoreRow } from "@/types/project";
import { getTrustScoreTier, SCORE_WEIGHTS } from "@/lib/trust-score";
import { ShieldCheck, HelpCircle } from "lucide-react";

interface ScoreBreakdownCardProps {
  score: TrustScoreRow | null | undefined;
  className?: string;
}

export function ScoreBreakdownCard({ score, className = "" }: ScoreBreakdownCardProps) {
  if (!score) {
    return (
      <div className={`p-6 rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <HelpCircle className="w-5 h-5 text-slate-400" />
          <h3 className="font-semibold text-slate-700">Carbon Trust Score</h3>
        </div>
        <p className="text-sm text-slate-500">
          Trust Score has not yet been computed for this project. Scores are generated during the technical verification stage once all 5 audit components are evaluated.
        </p>
      </div>
    );
  }

  const calculated = score.calculated_score;
  const tier = getTrustScoreTier(calculated);

  const components = [
    {
      key: "D",
      label: "Documentation Completeness",
      score: score.documentation_score,
      weight: SCORE_WEIGHTS.documentation,
      contribution: (score.documentation_score * SCORE_WEIGHTS.documentation).toFixed(1),
      desc: "Project design document, baseline studies, and legal tenure clarity.",
    },
    {
      key: "V",
      label: "Verification Status & Currency",
      score: score.verification_score,
      weight: SCORE_WEIGHTS.verification,
      contribution: (score.verification_score * SCORE_WEIGHTS.verification).toFixed(1),
      desc: "Methodology alignment, accredited reviewer audit, and review recency.",
    },
    {
      key: "E",
      label: "Evidence Quality",
      score: score.evidence_score,
      weight: SCORE_WEIGHTS.evidence,
      contribution: (score.evidence_score * SCORE_WEIGHTS.evidence).toFixed(1),
      desc: "High-integrity remote sensing, IoT telemetry, and laboratory soil/biomass assay.",
    },
    {
      key: "H",
      label: "History & Traceability",
      score: score.history_score,
      weight: SCORE_WEIGHTS.history,
      contribution: (score.history_score * SCORE_WEIGHTS.history).toFixed(1),
      desc: "Carbon Passport event continuity, reviewer feedback compliance, and track record.",
    },
    {
      key: "T",
      label: "Transparency",
      score: score.transparency_score,
      weight: SCORE_WEIGHTS.transparency,
      contribution: (score.transparency_score * SCORE_WEIGHTS.transparency).toFixed(1),
      desc: "Public accessibility of raw telemetry, monitoring reports, and governance data.",
    },
  ];

  return (
    <div className={`p-6 rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {/* Header with main score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-forest-700" />
            <h3 className="text-base font-bold text-navy-900">Carbon Trust Score</h3>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
              {score.formula_version}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculated on {new Date(score.created_at).toLocaleDateString()} by {score.calculated_by}
          </p>
        </div>

        <div className="flex items-baseline gap-3">
          <div className="text-4xl font-extrabold text-navy-950 tracking-tight">
            {Math.round(calculated)}
            <span className="text-lg font-normal text-slate-400">/100</span>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tier.badgeBg}`}>
            {tier.tier}
          </span>
        </div>
      </div>

      {/* Component Breakdown */}
      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider pb-1">
          <span>Component & Weight</span>
          <span>Score × Weight = Contribution</span>
        </div>

        {components.map((c) => (
          <div key={c.key} className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-forest-50 text-forest-800 text-xs font-bold flex items-center justify-center border border-forest-200">
                  {c.key}
                </span>
                <span className="font-medium text-slate-800">{c.label}</span>
                <span className="text-xs text-slate-400">({c.weight * 100}%)</span>
              </div>
              <div className="text-xs font-mono text-slate-700">
                <span className="font-bold">{c.score}</span> × {c.weight.toFixed(2)} ={" "}
                <span className="font-semibold text-navy-900">+{c.contribution}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-forest-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${c.score}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Formula Footnote */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-400 gap-2">
        <span className="font-mono text-[11px]">
          Score = 0.30D + 0.25V + 0.20E + 0.15H + 0.10T
        </span>
        <span className="text-[11px] text-slate-500 italic">
          Transparency metric only. Not a carbon credit guarantee.
        </span>
      </div>
    </div>
  );
}
