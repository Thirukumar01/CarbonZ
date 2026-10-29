/**
 * Carbon Trust Score Calculation Engine
 * 
 * Exact Formula:
 * Carbon Trust Score = 0.30D + 0.25V + 0.20E + 0.15H + 0.10T
 * 
 * Components (0 to 100):
 * - D = Documentation Completeness (Weight: 30% / 0.30)
 * - V = Verification Status and Currency (Weight: 25% / 0.25)
 * - E = Evidence Quality (Weight: 20% / 0.20)
 * - H = History and Traceability (Weight: 15% / 0.15)
 * - T = Transparency (Weight: 10% / 0.10)
 * 
 * Benchmark Example:
 * D = 80, V = 90, E = 70, H = 60, T = 75
 * Contributions: 24 + 22.5 + 14 + 9 + 7.5 = 77.0 / 100
 * 
 * Disclaimer:
 * The CarbonZ Trust Score is an internal transparency and data-integrity indicator,
 * NOT a guarantee of legal compliance, real-world additionality, carbon removal permanence,
 * or 3rd-party credit quality.
 */

export const TRUST_SCORE_FORMULA_VERSION = "v1.0";

export const SCORE_WEIGHTS = {
  documentation: 0.30,
  verification: 0.25,
  evidence: 0.20,
  history: 0.15,
  transparency: 0.10,
} as const;

export interface ScoreComponents {
  documentation: number;
  verification: number;
  evidence: number;
  history: number;
  transparency: number;
}

export interface ScoreBreakdown {
  documentation: { score: number; weight: number; contribution: number };
  verification: { score: number; weight: number; contribution: number };
  evidence: { score: number; weight: number; contribution: number };
  history: { score: number; weight: number; contribution: number };
  transparency: { score: number; weight: number; contribution: number };
}

export interface ScoreCalculationResult {
  isValid: boolean;
  score: number;
  roundedScore: number;
  formulaVersion: string;
  components: ScoreComponents;
  breakdown: ScoreBreakdown;
  status: "valid" | "incomplete" | "error";
  error?: string;
  calculatedAt: string;
}

/**
 * Validates whether a component score is a valid finite number between 0 and 100.
 */
export function isValidScoreComponent(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val) && val >= 0 && val <= 100;
}

/**
 * Calculates the Carbon Trust Score given the 5 component scores.
 * Throws an Error or returns an incomplete/error result if any input is missing or invalid.
 */
export function calculateCarbonTrustScore(
  inputs: Partial<ScoreComponents>
): ScoreCalculationResult {
  const calculatedAt = new Date().toISOString();

  // Check for missing inputs - NEVER silently treat missing data as zero
  if (
    inputs.documentation === undefined ||
    inputs.verification === undefined ||
    inputs.evidence === undefined ||
    inputs.history === undefined ||
    inputs.transparency === undefined
  ) {
    return {
      isValid: false,
      score: 0,
      roundedScore: 0,
      formulaVersion: TRUST_SCORE_FORMULA_VERSION,
      components: {
        documentation: inputs.documentation ?? 0,
        verification: inputs.verification ?? 0,
        evidence: inputs.evidence ?? 0,
        history: inputs.history ?? 0,
        transparency: inputs.transparency ?? 0,
      },
      breakdown: {
        documentation: { score: inputs.documentation ?? 0, weight: SCORE_WEIGHTS.documentation, contribution: 0 },
        verification: { score: inputs.verification ?? 0, weight: SCORE_WEIGHTS.verification, contribution: 0 },
        evidence: { score: inputs.evidence ?? 0, weight: SCORE_WEIGHTS.evidence, contribution: 0 },
        history: { score: inputs.history ?? 0, weight: SCORE_WEIGHTS.history, contribution: 0 },
        transparency: { score: inputs.transparency ?? 0, weight: SCORE_WEIGHTS.transparency, contribution: 0 },
      },
      status: "incomplete",
      error: "Missing required score components. All 5 components (D, V, E, H, T) must be provided.",
      calculatedAt,
    };
  }

  // Validate bounds [0, 100] and finite numbers
  const keys: (keyof ScoreComponents)[] = [
    "documentation",
    "verification",
    "evidence",
    "history",
    "transparency",
  ];

  for (const key of keys) {
    const val = inputs[key];
    if (!isValidScoreComponent(val)) {
      return {
        isValid: false,
        score: 0,
        roundedScore: 0,
        formulaVersion: TRUST_SCORE_FORMULA_VERSION,
        components: inputs as ScoreComponents,
        breakdown: {
          documentation: { score: 0, weight: SCORE_WEIGHTS.documentation, contribution: 0 },
          verification: { score: 0, weight: SCORE_WEIGHTS.verification, contribution: 0 },
          evidence: { score: 0, weight: SCORE_WEIGHTS.evidence, contribution: 0 },
          history: { score: 0, weight: SCORE_WEIGHTS.history, contribution: 0 },
          transparency: { score: 0, weight: SCORE_WEIGHTS.transparency, contribution: 0 },
        },
        status: "error",
        error: `Invalid score for '${key}': ${val}. Must be a finite number between 0 and 100.`,
        calculatedAt,
      };
    }
  }

  const { documentation, verification, evidence, history, transparency } = inputs as ScoreComponents;

  // Calculate weighted contributions
  const dCont = Number((documentation * SCORE_WEIGHTS.documentation).toFixed(4));
  const vCont = Number((verification * SCORE_WEIGHTS.verification).toFixed(4));
  const eCont = Number((evidence * SCORE_WEIGHTS.evidence).toFixed(4));
  const hCont = Number((history * SCORE_WEIGHTS.history).toFixed(4));
  const tCont = Number((transparency * SCORE_WEIGHTS.transparency).toFixed(4));

  const totalScore = Number((dCont + vCont + eCont + hCont + tCont).toFixed(2));
  const roundedScore = Math.round(totalScore);

  return {
    isValid: true,
    score: totalScore,
    roundedScore,
    formulaVersion: TRUST_SCORE_FORMULA_VERSION,
    components: { documentation, verification, evidence, history, transparency },
    breakdown: {
      documentation: { score: documentation, weight: SCORE_WEIGHTS.documentation, contribution: dCont },
      verification: { score: verification, weight: SCORE_WEIGHTS.verification, contribution: vCont },
      evidence: { score: evidence, weight: SCORE_WEIGHTS.evidence, contribution: eCont },
      history: { score: history, weight: SCORE_WEIGHTS.history, contribution: hCont },
      transparency: { score: transparency, weight: SCORE_WEIGHTS.transparency, contribution: tCont },
    },
    status: "valid",
    calculatedAt,
  };
}

/**
 * Helper to get human label and tier for a given score.
 */
export function getTrustScoreTier(score: number): {
  tier: "Excellent" | "High" | "Moderate" | "Preliminary" | "Low";
  colorClass: string;
  badgeBg: string;
} {
  if (score >= 85) {
    return { tier: "Excellent", colorClass: "text-emerald-700", badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300" };
  }
  if (score >= 75) {
    return { tier: "High", colorClass: "text-teal-700", badgeBg: "bg-teal-50 text-teal-800 border-teal-300" };
  }
  if (score >= 60) {
    return { tier: "Moderate", colorClass: "text-amber-700", badgeBg: "bg-amber-50 text-amber-800 border-amber-300" };
  }
  if (score >= 40) {
    return { tier: "Preliminary", colorClass: "text-orange-700", badgeBg: "bg-orange-50 text-orange-800 border-orange-300" };
  }
  return { tier: "Low", colorClass: "text-rose-700", badgeBg: "bg-rose-50 text-rose-800 border-rose-300" };
}
