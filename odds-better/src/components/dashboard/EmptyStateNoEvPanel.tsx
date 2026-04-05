// ── Empty State Panel ────────────────────────────────────────

'use client';

interface EmptyStateNoEvPanelProps {
  eventsAnalyzed: number;
  bookmakersCompared: number;
  currentEvThreshold: number;
  message?: string;
}

export default function EmptyStateNoEvPanel({
  eventsAnalyzed,
  bookmakersCompared,
  currentEvThreshold,
  message,
}: EmptyStateNoEvPanelProps) {
  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8 text-center">
      <div className="text-4xl mb-4 opacity-40">📊</div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">
        No Opportunities Found
      </h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
        {message ??
          `No selections exceeded the EV threshold of ${(currentEvThreshold * 100).toFixed(0)}% across the current dataset.`}
      </p>
      <div className="flex justify-center gap-6 text-xs text-slate-500">
        <div>
          <span className="text-slate-300 font-mono text-sm">{eventsAnalyzed}</span>
          <p>events analyzed</p>
        </div>
        <div>
          <span className="text-slate-300 font-mono text-sm">{bookmakersCompared}</span>
          <p>bookmakers compared</p>
        </div>
        <div>
          <span className="text-slate-300 font-mono text-sm">{(currentEvThreshold * 100).toFixed(0)}%</span>
          <p>EV threshold</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-4">
        Try lowering the EV threshold or wait for market updates.
      </p>
    </div>
  );
}
