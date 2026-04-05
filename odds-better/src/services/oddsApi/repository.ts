// ── The Odds API v4 — Repository (server-side data access) ───

import { OddsApiEvent, OddsApiQuotaMeta, OddsApiSport } from '@/domain/models/api';
import { NormalizedEventOdds } from '@/domain/models/odds';
import { DEFAULT_ODDS_API_CONFIG } from './config';
import { oddsApiFetch, ApiClientResponse } from './client';
import { sportsEndpoint, sportOddsEndpoint } from './endpoints';
import { adaptEventsToNormalized } from './adapters';

export interface OddsRepository {
  fetchSports(): Promise<ApiClientResponse<OddsApiSport[]>>;
  fetchSportOdds(sportKey: string, market: string, region: string): Promise<ApiClientResponse<OddsApiEvent[]>>;
  fetchNormalizedOdds(sportKey: string, market: string, region: string): Promise<{ events: NormalizedEventOdds[]; quota: OddsApiQuotaMeta }>;
}

export function createOddsRepository(): OddsRepository {
  return {
    async fetchSports() {
      return oddsApiFetch<OddsApiSport[]>(sportsEndpoint());
    },

    async fetchSportOdds(
      sportKey: string = DEFAULT_ODDS_API_CONFIG.defaultSportKey,
      market: string = DEFAULT_ODDS_API_CONFIG.defaultMarket,
      region: string = DEFAULT_ODDS_API_CONFIG.defaultRegion
    ) {
      return oddsApiFetch<OddsApiEvent[]>(sportOddsEndpoint(sportKey), {
        regions: region,
        markets: market,
        oddsFormat: DEFAULT_ODDS_API_CONFIG.defaultOddsFormat,
      });
    },

    async fetchNormalizedOdds(
      sportKey: string = DEFAULT_ODDS_API_CONFIG.defaultSportKey,
      market: string = DEFAULT_ODDS_API_CONFIG.defaultMarket,
      region: string = DEFAULT_ODDS_API_CONFIG.defaultRegion
    ) {
      const response = await oddsApiFetch<OddsApiEvent[]>(sportOddsEndpoint(sportKey), {
        regions: region,
        markets: market,
        oddsFormat: DEFAULT_ODDS_API_CONFIG.defaultOddsFormat,
      });
      const events = adaptEventsToNormalized(response.data, market);
      return { events, quota: response.quota };
    },
  };
}
