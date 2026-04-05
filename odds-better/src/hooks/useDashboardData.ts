// ── Dashboard Data Hook — full pipeline from API to domain models ─

'use client';

import { useMemo } from 'react';
import { NormalizedEventOdds } from '@/domain/models/odds';
import { ValueBetRow } from '@/domain/models/valueBet';
import { SurebetCandidate } from '@/domain/models/surebet';
import { StaleOddsSignal } from '@/domain/models/staleOdds';
import { AlertItem } from '@/domain/models/alerts';
import { BookmakerDivergenceRow } from '@/domain/models/network';
import {
  BenchmarkType,
  Confidence,
  Provenance,
  Severity,
  AlertCategory,
} from '@/domain/models/enums';
import { GlobalFilterState } from '@/domain/models/filters';
import { getBookmakerTitle, DEFAULT_BENCHMARK_BOOKMAKER } from '@/domain/models/bookmaker';
import {
  computeBenchmark,
  computeExpectedValue,
  meetsEvThreshold,
  getUniqueOutcomeLabels,
  bookmakerOddsMap,
  detectSurebetCandidates,
  computeAverageCoverage,
  getUniqueBookmakers,
} from '@/domain/calculations';

// ── Value Bet Pipeline ───────────────────────────────────────

function buildValueBets(
  events: NormalizedEventOdds[],
  evThreshold: number,
  benchmarkStrategy: 'direct' | 'synthetic' | 'auto',
  searchText: string
): ValueBetRow[] {
  const rows: ValueBetRow[] = [];

  for (const event of events) {
    const labels = getUniqueOutcomeLabels(event);

    for (const label of labels) {
      const benchmark = computeBenchmark(event.outcomes, label, DEFAULT_BENCHMARK_BOOKMAKER, benchmarkStrategy);
      if (!benchmark) continue;

      const outcomesForLabel = event.outcomes.filter((o) => o.label === label);
      const bmMap = bookmakerOddsMap(event.outcomes, label);

      for (const outcome of outcomesForLabel) {
        // Skip benchmark bookmaker itself
        if (outcome.bookmakerKey === DEFAULT_BENCHMARK_BOOKMAKER && benchmark.benchmarkType === BenchmarkType.Direct) continue;

        const ev = computeExpectedValue(outcome.price, benchmark.benchmarkOdds);
        if (!meetsEvThreshold(ev.expectedValue, evThreshold)) continue;

        const matchStr = `${event.homeTeam} ${event.awayTeam} ${label} ${outcome.bookmakerTitle}`.toLowerCase();
        if (searchText && !matchStr.includes(searchText.toLowerCase())) continue;

        const severity = ev.expectedValue > 0.50 ? Severity.Critical
          : ev.expectedValue > 0.35 ? Severity.High
          : ev.expectedValue > 0.25 ? Severity.Medium
          : Severity.Low;

        const confidence = benchmark.benchmarkType === BenchmarkType.Direct
          ? (benchmark.bookmakerCountConsidered >= 1 ? Confidence.High : Confidence.Medium)
          : (benchmark.bookmakerCountConsidered >= 5 ? Confidence.Medium : Confidence.Low);

        rows.push({
          id: `vb-${event.eventId}-${label}-${outcome.bookmakerKey}`,
          eventId: event.eventId,
          homeTeam: event.homeTeam,
          awayTeam: event.awayTeam,
          commenceTime: event.commenceTime,
          market: event.market,
          selection: label,
          bookmakerKey: outcome.bookmakerKey,
          bookmakerTitle: outcome.bookmakerTitle,
          offeredOdds: outcome.price,
          benchmarkOdds: benchmark.benchmarkOdds,
          fairProbability: ev.fairProbability,
          expectedValue: ev.expectedValue,
          edgePercent: ev.edgePercent,
          benchmarkSource: benchmark.benchmarkSource,
          benchmarkType: benchmark.benchmarkType,
          bookmakerCoverageCount: event.bookmakerCount,
          severity,
          confidence,
          provenance: Provenance.Real,
          whyFlagged: `Offered odds ${outcome.price} from ${outcome.bookmakerTitle} exceed fair value (${benchmark.benchmarkOdds.toFixed(2)}) by ${ev.edgePercent.toFixed(1)}%.`,
          formulaUsed: 'EV = offered_odds × (1/benchmark_odds) − 1',
          comparisonSet: Object.keys(bmMap),
          rawBookmakerSample: bmMap,
          benchmarkMethodology: benchmark.explanation,
          sourceFreshness: outcome.lastUpdate,
          apiUpdateTimestamp: event.lastApiUpdate,
        });
      }
    }
  }

  return rows.sort((a, b) => b.expectedValue - a.expectedValue);
}

