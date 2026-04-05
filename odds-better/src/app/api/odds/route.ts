// ── Server-side API Route — Odds Proxy ───────────────────────
// POST /api/odds  — proxies calls to The Odds API v4
// Query params forwarded: sportKey, market, region
// API key is read from environment — never exposed to client.

import { NextRequest, NextResponse } from 'next/server';
import { createOddsRepository } from '@/services/oddsApi/repository';
import { OddsApiError } from '@/services/oddsApi/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const sportKey = searchParams.get('sportKey') ?? 'soccer_italy_serie_a';
  const market = searchParams.get('market') ?? 'h2h';
  const region = searchParams.get('region') ?? 'eu';

  // Validate inputs to prevent injection
  const validSportKeyPattern = /^[a-z0-9_]+$/;
  const validMarketPattern = /^[a-z0-9_]+$/;
  const validRegionPattern = /^[a-z]{2}$/;

  if (!validSportKeyPattern.test(sportKey)) {
    return NextResponse.json({ error: 'Invalid sportKey parameter' }, { status: 400 });
  }
  if (!validMarketPattern.test(market)) {
    return NextResponse.json({ error: 'Invalid market parameter' }, { status: 400 });
  }
  if (!validRegionPattern.test(region)) {
    return NextResponse.json({ error: 'Invalid region parameter' }, { status: 400 });
  }

  try {
    const repo = createOddsRepository();
    const { events, quota } = await repo.fetchNormalizedOdds(sportKey, market, region);

    return NextResponse.json({
      events,
      quota,
      meta: {
        sportKey,
        market,
        region,
        fetchedAt: new Date().toISOString(),
        eventCount: events.length,
      },
    });
  } catch (err) {
    if (err instanceof OddsApiError) {
      return NextResponse.json(
        {
          error: err.message,
          statusCode: err.statusCode,
          quota: err.quota,
        },
        { status: err.statusCode >= 500 ? 502 : err.statusCode }
      );
    }
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
