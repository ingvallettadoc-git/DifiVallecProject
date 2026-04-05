// ── Bookmaker Network / Divergence Models ─────────────────────

export interface BookmakerDivergenceRow {
  bookmakerKeyA: string;
  bookmakerTitleA: string;
  bookmakerKeyB: string;
  bookmakerTitleB: string;
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  outcome: string;
  oddsA: number;
  oddsB: number;
  absoluteDivergence: number;
  percentDivergence: number;
}

export interface BookmakerSimilarityCell {
  bookmakerKeyA: string;
  bookmakerKeyB: string;
  similarity: number;            // 0..1
  sampleSize: number;
}
