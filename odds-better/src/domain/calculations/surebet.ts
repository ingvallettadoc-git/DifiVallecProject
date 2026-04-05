// ── Surebet Detection ─────────────────────────────────────────

import { NormalizedEventOdds } from '@/domain/models/odds';
import { SurebetCandidate, SurebetLeg } from '@/domain/models/surebet';
import { Confidence, Provenance, Severity } from '@/domain/models/enums';
import { impliedProbability } from './impliedProbability';
import { getBestOddsPerOutcome } from './normalization';

/**
 * Detect surebet candidates from an event's odds by picking the best
 * odds per outcome across all bookmakers and checking if the total
 * implied probability < 1.
 */
export function detectSurebetCandidates(events: NormalizedEventOdds[]): SurebetCandidate[] {
  const candidates: SurebetCandidate[] = [];

  for (const event of events) {
    const bestPerOutcome = getBestOddsPerOutcome(event.outcomes);
    const labels = Object.keys(bestPerOutcome);
    if (labels.length < 2) continue;

    const legs: SurebetLeg[] = labels.map((label) => {
      const o = bestPerOutcome[label];
      return {
        selection: label,
        bookmakerKey: o.bookmakerKey,
        bookmakerTitle: o.bookmakerTitle,
        odds: o.price,
        impliedProbability: impliedProbability(o.price),
      };
    });

    const totalIp = legs.reduce((s, l) => s + l.impliedProbability, 0);
    const margin = 1 - totalIp;

    if (margin > 0) {
      // True surebet: margin > 0
      candidates.push({
        id: `surebet-${event.eventId}`,
        eventId: event.eventId,
        homeTeam: event.homeTeam,
        awayTeam: event.awayTeam,
        commenceTime: event.commenceTime,
        market: event.market,
        legs,
        totalImpliedProbability: totalIp,
        surebetMargin: margin,
        expectedProfit: margin * 100,
        severity: margin > 0.03 ? Severity.High : margin > 0.01 ? Severity.Medium : Severity.Low,
        confidence: margin > 0.05 ? Confidence.High : margin > 0.02 ? Confidence.Medium : Confidence.Low,
        provenance: Provenance.Real,
        whyFlagged: `Total implied probability ${totalIp.toFixed(4)} < 1.0 across best bookmaker odds per outcome.`,
        actionabilityNote:
          margin > 0.03
            ? 'Strong candidate — verify line availability before acting.'
            : 'Marginal candidate — may disappear quickly. Exercise caution.',
      });
    } else if (margin > -0.02) {
      // Near-surebet signal
      candidates.push({
        id: `surebet-signal-${event.eventId}`,
        eventId: event.eventId,
        homeTeam: event.homeTeam,
        awayTeam: event.awayTeam,
        commenceTime: event.commenceTime,
        market: event.market,
        legs,
        totalImpliedProbability: totalIp,
        surebetMargin: margin,
        expectedProfit: margin * 100,
        severity: Severity.Info,
        confidence: Confidence.Speculative,
        provenance: Provenance.Real,
        whyFlagged: `Near-surebet signal: total IP ${totalIp.toFixed(4)} is close to 1.0 (margin ${(margin * 100).toFixed(2)}%).`,
        actionabilityNote: 'Hypothesis only — not actionable without further confirmation.',
      });
    }
  }

  return candidates.sort((a, b) => b.surebetMargin - a.surebetMargin);
}
