// ── Odds API Data Hook ───────────────────────────────────────

'use client';

import { useState, useCallback } from 'react';
import { NormalizedEventOdds } from '@/domain/models/odds';
import { OddsApiQuotaMeta } from '@/domain/models/api';
import { FetchStatus } from '@/domain/models/enums';

interface OddsApiDataState {
  events: NormalizedEventOdds[];
  quota: OddsApiQuotaMeta | null;
  status: FetchStatus;
  error: string | null;
  fetchedAt: string | null;
  eventCount: number;
}

interface UseOddsApiDataReturn extends OddsApiDataState {
  fetchOdds: (sportKey: string, market: string, region?: string) => Promise<void>;
}

export function useOddsApiData(): UseOddsApiDataReturn {
  const [state, setState] = useState<OddsApiDataState>({
    events: [],
    quota: null,
    status: FetchStatus.Idle,
    error: null,
    fetchedAt: null,
    eventCount: 0,
  });

  const fetchOdds = useCallback(async (sportKey: string, market: string, region: string = 'eu') => {
    setState((prev) => ({ ...prev, status: FetchStatus.Loading, error: null }));

    try {
      const params = new URLSearchParams({ sportKey, market, region });
      const res = await fetch(`/api/odds?${params.toString()}`);

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();

      const events: NormalizedEventOdds[] = data.events ?? [];
      const quota: OddsApiQuotaMeta = data.quota ?? { requestsUsed: 0, requestsRemaining: 0, requestsLast: '' };

      setState({
        events,
        quota,
        status: events.length > 0 ? FetchStatus.Success : FetchStatus.Empty,
        error: null,
        fetchedAt: data.meta?.fetchedAt ?? new Date().toISOString(),
        eventCount: events.length,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        status: FetchStatus.Error,
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  }, []);

  return { ...state, fetchOdds };
}
