// ── Value Bet Domain Models ───────────────────────────────────

import { BenchmarkType, Confidence, Provenance, Severity } from './enums';

export interface BenchmarkResult {
  benchmarkOdds: number;
  benchmarkSource: string;
  benchmarkType: BenchmarkType;
  bookmakerCountConsidered: number;
  fallbackUsed: boolean;
  explanation: string;
}

export interface EvComputationResult {
  fairProbability: number;
  expectedValue: number;
  edgePercent: number;
}

export interface ValueBetRow {
  id: string;
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  market: string;
  selection: string;
  bookmakerKey: string;
  bookmakerTitle: string;
  offeredOdds: number;
  benchmarkOdds: number;
  fairProbability: number;
  expectedValue: number;
  edgePercent: number;
  benchmarkSource: string;
  benchmarkType: BenchmarkType;
  bookmakerCoverageCount: number;
  severity: Severity;
  confidence: Confidence;
  provenance: Provenance;
  whyFlagged: string;
  formulaUsed: string;
  comparisonSet: string[];
  rawBookmakerSample: Record<string, number>;
  benchmarkMethodology: string;
  sourceFreshness: string;
  apiUpdateTimestamp: string;
}
