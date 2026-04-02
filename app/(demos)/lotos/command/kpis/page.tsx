'use client';

import { MONTHLY_KPIS, KPI_TARGETS } from '@/data/lotos';

type KpiKey = keyof typeof KPI_TARGETS;

function buildSparkline(values: number[], width = 100, height = 30): string {
  if (values.length < 2) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return points;
}

function getTrafficLight(
  current: number,
  target: number,
  lowerIsBetter = false
): { color: string; label: string } {
  const ratio = lowerIsBetter ? target / current : current / target;
  if (ratio >= 1) return { color: '#16A34A', label: 'On Target' };
  if (ratio >= 0.9) return { color: '#D97706', label: 'Near Target' };
  return { color: '#DC2626', label: 'Below Target' };
}

function formatValue(value: number, unit: string): string {
  if (unit === '$') return `$${value.toLocaleString()}`;
  if (unit === '%') return `${value}%`;
  if (unit === 'x/yr') return `${value.toFixed(1)}x`;
  return `${value} ${unit}`;
}

const KPI_KEYS: KpiKey[] = [
  'turnRate',
  'grossPerUnit',
  'avgDaysToFund',
  'reconCycleTime',
  'avgDaysOnLot',
  'fniPenetration',
];

const MONTH_LABELS: Record<string, string> = {
  '2025-05': 'May 25',
  '2025-06': 'Jun 25',
  '2025-07': 'Jul 25',
  '2025-08': 'Aug 25',
  '2025-09': 'Sep 25',
  '2025-10': 'Oct 25',
  '2025-11': 'Nov 25',
  '2025-12': 'Dec 25',
  '2026-01': 'Jan 26',
  '2026-02': 'Feb 26',
  '2026-03': 'Mar 26',
  '2026-04': 'Apr 26',
};

export default function LotosKpiDashboardPage() {
  const latestMonth = MONTHLY_KPIS[MONTHLY_KPIS.length - 1];
  const last6 = MONTHLY_KPIS.slice(-6);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          KPI Dashboard
        </h1>
        <p style={{ color: '#57534E', fontSize: '16px', marginTop: '4px' }}>
          Dealership performance vs targets — current month and 12-month trend
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {KPI_KEYS.map((key) => {
          const config = KPI_TARGETS[key];
          const current = latestMonth[key as keyof typeof latestMonth] as number;
          const sparkValues = last6.map((m) => m[key as keyof typeof m] as number);
          const sparkPoints = buildSparkline(sparkValues);
          const traffic = getTrafficLight(current, config.target, 'lowerIsBetter' in config ? config.lowerIsBetter : false);

          return (
            <div
              key={key}
              className="rounded-xl bg-white border p-6"
              style={{ borderColor: '#E7E5E4' }}
            >
              {/* Header row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#78716C' }}>
                  {config.label}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: traffic.color,
                    background: traffic.color + '18',
                    borderRadius: '999px',
                    padding: '2px 8px',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: traffic.color,
                      display: 'inline-block',
                    }}
                  />
                  {traffic.label}
                </span>
              </div>

              {/* Current value */}
              <div className="text-3xl font-bold" style={{ color: '#1C1917', marginBottom: '4px' }}>
                {formatValue(current, config.unit)}
              </div>

              {/* Target */}
              <div style={{ fontSize: '13px', color: '#78716C', marginBottom: '12px' }}>
                Target: {formatValue(config.target, config.unit)}
                {'lowerIsBetter' in config && config.lowerIsBetter ? ' (lower is better)' : ''}
              </div>

              {/* Sparkline */}
              <svg
                width="100"
                height="30"
                style={{ display: 'block' }}
                aria-hidden="true"
              >
                <polyline
                  points={sparkPoints}
                  fill="none"
                  stroke={traffic.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={{ fontSize: '11px', color: '#A8A29E', marginTop: '2px' }}>
                Last 6 months
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Trend Table */}
      <div style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1C1917' }}>
          Monthly Trend — All Metrics
        </h2>
      </div>
      <div
        className="rounded-xl bg-white border"
        style={{ borderColor: '#E7E5E4', overflowX: 'auto' }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
              {[
                'Month',
                'Units Sold',
                'Turn Rate',
                'Gross / Unit',
                'Days to Fund',
                'Recon Cycle',
                'Avg Days Lot',
                'F&I %',
                'Total Revenue',
              ].map((h) => (
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
            {MONTHLY_KPIS.map((row) => {
              const isCurrent = row.month === latestMonth.month;
              return (
                <tr
                  key={row.month}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    background: isCurrent ? '#F0FDF4' : 'transparent',
                  }}
                >
                  <td
                    style={{
                      padding: '11px 14px',
                      fontSize: '14px',
                      fontWeight: isCurrent ? 700 : 500,
                      color: '#1C1917',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {MONTH_LABELS[row.month] ?? row.month}
                    {isCurrent && (
                      <span
                        style={{
                          marginLeft: '6px',
                          fontSize: '11px',
                          background: '#16A34A',
                          color: '#FFFFFF',
                          borderRadius: '999px',
                          padding: '1px 6px',
                          fontWeight: 700,
                        }}
                      >
                        Current
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '14px', color: '#1C1917', fontWeight: 600 }}>
                    {row.unitsSold}
                  </td>
                  {/* Turn Rate — target 10 */}
                  <td
                    style={{
                      padding: '11px 14px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: row.turnRate >= 10 ? '#16A34A' : row.turnRate >= 9 ? '#D97706' : '#DC2626',
                    }}
                  >
                    {row.turnRate.toFixed(1)}x
                  </td>
                  {/* Gross/Unit — target 4000 */}
                  <td
                    style={{
                      padding: '11px 14px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: row.grossPerUnit >= 4000 ? '#16A34A' : row.grossPerUnit >= 3600 ? '#D97706' : '#DC2626',
                    }}
                  >
                    ${row.grossPerUnit.toLocaleString()}
                  </td>
                  {/* Days to Fund — target 5, lower better */}
                  <td
                    style={{
                      padding: '11px 14px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: row.avgDaysToFund <= 5 ? '#16A34A' : row.avgDaysToFund <= 5.5 ? '#D97706' : '#DC2626',
                    }}
                  >
                    {row.avgDaysToFund}d
                  </td>
                  {/* Recon Cycle — target 5, lower better */}
                  <td
                    style={{
                      padding: '11px 14px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: row.reconCycleTime <= 5 ? '#16A34A' : row.reconCycleTime <= 5.5 ? '#D97706' : '#DC2626',
                    }}
                  >
                    {row.reconCycleTime}d
                  </td>
                  {/* Avg Days on Lot — target 30, lower better */}
                  <td
                    style={{
                      padding: '11px 14px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: row.avgDaysOnLot <= 30 ? '#16A34A' : row.avgDaysOnLot <= 33 ? '#D97706' : '#DC2626',
                    }}
                  >
                    {row.avgDaysOnLot}d
                  </td>
                  {/* F&I Penetration — target 70 */}
                  <td
                    style={{
                      padding: '11px 14px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: row.fniPenetration >= 70 ? '#16A34A' : row.fniPenetration >= 63 ? '#D97706' : '#DC2626',
                    }}
                  >
                    {row.fniPenetration}%
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '14px', color: '#1C1917', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    ${row.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
