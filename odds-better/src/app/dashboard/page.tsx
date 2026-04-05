// ── Dashboard Page (main entry) ──────────────────────────────

'use client';

import { useState } from 'react';
import { useOddsApiData } from '@/hooks/useOddsApiData';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useGlobalFilters, GlobalFilterProvider } from '@/hooks/useGlobalFilters';
import { FetchStatus } from '@/domain/models/enums';
import GlobalFilterBar from '@/components/dashboard/GlobalFilterBar';
import CommandCenterView from '@/components/dashboard/views/CommandCenterView';
import ValueBetIntelligenceView from '@/components/dashboard/views/ValueBetIntelligenceView';
import SurebetIntelligenceView from '@/components/dashboard/views/SurebetIntelligenceView';
import MarketSynchronizationView from '@/components/dashboard/views/MarketSynchronizationView';
import BookmakerNetworkView from '@/components/dashboard/views/BookmakerNetworkView';
import LifecyclePersistenceView from '@/components/dashboard/views/LifecyclePersistenceView';
import ResearchAnalyticsView from '@/components/dashboard/views/ResearchAnalyticsView';
import { cn } from '@/lib/utils';

type TabId =
  | 'command-center'
  | 'value-bet'
  | 'surebet'
  | 'market-sync'
  | 'bookmaker-network'
  | 'lifecycle'
  | 'research';

const TABS: { id: TabId; label: string }[] = [
  { id: 'command-center', label: 'Command Center' },
  { id: 'value-bet', label: 'Value Bet Intelligence' },
  { id: 'surebet', label: 'Surebet Intelligence' },
  { id: 'market-sync', label: 'Market Sync' },
  { id: 'bookmaker-network', label: 'Bookmaker Network' },
  { id: 'lifecycle', label: 'Lifecycle Lab' },
  { id: 'research', label: 'Research & Analytics' },
];

