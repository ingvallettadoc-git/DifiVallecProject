// ── Odds API Status Panel ────────────────────────────────────

'use client';

import { FetchStatus } from '@/domain/models/enums';
import { cn } from '@/lib/utils';

interface OddsApiStatusPanelProps {
  status: FetchStatus;
  error: string | null;
  eventCount: number;
  fetchedAt: string | null;
  sportKey: string;
  market: string;
}

const STATUS_MAP: Record<FetchStatus, { label: string; color: string }> = {
  [FetchStatus.Idle]: { label: 'Idle', color: 'text-slate-400' },
  [FetchStatus.Loading]: { label: 'Fetching...', color: 'text-blue-400' },
  [FetchStatus.Success]: { label: 'Connected', color: 'text-emerald-400' },
  [FetchStatus.Error]: { label: 'Error', color: 'text-red-400' },
  [FetchStatus.Empty]: { label: 'No Data', color: 'text-yellow-400' },
};

export default function OddsApiStatusPanel({
  status,
  error,
  eventCount,
  fetchedAt,
  sportKey,
  market,
}: OddsApiStatusPanelProps) {
  const statusInfo = STATUS_MAP[status];

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">API Status</h3>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Status</span>
          <span className={cn('font-semibold', statusInfo.color)}>
            {status === FetchStatus.Loading && (
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-1.5" />
            )}
            {statusInfo.label}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Sport</span>
          <span className="text-slate-200 font-mono text-xs">{sportKey}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Market</span>
          <span className="text-slate-200 font-mono text-xs">{market}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Events</span>
          <span className="text-slate-200 font-mono">{eventCount}</span>
        </div>

        {fetchedAt && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Last Fetch</span>
            <span className="text-slate-300 font-mono text-xs">
              {new Date(fetchedAt).toLocaleTimeString('it-IT')}
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 text-xs rounded px-2 py-1.5 mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
