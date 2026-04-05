// ── The Odds API v4 — HTTP Client (server-side only) ─────────

import { OddsApiQuotaMeta } from '@/domain/models/api';
import { getApiKeyFromEnv } from './config';
import { parseQuotaHeaders } from './quota';

export interface ApiClientResponse<T> {
  data: T;
  quota: OddsApiQuotaMeta;
  status: number;
}

export async function oddsApiFetch<T>(
  url: string,
  params: Record<string, string> = {}
): Promise<ApiClientResponse<T>> {
  const apiKey = getApiKeyFromEnv();

  const searchParams = new URLSearchParams({ apiKey, ...params });
  const fullUrl = `${url}?${searchParams.toString()}`;

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 },
  });

  const quota = parseQuotaHeaders(response.headers);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new OddsApiError(
      `The Odds API returned ${response.status}: ${errorBody}`,
      response.status,
      quota
    );
  }

  const data = (await response.json()) as T;
  return { data, quota, status: response.status };
}

export class OddsApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly quota: OddsApiQuotaMeta
  ) {
    super(message);
    this.name = 'OddsApiError';
  }
}
