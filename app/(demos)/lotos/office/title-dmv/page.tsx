'use client';

import { DEALS, VEHICLES, CUSTOMERS } from '@/data/lotos';

const TITLE_PIPELINE = [
  { dealId: 'DL-2026-001', titleReceived: true, dmvSubmitted: true, registered: true },
  { dealId: 'DL-2026-002', titleReceived: true, dmvSubmitted: true, registered: false },
  { dealId: 'DL-2026-003', titleReceived: true, dmvSubmitted: false, registered: false },
  { dealId: 'DL-2026-004', titleReceived: false, dmvSubmitted: false, registered: false },
  { dealId: 'DL-2026-005', titleReceived: false, dmvSubmitted: false, registered: false },
  { dealId: 'DL-2026-006', titleReceived: true, dmvSubmitted: true, registered: true },
  { dealId: 'DL-2026-007', titleReceived: false, dmvSubmitted: false, registered: false },
];

const CUSTOMER_NAMES: Record<string, string> = {
  'CUS-001': 'Marcus Rivera',
  'CUS-002': 'Sarah Chen',
  'CUS-005': 'David Thompson',
  'CUS-006': 'Ashley Brown',
  'CUS-007': 'Robert Martinez',
  'CUS-008': 'Jennifer Lee',
  'CUS-010': 'Nicole Anderson',
};

function StageIcon({ complete, inProgress }: { complete: boolean; inProgress: boolean }) {
  if (complete) return <span className="text-base font-bold" style={{ color: '#16A34A' }}>✓</span>;
  if (inProgress) return <span className="text-base" style={{ color: '#2563EB' }}>◐</span>;
  return <span className="text-base" style={{ color: '#D1D5DB' }}>○</span>;
}

export default function TitleDmvPage() {
  const dealMap = Object.fromEntries(DEALS.map(d => [d.id, d]));
  const vehicleMap = Object.fromEntries(VEHICLES.map(v => [v.id, v]));

  // Pipeline stage counts
  const dealClosed = TITLE_PIPELINE.length;
  const titleReceived = TITLE_PIPELINE.filter(p => p.titleReceived).length;
  const dmvSubmitted = TITLE_PIPELINE.filter(p => p.dmvSubmitted).length;
  const registered = TITLE_PIPELINE.filter(p => p.registered).length;

  // Average days to title for completed ones (deals with registered = true and a fundedDate)
  const completedDeals = TITLE_PIPELINE
    .filter(p => p.registered)
    .map(p => dealMap[p.dealId])
    .filter(d => d && d.fundedDate && d.closedDate);

  const avgDaysToTitle = completedDeals.length > 0
    ? Math.round(
        completedDeals.reduce((sum, d) => {
          const days = Math.round((new Date(d!.fundedDate!).getTime() - new Date(d!.closedDate).getTime()) / (1000 * 60 * 60 * 24));
          return sum + days + 12; // add processing time offset
        }, 0) / completedDeals.length
      )
    : 14;

  const stages = [
    { label: 'Deal Closed', count: dealClosed },
    { label: 'Title Received', count: titleReceived },
    { label: 'DMV Submitted', count: dmvSubmitted },
    { label: 'Registration Complete', count: registered },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Title &amp; DMV
        </h1>
        <p className="mt-1 text-base" style={{ color: '#57534E' }}>
          Title transfer pipeline and registration status for all active deals
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Deals Closed
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>{dealClosed}</p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>in pipeline</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Titles Received
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#2563EB' }}>{titleReceived}</p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>of {dealClosed} deals</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            DMV Submitted
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#7C3AED' }}>{dmvSubmitted}</p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>submitted for registration</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Avg Days to Title
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#16A34A' }}>{avgDaysToTitle}</p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>days for completed titles</p>
        </div>
      </div>

      {/* Pipeline Stage Progress Bar */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-lg font-bold mb-5" style={{ color: '#1C1917' }}>
          Pipeline Stages
        </h2>
        <div className="flex items-center gap-0">
          {stages.map((stage, i) => (
            <div key={stage.label} className="flex items-center flex-1">
              <div className="flex-1 flex flex-col items-center gap-2">
                {/* Bubble */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{
                    backgroundColor: stage.count === dealClosed ? '#16A34A' : stage.count > 0 ? '#2563EB' : '#E7E5E4',
                    color: stage.count > 0 ? '#FFFFFF' : '#78716C',
                  }}
                >
                  {stage.count}
                </div>
                <p className="text-sm font-semibold text-center" style={{ color: '#1C1917' }}>{stage.label}</p>
                <p className="text-xs" style={{ color: '#78716C' }}>
                  {Math.round((stage.count / dealClosed) * 100)}% of deals
                </p>
              </div>
              {i < stages.length - 1 && (
                <div
                  className="h-1 flex-1 mx-1"
                  style={{ backgroundColor: stages[i + 1].count > 0 ? '#2563EB' : '#E7E5E4', maxWidth: '60px' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Per-Deal Tracker Table */}
      <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #E7E5E4' }}>
          <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>
            Per-Deal Title Tracker
          </h2>
          <p className="text-sm mt-0.5" style={{ color: '#57534E' }}>
            Stage-by-stage status for each deal in the transfer pipeline
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E7E5E4' }}>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Deal #</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Vehicle</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Customer</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Close Date</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Deal Closed</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Title Received</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>DMV Submitted</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Registered</th>
            </tr>
          </thead>
          <tbody>
            {TITLE_PIPELINE.map((pipeline, i) => {
              const deal = dealMap[pipeline.dealId];
              if (!deal) return null;
              const vehicle = vehicleMap[deal.vehicleId];
              return (
                <tr key={pipeline.dealId} style={{ borderBottom: i < TITLE_PIPELINE.length - 1 ? '1px solid #F5F5F4' : undefined }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1C1917' }}>{deal.id}</td>
                  <td className="px-4 py-3" style={{ color: '#57534E' }}>
                    {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : deal.vehicleId}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#57534E' }}>{CUSTOMER_NAMES[deal.customerId] || deal.customerId}</td>
                  <td className="px-4 py-3 text-center" style={{ color: '#57534E' }}>{deal.closedDate}</td>
                  <td className="px-4 py-3 text-center">
                    <StageIcon complete={true} inProgress={false} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StageIcon complete={pipeline.titleReceived} inProgress={!pipeline.titleReceived} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StageIcon
                      complete={pipeline.dmvSubmitted}
                      inProgress={pipeline.titleReceived && !pipeline.dmvSubmitted}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StageIcon
                      complete={pipeline.registered}
                      inProgress={pipeline.dmvSubmitted && !pipeline.registered}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-6 py-3 flex gap-6" style={{ borderTop: '1px solid #E7E5E4', backgroundColor: '#F8FAFC' }}>
          <span className="text-sm flex items-center gap-1.5" style={{ color: '#57534E' }}>
            <span style={{ color: '#16A34A', fontWeight: 700 }}>✓</span> Complete
          </span>
          <span className="text-sm flex items-center gap-1.5" style={{ color: '#57534E' }}>
            <span style={{ color: '#2563EB' }}>◐</span> In Progress
          </span>
          <span className="text-sm flex items-center gap-1.5" style={{ color: '#57534E' }}>
            <span style={{ color: '#D1D5DB' }}>○</span> Pending
          </span>
        </div>
      </div>
    </div>
  );
}
