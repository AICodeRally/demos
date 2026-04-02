'use client';

import { useState } from 'react';
import { CUSTOMERS, TIER_COLORS, type CreditTier } from '@/data/lotos';

const FUNNEL_STAGES = [
  { label: 'New Lead', count: 10, color: '#1E3A5F', widthPct: 100 },
  { label: 'Contacted', count: 8, color: '#2563EB', widthPct: 80 },
  { label: 'Test Drive', count: 6, color: '#7C3AED', widthPct: 60 },
  { label: 'Negotiation', count: 4, color: '#E85D2C', widthPct: 40 },
  { label: 'Sold', count: 3, color: '#16A34A', widthPct: 30 },
];

const STAGE_CUSTOMER_MAP: Record<string, number[]> = {
  'New Lead': [0, 1, 2],
  'Contacted': [3, 4],
  'Test Drive': [5, 6],
  'Negotiation': [7, 8],
  'Sold': [9],
};

const LEAD_SOURCES = [
  { source: 'Website', leads: 18, closed: 4, convRate: '22%', avgGross: 2840 },
  { source: 'Walk-in', leads: 12, closed: 3, convRate: '25%', avgGross: 3120 },
  { source: 'Phone', leads: 9, closed: 2, convRate: '22%', avgGross: 2650 },
  { source: 'Referral', leads: 7, closed: 3, convRate: '43%', avgGross: 3580 },
  { source: 'Facebook', leads: 14, closed: 2, convRate: '14%', avgGross: 2200 },
  { source: 'CarGurus', leads: 11, closed: 2, convRate: '18%', avgGross: 2990 },
];

const SPARKLINE_DATA: Record<string, number[]> = {
  Website: [12, 14, 11, 16, 15, 18],
  'Walk-in': [8, 10, 9, 11, 10, 12],
  Phone: [6, 7, 8, 7, 9, 9],
  Referral: [3, 4, 5, 5, 6, 7],
  Facebook: [10, 12, 11, 14, 13, 14],
  CarGurus: [7, 8, 9, 10, 10, 11],
};

function MiniSparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 60;
  const h = 20;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="inline-block align-middle">
      <polyline
        points={points}
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PipelinePage() {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  const totalLeads = FUNNEL_STAGES[0].count;
  const totalSold = FUNNEL_STAGES[FUNNEL_STAGES.length - 1].count;
  const conversionRate = Math.round((totalSold / totalLeads) * 100);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Lead Pipeline
        </h1>
        <p className="mt-1 text-base" style={{ color: '#57534E' }}>
          Funnel performance and lead source ROI — March 2026
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Total Leads (March)
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>
            71
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>across all sources</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Conversion Rate
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#16A34A' }}>
            {conversionRate}%
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>{totalSold} of {totalLeads} active leads</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Avg Days to Close
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#2563EB' }}>
            8.4
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>days from first contact</p>
        </div>
      </div>

      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-lg font-bold mb-5" style={{ color: '#1C1917' }}>
          Sales Funnel
        </h2>
        <div className="space-y-3">
          {FUNNEL_STAGES.map((stage, i) => {
            const nextCount = FUNNEL_STAGES[i + 1]?.count;
            const dropRate = nextCount ? Math.round(((stage.count - nextCount) / stage.count) * 100) : null;
            const isExpanded = expandedStage === stage.label;
            const stageCustomerIndices = STAGE_CUSTOMER_MAP[stage.label] || [];
            const stageCustomers = stageCustomerIndices
              .filter(idx => idx < CUSTOMERS.length)
              .map(idx => CUSTOMERS[idx]);

            return (
              <div key={stage.label}>
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedStage(isExpanded ? null : stage.label)}
                >
                  <div className="w-28 text-sm font-semibold text-right flex-shrink-0" style={{ color: '#1C1917' }}>
                    {stage.label}
                  </div>
                  <div className="flex-1 relative h-10 flex items-center">
                    <div
                      className="h-10 rounded-lg flex items-center px-4 transition-all hover:opacity-90"
                      style={{
                        width: `${stage.widthPct}%`,
                        backgroundColor: stage.color,
                      }}
                    >
                      <span className="text-white font-bold text-base">{stage.count}</span>
                    </div>
                  </div>
                  <div className="w-24 flex-shrink-0 text-right">
                    {dropRate !== null ? (
                      <span className="text-sm font-medium" style={{ color: '#DC2626' }}>
                        -{dropRate}% drop
                      </span>
                    ) : (
                      <span className="text-sm font-bold" style={{ color: '#16A34A' }}>
                        SOLD
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded && stageCustomers.length > 0 && (
                  <div className="ml-32 mt-2 mb-1 rounded-lg border p-3 space-y-2" style={{ backgroundColor: '#F8FAFC', borderColor: '#E7E5E4' }}>
                    {stageCustomers.map(c => (
                      <div key={c.id} className="flex items-center gap-3">
                        <span className="text-sm font-semibold" style={{ color: '#1C1917' }}>
                          {c.firstName} {c.lastName}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                          style={{ backgroundColor: TIER_COLORS[c.creditTier as CreditTier] }}
                        >
                          {c.creditTier}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E7E5E4' }}>
          <p className="text-sm" style={{ color: '#57534E' }}>
            Overall pipeline conversion: <strong style={{ color: '#1C1917' }}>{conversionRate}%</strong> — {totalSold} deals closed from {totalLeads} active leads this month.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #E7E5E4' }}>
          <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>
            Lead Source ROI
          </h2>
          <p className="text-sm mt-0.5" style={{ color: '#57534E' }}>
            Conversion rate and average gross profit by acquisition channel
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E7E5E4' }}>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Source
              </th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Leads
              </th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Closed
              </th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Conv. Rate
              </th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                6-Month Trend
              </th>
              <th className="text-right px-6 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Avg Gross / Deal
              </th>
            </tr>
          </thead>
          <tbody>
            {LEAD_SOURCES.map((row, i) => (
              <tr
                key={row.source}
                style={{ borderBottom: i < LEAD_SOURCES.length - 1 ? '1px solid #F5F5F4' : undefined }}
              >
                <td className="px-6 py-3 font-semibold" style={{ color: '#1C1917' }}>
                  {row.source}
                </td>
                <td className="px-4 py-3 text-right" style={{ color: '#57534E' }}>
                  {row.leads}
                </td>
                <td className="px-4 py-3 text-right font-semibold" style={{ color: '#1C1917' }}>
                  {row.closed}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className="font-bold"
                    style={{ color: parseFloat(row.convRate) >= 30 ? '#16A34A' : parseFloat(row.convRate) >= 20 ? '#2563EB' : '#D97706' }}
                  >
                    {row.convRate}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <MiniSparkline values={SPARKLINE_DATA[row.source]} />
                </td>
                <td className="px-6 py-3 text-right font-semibold" style={{ color: '#1C1917' }}>
                  ${row.avgGross.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
