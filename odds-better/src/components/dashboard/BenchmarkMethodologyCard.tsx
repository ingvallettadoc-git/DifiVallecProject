// ── Benchmark Methodology Card ───────────────────────────────

'use client';

import { BENCHMARK_TYPE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BenchmarkMethodologyCardProps {
  benchmarkCoverageRate: number;
  eventsWithDirect: number;
  eventsWithSynthetic: number;
  totalEvents: number;
  strategy: 'direct' | 'synthetic' | 'auto';
}

export default function BenchmarkMethodologyCard({
  benchmarkCoverageRate,
  eventsWithDirect,
  eventsWithSynthetic,
  totalEvents,
  strategy,
}: BenchmarkMethodologyCardProps) {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Benchmark Methodology
      </h3>

      <div className="space-y-3">
        <div className="text-sm text-slate-300">
          <p className="mb-2">
            <strong>Strategy:</strong>{' '}
            <span className="font-mono text-blue-400">{strategy}</span>
          </p>
          <p className="text-xs text-slate-400 mb-3">
            {strategy === 'auto'
              ? 'Uses Pinnacle (sharp bookmaker) when available, falls back to consensus median.'
              : strategy === 'direct'
              ? 'Uses only the designated sharp bookmaker (Pinnacle).'
              : 'Uses the median of all available bookmaker odds.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/50 rounded p-2.5">
            <p className="text-[10px] text-slate-400 uppercase">Direct (Pinnacle)</p>
            <p className="text-lg font-bold text-slate-200">{eventsWithDirect}</p>
            <span className={cn('text-[9px] px-1.5 py-0.5 rounded', BENCHMARK_TYPE_COLORS.direct)}>
              direct
            </span>
          </div>
          <div className="bg-slate-900/50 rounded p-2.5">
            <p className="text-[10px] text-slate-400 uppercase">Synthetic (Median)</p>
            <p className="text-lg font-bold text-slate-200">{eventsWithSynthetic}</p>
            <span className={cn('text-[9px] px-1.5 py-0.5 rounded', BENCHMARK_TYPE_COLORS.synthetic)}>
              synthetic
            </span>
          </div>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 uppercase mb-1">Coverage Rate</p>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${benchmarkCoverageRate * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {(benchmarkCoverageRate * 100).toFixed(1)}% of {totalEvents} events
          </p>
        </div>

        <div className="bg-slate-900/30 rounded p-2 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">Formula</p>
          <code className="text-blue-400 text-[11px]">
            fair_probability = 1 / benchmark_odds
          </code>
          <br />
          <code className="text-blue-400 text-[11px]">
            expected_value = offered_odds × fair_probability − 1
          </code>
        </div>
      </div>
    </div>
  );
}
