// ── Implied Probability Calculation ──────────────────────────

/**
 * Convert decimal odds to implied probability.
 * implied_probability = 1 / odds
 */
export function impliedProbability(decimalOdds: number): number {
  if (decimalOdds <= 1) return 0;
  return 1 / decimalOdds;
}

/**
 * Calculate total implied probability for a set of outcomes.
 * If < 1.0, there's a surebet opportunity.
 */
export function totalImpliedProbability(odds: number[]): number {
  return odds.reduce((sum, o) => sum + impliedProbability(o), 0);
}

/**
 * Remove overround from implied probabilities (normalize to sum=1).
 */
export function removeOverround(probabilities: number[]): number[] {
  const total = probabilities.reduce((s, p) => s + p, 0);
  if (total === 0) return probabilities;
  return probabilities.map((p) => p / total);
}
