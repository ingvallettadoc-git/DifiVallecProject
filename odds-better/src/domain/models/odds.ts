// ── Normalized Odds Domain Models ─────────────────────────────

export interface NormalizedOutcome {
  label: string;           // Home | Away | Draw
  bookmakerKey: string;
  bookmakerTitle: string;
  price: number;
  lastUpdate: string;
}

export interface NormalizedEventOdds {
  eventId: string;
  sportKey: string;
  sportTitle: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  market: string;
  outcomes: NormalizedOutcome[];
  bookmakerCount: number;
  bookmakerKeys: string[];
  lastApiUpdate: string;
}

export interface OutcomeRow {
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  market: string;
  outcomeLabel: string;
  bookmakerKey: string;
  bookmakerTitle: string;
  offeredOdds: number;
  lastUpdate: string;
}
