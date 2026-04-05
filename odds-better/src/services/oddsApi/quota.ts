// ── The Odds API v4 — Quota Meta Parser ──────────────────────

import { OddsApiQuotaMeta } from '@/domain/models/api';

export function parseQuotaHeaders(headers: Headers): OddsApiQuotaMeta {
  return {
    requestsUsed: parseInt(headers.get('x-requests-used') ?? '0', 10),
    requestsRemaining: parseInt(headers.get('x-requests-remaining') ?? '0', 10),
    requestsLast: headers.get('x-requests-last') ?? '',
  };
}

export function isQuotaLow(quota: OddsApiQuotaMeta, threshold: number = 50): boolean {
  return quota.requestsRemaining <= threshold;
}

export function quotaSummary(quota: OddsApiQuotaMeta): string {
  return `Used: ${quota.requestsUsed} | Remaining: ${quota.requestsRemaining} | Last: ${quota.requestsLast}`;
}
