// ── Surebet Domain Models ─────────────────────────────────────

import { Confidence, Provenance, Severity } from './enums';

export interface SurebetLeg {
  selection: string;
  bookmakerKey: string;
  bookmakerTitle: string;
  odds: number;
  impliedProbability: number;
}

export interface SurebetCandidate {
  id: string;
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  market: string;
  legs: SurebetLeg[];
  totalImpliedProbability: number;
  surebetMargin: number;
  expectedProfit: number;
  severity: Severity;
  confidence: Confidence;
  provenance: Provenance;
  whyFlagged: string;
  actionabilityNote: string;
}
