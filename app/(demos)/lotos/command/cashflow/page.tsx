'use client';

const CASHFLOW_PROJECTION = [
  { period: 'Week 1 (Apr 1–7)', inflows: 45000, outflows: 32000, sources: 'DL-2026-004 funding, DL-2026-005 expected', expenses: 'Payroll, floorplan interest' },
  { period: 'Week 2 (Apr 8–14)', inflows: 38000, outflows: 28000, sources: '2 projected sales at avg gross', expenses: 'Rent, marketing' },
  { period: 'Week 3 (Apr 15–21)', inflows: 52000, outflows: 35000, sources: '3 projected sales, BHPH payments', expenses: 'Payroll, auction purchases' },
  { period: 'Week 4 (Apr 22–30)', inflows: 48000, outflows: 30000, sources: '2–3 projected sales', expenses: 'Insurance, utilities' },
  { period: 'May (30–60d)', inflows: 165000, outflows: 120000, sources: 'Projected 12–14 unit sales', expenses: 'Standard operating' },
  { period: 'June (60–90d)', inflows: 180000, outflows: 125000, sources: 'Summer buying season boost', expenses: 'Standard operating + marketing push' },
];

const STARTING_CASH = 125000;

// Build cumulative running balance
function buildRunningBalance() {
  let balance = STARTING_CASH;
  return CASHFLOW_PROJECTION.map((row) => {
    const net = row.inflows - row.outflows;
    balance += net;
    return { period: row.period, net, runningBalance: balance };
  });
}

const runningBalance = buildRunningBalance();
const maxBalance = Math.max(STARTING_CASH, ...runningBalance.map((r) => r.runningBalance));

