'use client';

import { StatCard, BubbleChart, AreaChart, HeatMap } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const INCIDENT_BUBBLES = [
  { x: 14, y: 92, size: 35, color: '#059669', label: 'Meridian (Resolving)' },
  { x: 3, y: 65, size: 20, color: '#DC2626', label: 'Apex (Active)' },
  { x: 7, y: 45, size: 15, color: '#EAB308', label: 'HealthCore (Active)' },
];

const PORTFOLIO_RISK = [
  { label: 'Apr', value: 72 },
  { label: 'May', value: 68 },
  { label: 'Jun', value: 71 },
  { label: 'Jul', value: 65 },
  { label: 'Aug', value: 62 },
  { label: 'Sep', value: 58 },
  { label: 'Oct', value: 64 },
  { label: 'Nov', value: 70 },
  { label: 'Dec', value: 75 },
  { label: 'Jan', value: 82 },
  { label: 'Feb', value: 74 },
  { label: 'Mar', value: 68 },
];

const ALERTS = [
  {
    title: '3 clients entering elevated risk zone Q2 2026',
    detail: 'Apex Financial, NovaPharma, TerraEnergy',
    color: '#EA580C',
  },
  {
    title: 'Fintech regulatory wave expected Q2 — SEC enforcement surge',
    detail: 'New cybersecurity disclosure rules take effect April 2026',
    color: '#DC2626',
  },
  {
    title: 'Healthcare ransomware trend +40% YoY — 2 clients in sector',
    detail: 'HealthCore and BioVance have elevated exposure',
    color: '#EA580C',
  },
];

const ROI_BUBBLES = [
  { x: 60, y: 85, size: 25, color: '#059669', label: 'Meridian' },
  { x: 40, y: 50, size: 20, color: '#059669', label: 'Apex' },
  { x: 80, y: 70, size: 15, color: '#EAB308', label: 'HealthCore' },
  { x: 30, y: 45, size: 18, color: '#059669', label: 'TerraEnergy' },
  { x: 50, y: 30, size: 10, color: '#EAB308', label: 'NovaPharma' },
];

const HEATMAP_ROWS = ['Technology', 'Financial Svc', 'Healthcare', 'Energy', 'Retail'];
const HEATMAP_COLS = ['Cyber', 'Regulatory', 'Media', 'Legal', 'Operational'];
const HEATMAP_DATA = [
  [90, 50, 40, 60, 30],  // Technology
  [60, 80, 30, 70, 40],  // Financial Services
  [70, 40, 50, 30, 60],  // Healthcare
  [40, 60, 20, 40, 50],  // Energy
  [30, 30, 60, 20, 70],  // Retail
];

/* ── Page ─────────────────────────────────────────────────── */

export default function CEODashboard() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>CEO Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Portfolio intelligence and predictive risk analysis
        </p>
      </div>

      {/* 5 StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Active Clients" value="42" color="#8B7355" />
        <StatCard label="Active Incidents" value="3" color="#DC2626" />
        <StatCard label="Resolved YTD" value="18" color="#059669" />
        <StatCard label="Avg Response" value="2.1hr" color="#059669" />
        <StatCard label="Risk Score" value="68/100" color="#EA580C" />
      </div>

      {/* Active Incidents Bubble */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Active Incidents</h2>
        <p className="text-[10px] mb-3" style={{ color: '#A8A29E' }}>Bubble size = financial exposure, Y-axis = severity</p>
        <BubbleChart data={INCIDENT_BUBBLES} xLabel="Days Active" yLabel="Severity" height={280} />
      </div>

      {/* 12-Month Portfolio Risk */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>12-Month Portfolio Risk</h2>
        <p className="text-[10px] mb-3" style={{ color: '#A8A29E' }}>Score spike in January correlates with Meridian breach discovery</p>
        <AreaChart data={PORTFOLIO_RISK} color="#8B7355" height={180} />
      </div>

      {/* Predictive Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {ALERTS.map((alert) => (
          <div
            key={alert.title}
            className="rounded-xl bg-white border border-l-4 p-4"
            style={{ borderColor: '#E7E5E4', borderLeftColor: alert.color }}
          >
            <h3 className="text-[12px] font-semibold mb-1.5" style={{ color: '#1C1917' }}>{alert.title}</h3>
            <p className="text-[10px]" style={{ color: '#57534E' }}>{alert.detail}</p>
          </div>
        ))}
      </div>

      {/* Retainer ROI Bubble */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Retainer ROI</h2>
        <p className="text-[10px] mb-3" style={{ color: '#A8A29E' }}>Bubble size = ROI multiple</p>
        <BubbleChart data={ROI_BUBBLES} xLabel="Annual Retainer ($K)" yLabel="Cost Avoided ($K)" height={280} />
      </div>

      {/* Industry x Risk HeatMap */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Industry x Risk Category</h2>
        <p className="text-[10px] mb-3" style={{ color: '#A8A29E' }}>Higher values indicate greater risk concentration</p>
        <HeatMap rows={HEATMAP_ROWS} cols={HEATMAP_COLS} data={HEATMAP_DATA} />
      </div>
    </>
  );
}
