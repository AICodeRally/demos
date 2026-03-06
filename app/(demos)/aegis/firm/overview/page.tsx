'use client';

import { StatCard, RadarChart, DonutChart, SparklineRow } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const CAPABILITIES = [
  { label: 'Legal Advisory', value: 92 },
  { label: 'Cyber IR', value: 88 },
  { label: 'Media/Comms', value: 85 },
  { label: 'Regulatory', value: 90 },
  { label: 'Investigations', value: 87 },
  { label: 'Biz Continuity', value: 82 },
];

const TEAM_SEGMENTS = [
  { label: 'Available', value: 14, color: '#059669' },
  { label: 'Engaged', value: 16, color: '#8B7355' },
  { label: 'On Leave', value: 4, color: '#A8A29E' },
];

type Outcome = 'Resolved' | 'Ongoing' | 'Settled';

interface Engagement {
  client: string;
  type: string;
  outcome: Outcome;
  duration: string;
  sparkline: number[];
}

const ENGAGEMENTS: Engagement[] = [
  { client: 'Client Alpha', type: 'Cyber Breach', outcome: 'Resolved', duration: '14 days', sparkline: [8, 12, 18, 24, 22, 16, 10, 6, 4, 3, 2, 2] },
  { client: 'Client Beta', type: 'Product Recall', outcome: 'Resolved', duration: '21 days', sparkline: [5, 8, 14, 20, 28, 24, 18, 12, 8, 5, 3, 2] },
  { client: 'Client Gamma', type: 'Regulatory Inquiry', outcome: 'Ongoing', duration: '32 days', sparkline: [3, 5, 7, 6, 8, 10, 12, 14, 16, 14, 12, 11] },
  { client: 'Client Delta', type: 'Executive Scandal', outcome: 'Settled', duration: '45 days', sparkline: [2, 6, 14, 22, 30, 28, 24, 18, 12, 8, 6, 4] },
  { client: 'Client Epsilon', type: 'Data Leak', outcome: 'Resolved', duration: '9 days', sparkline: [10, 16, 22, 18, 12, 8, 5, 3, 2, 2, 1, 1] },
];

const OUTCOME_COLORS: Record<Outcome, { bg: string; text: string }> = {
  Resolved: { bg: '#ECFDF5', text: '#059669' },
  Ongoing: { bg: '#FFF7ED', text: '#EA580C' },
  Settled: { bg: '#F5F3FF', text: '#7C3AED' },
};

/* ── Page ─────────────────────────────────────────────────── */

export default function PracticeOverview() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Practice Overview</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>Ironclad Crisis Group &mdash; capabilities at a glance</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Incidents Managed" value="247" trend="up" trendValue="+12%" color="#8B7355" sparkline={[18, 22, 19, 24, 28, 26, 30, 27, 32, 29, 34, 36]} />
        <StatCard label="Privilege Preserved" value="98.6%" trend="up" trendValue="+0.3%" color="#7C3AED" sparkline={[96, 97, 97, 98, 97, 98, 98, 99, 98, 99, 99, 99]} />
        <StatCard label="Avg Response Time" value="2.1hr" trend="down" trendValue="-18min" color="#059669" sparkline={[4, 3.8, 3.5, 3.2, 3, 2.8, 2.6, 2.5, 2.4, 2.3, 2.2, 2.1]} />
        <StatCard label="Client Retention" value="94%" trend="up" trendValue="+2%" color="#8B7355" sparkline={[88, 89, 90, 90, 91, 91, 92, 92, 93, 93, 94, 94]} />
      </div>

      {/* Two-column: Radar + Donut */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Capabilities Radar */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Core Capabilities</h2>
          <div className="flex justify-center">
            <RadarChart axes={CAPABILITIES} color="#8B7355" size={300} />
          </div>
        </div>

        {/* Team Capacity Donut */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Team Capacity</h2>
          <div className="flex justify-center">
            <DonutChart segments={TEAM_SEGMENTS} centerValue="34" centerLabel="Professionals" size={200} />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {TEAM_SEGMENTS.map((s) => (
              <div key={s.label} className="rounded-lg p-3 text-center" style={{ backgroundColor: '#F5F5F4' }}>
                <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11px]" style={{ color: '#57534E' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Engagements Table */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Recent Engagements</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #E7E5E4' }}>
                <th className="text-left pb-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#A8A29E' }}>Client</th>
                <th className="text-left pb-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#A8A29E' }}>Type</th>
                <th className="text-left pb-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#A8A29E' }}>Outcome</th>
                <th className="text-left pb-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#A8A29E' }}>Duration</th>
                <th className="text-right pb-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#A8A29E' }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {ENGAGEMENTS.map((e, i) => {
                const oc = OUTCOME_COLORS[e.outcome];
                return (
                  <tr key={i} style={{ borderBottom: i < ENGAGEMENTS.length - 1 ? '1px solid #F5F5F4' : 'none' }}>
                    <td className="py-3 font-medium" style={{ color: '#1C1917' }}>{e.client}</td>
                    <td className="py-3" style={{ color: '#57534E' }}>{e.type}</td>
                    <td className="py-3">
                      <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: oc.bg, color: oc.text }}>{e.outcome}</span>
                    </td>
                    <td className="py-3" style={{ color: '#57534E' }}>{e.duration}</td>
                    <td className="py-3 text-right">
                      <div className="inline-block">
                        <SparklineRow data={e.sparkline} color="#8B7355" width={80} height={24} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Practice Highlights */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#A8A29E' }}>Fastest Resolution</p>
          <p className="text-lg font-bold" style={{ color: '#1C1917' }}>4.2 hours</p>
          <p className="text-xs mt-1" style={{ color: '#57534E' }}>Data Exfiltration — Client Epsilon</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#A8A29E' }}>Largest Engagement</p>
          <p className="text-lg font-bold" style={{ color: '#1C1917' }}>$2.4M</p>
          <p className="text-xs mt-1" style={{ color: '#57534E' }}>Multi-jurisdiction regulatory defense</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#A8A29E' }}>Privileged Documents</p>
          <p className="text-lg font-bold" style={{ color: '#1C1917' }}>12,847</p>
          <p className="text-xs mt-1" style={{ color: '#57534E' }}>Maintained across all active matters</p>
        </div>
      </div>
    </>
  );
}
