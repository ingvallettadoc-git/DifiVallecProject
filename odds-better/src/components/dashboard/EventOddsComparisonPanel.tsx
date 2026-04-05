// ── Event Odds Comparison Panel ──────────────────────────────

'use client';

import { NormalizedEventOdds } from '@/domain/models/odds';
import { formatOdds, formatDateShort } from '@/lib/format';
import { getUniqueOutcomeLabels, groupOutcomesByLabel } from '@/domain/calculations/normalization';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface EventOddsComparisonPanelProps {
  event: NormalizedEventOdds | null;
}

const CHART_COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#38bdf8'];

export default function EventOddsComparisonPanel({ event }: EventOddsComparisonPanelProps) {
  if (!event) {
    return (
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Event Odds Comparison
        </h3>
        <p className="text-sm text-slate-500">Select an event or value bet row to see detailed comparison.</p>
      </div>
    );
  }

  const labels = getUniqueOutcomeLabels(event);
  const grouped = groupOutcomesByLabel(event.outcomes);

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
        Event Odds Comparison
      </h3>
      <p className="text-sm text-slate-200 font-semibold mb-1">
        {event.homeTeam} vs {event.awayTeam}
      </p>
      <p className="text-[10px] text-slate-400 mb-4">
        {formatDateShort(event.commenceTime)} · {event.market} · {event.bookmakerCount} bookmakers
      </p>

      <div className="space-y-5">
        {labels.map((label) => {
          const ocs = grouped[label] ?? [];
          const chartData = ocs
            .sort((a, b) => b.price - a.price)
            .map((o) => ({ name: o.bookmakerTitle, odds: o.price }));

          return (
            <div key={label}>
              <h4 className="text-xs font-semibold text-slate-300 mb-2">{label}</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 10, top: 0, bottom: 0 }}>
                    <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={75} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', fontSize: 12 }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="odds" radius={[0, 3, 3, 0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Small table */}
              <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px]">
                {ocs.sort((a, b) => b.price - a.price).map((o) => (
                  <div key={o.bookmakerKey} className="flex justify-between text-slate-400">
                    <span>{o.bookmakerTitle}</span>
                    <span className="text-slate-200 font-mono">{formatOdds(o.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