export default function LotosCashflowPage() {
  const projected30 = CASHFLOW_PROJECTION.slice(0, 4).reduce((sum, r) => sum + r.inflows - r.outflows, 0);
  const projected60 = CASHFLOW_PROJECTION.slice(0, 5).reduce((sum, r) => sum + r.inflows - r.outflows, 0);
  const projected90 = CASHFLOW_PROJECTION.reduce((sum, r) => sum + r.inflows - r.outflows, 0);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Cashflow Forecast
        </h1>
        <p style={{ color: '#57534E', fontSize: '16px', marginTop: '4px' }}>
          30 / 60 / 90-day cash position projection with weekly detail
        </p>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {[
          { label: 'Current Cash Position', value: STARTING_CASH, color: '#1C1917', note: 'As of Apr 1, 2026' },
          { label: '30-Day Projected', value: projected30, color: projected30 >= 0 ? '#16A34A' : '#DC2626', note: 'Net inflow/outflow', prefix: projected30 >= 0 ? '+' : '' },
          { label: '60-Day Projected', value: projected60, color: projected60 >= 0 ? '#16A34A' : '#DC2626', note: 'Cumulative net', prefix: projected60 >= 0 ? '+' : '' },
          { label: '90-Day Projected', value: projected90, color: projected90 >= 0 ? '#16A34A' : '#DC2626', note: 'Cumulative net', prefix: projected90 >= 0 ? '+' : '' },
        ].map(({ label, value, color, note, prefix = '' }) => (
          <div
            key={label}
            className="rounded-xl bg-white border p-6"
            style={{ borderColor: '#E7E5E4' }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#78716C', marginBottom: '6px' }}>
              {label}
            </div>
            <div className="text-3xl font-bold" style={{ color }}>
              {prefix}${Math.abs(value).toLocaleString()}
            </div>
            <div style={{ fontSize: '13px', color: '#A8A29E', marginTop: '4px' }}>{note}</div>
          </div>
        ))}
      </div>

      {/* Alert Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        <div
          style={{
            background: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400E', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Floorplan Alert
          </div>
          <div style={{ fontSize: '15px', color: '#78350F', fontWeight: 600 }}>
            2 units approaching 90-day mark
          </div>
          <div style={{ fontSize: '14px', color: '#92400E', marginTop: '2px' }}>
            Curtailment payoff required: <strong>$66,500</strong>
          </div>
        </div>
        <div
          style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E40AF', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            BHPH Collections
          </div>
          <div style={{ fontSize: '15px', color: '#1E3A8A', fontWeight: 600 }}>
            Collections due this pay period
          </div>
          <div style={{ fontSize: '14px', color: '#1E40AF', marginTop: '2px' }}>
            Expected BHPH payment: <strong>$850</strong>
          </div>
        </div>
      </div>

      {/* Inflows vs Outflows Table */}
      <div style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1C1917' }}>Inflows vs Outflows</h2>
      </div>
      <div
        className="rounded-xl bg-white border"
        style={{ borderColor: '#E7E5E4', overflowX: 'auto', marginBottom: '28px' }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
              {['Period', 'Inflows', 'Outflows', 'Net', 'Sources', 'Expenses'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 14px',
                    textAlign: 'left',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    color: '#78716C',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CASHFLOW_PROJECTION.map((row) => {
              const net = row.inflows - row.outflows;
              return (
                <tr key={row.period} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 600, color: '#1C1917', whiteSpace: 'nowrap' }}>
                    {row.period}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 700, color: '#16A34A', whiteSpace: 'nowrap' }}>
                    +${row.inflows.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 700, color: '#DC2626', whiteSpace: 'nowrap' }}>
                    −${row.outflows.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: '12px 14px',
                      fontSize: '14px',
                      fontWeight: 800,
                      color: net >= 0 ? '#16A34A' : '#DC2626',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {net >= 0 ? '+' : '−'}${Math.abs(net).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#57534E', minWidth: '200px' }}>
                    {row.sources}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#57534E', minWidth: '180px' }}>
                    {row.expenses}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Running Balance Visualization */}
      <div style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1C1917' }}>
          Cumulative Cash Position (90-Day Outlook)
        </h2>
      </div>
      <div
        className="rounded-xl bg-white border p-6"
        style={{ borderColor: '#E7E5E4' }}
      >
        {/* Starting balance marker */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}
        >
          <span style={{ fontSize: '13px', color: '#78716C', fontWeight: 600 }}>Starting:</span>
          <span style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917' }}>
            ${STARTING_CASH.toLocaleString()}
          </span>
        </div>

        {/* Bar chart */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '160px' }}>
          {/* Starting bar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#1C1917',
                marginBottom: '4px',
                textAlign: 'center',
              }}
            >
              ${STARTING_CASH.toLocaleString()}
            </div>
            <div
              style={{
                width: '100%',
                height: `${(STARTING_CASH / (maxBalance * 1.1)) * 120}px`,
                background: '#CBD5E1',
                borderRadius: '6px 6px 0 0',
                minHeight: '8px',
              }}
            />
            <div style={{ fontSize: '11px', color: '#78716C', marginTop: '4px', textAlign: 'center' }}>
              Start
            </div>
          </div>

          {runningBalance.map((row, i) => {
            const barHeight = Math.max(8, (row.runningBalance / (maxBalance * 1.1)) * 120);
            const isPositive = row.runningBalance >= 0;
            const shortLabel = i < 4 ? `Wk ${i + 1}` : i === 4 ? 'May' : 'Jun';
            return (
              <div
                key={row.period}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isPositive ? '#16A34A' : '#DC2626',
                    marginBottom: '4px',
                    textAlign: 'center',
                  }}
                >
                  ${row.runningBalance.toLocaleString()}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: `${barHeight}px`,
                    background: isPositive ? '#16A34A' : '#DC2626',
                    borderRadius: '6px 6px 0 0',
                    minHeight: '8px',
                  }}
                />
                <div style={{ fontSize: '11px', color: '#78716C', marginTop: '4px', textAlign: 'center' }}>
                  {shortLabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* Baseline */}
        <div style={{ borderTop: '2px solid #1C1917', marginTop: '0', opacity: 0.15 }} />

        <div style={{ marginTop: '12px', fontSize: '13px', color: '#78716C' }}>
          * Projections based on pipeline data, historical averages, and BHPH payment schedules. Actuals may vary.
        </div>
      </div>
    </div>
  );
}
