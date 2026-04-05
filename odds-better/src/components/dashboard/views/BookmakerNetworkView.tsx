// ── Bookmaker Network View ───────────────────────────────────

'use client';

import { BookmakerDivergenceRow } from '@/domain/models/network';
import { formatOdds, formatPercent } from '@/lib/format';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BookmakerNetworkViewProps {
  divergenceRows: BookmakerDivergenceRow[];
}

export default function BookmakerNetworkView({ divergenceRows }: BookmakerNetworkViewProps) {
  // Build divergence heatmap data
  const pairMap = new Map<string, { totalDiv: number; count: number }>();
  for (const row of divergenceRows) {
    const key = [row.bookmakerKeyA, row.bookmakerKeyB].sort().join('|');
    const existing = pairMap.get(key) ?? { totalDiv: 0, count: 0 };
    existing.totalDiv += row.percentDivergence;
    existing.count += 1;
    pairMap.set(key, existing);
  }

  const pairData = Array.from(pairMap.entries())
    .map(([key, val]) => {
      const [a, b] = key.split('|');
      return {
        pair: `${a} / ${b}`,
        avgDivergence: val.totalDiv / val.count,
        sampleSize: val.count,
      };
    })
    .sort((a, b) => b.avgDivergence - a.avgDivergence)
    .slice(0, 30);

  return (
    <div className="space-y-4">
      {/* Divergence Table */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Bookmaker Divergence Analysis
        </h3>
        <p className="text-[10px] text-slate-500 mb-4">
          Top divergent bookmaker pairs based on current snapshot. Divergence &gt;5% highlighted.
        </p>

        {divergenceRows.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">
              No significant divergence detected between bookmakers in the current dataset.
            </p>
          </div>
        ) : (
          <>
            {/* Scatter visualization */}
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <XAxis
                    dataKey="sampleSize"
                    name="Samples"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    label={{ value: 'Sample Size', position: 'insideBottom', fill: '#64748b', fontSize: 10, offset: -5 }}
                  />
                  <YAxis
                    dataKey="avgDivergence"
                    name="Avg Divergence"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                    label={{ value: 'Avg Divergence', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                  />
                  <ZAxis dataKey="sampleSize" range={[30, 200]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', fontSize: 11 }}
                    formatter={(value, name) => {
                      if (name === 'Avg Divergence' && typeof value === 'number') return formatPercent(value);
                      return String(value);
                    }}
                  />
                  <Scatter data={pairData} fill="#60a5fa">
                    {pairData.map((_, i) => (
                      <Cell key={i} fill={pairData[i].avgDivergence > 0.1 ? '#f87171' : '#60a5fa'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Top divergence table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900/50 text-left">
                    <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Event</th>
                    <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Outcome</th>
                    <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Bookmaker A</th>
                    <th className="px-3 py-2 text-[10px] text-slate-400 uppercase text-right">Odds A</th>
                    <th className="px-3 py-2 text-[10px] text-slate-400 uppercase">Bookmaker B</th>
                    <th className="px-3 py-2 text-[10px] text-slate-400 uppercase text-right">Odds B</th>
                    <th className="px-3 py-2 text-[10px] text-slate-400 uppercase text-right">Divergence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {divergenceRows.slice(0, 20).map((r, i) => (
                    <tr key={i} className="hover:bg-slate-700/20">
                      <td className="px-3 py-2 text-slate-200 text-xs whitespace-nowrap">
                        {r.homeTeam} vs {r.awayTeam}
                      </td>
                      <td className="px-3 py-2 text-slate-300 text-xs">{r.outcome}</td>
                      <td className="px-3 py-2 text-slate-400 text-xs">{r.bookmakerTitleA}</td>
                      <td className="px-3 py-2 text-right text-slate-200 font-mono text-xs">{formatOdds(r.oddsA)}</td>
                      <td className="px-3 py-2 text-slate-400 text-xs">{r.bookmakerTitleB}</td>
                      <td className="px-3 py-2 text-right text-slate-200 font-mono text-xs">{formatOdds(r.oddsB)}</td>
                      <td className="px-3 py-2 text-right font-mono text-xs text-orange-400">
                        {formatPercent(r.percentDivergence)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
