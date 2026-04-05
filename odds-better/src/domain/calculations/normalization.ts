// ── Odds Normalization ────────────────────────────────────────

import { NormalizedEventOdds, NormalizedOutcome } from '@/domain/models/odds';

/**
 * Get unique outcome labels for an event (e.g., ["Home", "Away", "Draw"]).
 */
export function getUniqueOutcomeLabels(event: NormalizedEventOdds): string[] {
  const labels = new Set<string>();
  for (const o of event.outcomes) {
    labels.add(o.label);
  }
  return Array.from(labels);
}

/**
 * Group outcomes by label.
 */
export function groupOutcomesByLabel(
  outcomes: NormalizedOutcome[]
): Record<string, NormalizedOutcome[]> {
  const groups: Record<string, NormalizedOutcome[]> = {};
  for (const o of outcomes) {
    if (!groups[o.label]) groups[o.label] = [];
    groups[o.label].push(o);
  }
  return groups;
}

/**
 * Get best (highest) odds for each outcome label.
 */
export function getBestOddsPerOutcome(
  outcomes: NormalizedOutcome[]
): Record<string, NormalizedOutcome> {
  const best: Record<string, NormalizedOutcome> = {};
  for (const o of outcomes) {
    if (!best[o.label] || o.price > best[o.label].price) {
      best[o.label] = o;
    }
  }
  return best;
}

/**
 * Build a map of bookmaker→odds for a specific outcome.
 */
export function bookmakerOddsMap(
  outcomes: NormalizedOutcome[],
  outcomeLabel: string
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const o of outcomes) {
    if (o.label === outcomeLabel) {
      map[o.bookmakerKey] = o.price;
    }
  }
  return map;
}
