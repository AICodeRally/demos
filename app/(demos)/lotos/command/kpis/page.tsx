'use client';

import { useState } from 'react';
import { MONTHLY_KPIS, KPI_TARGETS } from '@/data/lotos';

type KpiKey = keyof typeof KPI_TARGETS;

const BENCHMARKS: Record<KpiKey, number> = {
  turnRate: 9.0,
  grossPerUnit: 3800,
  avgDaysToFund: 5.5,
  reconCycleTime: 5.0,
  avgDaysOnLot: 30,
  fniPenetration: 55,
};

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

function buildSparklinePoints(values: number[], width: number, height: number): Array<{ x: number; y: number; value: number }> {
  if (values.length < 2) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values.map((v, i) => ({
    x: (i / (values.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 8) - 4,
    value: v,
  }));
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

const SHORT_MONTH_LABELS: Record<string, string> = {
  '2025-05': 'May',
  '2025-06': 'Jun',
  '2025-07': 'Jul',
  '2025-08': 'Aug',
  '2025-09': 'Sep',
  '2025-10': 'Oct',
  '2025-11': 'Nov',
  '2025-12': 'Dec',
  '2026-01': 'Jan',
  '2026-02': 'Feb',
  '2026-03': 'Mar',
  '2026-04': 'Apr',
};

export default function LotosKpiDashboardPage() {
  const [expandedKpi, setExpandedKpi] = useState<string | null>(null);
  const [showBenchmark, setShowBenchmark] = useState(false);

  const latestMonth = MONTHLY_KPIS[MONTHLY_KPIS.length - 1];
  const last6 = MONTHLY_KPIS.slice(-6);

  return (
    <div className="lot-page">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="lot-heading">
            KPI Dashboard
          </h1>
          <p className="lot-description">
            Dealership performance vs targets — current month and 12-month trend
          </p>
        </div>
        <button
          onClick={() => setShowBenchmark(!showBenchmark)}
          className={showBenchmark ? 'lot-btn lot-btn-active' : 'lot-btn'}
        >
          {showBenchmark ? 'Industry Avg: ON' : 'Show Industry Avg'}
        </button>
      </div>

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
          const isExpanded = expandedKpi === key;
          const traffic = getTrafficLight(current, config.target, 'lowerIsBetter' in config ? config.lowerIsBetter : false);
          const benchmarkValue = BENCHMARKS[key];

          if (isExpanded) {
            const expandedWidth = 500;
            const expandedHeight = 200;
            const pts = buildSparklinePoints(sparkValues, expandedWidth, expandedHeight);
            const polyPoints = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

            let benchmarkY: number | null = null;
            if (showBenchmark && sparkValues.length >= 2) {
              const min = Math.min(...sparkValues);
              const max = Math.max(...sparkValues);
              const range = max - min || 1;
              benchmarkY = expandedHeight - ((benchmarkValue - min) / range) * (expandedHeight - 8) - 4;
            }

            return (
              <div
                key={key}
                className="lot-card lot-animate-in"
                style={{ borderColor: '#2563EB', cursor: 'pointer', gridColumn: 'span 2' }}
                onClick={() => setExpandedKpi(null)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--lot-text)' }}>{config.label}</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: traffic.color,
                      background: traffic.color + '18',
                      borderRadius: '999px',
                      padding: '2px 10px',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: traffic.color, display: 'inline-block' }} />
                    {traffic.label}
                  </span>
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--lot-text)', marginBottom: '12px' }}>
                  {formatValue(current, config.unit)}
                </div>
                <svg
                  width={expandedWidth}
                  height={expandedHeight}
                  style={{ display: 'block', maxWidth: '100%' }}
                  aria-hidden="true"
                >
                  {showBenchmark && benchmarkY !== null && (
                    <line
                      x1="0"
                      y1={benchmarkY}
                      x2={expandedWidth}
                      y2={benchmarkY}
                      stroke="#78716C"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />
                  )}
                  <polyline
                    points={polyPoints}
                    fill="none"
                    stroke={traffic.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {pts.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="5" fill={traffic.color} />
                      <text
                        x={p.x}
                        y={p.y - 12}
                        textAnchor="middle"
                        fill="var(--lot-text)"
                        fontSize="12"
                        fontWeight="700"
                      >
                        {formatValue(p.value, config.unit)}
                      </text>
                      <text
                        x={p.x}
                        y={expandedHeight - 2}
                        textAnchor="middle"
                        fill="var(--lot-text-muted)"
                        fontSize="11"
                      >
                        {SHORT_MONTH_LABELS[last6[i]?.month] ?? ''}
                      </text>
                    </g>
                  ))}
                  {showBenchmark && benchmarkY !== null && (
                    <text x={expandedWidth - 4} y={benchmarkY - 6} textAnchor="end" fill="var(--lot-text-muted)" fontSize="11" fontWeight="600">
                      Ind. Avg: {formatValue(benchmarkValue, config.unit)}
                    </text>
                  )}
                </svg>
                <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginTop: '6px' }}>
                  Click to collapse
                </div>
              </div>
            );
          }

          const smallPoints = buildSparkline(sparkValues);

          let benchmarkY: number | null = null;
          if (showBenchmark && sparkValues.length >= 2) {
            const min = Math.min(...sparkValues);
            const max = Math.max(...sparkValues);
            const range = max - min || 1;
            benchmarkY = 30 - ((benchmarkValue - min) / range) * (30 - 4) - 2;
          }

          return (
            <div
              key={key}
              className="lot-card lot-animate-in"
              style={{ cursor: 'pointer' }}
              onClick={() => setExpandedKpi(key)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--lot-text-muted)' }}>{config.label}</span>
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
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: traffic.color, display: 'inline-block' }} />
                  {traffic.label}
                </span>
              </div>
              <div className="text-3xl font-bold" style={{ color: 'var(--lot-text)', marginBottom: '4px' }}>
                {formatValue(current, config.unit)}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginBottom: '12px' }}>
                Target: {formatValue(config.target, config.unit)}
                {'lowerIsBetter' in config && config.lowerIsBetter ? ' (lower is better)' : ''}
              </div>
              <svg width="100" height="30" style={{ display: 'block' }} aria-hidden="true">
                {showBenchmark && benchmarkY !== null && (
                  <line
                    x1="0"
                    y1={benchmarkY}
                    x2="100"
                    y2={benchmarkY}
                    stroke="#78716C"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                  />
                )}
                <polyline
                  points={smallPoints}
                  fill="none"
                  stroke={traffic.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginTop: '2px' }}>
                Last 6 months · click to expand
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <h2 className="lot-subheading">
          Monthly Trend — All Metrics
        </h2>
      </div>
      <div
        className="lot-card"
        style={{ overflowX: 'auto', padding: 0 }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--lot-border-faint)' }}>
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
                    color: 'var(--lot-text-muted)',
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
                    borderBottom: '1px solid var(--lot-border-faint)',
                    background: isCurrent ? '#F0FDF4' : 'transparent',
                  }}
                >
                  <td
                    style={{
                      padding: '11px 14px',
                      fontSize: '14px',
                      fontWeight: isCurrent ? 700 : 500,
                      color: 'var(--lot-text)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {MONTH_LABELS[row.month] ?? row.month}
                    {isCurrent && (
                      <span
                        style={{
                          marginLeft: '6px',
                          fontSize: '14px',
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
                  <td style={{ padding: '11px 14px', fontSize: '14px', color: 'var(--lot-text)', fontWeight: 600 }}>
                    {row.unitsSold}
                  </td>
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
                  <td style={{ padding: '11px 14px', fontSize: '14px', color: 'var(--lot-text)', fontWeight: 600, whiteSpace: 'nowrap' }}>
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
