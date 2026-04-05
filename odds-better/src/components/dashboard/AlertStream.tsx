// ── Alert Stream Component ───────────────────────────────────

'use client';

import { AlertItem } from '@/domain/models/alerts';
import { SEVERITY_COLORS, CONFIDENCE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface AlertStreamProps {
  alerts: AlertItem[];
  maxVisible?: number;
}

export default function AlertStream({ alerts, maxVisible = 10 }: AlertStreamProps) {
  const visible = alerts.slice(0, maxVisible);

  if (visible.length === 0) {
    return (
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <p className="text-sm text-slate-500">No alerts at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg divide-y divide-slate-700/50 max-h-[360px] overflow-y-auto">
      {visible.map((alert) => (
        <div key={alert.id} className="px-4 py-2.5 flex items-start gap-3">
          <span
            className={cn(
              'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-0.5 shrink-0',
              SEVERITY_COLORS[alert.severity]
            )}
          >
            {alert.severity}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{alert.title}</p>
            <p className="text-xs text-slate-400 truncate">{alert.description}</p>
          </div>
          <span
            className={cn(
              'text-[9px] font-medium uppercase px-1.5 py-0.5 rounded mt-0.5 shrink-0',
              CONFIDENCE_COLORS[alert.confidence]
            )}
          >
            {alert.confidence}
          </span>
        </div>
      ))}
    </div>
  );
}
