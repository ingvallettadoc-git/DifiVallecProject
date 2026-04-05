// ── Global KPI Bar Component ─────────────────────────────────

'use client';

import { OddsApiQuotaMeta } from '@/domain/models/api';
import { formatPercent } from '@/lib/format';

interface KpiBarProps {
  eventsMonitored: number;
  activeBookmakers: number;
  valueBetCount: number;
  benchmarkCoverageRate: number;
  averageBookmakerCoverage: number;
  quota: OddsApiQuotaMeta | null;
}

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 min-w-[140px]">
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-slate-100 mt-0.5">{value}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function GlobalKpiBar({
  eventsMonitored,
  activeBookmakers,
  valueBetCount,
  benchmarkCoverageRate,
  averageBookmakerCoverage,
  quota,
}: KpiBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <KpiCard label="Events Monitored" value={eventsMonitored} />
      <KpiCard label="Active Bookmakers" value={activeBookmakers} />
      <KpiCard
        label="Value Bets (EV>20%)"
        value={valueBetCount}
        sub={valueBetCount === 0 ? 'No opportunities found' : undefined}
      />
      <KpiCard
        label="Benchmark Coverage"
        value={formatPercent(benchmarkCoverageRate)}
        sub="Events with Pinnacle"
      />
      <KpiCard
        label="Avg BM Coverage"
        value={formatPercent(averageBookmakerCoverage)}
        sub="Per event"
      />
      {quota && (
        <>
          <KpiCard
            label="API Requests Used"
            value={quota.requestsUsed}
            sub={`Remaining: ${quota.requestsRemaining}`}
          />
          <KpiCard
            label="API Remaining"
            value={quota.requestsRemaining}
            sub={quota.requestsRemaining < 50 ? '⚠ Low quota' : 'OK'}
          />
        </>
      )}
    </div>
  );
}
