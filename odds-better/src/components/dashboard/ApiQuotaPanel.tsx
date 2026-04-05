// ── API Quota Panel Component ────────────────────────────────

'use client';

import { OddsApiQuotaMeta } from '@/domain/models/api';
import { cn } from '@/lib/utils';

interface ApiQuotaPanelProps {
  quota: OddsApiQuotaMeta | null;
  fetchedAt: string | null;
}

export default function ApiQuotaPanel({ quota, fetchedAt }: ApiQuotaPanelProps) {
  if (!quota) {
    return (
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">API Quota</h3>
        <p className="text-sm text-slate-500">No quota data available yet. Fetch data first.</p>
      </div>
    );
  }

  const isLow = quota.requestsRemaining < 50;
  const isCritical = quota.requestsRemaining < 10;
  const total = quota.requestsUsed + quota.requestsRemaining;
  const usedPercent = total > 0 ? (quota.requestsUsed / total) * 100 : 0;

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">API Quota</h3>

      <div className="space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Requests Used</span>
          <span className="text-slate-200 font-mono">{quota.requestsUsed}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Requests Remaining</span>
          <span
            className={cn(
              'font-mono font-semibold',
              isCritical ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-emerald-400'
            )}
          >
            {quota.requestsRemaining}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              isCritical ? 'bg-red-500' : isLow ? 'bg-yellow-500' : 'bg-emerald-500'
            )}
            style={{ width: `${usedPercent}%` }}
          />
        </div>

        {quota.requestsLast && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Last Request Cost</span>
            <span className="text-slate-300 font-mono">{quota.requestsLast}</span>
          </div>
        )}

        {fetchedAt && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Last Fetch</span>
            <span className="text-slate-300 font-mono text-xs">
              {new Date(fetchedAt).toLocaleTimeString('it-IT')}
            </span>
          </div>
        )}

        {isLow && (
          <div
            className={cn(
              'text-xs font-medium px-2 py-1 rounded',
              isCritical ? 'bg-red-900/50 text-red-300' : 'bg-yellow-900/50 text-yellow-300'
            )}
          >
            {isCritical ? 'Critical: API quota nearly exhausted' : 'Warning: API quota running low'}
          </div>
        )}
      </div>
    </div>
  );
}
