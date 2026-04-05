// ── Surebet Intelligence View ────────────────────────────────

'use client';

import { SurebetCandidate } from '@/domain/models/surebet';
import { SEVERITY_COLORS, CONFIDENCE_COLORS } from '@/lib/constants';
import { formatOdds, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

interface SurebetIntelligenceViewProps {
  candidates: SurebetCandidate[];
}

export default function SurebetIntelligenceView({ candidates }: SurebetIntelligenceViewProps) {
  const trueSurebets = candidates.filter((c) => c.surebetMargin > 0);
  const signals = candidates.filter((c) => c.surebetMargin <= 0);

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Surebet Candidates
          </h3>
          <span className="text-[10px] text-slate-500">
            {trueSurebets.length} candidates · {signals.length} signals
          </span>
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">
              No surebet candidates or signals detected in the current dataset.
            </p>
            <p className="text-xs text-slate-600 mt-2">
              This is common — true surebets are rare and typically short-lived.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {candidates.map((c) => (
              <div
                key={c.id}
                className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {c.homeTeam} vs {c.awayTeam}
                    </p>
                    <p className="text-[10px] text-slate-400">{c.market} market</p>
                  </div>
                  <div className="flex gap-1.5">
                    <span className={cn('text-[9px] px-1.5 py-0.5 rounded uppercase', SEVERITY_COLORS[c.severity])}>
                      {c.severity}
                    </span>
                    <span className={cn('text-[9px] px-1.5 py-0.5 rounded uppercase', CONFIDENCE_COLORS[c.confidence])}>
                      {c.confidence}
                    </span>
                  </div>
                </div>

                {/* Legs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                  {c.legs.map((leg) => (
                    <div key={leg.selection} className="bg-slate-800/60 rounded p-2">
                      <p className="text-[10px] text-slate-400 uppercase">{leg.selection}</p>
                      <p className="text-sm font-bold text-emerald-400 font-mono">{formatOdds(leg.odds)}</p>
                      <p className="text-[10px] text-slate-500">{leg.bookmakerTitle}</p>
                      <p className="text-[10px] text-slate-500">IP: {formatPercent(leg.impliedProbability)}</p>
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 text-xs mb-3">
                  <div>
                    <span className="text-slate-400">Total IP</span>
                    <p className="text-slate-200 font-mono">{c.totalImpliedProbability.toFixed(4)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Margin</span>
                    <p
                      className={cn(
                        'font-mono font-semibold',
                        c.surebetMargin > 0 ? 'text-emerald-400' : 'text-yellow-400'
                      )}
                    >
                      {(c.surebetMargin * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Expected Profit</span>
                    <p
                      className={cn(
                        'font-mono font-semibold',
                        c.expectedProfit > 0 ? 'text-emerald-400' : 'text-slate-400'
                      )}
                    >
                      {c.expectedProfit.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Why Flagged */}
                <div className="text-xs text-slate-400 space-y-1">
                  <p>
                    <span className="text-slate-500 font-medium">Why flagged:</span> {c.whyFlagged}
                  </p>
                  <p>
                    <span className="text-slate-500 font-medium">Actionability:</span>{' '}
                    <span className="italic">{c.actionabilityNote}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
