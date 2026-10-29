import { describe, it, expect } from "vitest";
import {
  calculateCarbonTrustScore,
  isValidScoreComponent,
  getTrustScoreTier,
  TRUST_SCORE_FORMULA_VERSION,
} from "./trust-score";

describe("Carbon Trust Score Engine", () => {
  it("computes the exact benchmark example from the CarbonZ master specification", () => {
    // Benchmark from requirement:
    // D = 80, V = 90, E = 70, H = 60, T = 75
    // Calculation: 24 + 22.5 + 14 + 9 + 7.5 = 77.0 / 100
    const result = calculateCarbonTrustScore({
      documentation: 80,
      verification: 90,
      evidence: 70,
      history: 60,
      transparency: 75,
    });

    expect(result.isValid).toBe(true);
    expect(result.status).toBe("valid");
    expect(result.score).toBe(77.0);
    expect(result.roundedScore).toBe(77);
    expect(result.formulaVersion).toBe(TRUST_SCORE_FORMULA_VERSION);

    // Verify individual weighted contributions
    expect(result.breakdown.documentation.contribution).toBe(24);
    expect(result.breakdown.verification.contribution).toBe(22.5);
    expect(result.breakdown.evidence.contribution).toBe(14);
    expect(result.breakdown.history.contribution).toBe(9);
    expect(result.breakdown.transparency.contribution).toBe(7.5);
  });

  it("handles maximum boundary condition (all 100s)", () => {
    const result = calculateCarbonTrustScore({
      documentation: 100,
      verification: 100,
      evidence: 100,
      history: 100,
      transparency: 100,
    });

    expect(result.isValid).toBe(true);
    expect(result.score).toBe(100);
    expect(result.roundedScore).toBe(100);
  });

  it("handles minimum boundary condition (all 0s)", () => {
    const result = calculateCarbonTrustScore({
      documentation: 0,
      verification: 0,
      evidence: 0,
      history: 0,
      transparency: 0,
    });

    expect(result.isValid).toBe(true);
    expect(result.score).toBe(0);
    expect(result.roundedScore).toBe(0);
  });

  it("rejects incomplete inputs and never silently treats missing values as zero", () => {
    const result = calculateCarbonTrustScore({
      documentation: 80,
      verification: 90,
      // evidence is missing
      history: 60,
      transparency: 75,
    });

    expect(result.isValid).toBe(false);
    expect(result.status).toBe("incomplete");
    expect(result.error).toContain("Missing required score components");
  });

  it("rejects negative component values", () => {
    const result = calculateCarbonTrustScore({
      documentation: -5,
      verification: 90,
      evidence: 70,
      history: 60,
      transparency: 75,
    });

    expect(result.isValid).toBe(false);
    expect(result.status).toBe("error");
    expect(result.error).toContain("Invalid score for 'documentation'");
  });

  it("rejects component values exceeding 100", () => {
    const result = calculateCarbonTrustScore({
      documentation: 80,
      verification: 105,
      evidence: 70,
      history: 60,
      transparency: 75,
    });

    expect(result.isValid).toBe(false);
    expect(result.status).toBe("error");
    expect(result.error).toContain("Invalid score for 'verification'");
  });

  it("rejects non-numeric and NaN values", () => {
    const result = calculateCarbonTrustScore({
      documentation: 80,
      verification: NaN,
      evidence: 70,
      history: 60,
      transparency: 75,
    });

    expect(result.isValid).toBe(false);
    expect(result.status).toBe("error");
  });

  it("validates individual component helper", () => {
    expect(isValidScoreComponent(0)).toBe(true);
    expect(isValidScoreComponent(100)).toBe(true);
    expect(isValidScoreComponent(75.5)).toBe(true);
    expect(isValidScoreComponent(-1)).toBe(false);
    expect(isValidScoreComponent(100.1)).toBe(false);
    expect(isValidScoreComponent(Infinity)).toBe(false);
    expect(isValidScoreComponent(null)).toBe(false);
    expect(isValidScoreComponent("80")).toBe(false);
  });

  it("assigns appropriate score tiers", () => {
    expect(getTrustScoreTier(88).tier).toBe("Excellent");
    expect(getTrustScoreTier(77).tier).toBe("High");
    expect(getTrustScoreTier(65).tier).toBe("Moderate");
    expect(getTrustScoreTier(45).tier).toBe("Preliminary");
    expect(getTrustScoreTier(20).tier).toBe("Low");
  });
});

