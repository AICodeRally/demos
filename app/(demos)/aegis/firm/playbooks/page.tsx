'use client';

import { StatCard, SparklineRow, BarChart, HeatMap } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

interface Playbook {
  name: string;
  activations: number;
  avgResolution: number; // days
  lastDeployed: string;
  trend: number[];
  rank: number; // 1=gold, 2=silver, 3=bronze, 0=none
}

const PLAYBOOKS: Playbook[] = [
  { name: 'Cyber Breach', activations: 14, avgResolution: 8.2, lastDeployed: '2026-02-18', trend: [1, 2, 1, 3, 2, 1, 2, 1, 2, 1, 1, 2], rank: 1 },
  { name: 'Product Recall', activations: 11, avgResolution: 14.5, lastDeployed: '2026-01-22', trend: [0, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1], rank: 2 },
  { name: 'Executive Scandal', activations: 9, avgResolution: 22.1, lastDeployed: '2026-02-04', trend: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1], rank: 3 },
  { name: 'Regulatory Investigation', activations: 7, avgResolution: 18.3, lastDeployed: '2025-12-15', trend: [0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1], rank: 0 },
  { name: 'Litigation Crisis', activations: 6, avgResolution: 28.7, lastDeployed: '2026-01-08', trend: [1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], rank: 0 },
  { name: 'Workplace Incident', activations: 5, avgResolution: 6.4, lastDeployed: '2026-02-28', trend: [0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1], rank: 0 },
  { name: 'Natural Disaster', activations: 3, avgResolution: 12.0, lastDeployed: '2025-10-02', trend: [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1], rank: 0 },
  { name: 'Supply Chain', activations: 2, avgResolution: 16.8, lastDeployed: '2025-11-19', trend: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], rank: 0 },
];

const RANK_BORDERS: Record<number, string> = {
  1: '#8B7355',
  2: '#A8A29E',
  3: '#EA580C',
};

const RANK_LABELS: Record<number, string> = {
  1: 'Most Deployed',
  2: '2nd Most',
  3: '3rd Most',
};

const RESOLUTION_DATA = PLAYBOOKS.slice()
  .sort((a, b) => a.avgResolution - b.avgResolution)
  .map((p) => ({
    label: p.name,
    value: Math.round(p.avgResolution * 10) / 10,
    color: p.avgResolution <= 10 ? '#059669' : p.avgResolution <= 20 ? '#F59E0B' : '#DC2626',
  }));

const CUSTOMIZATION_CLIENTS = ['Meridian', 'Apex', 'HealthCore', 'Terra'];
const CUSTOMIZATION_DATA = [
  [95, 82, 90, 60], // Cyber Breach
  [70, 88, 45, 80], // Product Recall
  [85, 72, 55, 30], // Executive Scandal
  [60, 92, 88, 75], // Regulatory Investigation
  [78, 65, 42, 50], // Litigation Crisis
  [40, 55, 90, 35], // Workplace Incident
  [25, 30, 70, 85], // Natural Disaster
  [30, 45, 35, 92], // Supply Chain
];

/* ── Page ─────────────────────────────────────────────────── */

export default function PlaybookLibrary() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Playbook Library</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>Pre-built crisis response frameworks</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Playbooks" value="8" color="#8B7355" sparkline={[5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 8]} />
        <StatCard label="Deployments YTD" value="23" trend="up" trendValue="+4" color="#8B7355" sparkline={[12, 14, 15, 16, 17, 18, 19, 20, 20, 21, 22, 23]} />
        <StatCard label="Avg Resolution" value="12.4d" trend="down" trendValue="-2.1d" color="#059669" sparkline={[18, 17, 16, 15, 15, 14, 14, 13, 13, 13, 12, 12]} />
        <StatCard label="Coverage" value="94%" trend="up" trendValue="+2%" color="#8B7355" sparkline={[86, 87, 88, 89, 90, 90, 91, 92, 92, 93, 93, 94]} />
      </div>

      {/* Playbook Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {PLAYBOOKS.map((p) => {
          const hasMedal = p.rank > 0;
          const medalBorder = RANK_BORDERS[p.rank];
          return (
            <div
              key={p.name}
              className="rounded-xl bg-white border p-5 relative"
              style={{
                borderColor: hasMedal ? medalBorder : '#E7E5E4',
                borderWidth: hasMedal ? 2 : 1,
              }}
            >
              {/* Medal Badge */}
              {hasMedal && (
                <span
                  className="absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: `${medalBorder}15`, color: medalBorder, border: `1px solid ${medalBorder}40` }}
                >
                  {RANK_LABELS[p.rank]}
                </span>
              )}

              <h3 className="font-semibold text-sm mb-3" style={{ color: '#1C1917' }}>{p.name}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: '#A8A29E' }}>Activations</p>
                  <p className="text-sm font-bold" style={{ color: '#1C1917' }}>{p.activations}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: '#A8A29E' }}>Avg Resolution</p>
                  <p className="text-sm font-bold" style={{ color: '#1C1917' }}>{p.avgResolution}d</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: '#A8A29E' }}>Last Deployed</p>
                  <p className="text-sm font-bold" style={{ color: '#1C1917' }}>
                    {new Date(p.lastDeployed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #F5F5F4' }}>
                <span className="text-[10px]" style={{ color: '#A8A29E' }}>12-mo deployment trend</span>
                <SparklineRow data={p.trend} color={hasMedal ? medalBorder! : '#8B7355'} width={90} height={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Resolution Time Bar Chart */}
      <div className="rounded-xl bg-white border p-6 mb-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Average Time-to-Resolution (days)</h2>
        <BarChart data={RESOLUTION_DATA} unit="d" />
      </div>

      {/* Customization HeatMap */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-2" style={{ color: '#1C1917' }}>Client Customization Coverage</h2>
        <p className="text-xs mb-4" style={{ color: '#A8A29E' }}>Percentage of playbook customized per client (0-100)</p>
        <HeatMap
          rows={PLAYBOOKS.map((p) => p.name)}
          cols={CUSTOMIZATION_CLIENTS}
          data={CUSTOMIZATION_DATA}
          colorScale={{ low: '#DC2626', mid: '#F59E0B', high: '#059669' }}
        />
      </div>
    </>
  );
}
