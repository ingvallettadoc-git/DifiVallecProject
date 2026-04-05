// ── The Odds API v4 — Raw→Domain Adapters ────────────────────

import { OddsApiEvent } from '@/domain/models/api';
import { NormalizedEventOdds, NormalizedOutcome } from '@/domain/models/odds';

export function adaptEventToNormalized(raw: OddsApiEvent, market: string): NormalizedEventOdds {
  const outcomes: NormalizedOutcome[] = [];
  const bookmakerKeys: string[] = [];
  let latestUpdate = '';

  for (const bm of raw.bookmakers) {
    bookmakerKeys.push(bm.key);
    const mkt = bm.markets.find((m) => m.key === market);
    if (!mkt) continue;

    if (mkt.last_update > latestUpdate) {
      latestUpdate = mkt.last_update;
    }

    for (const oc of mkt.outcomes) {
      outcomes.push({
        label: oc.name,
        bookmakerKey: bm.key,
        bookmakerTitle: bm.title,
        price: oc.price,
        lastUpdate: mkt.last_update,
      });
    }
  }

  return {
    eventId: raw.id,
    sportKey: raw.sport_key,
    sportTitle: raw.sport_title,
    homeTeam: raw.home_team,
    awayTeam: raw.away_team,
    commenceTime: raw.commence_time,
    market,
    outcomes,
    bookmakerCount: bookmakerKeys.length,
    bookmakerKeys,
    lastApiUpdate: latestUpdate || new Date().toISOString(),
  };
}

export function adaptEventsToNormalized(raw: OddsApiEvent[], market: string): NormalizedEventOdds[] {
  return raw.map((ev) => adaptEventToNormalized(ev, market));
}
