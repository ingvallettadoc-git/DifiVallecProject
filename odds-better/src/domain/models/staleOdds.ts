// ── Stale Odds Signal Models ──────────────────────────────────

import { Confidence, Severity } from './enums';

export interface StaleOddsSignal {
  id: string;
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  bookmakerKey: string;
  bookmakerTitle: string;
  lastUpdateTimestamp: string;
  medianUpdateTimestamp: string;
  lagSeconds: number;
  severity: Severity;
  confidence: Confidence;
  signalType: 'possible_stale' | 'lagging' | 'coverage_mismatch';
  explanation: string;
}
