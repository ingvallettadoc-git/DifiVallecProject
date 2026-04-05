// ── The Odds API v4 — Endpoint Builder ───────────────────────

import { ODDS_API_BASE_URL, ODDS_API_VERSION } from './config';

const base = `${ODDS_API_BASE_URL}/${ODDS_API_VERSION}`;

export function sportsEndpoint(): string {
  return `${base}/sports`;
}

export function sportOddsEndpoint(sportKey: string): string {
  return `${base}/sports/${encodeURIComponent(sportKey)}/odds`;
}

export function sportEventsEndpoint(sportKey: string): string {
  return `${base}/sports/${encodeURIComponent(sportKey)}/events`;
}

export function eventOddsEndpoint(sportKey: string, eventId: string): string {
  return `${base}/sports/${encodeURIComponent(sportKey)}/events/${encodeURIComponent(eventId)}/odds`;
}
