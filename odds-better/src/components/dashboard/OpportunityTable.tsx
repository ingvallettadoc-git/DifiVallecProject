// ── Simple Opportunity Table (summary) ───────────────────────

'use client';

import { ValueBetRow } from '@/domain/models/valueBet';
import { formatOdds, formatEv } from '@/lib/format';
import { SEVERITY_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface OpportunityTableProps {
  rows: ValueBetRow[];
  maxRows?: number;
}

export default function OpportunityTable({ rows, maxRows = 5 }: OpportunityTableProps) {
  const visible = rows.slice(0, maxRows);

  if (visible.length === 0) {
    return (
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Top Opportunities
        </h3>
        <p className="text-sm text-slate-500">No value bet opportunities detected.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-700">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Top Opportunities
        </h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-900/50 text-left">
            <th className="px-3 py-1.5 text-[10px] text-slate-400 uppercase">Event</th>
            <th className="px-3 py-1.5 text-[10px] text-slate-400 uppercase">Sel</th>
            <th className="px-3 py-1.5 text-[10px] text-slate-400 uppercase">Bookmaker</th>
            <th className="px-3 py-1.5 text-[10px] text-slate-400 uppercase text-right">Odds</th>
            <th className="px-3 py-1.5 text-[10px] text-slate-400 uppercase text-right">EV</th>
            <th className="px-3 py-1.5 text-[10px] text-slate-400 uppercase">Sev</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/40">
          {visible.map((r) => (
            <tr key={r.id} className="hover:bg-slate-700/20">
              <td className="px-3 py-1.5 text-slate-200 text-xs whitespace-nowrap">
                {r.homeTeam} vs {r.awayTeam}
              </td>
              <td className="px-3 py-1.5 text-slate-300 text-xs">{r.selection}</td>
              <td className="px-3 py-1.5 text-slate-400 text-xs">{r.bookmakerTitle}</td>
              <td className="px-3 py-1.5 text-right text-emerald-400 font-mono">{formatOdds(r.offeredOdds)}</td>
              <td className="px-3 py-1.5 text-right font-mono font-bold text-emerald-400">{formatEv(r.expectedValue)}</td>
              <td className="px-3 py-1.5">
                <span className={cn('text-[9px] px-1.5 py-0.5 rounded uppercase', SEVERITY_COLORS[r.severity])}>
                  {r.severity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
