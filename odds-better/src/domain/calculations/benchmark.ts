// ── Benchmark Calculation ─────────────────────────────────────

import { BenchmarkResult } from '@/domain/models/valueBet';
import { BenchmarkType } from '@/domain/models/enums';
import { NormalizedOutcome } from '@/domain/models/odds';
import { DEFAULT_BENCHMARK_BOOKMAKER } from '@/domain/models/bookmaker';

/**
 * Build benchmark for a specific outcome label from a list of outcomes.
 *
 * Strategy (priority order):
 *   1. Direct: use the sharp benchmark bookmaker (Pinnacle) if present
 *   2. Synthetic: median of all available bookmaker odds for that outcome
 */
export function computeBenchmark(
  outcomes: NormalizedOutcome[],
  outcomeLabel: string,
  benchmarkBookmaker: string = DEFAULT_BENCHMARK_BOOKMAKER,
  strategy: 'direct' | 'synthetic' | 'auto' = 'auto'
): BenchmarkResult | null {
  const relevantOutcomes = outcomes.filter((o) => o.label === outcomeLabel);
  if (relevantOutcomes.length === 0) return null;

  // Try direct benchmark
  if (strategy === 'direct' || strategy === 'auto') {
    const directOutcome = relevantOutcomes.find((o) => o.bookmakerKey === benchmarkBookmaker);
    if (directOutcome) {
      return {
        benchmarkOdds: directOutcome.price,
        benchmarkSource: benchmarkBookmaker,
        benchmarkType: BenchmarkType.Direct,
        bookmakerCountConsidered: 1,
        fallbackUsed: false,
        explanation: `Direct benchmark from ${benchmarkBookmaker} at odds ${directOutcome.price}`,
      };
    }
  }

  // Synthetic benchmark via median
  if (strategy === 'synthetic' || strategy === 'auto') {
    const prices = relevantOutcomes.map((o) => o.price).sort((a, b) => a - b);
    if (prices.length === 0) return null;

    const median = computeMedian(prices);
    return {
      benchmarkOdds: median,
      benchmarkSource: 'consensus_median',
      benchmarkType: BenchmarkType.Synthetic,
      bookmakerCountConsidered: prices.length,
      fallbackUsed: true,
      explanation: `Synthetic benchmark: median of ${prices.length} bookmakers = ${median.toFixed(3)}`,
    };
  }

  return null;
}

function computeMedian(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}
