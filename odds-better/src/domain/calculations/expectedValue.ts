// ── Expected Value Calculation ────────────────────────────────

import { EvComputationResult } from '@/domain/models/valueBet';
import { impliedProbability } from './impliedProbability';

/**
 * fair_probability = 1 / benchmark_odds
 * expected_value = offered_odds * fair_probability - 1
 * edge_percent = expected_value * 100
 */
export function computeExpectedValue(
  offeredOdds: number,
  benchmarkOdds: number
): EvComputationResult {
  const fairProb = impliedProbability(benchmarkOdds);
  const ev = offeredOdds * fairProb - 1;
  return {
    fairProbability: fairProb,
    expectedValue: ev,
    edgePercent: ev * 100,
  };
}

/**
 * Check if a selection meets the EV threshold.
 */
export function meetsEvThreshold(ev: number, threshold: number): boolean {
  return ev >= threshold;
}
