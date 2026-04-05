// ── Research & Analytics View ────────────────────────────────

'use client';

import { DashboardData } from '@/hooks/useDashboardData';
import { OddsApiQuotaMeta } from '@/domain/models/api';
import { NormalizedEventOdds } from '@/domain/models/odds';
import { formatPercent, formatEv, formatOdds, formatDateTime } from '@/lib/format';
import { computeCoverageReport } from '@/domain/calculations/coverage';

interface ResearchAnalyticsViewProps {
  data: DashboardData;
  events: NormalizedEventOdds[];
  quota: OddsApiQuotaMeta | null;
  fetchedAt: string | null;
  sportKey: string;
  market: string;
  benchmarkStrategy: string;
}

export default function ResearchAnalyticsView({
  data,
  events,
  quota,
  fetchedAt,
  sportKey,
  market,
  benchmarkStrategy,
}: ResearchAnalyticsViewProps) {
  const coverageReports = events.map((e) => computeCoverageReport(e));

  return (
    <div className="space-y-4">
      {/* Session metadata */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Research Session Metadata
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500">Sport Key</span>
            <p className="text-slate-200 font-mono">{sportKey}</p>
          </div>
          <div>
            <span className="text-slate-500">Market</span>
            <p className="text-slate-200 font-mono">{market}</p>
          </div>
          <div>
            <span className="text-slate-500">Benchmark</span>
            <p className="text-slate-200 font-mono">{benchmarkStrategy}</p>
          </div>
          <div>
            <span className="text-slate-500">Fetched At</span>
            <p className="text-slate-200 font-mono text-[11px]">
              {fetchedAt ? formatDateTime(fetchedAt) : '—'}
            </p>
          </div>
          {quota && (
            <>
              <div>
                <span className="text-slate-500">API Used</span>
                <p className="text-slate-200 font-mono">{quota.requestsUsed}</p>
              </div>
              <div>
                <span className="text-slate-500">API Remaining</span>
                <p className="text-slate-200 font-mono">{quota.requestsRemaining}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Aggregate metrics */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Aggregate Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-900/50 rounded p-3">
            <p className="text-[10px] text-slate-500 uppercase">Events</p>
            <p className="text-lg font-bold text-slate-200">{data.kpis.eventsMonitored}</p>
          </div>
          <div className="bg-slate-900/50 rounded p-3">
            <p className="text-[10px] text-slate-500 uppercase">Value Bets</p>
            <p className="text-lg font-bold text-emerald-400">{data.kpis.valueBetCount}</p>
          </div>
          <div className="bg-slate-900/50 rounded p-3">
            <p className="text-[10px] text-slate-500 uppercase">Surebet candidates</p>
            <p className="text-lg font-bold text-blue-400">{data.surebetCandidates.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded p-3">
            <p className="text-[10px] text-slate-500 uppercase">Stale Signals</p>
            <p className="text-lg font-bold text-orange-400">{data.staleSignals.length}</p>
          </div>
        </div>
      </div>

      {/* Coverage per event */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Coverage Report per Event
        </h3>
        {coverageReports.length === 0 ? (
          <p className="text-sm text-slate-500">No events to report.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 text-left">
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Event</th>
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase text-center">Present</th>
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase text-center">Expected</th>
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase text-right">Coverage</th>
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Missing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {coverageReports.map((r) => (
                  <tr key={r.eventId} className="hover:bg-slate-700/20">
                    <td className="px-3 py-2 text-slate-200 text-xs whitespace-nowrap">
                      {r.homeTeam} vs {r.awayTeam}
                    </td>
                    <td className="px-3 py-2 text-center text-slate-300 font-mono text-xs">{r.totalBookmakers}</td>
                    <td className="px-3 py-2 text-center text-slate-400 font-mono text-xs">{r.expectedBookmakers}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs text-emerald-400">
                      {formatPercent(r.coverageRate)}
                    </td>
                    <td className="px-3 py-2 text-slate-500 text-[10px]">
                      {r.missingBookmakers.length > 0
                        ? r.missingBookmakers.slice(0, 4).join(', ') + (r.missingBookmakers.length > 4 ? '…' : '')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Value bets export-ready view */}
      {data.valueBets.length > 0 && (
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Value Bets — Export-Ready View
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-slate-900/50 text-left">
                  <th className="px-2 py-1.5 text-[9px] text-slate-400 uppercase">Event</th>
                  <th className="px-2 py-1.5 text-[9px] text-slate-400 uppercase">Selection</th>
                  <th className="px-2 py-1.5 text-[9px] text-slate-400 uppercase">BM</th>
                  <th className="px-2 py-1.5 text-[9px] text-slate-400 uppercase text-right">Offered</th>
                  <th className="px-2 py-1.5 text-[9px] text-slate-400 uppercase text-right">Bench</th>
                  <th className="px-2 py-1.5 text-[9px] text-slate-400 uppercase text-right">EV</th>
                  <th className="px-2 py-1.5 text-[9px] text-slate-400 uppercase">Source</th>
                  <th className="px-2 py-1.5 text-[9px] text-slate-400 uppercase">Type</th>
                  <th className="px-2 py-1.5 text-[9px] text-slate-400 uppercase">Prov</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {data.valueBets.map((vb) => (
                  <tr key={vb.id}>
                    <td className="px-2 py-1 text-slate-300 whitespace-nowrap">
                      {vb.homeTeam} vs {vb.awayTeam}
                    </td>
                    <td className="px-2 py-1 text-slate-300">{vb.selection}</td>
                    <td className="px-2 py-1 text-slate-400">{vb.bookmakerTitle}</td>
                    <td className="px-2 py-1 text-right text-emerald-400 font-mono">{formatOdds(vb.offeredOdds)}</td>
                    <td className="px-2 py-1 text-right text-slate-400 font-mono">{formatOdds(vb.benchmarkOdds)}</td>
                    <td className="px-2 py-1 text-right font-mono font-bold text-emerald-400">{formatEv(vb.expectedValue)}</td>
                    <td className="px-2 py-1 text-slate-500">{vb.benchmarkSource}</td>
                    <td className="px-2 py-1 text-slate-500">{vb.benchmarkType}</td>
                    <td className="px-2 py-1 text-slate-500">{vb.provenance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
