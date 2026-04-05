// ── Global Filter Bar Component ──────────────────────────────

'use client';

import { useGlobalFilters } from '@/hooks/useGlobalFilters';
import { SportKey, MarketType } from '@/domain/models/enums';

export default function GlobalFilterBar() {
  const {
    filters,
    setSportKey,
    setMarket,
    setEvThreshold,
    setMinBookmakerCoverage,
    setBenchmarkStrategy,
    setSearchText,
    resetFilters,
  } = useGlobalFilters();

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 flex flex-wrap items-end gap-4">
      {/* Sport */}
      <div>
        <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Sport</label>
        <select
          value={filters.sportKey}
          onChange={(e) => setSportKey(e.target.value as SportKey)}
          className="bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option value={SportKey.SoccerItalySerieA}>Serie A</option>
          <option value={SportKey.SoccerItalySerieB}>Serie B</option>
          <option value={SportKey.SoccerItalyCoppaItalia}>Coppa Italia</option>
        </select>
      </div>

      {/* Market */}
      <div>
        <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Market</label>
        <select
          value={filters.market}
          onChange={(e) => setMarket(e.target.value as MarketType)}
          className="bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option value={MarketType.H2H}>H2H (1X2)</option>
          <option value={MarketType.Spreads}>Spreads</option>
          <option value={MarketType.Totals}>Totals</option>
        </select>
      </div>

      {/* EV Threshold */}
      <div>
        <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
          EV Threshold: {(filters.evThreshold * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={filters.evThreshold * 100}
          onChange={(e) => setEvThreshold(Number(e.target.value) / 100)}
          className="w-32 accent-blue-500"
        />
      </div>

      {/* Min BM Coverage */}
      <div>
        <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Min Bookmakers</label>
        <input
          type="number"
          min={1}
          max={15}
          value={filters.minBookmakerCoverage}
          onChange={(e) => setMinBookmakerCoverage(Number(e.target.value))}
          className="bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded px-2 py-1.5 w-16 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Benchmark Strategy */}
      <div>
        <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Benchmark</label>
        <select
          value={filters.benchmarkStrategy}
          onChange={(e) => setBenchmarkStrategy(e.target.value as 'direct' | 'synthetic' | 'auto')}
          className="bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option value="auto">Auto</option>
          <option value="direct">Direct (Pinnacle)</option>
          <option value="synthetic">Synthetic (Median)</option>
        </select>
      </div>

      {/* Search */}
      <div>
        <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Search</label>
        <input
          type="text"
          placeholder="Team, bookmaker..."
          value={filters.searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="bg-slate-900 border border-slate-600 text-slate-200 text-sm rounded px-2 py-1.5 w-44 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium px-3 py-1.5 rounded transition-colors"
      >
        Reset
      </button>
    </div>
  );
}