function DashboardInner() {
  const [activeTab, setActiveTab] = useState<TabId>('command-center');
  const { filters } = useGlobalFilters();
  const api = useOddsApiData();
  const dashData = useDashboardData(api.events, filters, api.quota?.requestsRemaining ?? 0);

  // ── Quota budget state ─────────────────────────────────────
  const [tokenBudget, setTokenBudget] = useState<number>(5);
  const [sessionRequestsUsed, setSessionRequestsUsed] = useState<number>(0);
  const [analysisStarted, setAnalysisStarted] = useState<boolean>(false);

  const budgetExhausted = sessionRequestsUsed >= tokenBudget;

  const handleStartAnalysis = async () => {
    if (budgetExhausted) return;
    setAnalysisStarted(true);
    await api.fetchOdds(filters.sportKey, filters.market);
    setSessionRequestsUsed((prev) => prev + 1);
  };

  const handleRefresh = async () => {
    if (budgetExhausted) return;
    await api.fetchOdds(filters.sportKey, filters.market);
    setSessionRequestsUsed((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">
              OddsBetter <span className="text-blue-400 font-normal text-sm ml-1">Intelligence</span>
            </h1>
            <p className="text-[10px] text-slate-500">
              Betting Market Analysis · Real Data · The Odds API v4
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Session quota budget indicator */}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded px-3 py-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Session Requests</span>
              <span
                className={cn(
                  'font-mono text-sm font-bold',
                  budgetExhausted ? 'text-red-400' : sessionRequestsUsed >= tokenBudget - 1 ? 'text-yellow-400' : 'text-emerald-400'
                )}
              >
                {sessionRequestsUsed}
              </span>
              <span className="text-slate-600 text-xs">/</span>
              <span className="font-mono text-sm text-slate-400">{tokenBudget}</span>
            </div>

            {api.status === FetchStatus.Loading && (
              <span className="text-xs text-blue-400 animate-pulse">Fetching…</span>
            )}

            {analysisStarted && (
              <button
                onClick={handleRefresh}
                disabled={api.status === FetchStatus.Loading || budgetExhausted}
                title={budgetExhausted ? 'Budget esaurito per questa sessione' : ''}
                className={cn(
                  'text-white text-xs font-medium px-4 py-1.5 rounded transition-colors',
                  budgetExhausted
                    ? 'bg-slate-700 opacity-40 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
                )}
              >
                {budgetExhausted ? 'Budget esaurito' : 'Refresh Data'}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-4 py-4 space-y-4">

        {/* ── Pre-analysis configuration panel ─────────────────── */}
        {!analysisStarted && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-8 w-full max-w-md text-center">
              <h2 className="text-lg font-bold text-slate-100 mb-1">Configura Sessione di Analisi</h2>
              <p className="text-xs text-slate-400 mb-6">
                Imposta il numero massimo di richieste API che vuoi consumare in questa sessione prima di avviare l&apos;analisi.
                Ogni &quot;Refresh Data&quot; consuma 1 richiesta.
              </p>

              <div className="bg-slate-900/60 rounded-lg p-4 mb-6 text-left space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Piano API attuale</span>
                  <span className="text-slate-200 font-mono">Free tier</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Costo stimato per fetch</span>
                  <span className="text-slate-200 font-mono">~1 request</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Sport selezionato</span>
                  <span className="text-slate-200 font-mono">{filters.sportKey}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Market</span>
                  <span className="text-slate-200 font-mono">{filters.market}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs text-slate-400 mb-3">
                  Budget massimo richieste questa sessione:{' '}
                  <span className="text-white font-bold text-sm">{tokenBudget}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={tokenBudget}
                  onChange={(e) => setTokenBudget(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-800/50 rounded p-3 mb-6 text-left">
                <p className="text-[11px] text-yellow-300">
                  <span className="font-semibold">Attenzione:</span> Il piano free di The Odds API ha un quota mensile limitata.
                  Con budget = {tokenBudget} consumi al massimo {tokenBudget} request in questa sessione.
                </p>
              </div>

              <button
                onClick={handleStartAnalysis}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
              >
                Avvia Analisi (1 request)
              </button>
            </div>
          </div>
        )}

        {/* ── Active analysis layout ───────────────────────────── */}
        {analysisStarted && (
          <>
            {/* Global Filters */}
            <GlobalFilterBar />

            {/* Budget exhausted banner */}
            {budgetExhausted && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-yellow-300">Budget sessione esaurito</p>
                  <p className="text-xs text-yellow-400/80">
                    Hai usato {sessionRequestsUsed}/{tokenBudget} richieste. Ricarica la pagina per riconfigurare il budget.
                  </p>
                </div>
                <button
                  onClick={() => { setSessionRequestsUsed(0); setAnalysisStarted(false); }}
                  className="text-xs bg-yellow-700 hover:bg-yellow-600 text-yellow-100 px-3 py-1.5 rounded transition-colors shrink-0"
                >
                  Riconfigura sessione
                </button>
              </div>
            )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-3 py-2 text-xs font-medium rounded-t transition-colors border-b-2',
                activeTab === tab.id
                  ? 'text-blue-400 border-blue-400 bg-slate-800/50'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30'
              )}
            >
              {tab.label}
              {tab.id === 'value-bet' && dashData.valueBets.length > 0 && (
                <span className="ml-1.5 bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                  {dashData.valueBets.length}
                </span>
              )}
              {tab.id === 'surebet' && dashData.surebetCandidates.length > 0 && (
                <span className="ml-1.5 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                  {dashData.surebetCandidates.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error state */}
        {api.status === FetchStatus.Error && (
          <div className="bg-red-900/20 border border-red-800 text-red-300 rounded-lg p-4">
            <p className="text-sm font-semibold">API Error</p>
            <p className="text-xs mt-1">{api.error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-xs bg-red-800 hover:bg-red-700 text-red-100 px-3 py-1 rounded"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading placeholder */}
        {api.status === FetchStatus.Loading && api.events.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-400">Fetching odds data from The Odds API…</p>
            </div>
          </div>
        )}

        {/* Idle state */}
        {api.status === FetchStatus.Idle && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-sm text-slate-500">Click &quot;Refresh Data&quot; to fetch live odds.</p>
            </div>
          </div>
        )}

        {/* Tab content */}
        {(api.status === FetchStatus.Success || api.status === FetchStatus.Empty || api.events.length > 0) && (
          <>
            {activeTab === 'command-center' && (
              <CommandCenterView
                data={dashData}
                status={api.status}
                error={api.error}
                quota={api.quota}
                fetchedAt={api.fetchedAt}
                sportKey={filters.sportKey}
                market={filters.market}
              />
            )}
            {activeTab === 'value-bet' && (
              <ValueBetIntelligenceView
                data={dashData}
                events={api.events}
                evThreshold={filters.evThreshold}
                benchmarkStrategy={filters.benchmarkStrategy}
              />
            )}
            {activeTab === 'surebet' && (
              <SurebetIntelligenceView candidates={dashData.surebetCandidates} />
            )}
            {activeTab === 'market-sync' && (
              <MarketSynchronizationView staleSignals={dashData.staleSignals} />
            )}
            {activeTab === 'bookmaker-network' && (
              <BookmakerNetworkView divergenceRows={dashData.divergenceRows} />
            )}
            {activeTab === 'lifecycle' && <LifecyclePersistenceView />}
            {activeTab === 'research' && (
              <ResearchAnalyticsView
                data={dashData}
                events={api.events}
                quota={api.quota}
                fetchedAt={api.fetchedAt}
                sportKey={filters.sportKey}
                market={filters.market}
                benchmarkStrategy={filters.benchmarkStrategy}
              />
            )}
          </>
        )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-8 py-4 text-center text-[10px] text-slate-600">
        OddsBetter Intelligence · Powered by The Odds API v4 · Real Data Only · No Mock
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <GlobalFilterProvider>
      <DashboardInner />
    </GlobalFilterProvider>
  );
}
