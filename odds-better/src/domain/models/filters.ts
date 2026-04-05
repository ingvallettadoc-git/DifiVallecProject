// ── Global Filter State ───────────────────────────────────────

import { MarketType, SportKey } from './enums';

export interface GlobalFilterState {
  sportKey: SportKey;
  market: MarketType;
  evThreshold: number;
  minBookmakerCoverage: number;
  selectedBookmakers: string[];
  searchText: string;
  selectedEventId: string | null;
  benchmarkStrategy: 'direct' | 'synthetic' | 'auto';
}

export const DEFAULT_FILTERS: GlobalFilterState = {
  sportKey: SportKey.SoccerItalySerieA,
  market: MarketType.H2H,
  evThreshold: 0.20,
  minBookmakerCoverage: 3,
  selectedBookmakers: [],
  searchText: '',
  selectedEventId: null,
  benchmarkStrategy: 'auto',
};