// ── Stale Odds Pipeline ──────────────────────────────────────

function buildStaleSignals(events: NormalizedEventOdds[]): StaleOddsSignal[] {
  const signals: StaleOddsSignal[] = [];

  for (const event of events) {
    const timestamps = event.outcomes.map((o) => new Date(o.lastUpdate).getTime()).filter((t) => !isNaN(t));
    if (timestamps.length < 2) continue;

    timestamps.sort((a, b) => a - b);
    const median = timestamps[Math.floor(timestamps.length / 2)];

    const seen = new Set<string>();
    for (const outcome of event.outcomes) {
      if (seen.has(outcome.bookmakerKey)) continue;
      seen.add(outcome.bookmakerKey);

      const ts = new Date(outcome.lastUpdate).getTime();
      if (isNaN(ts)) continue;

      const lagSeconds = (median - ts) / 1000;
      if (lagSeconds < 300) continue; // < 5 min not considered stale

      signals.push({
        id: `stale-${event.eventId}-${outcome.bookmakerKey}`,
        eventId: event.eventId,
        homeTeam: event.homeTeam,
        awayTeam: event.awayTeam,
        commenceTime: event.commenceTime,
        bookmakerKey: outcome.bookmakerKey,
        bookmakerTitle: outcome.bookmakerTitle,
        lastUpdateTimestamp: outcome.lastUpdate,
        medianUpdateTimestamp: new Date(median).toISOString(),
        lagSeconds,
        severity: lagSeconds > 3600 ? Severity.High : lagSeconds > 1800 ? Severity.Medium : Severity.Low,
        confidence: lagSeconds > 3600 ? Confidence.Medium : Confidence.Low,
        signalType: 'possible_stale',
        explanation: `${outcome.bookmakerTitle} last updated ${Math.round(lagSeconds / 60)}min before median update time.`,
      });
    }
  }

  return signals.sort((a, b) => b.lagSeconds - a.lagSeconds);
}

// ── Divergence Pipeline ──────────────────────────────────────

function buildDivergenceRows(events: NormalizedEventOdds[]): BookmakerDivergenceRow[] {
  const rows: BookmakerDivergenceRow[] = [];

  for (const event of events) {
    const labels = getUniqueOutcomeLabels(event);
    for (const label of labels) {
      const outcomesForLabel = event.outcomes.filter((o) => o.label === label);
      for (let i = 0; i < outcomesForLabel.length; i++) {
        for (let j = i + 1; j < outcomesForLabel.length; j++) {
          const a = outcomesForLabel[i];
          const b = outcomesForLabel[j];
          const absDiff = Math.abs(a.price - b.price);
          const avgPrice = (a.price + b.price) / 2;
          if (absDiff / avgPrice < 0.05) continue;

          rows.push({
            bookmakerKeyA: a.bookmakerKey,
            bookmakerTitleA: a.bookmakerTitle,
            bookmakerKeyB: b.bookmakerKey,
            bookmakerTitleB: b.bookmakerTitle,
            eventId: event.eventId,
            homeTeam: event.homeTeam,
            awayTeam: event.awayTeam,
            outcome: label,
            oddsA: a.price,
            oddsB: b.price,
            absoluteDivergence: absDiff,
            percentDivergence: absDiff / avgPrice,
          });
        }
      }
    }
  }

  return rows.sort((a, b) => b.percentDivergence - a.percentDivergence).slice(0, 100);
}

// ── Alerts Pipeline ──────────────────────────────────────────

