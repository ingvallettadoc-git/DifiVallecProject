// ── Domain Enums ──────────────────────────────────────────────

export enum Severity {
  Critical = 'critical',
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  Info = 'info',
}

export enum Confidence {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  Speculative = 'speculative',
}

export enum Provenance {
  Real = 'real',
  Synthetic = 'synthetic',
}

export enum BenchmarkType {
  Direct = 'direct',
  Synthetic = 'synthetic',
}

export enum AlertCategory {
  ValueBet = 'value_bet',
  Surebet = 'surebet',
  StaleOdds = 'stale_odds',
  CoverageDrop = 'coverage_drop',
  QuotaWarning = 'quota_warning',
  ApiError = 'api_error',
}

export enum FetchStatus {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
  Empty = 'empty',
}

export enum MarketType {
  H2H = 'h2h',
  Spreads = 'spreads',
  Totals = 'totals',
}

export enum OutcomeLabel {
  Home = 'Home',
  Away = 'Away',
  Draw = 'Draw',
}

export enum SportKey {
  SoccerItalySerieA = 'soccer_italy_serie_a',
  SoccerItalySerieB = 'soccer_italy_serie_b',
  SoccerItalyCoppaItalia = 'soccer_italy_coppa_italia',
}
