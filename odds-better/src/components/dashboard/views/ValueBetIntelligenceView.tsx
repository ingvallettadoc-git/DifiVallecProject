// ── Value Bet Intelligence View ──────────────────────────────

'use client';

import { useState, useMemo } from 'react';
import { DashboardData } from '@/hooks/useDashboardData';
import { NormalizedEventOdds } from '@/domain/models/odds';
import { ValueBetRow, BenchmarkResult } from '@/domain/models/valueBet';
import { BenchmarkType } from '@/domain/models/enums';
import RealDataOpportunityTable from '@/components/dashboard/RealDataOpportunityTable';
import EventOddsComparisonPanel from '@/components/dashboard/EventOddsComparisonPanel';
import BenchmarkMethodologyCard from '@/components/dashboard/BenchmarkMethodologyCard';

interface ValueBetIntelligenceViewProps {
  data: DashboardData;
  events: NormalizedEventOdds[];
  evThreshold: number;
  benchmarkStrategy: 'direct' | 'synthetic' | 'auto';
}

export default function ValueBetIntelligenceView({
  data,
  events,
  evThreshold,
  benchmarkStrategy,
}: ValueBetIntelligenceViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<NormalizedEventOdds | null>(null);

  const handleSelectRow = (row: ValueBetRow) => {
    const ev = events.find((e) => e.eventId === row.eventId);
    setSelectedEvent(ev ?? null);
  };

  const benchmarkStats = useMemo(() => {
    const direct = data.valueBets.filter((v) => v.benchmarkType === BenchmarkType.Direct).length;
    const synthetic = data.valueBets.filter((v) => v.benchmarkType === BenchmarkType.Synthetic).length;
    return { direct, synthetic };
  }, [data.valueBets]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3">
          <RealDataOpportunityTable
            valueBets={data.valueBets}
            eventsAnalyzed={data.kpis.eventsMonitored}
            bookmakersCompared={data.kpis.activeBookmakers}
            evThreshold={evThreshold}
            onSelectRow={handleSelectRow}
          />
        </div>
        <div className="space-y-4">
          <BenchmarkMethodologyCard
            benchmarkCoverageRate={data.kpis.benchmarkCoverageRate}
            eventsWithDirect={benchmarkStats.direct}
            eventsWithSynthetic={benchmarkStats.synthetic}
            totalEvents={data.kpis.eventsMonitored}
            strategy={benchmarkStrategy}
          />
          <EventOddsComparisonPanel event={selectedEvent} />
        </div>
      </div>
    </div>
  );
}
