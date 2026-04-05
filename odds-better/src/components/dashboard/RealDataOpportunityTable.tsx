// ── Real Data Opportunity Table ──────────────────────────────

'use client';

import { useState } from 'react';
import { ValueBetRow } from '@/domain/models/valueBet';
import { SEVERITY_COLORS, CONFIDENCE_COLORS, BENCHMARK_TYPE_COLORS } from '@/lib/constants';
import { formatOdds, formatEv, formatPercent, formatDateShort } from '@/lib/format';
import { cn } from '@/lib/utils';
import EmptyStateNoEvPanel from './EmptyStateNoEvPanel';

interface RealDataOpportunityTableProps {
  valueBets: ValueBetRow[];
  eventsAnalyzed: number;
  bookmakersCompared: number;
  evThreshold: number;
  onSelectRow?: (row: ValueBetRow) => void;
}

export default function RealDataOpportunityTable({
  valueBets,
  eventsAnalyzed,
  bookmakersCompared,
  evThreshold,
  onSelectRow,
}: RealDataOpportunityTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (valueBets.length === 0) {
    return (
      <EmptyStateNoEvPanel
        eventsAnalyzed={eventsAnalyzed}
        bookmakersCompared={bookmakersCompared}
        currentEvThreshold={evThreshold}
      />
    );
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Value Bet Opportunities ({valueBets.length})
        </h3>
        <span className="text-[10px] text-slate-500">
          Sorted by EV desc · Threshold {(evThreshold * 100).toFixed(0)}% · Provenance: real
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900/50 text-left">
              <th className="px-3 py-2 text-[10px] text-slate-400 uppercase font-medium">Event</th>
              <th className="px-3 py-2 text-[10px] text-slate-400 uppercase font-medium">Kick-off</th>
              <th className="px-3 py-2 text-[10px] text-slate-400 uppercase font-medium">Selection</th>
              <th className="px-3 py-2 text-[10px] text-slate-400 uppercase font-medium">Bookmaker</th>
              <th className="px-3 py-2 text-[10px] text-slate-400 uppercase font-medium text-right">Offered</th>
              <th className="px-3 py-2 text-[10px] text-slate-400 uppercase font-medium text-right">Benchmark</th>
              <th className="px-3 py-2 text-[10px] text-slate-400 uppercase font-medium text-right">Fair Prob</th>
              <th className="px-3 py-2 text-[10px] text-slate-400 uppercase font-medium text-right">EV</th>
              <th className="px-3 py-2 text-[10px] text-slate-400 uppercase font-medium">BM Type</th>
              <th className="px-3 py-2 text-[10px] text-slate-400 uppercase font-medium">Severity</th>
              <th className="px-3 py-2 text-[10px] text-slate-400 uppercase font-medium text-center">Coverage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/40">
            {valueBets.map((row) => (
              <>
                <tr
                  key={row.id}
                  onClick={() => {
                    setExpandedId(expandedId === row.id ? null : row.id);
                    onSelectRow?.(row);
                  }}
                  className="hover:bg-slate-700/30 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2 text-slate-200 font-medium whitespace-nowrap">
                    {row.homeTeam} vs {row.awayTeam}
                  </td>
                  <td className="px-3 py-2 text-slate-400 text-xs whitespace-nowrap">
                    {formatDateShort(row.commenceTime)}
                  </td>
                  <td className="px-3 py-2 text-slate-200">{row.selection}</td>
                  <td className="px-3 py-2 text-slate-300 text-xs">{row.bookmakerTitle}</td>
                  <td className="px-3 py-2 text-right text-emerald-400 font-mono font-semibold">
                    {formatOdds(row.offeredOdds)}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-400 font-mono">
                    {formatOdds(row.benchmarkOdds)}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-400 font-mono text-xs">
                    {formatPercent(row.fairProbability)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span
                      className={cn(
                        'font-mono font-bold',
                        row.expectedValue > 0.4 ? 'text-red-400' : row.expectedValue > 0.25 ? 'text-orange-400' : 'text-emerald-400'
                      )}
                    >
                      {formatEv(row.expectedValue)}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        'text-[9px] px-1.5 py-0.5 rounded font-medium uppercase',
                        BENCHMARK_TYPE_COLORS[row.benchmarkType]
                      )}
                    >
                      {row.benchmarkType}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        'text-[9px] px-1.5 py-0.5 rounded font-medium uppercase',
                        SEVERITY_COLORS[row.severity]
                      )}
                    >
                      {row.severity}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center text-slate-400 font-mono text-xs">
                    {row.bookmakerCoverageCount}
                  </td>
                </tr>
                {expandedId === row.id && (
                  <tr key={`${row.id}-detail`}>
                    <td colSpan={11} className="bg-slate-900/60 px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <h4 className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Why Flagged</h4>
                          <p className="text-slate-300">{row.whyFlagged}</p>

                          <h4 className="text-[10px] text-slate-400 uppercase font-semibold mt-3 mb-1">Formula</h4>
                          <code className="text-blue-400 text-[11px]">{row.formulaUsed}</code>

                          <h4 className="text-[10px] text-slate-400 uppercase font-semibold mt-3 mb-1">
                            Benchmark Methodology
                          </h4>
                          <p className="text-slate-400">{row.benchmarkMethodology}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] text-slate-400 uppercase font-semibold mb-2">
                            Raw Bookmaker Sample
                          </h4>
                          <div className="space-y-1">
                            {Object.entries(row.rawBookmakerSample)
                              .sort(([, a], [, b]) => b - a)
                              .map(([bm, odds]) => (
                                <div key={bm} className="flex justify-between">
                                  <span className="text-slate-400">{bm}</span>
                                  <span
                                    className={cn(
                                      'font-mono',
                                      odds === row.offeredOdds ? 'text-emerald-400 font-bold' : 'text-slate-300'
                                    )}
                                  >
                                    {formatOdds(odds)}
                                  </span>
                                </div>
                              ))}
                          </div>

                          <h4 className="text-[10px] text-slate-400 uppercase font-semibold mt-3 mb-1">
                            Source Freshness
                          </h4>
                          <p className="text-slate-400">{formatDateShort(row.sourceFreshness)}</p>

                          <div className="flex gap-2 mt-3">
                            <span className={cn('text-[9px] px-1.5 py-0.5 rounded', CONFIDENCE_COLORS[row.confidence])}>
                              {row.confidence}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-600 text-slate-200">
                              {row.provenance}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
