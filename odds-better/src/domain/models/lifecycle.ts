// ── Lifecycle / Persistence Placeholder Models ────────────────

export interface LifecycleSnapshot {
  snapshotId: string;
  capturedAt: string;
  sportKey: string;
  eventsCount: number;
  bookmakerCount: number;
  valueBetsFound: number;
  surebetCandidatesFound: number;
}

export interface LifecycleStatus {
  persistenceEnabled: boolean;
  snapshotsAvailable: number;
  oldestSnapshot: string | null;
  newestSnapshot: string | null;
  message: string;
}
