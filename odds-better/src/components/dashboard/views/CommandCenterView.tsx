// ── Command Center View ──────────────────────────────────────

'use client';

import { DashboardData } from '@/hooks/useDashboardData';
import { OddsApiQuotaMeta } from '@/domain/models/api';
import { FetchStatus } from '@/domain/models/enums';
import GlobalKpiBar from '@/components/dashboard/GlobalKpiBar';
import AlertStream from '@/components/dashboard/AlertStream';
import OpportunityTable from '@/components/dashboard/OpportunityTable';
import OddsApiStatusPanel from '@/components/dashboard/OddsApiStatusPanel';
import ApiQuotaPanel from '@/components/dashboard/ApiQuotaPanel';

interface CommandCenterViewProps {
  data: DashboardData;
  status: FetchStatus;
  error: string | null;
  quota: OddsApiQuotaMeta | null;
  fetchedAt: string | null;
  sportKey: string;
  market: string;
}

export default function CommandCenterView({
  data,
  status,
  error,
  quota,
  fetchedAt,
  sportKey,
  market,
}: CommandCenterViewProps) {
  return (
    <div className="space-y-4">
      <GlobalKpiBar
        eventsMonitored={data.kpis.eventsMonitored}
        activeBookmakers={data.kpis.activeBookmakers}
        valueBetCount={data.kpis.valueBetCount}
        benchmarkCoverageRate={data.kpis.benchmarkCoverageRate}
        averageBookmakerCoverage={data.kpis.averageBookmakerCoverage}
        quota={quota}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <AlertStream alerts={data.alerts} />
          <OpportunityTable rows={data.valueBets} maxRows={8} />
        </div>
        <div className="space-y-4">
          <OddsApiStatusPanel
            status={status}
            error={error}
            eventCount={data.kpis.eventsMonitored}
            fetchedAt={fetchedAt}
            sportKey={sportKey}
            market={market}
          />
          <ApiQuotaPanel quota={quota} fetchedAt={fetchedAt} />
        </div>
      </div>
    </div>
  );
}
