// ── Lifecycle & Persistence View ─────────────────────────────

'use client';

import { LifecycleStatus } from '@/domain/models/lifecycle';

const DEFAULT_STATUS: LifecycleStatus = {
  persistenceEnabled: false,
  snapshotsAvailable: 0,
  oldestSnapshot: null,
  newestSnapshot: null,
  message:
    'The lifecycle persistence module is architecturally ready but requires a storage backend (e.g., database, file system) to persist historical snapshots. Current data is real-time snapshot-only.',
};

export default function LifecyclePersistenceView() {
  const status = DEFAULT_STATUS;

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Lifecycle & Persistence Lab
        </h3>
        <p className="text-[10px] text-slate-500 mb-4">
          Temporal tracking and persistence layer status.
        </p>

        <div className="bg-slate-900/50 rounded-lg p-6 text-center">
          <div className="text-3xl mb-3 opacity-30">🕰️</div>
          <h4 className="text-sm font-semibold text-slate-300 mb-2">
            Persistence: {status.persistenceEnabled ? 'Enabled' : 'Not Yet Enabled'}
          </h4>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mb-4">{status.message}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-800/60 rounded p-3">
              <p className="text-[10px] text-slate-500 uppercase">Status</p>
              <p className="text-sm font-mono text-yellow-400 mt-1">
                {status.persistenceEnabled ? 'Active' : 'Pending'}
              </p>
            </div>
            <div className="bg-slate-800/60 rounded p-3">
              <p className="text-[10px] text-slate-500 uppercase">Snapshots</p>
              <p className="text-sm font-mono text-slate-300 mt-1">{status.snapshotsAvailable}</p>
            </div>
            <div className="bg-slate-800/60 rounded p-3">
              <p className="text-[10px] text-slate-500 uppercase">Oldest</p>
              <p className="text-sm font-mono text-slate-300 mt-1">{status.oldestSnapshot ?? '—'}</p>
            </div>
            <div className="bg-slate-800/60 rounded p-3">
              <p className="text-[10px] text-slate-500 uppercase">Newest</p>
              <p className="text-sm font-mono text-slate-300 mt-1">{status.newestSnapshot ?? '—'}</p>
            </div>
          </div>

          <div className="mt-6 bg-slate-900/30 rounded p-3 text-xs text-slate-400 text-left max-w-lg mx-auto">
            <p className="font-semibold text-slate-300 mb-1">Ready for integration</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Domain models for snapshots are defined</li>
              <li>Temporal analysis functions are structurally prepared</li>
              <li>Requires: database connection, cron-based snapshot capture, historical query API</li>
              <li>Recommended backends: PostgreSQL, SQLite, or a time-series database</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
