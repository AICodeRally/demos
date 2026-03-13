'use client';

import { StatCard, SparklineRow, DonutChart, BarChart } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

type Tier = 'Platinum' | 'Gold' | 'Silver';
type Pulse = 'green' | 'amber' | 'red';

interface Client {
  name: string;
  industry: string;
  tier: Tier;
  readiness: number;
  pulse: Pulse;
  riskTrend: number[];
  retainerValue: number;
}

const TIER_COLORS: Record<Tier, string> = {
  Platinum: '#8B7355',
  Gold: '#EAB308',
  Silver: '#A8A29E',
};

const PULSE_COLORS: Record<Pulse, string> = {
  green: '#059669',
  amber: '#F59E0B',
  red: '#DC2626',
};

const CLIENTS: Client[] = [
  { name: 'Meridian Dynamics', industry: 'Technology', tier: 'Platinum', readiness: 92, pulse: 'green', riskTrend: [3, 4, 3, 2, 3, 2, 2, 1, 2, 2, 1, 1], retainerValue: 480 },
  { name: 'Apex Financial', industry: 'Financial', tier: 'Platinum', readiness: 88, pulse: 'green', riskTrend: [4, 5, 4, 3, 4, 3, 3, 2, 3, 2, 2, 2], retainerValue: 520 },
  { name: 'HealthCore Systems', industry: 'Healthcare', tier: 'Platinum', readiness: 85, pulse: 'amber', riskTrend: [2, 3, 4, 5, 6, 5, 4, 5, 6, 5, 4, 5], retainerValue: 410 },
  { name: 'TerraEnergy Corp', industry: 'Energy', tier: 'Gold', readiness: 74, pulse: 'amber', riskTrend: [3, 3, 4, 5, 5, 6, 5, 6, 7, 6, 5, 6], retainerValue: 340 },
  { name: 'Nexus Retail Group', industry: 'Retail', tier: 'Gold', readiness: 71, pulse: 'green', riskTrend: [4, 3, 3, 2, 3, 2, 3, 2, 2, 2, 1, 2], retainerValue: 290 },
  { name: 'Pinnacle Pharma', industry: 'Healthcare', tier: 'Platinum', readiness: 90, pulse: 'green', riskTrend: [2, 2, 3, 2, 2, 1, 2, 1, 1, 2, 1, 1], retainerValue: 460 },
  { name: 'Cobalt Defense', industry: 'Technology', tier: 'Silver', readiness: 62, pulse: 'red', riskTrend: [3, 4, 5, 6, 7, 8, 7, 8, 9, 8, 7, 8], retainerValue: 180 },
  { name: 'Ironshore Capital', industry: 'Financial', tier: 'Gold', readiness: 78, pulse: 'green', riskTrend: [5, 4, 4, 3, 3, 4, 3, 3, 2, 3, 2, 2], retainerValue: 360 },
];

const INDUSTRY_DIST = [
  { label: 'Technology', value: 30, color: '#2563EB' },
  { label: 'Financial', value: 25, color: '#8B7355' },
  { label: 'Healthcare', value: 20, color: '#059669' },
  { label: 'Energy', value: 15, color: '#EA580C' },
  { label: 'Retail', value: 10, color: '#7C3AED' },
];

const INDUSTRY_BADGE_COLORS: Record<string, string> = {
  Technology: '#2563EB',
  Financial: '#8B7355',
  Healthcare: '#059669',
  Energy: '#EA580C',
  Retail: '#7C3AED',
};

const RETAINER_DATA = CLIENTS.slice()
  .sort((a, b) => b.retainerValue - a.retainerValue)
  .map((c) => ({ label: c.name, value: c.retainerValue }));

/* ── Readiness Circle ─────────────────────────────────────── */

function ReadinessCircle({ score }: { score: number }) {
  const r = 16;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#059669' : score >= 60 ? '#F59E0B' : '#DC2626';
  return (
    <svg width={40} height={40} viewBox="0 0 40 40">
      <circle cx={20} cy={20} r={r} fill="none" stroke="#F1F5F9" strokeWidth={3} />
      <circle cx={20} cy={20} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={`${circumference}`} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 20 20)" />
      <text x={20} y={21} textAnchor="middle" dominantBaseline="central"
        fill="#1C1917" fontSize={10} fontWeight={700}>{score}</text>
    </svg>
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function ClientPortfolio() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Client Portfolio</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>Active retainer clients with risk intelligence</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Clients" value="42" trend="up" trendValue="+3" color="#8B7355" sparkline={[32, 34, 35, 36, 37, 38, 39, 40, 40, 41, 41, 42]} />
        <StatCard label="Platinum Tier" value="8" trend="up" trendValue="+1" color="#8B7355" sparkline={[5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8]} />
        <StatCard label="Avg Readiness" value="78/100" trend="up" trendValue="+4" color="#059669" sparkline={[70, 71, 72, 73, 74, 74, 75, 76, 76, 77, 77, 78]} />
        <StatCard label="At-Risk" value="3" trend="up" trendValue="+1" color="#DC2626" sparkline={[1, 1, 2, 2, 1, 2, 2, 2, 3, 2, 3, 3]} />
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {CLIENTS.map((c) => (
          <div key={c.name} className="rounded-xl bg-white border p-5 flex flex-col gap-3" style={{ borderColor: '#E7E5E4' }}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-sm" style={{ color: '#1C1917' }}>{c.name}</h3>
                <span className="inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ backgroundColor: `${INDUSTRY_BADGE_COLORS[c.industry]}15`, color: INDUSTRY_BADGE_COLORS[c.industry] }}>
                  {c.industry}
                </span>
              </div>
              <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${TIER_COLORS[c.tier]}18`, color: TIER_COLORS[c.tier], border: `1px solid ${TIER_COLORS[c.tier]}40` }}>
                {c.tier}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ReadinessCircle score={c.readiness} />
                <div>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: '#A8A29E' }}>Readiness</p>
                  <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>{c.readiness}/100</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SparklineRow data={c.riskTrend} color={PULSE_COLORS[c.pulse]} width={70} height={22} />
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: PULSE_COLORS[c.pulse] }} />
                  <span className="text-[10px] capitalize" style={{ color: '#57534E' }}>{c.pulse}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #F5F5F4' }}>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: '#A8A29E' }}>Retainer</span>
              <span className="text-sm font-bold" style={{ color: '#8B7355' }}>${c.retainerValue}K/yr</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Two-Column */}
      <div className="grid grid-cols-2 gap-6">
        {/* Industry Distribution */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Industry Distribution</h2>
          <div className="flex justify-center">
            <DonutChart segments={INDUSTRY_DIST} centerValue="42" centerLabel="Clients" size={190} />
          </div>
        </div>

        {/* Retainer Value */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Retainer Value by Client</h2>
          <BarChart data={RETAINER_DATA} unit="K" color="#8B7355" />
        </div>
      </div>
    </>
  );
}