function buildAlerts(
  valueBets: ValueBetRow[],
  surebetCandidates: SurebetCandidate[],
  staleSignals: StaleOddsSignal[],
  quotaRemaining: number
): AlertItem[] {
  const alerts: AlertItem[] = [];
  const now = new Date().toISOString();

  for (const vb of valueBets.slice(0, 5)) {
    alerts.push({
      id: `alert-vb-${vb.id}`,
      timestamp: now,
      category: AlertCategory.ValueBet,
      severity: vb.severity,
      confidence: vb.confidence,
      title: `Value Bet: ${vb.selection} @ ${vb.bookmakerTitle}`,
      description: `${vb.homeTeam} vs ${vb.awayTeam} — EV ${(vb.expectedValue * 100).toFixed(1)}%`,
      eventId: vb.eventId,
      bookmakerKey: vb.bookmakerKey,
    });
  }

  for (const sb of surebetCandidates.filter((s) => s.surebetMargin > 0).slice(0, 3)) {
    alerts.push({
      id: `alert-sb-${sb.id}`,
      timestamp: now,
      category: AlertCategory.Surebet,
      severity: sb.severity,
      confidence: sb.confidence,
      title: `Surebet Candidate: ${sb.homeTeam} vs ${sb.awayTeam}`,
      description: `Margin ${(sb.surebetMargin * 100).toFixed(2)}%`,
      eventId: sb.eventId,
    });
  }

  for (const stale of staleSignals.slice(0, 3)) {
    alerts.push({
      id: `alert-stale-${stale.id}`,
      timestamp: now,
      category: AlertCategory.StaleOdds,
      severity: stale.severity,
      confidence: stale.confidence,
      title: `Possible Stale: ${stale.bookmakerTitle}`,
      description: stale.explanation,
      eventId: stale.eventId,
      bookmakerKey: stale.bookmakerKey,
    });
  }

  if (quotaRemaining < 50) {
    alerts.push({
      id: 'alert-quota-low',
      timestamp: now,
      category: AlertCategory.QuotaWarning,
      severity: quotaRemaining < 10 ? Severity.Critical : Severity.High,
      confidence: Confidence.High,
      title: 'API Quota Low',
      description: `Only ${quotaRemaining} requests remaining.`,
    });
  }

  return alerts.sort((a, b) => {
    const sev = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    return (sev[a.severity] ?? 4) - (sev[b.severity] ?? 4);
  });
}

// ── Main Dashboard Data ──────────────────────────────────────

export interface DashboardData {
  valueBets: ValueBetRow[];
  surebetCandidates: SurebetCandidate[];
  staleSignals: StaleOddsSignal[];
  divergenceRows: BookmakerDivergenceRow[];
  alerts: AlertItem[];
  kpis: {
    eventsMonitored: number;
    activeBookmakers: number;
    valueBetCount: number;
    benchmarkCoverageRate: number;
    averageBookmakerCoverage: number;
  };
}

export function useDashboardData(
  events: NormalizedEventOdds[],
  filters: GlobalFilterState,
  quotaRemaining: number
): DashboardData {
  return useMemo(() => {
    const valueBets = buildValueBets(events, filters.evThreshold, filters.benchmarkStrategy, filters.searchText);
    const surebetCandidates = detectSurebetCandidates(events);
    const staleSignals = buildStaleSignals(events);
    const divergenceRows = buildDivergenceRows(events);
    const alerts = buildAlerts(valueBets, surebetCandidates, staleSignals, quotaRemaining);

    const uniqueBm = getUniqueBookmakers(events);
    const avgCoverage = computeAverageCoverage(events);

    // Benchmark coverage: fraction of events that have the benchmark bookmaker
    const benchmarkCoverage = events.length > 0
      ? events.filter((e) => e.bookmakerKeys.includes(DEFAULT_BENCHMARK_BOOKMAKER)).length / events.length
      : 0;

    return {
      valueBets,
      surebetCandidates,
      staleSignals,
      divergenceRows,
      alerts,
      kpis: {
        eventsMonitored: events.length,
        activeBookmakers: uniqueBm.length,
        valueBetCount: valueBets.length,
        benchmarkCoverageRate: benchmarkCoverage,
        averageBookmakerCoverage: avgCoverage,
      },
    };
  }, [events, filters.evThreshold, filters.benchmarkStrategy, filters.searchText, quotaRemaining]);
}
