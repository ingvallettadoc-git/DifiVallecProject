// ── The Odds API v4 — Central Configuration ──────────────────

import { SportKey, MarketType } from '@/domain/models/enums';

export const ODDS_API_BASE_URL = 'https://api.the-odds-api.com';
export const ODDS_API_VERSION = 'v4';

export interface OddsApiConfig {
  baseUrl: string;
  version: string;
  defaultSportKey: SportKey;
  defaultMarket: MarketType;
  defaultRegion: string;
  defaultOddsFormat: string;
  bookmakerKeys: string[];
}

export const DEFAULT_ODDS_API_CONFIG: OddsApiConfig = {
  baseUrl: ODDS_API_BASE_URL,
  version: ODDS_API_VERSION,
  defaultSportKey: SportKey.SoccerItalySerieA,
  defaultMarket: MarketType.H2H,
  defaultRegion: 'eu',
  defaultOddsFormat: 'decimal',
  bookmakerKeys: [
    'pinnacle',
    'betfair_ex_eu',
    'sport888',
    'unibet_eu',
    'betclic',
    'williamhill',
    'betsson',
    'marathon_bet',
    'onexbet',
    'coolbet',
    'nordicbet',
    'matchbook',
    'betvictor',
  ],
};

export function getApiKeyFromEnv(): string {
  const key = process.env.ODDS_API_KEY;
  if (!key) {
    throw new Error('ODDS_API_KEY environment variable is not set');
  }
  return key;
}
