// ── Bookmaker Domain Model ────────────────────────────────────

export interface BookmakerDefinition {
  key: string;
  title: string;
  region: string;
  isSharp: boolean;
  isBenchmark: boolean;
  tier: 'sharp' | 'medium' | 'soft';
}

export const EU_BOOKMAKERS: BookmakerDefinition[] = [
  { key: 'pinnacle', title: 'Pinnacle', region: 'eu', isSharp: true, isBenchmark: true, tier: 'sharp' },
  { key: 'betfair_ex_eu', title: 'Betfair Exchange', region: 'eu', isSharp: true, isBenchmark: false, tier: 'sharp' },
  { key: 'sport888', title: '888sport', region: 'eu', isSharp: false, isBenchmark: false, tier: 'medium' },
  { key: 'unibet_eu', title: 'Unibet', region: 'eu', isSharp: false, isBenchmark: false, tier: 'medium' },
  { key: 'betclic', title: 'Betclic', region: 'eu', isSharp: false, isBenchmark: false, tier: 'medium' },
  { key: 'williamhill', title: 'William Hill', region: 'eu', isSharp: false, isBenchmark: false, tier: 'medium' },
  { key: 'betsson', title: 'Betsson', region: 'eu', isSharp: false, isBenchmark: false, tier: 'medium' },
  { key: 'marathon_bet', title: 'Marathon Bet', region: 'eu', isSharp: false, isBenchmark: false, tier: 'soft' },
  { key: 'onexbet', title: '1xBet', region: 'eu', isSharp: false, isBenchmark: false, tier: 'soft' },
  { key: 'coolbet', title: 'Coolbet', region: 'eu', isSharp: false, isBenchmark: false, tier: 'medium' },
  { key: 'nordicbet', title: 'NordicBet', region: 'eu', isSharp: false, isBenchmark: false, tier: 'medium' },
  { key: 'matchbook', title: 'Matchbook', region: 'eu', isSharp: true, isBenchmark: false, tier: 'sharp' },
  { key: 'betvictor', title: 'BetVictor', region: 'eu', isSharp: false, isBenchmark: false, tier: 'medium' },
];

export const DEFAULT_BENCHMARK_BOOKMAKER = 'pinnacle';

export function getBookmakerDefinition(key: string): BookmakerDefinition | undefined {
  return EU_BOOKMAKERS.find((b) => b.key === key);
}

export function getBookmakerTitle(key: string): string {
  return EU_BOOKMAKERS.find((b) => b.key === key)?.title ?? key;
}
