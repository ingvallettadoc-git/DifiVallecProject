// ── Constants ─────────────────────────────────────────────────

export const EV_THRESHOLD_DEFAULT = 0.20;
export const MIN_BOOKMAKER_COVERAGE = 3;
export const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
export const QUOTA_LOW_THRESHOLD = 50;

export const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-600 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-blue-500 text-white',
  info: 'bg-slate-500 text-white',
};

export const CONFIDENCE_COLORS: Record<string, string> = {
  high: 'bg-green-600 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-orange-500 text-white',
  speculative: 'bg-slate-600 text-white',
};

export const BENCHMARK_TYPE_COLORS: Record<string, string> = {
  direct: 'bg-emerald-600 text-white',
  synthetic: 'bg-violet-600 text-white',
};
