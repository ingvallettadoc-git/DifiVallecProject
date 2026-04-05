// ── Market Synchronization View ──────────────────────────────

'use client';

import { StaleOddsSignal } from '@/domain/models/staleOdds';
import { SEVERITY_COLORS, CONFIDENCE_COLORS } from '@/lib/constants';
import { formatDateShort } from '@/lib/format';
import { cn } from '@/lib/utils';

interface MarketSynchronizationViewProps {
  staleSignals: StaleOddsSignal[];
}

export default function MarketSynchronizationView({ staleSignals }: MarketSynchronizationViewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Market Synchronization & Stale Odds Signals
        </h3>
        <p className="text-[10px] text-slate-500 mb-4">
          Signals are based on update timestamp analysis from The Odds API. Confidence varies by lag magnitude.
        </p>

        {staleSignals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">
              No significant asynchronous update signals detected.
            </p>
            <p className="text-xs text-slate-600 mt-2">
              All bookmakers appear reasonably synchronized within the current snapshot.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 text-left">
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Event</th>
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Bookmaker</th>
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Last Update</th>
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Median Update</th>
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase text-right">Lag</th>
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Signal</th>
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Severity</th>
                  <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {staleSignals.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-700/20">
                    <td className="px-3 py-2 text-slate-200 text-xs whitespace-nowrap">
                      {s.homeTeam} vs {s.awayTeam}
                    </td>
                    <td className="px-3 py-2 text-slate-300 text-xs">{s.bookmakerTitle}</td>
                    <td className="px-3 py-2 text-slate-400 text-xs font-mono">{formatDateShort(s.lastUpdateTimestamp)}</td>
                    <td className="px-3 py-2 text-slate-400 text-xs font-mono">{formatDateShort(s.medianUpdateTimestamp)}</td>
                    <td className="px-3 py-2 text-right text-orange-400 font-mono text-xs">
                      {Math.round(s.lagSeconds / 60)}m
                    </td>
                    <td className="px-3 py-2 text-slate-300 text-xs">{s.signalType.replace('_', ' ')}</td>
                    <td className="px-3 py-2">
                      <span className={cn('text-[9px] px-1.5 py-0.5 rounded uppercase', SEVERITY_COLORS[s.severity])}>
                        {s.severity}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn('text-[9px] px-1.5 py-0.5 rounded uppercase', CONFIDENCE_COLORS[s.confidence])}>
                        {s.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 bg-slate-900/30 rounded p-3 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">Methodology Note</p>
          <p>
            Stale odds signals are derived by comparing each bookmaker&apos;s last update timestamp against the
            median update time across all bookmakers for the same event. Lags greater than 5 minutes are flagged.
            This is an observational signal, not a causal claim.
          </p>
        </div>
      </div>
    </div>
  );
}
