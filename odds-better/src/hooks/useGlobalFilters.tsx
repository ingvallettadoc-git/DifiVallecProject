// ── Global Filters Hook ──────────────────────────────────────

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { GlobalFilterState, DEFAULT_FILTERS } from '@/domain/models/filters';
import { SportKey, MarketType } from '@/domain/models/enums';

interface GlobalFilterContextValue {
  filters: GlobalFilterState;
  setSportKey: (key: SportKey) => void;
  setMarket: (market: MarketType) => void;
  setEvThreshold: (threshold: number) => void;
  setMinBookmakerCoverage: (min: number) => void;
  setSelectedBookmakers: (keys: string[]) => void;
  setSearchText: (text: string) => void;
  setSelectedEventId: (id: string | null) => void;
  setBenchmarkStrategy: (s: 'direct' | 'synthetic' | 'auto') => void;
  resetFilters: () => void;
}

const GlobalFilterContext = createContext<GlobalFilterContextValue | null>(null);

export function GlobalFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<GlobalFilterState>(DEFAULT_FILTERS);

  const update = useCallback(
    (patch: Partial<GlobalFilterState>) => setFilters((prev) => ({ ...prev, ...patch })),
    []
  );

  const value: GlobalFilterContextValue = {
    filters,
    setSportKey: (sportKey) => update({ sportKey }),
    setMarket: (market) => update({ market }),
    setEvThreshold: (evThreshold) => update({ evThreshold }),
    setMinBookmakerCoverage: (minBookmakerCoverage) => update({ minBookmakerCoverage }),
    setSelectedBookmakers: (selectedBookmakers) => update({ selectedBookmakers }),
    setSearchText: (searchText) => update({ searchText }),
    setSelectedEventId: (selectedEventId) => update({ selectedEventId }),
    setBenchmarkStrategy: (benchmarkStrategy) => update({ benchmarkStrategy }),
    resetFilters: () => setFilters(DEFAULT_FILTERS),
  };

  return <GlobalFilterContext.Provider value={value}>{children}</GlobalFilterContext.Provider>;
}

export function useGlobalFilters(): GlobalFilterContextValue {
  const ctx = useContext(GlobalFilterContext);
  if (!ctx) throw new Error('useGlobalFilters must be used within GlobalFilterProvider');
  return ctx;
}
