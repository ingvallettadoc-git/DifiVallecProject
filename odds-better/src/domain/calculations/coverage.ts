// ── Coverage Analysis ─────────────────────────────────────────

import { NormalizedEventOdds } from '@/domain/models/odds';
import { EU_BOOKMAKERS } from '@/domain/models/bookmaker';

export interface CoverageReport {
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  totalBookmakers: number;
  expectedBookmakers: number;
  coverageRate: number;
  missingBookmakers: string[];
  presentBookmakers: string[];
}

export function computeCoverageReport(event: NormalizedEventOdds): CoverageReport {
  const expectedKeys = EU_BOOKMAKERS.map((b) => b.key);
  const presentKeys = event.bookmakerKeys;
  const presentSet = new Set(presentKeys);
  const missingBookmakers = expectedKeys.filter((k) => !presentSet.has(k));

  return {
    eventId: event.eventId,
    homeTeam: event.homeTeam,
    awayTeam: event.awayTeam,
    totalBookmakers: presentKeys.length,
    expectedBookmakers: expectedKeys.length,
    coverageRate: presentKeys.length / expectedKeys.length,
    missingBookmakers,
    presentBookmakers: presentKeys,
  };
}

export function computeAverageCoverage(events: NormalizedEventOdds[]): number {
  if (events.length === 0) return 0;
  const rates = events.map((e) => computeCoverageReport(e).coverageRate);
  return rates.reduce((s, r) => s + r, 0) / rates.length;
}

export function getUniqueBookmakers(events: NormalizedEventOdds[]): string[] {
  const all = new Set<string>();
  for (const ev of events) {
    for (const k of ev.bookmakerKeys) all.add(k);
  }
  return Array.from(all);
}
