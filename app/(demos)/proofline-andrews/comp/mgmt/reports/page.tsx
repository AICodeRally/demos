'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard, Sparkline, ProofDonutChart, LightBarChart } from '@/components/demos/proofline';
import { SELLERS } from '@/data/proofline';

const ACCENT = '#0EA5E9';

const HOMETOWNS_LIST = [
  { id: 'dal', name: 'Dallas HQ', manager: 'Sarah Chen', quota: 3200000, revenue: 3354000, headcount: 8, status: 'on-track' as const },
  { id: 'aln', name: 'Allen', manager: 'Lisa Park', quota: 2400000, revenue: 2462000, headcount: 6, status: 'on-track' as const },
  { id: 'ftw', name: 'Fort Worth', manager: 'Carlos Mendoza', quota: 2800000, revenue: 2584000, headcount: 8, status: 'watch' as const },
  { id: 'enn', name: 'Ennis', manager: 'Tommy Nguyen', quota: 1800000, revenue: 1784000, headcount: 4, status: 'watch' as const },
  { id: 'cc', name: 'Corpus Christi', manager: 'Maria Santos', quota: 2100000, revenue: 2064000, headcount: 6, status: 'behind' as const },
  { id: 'lar', name: 'Laredo', manager: 'Roberto Garza', quota: 1600000, revenue: 1284000, headcount: 4, status: 'behind' as const },
];

const CLUB_TIERS = [
  { tier: 'Gold', label: 'Gold Club', threshold: 1.20, color: '#C6A052' },
  { tier: 'Silver', label: 'Silver Club', threshold: 1.10, color: '#94A3B8' },
  { tier: 'Bronze', label: 'Bronze Club', threshold: 1.05, color: '#92400E' },
];

const COACHING_RECS: Record<string, string[]> = {
  dal: [
    'Nathan Chowdhury (DAL-08) display compliance at 71% — schedule ride-along and photo verification training this week.',
    'Jackie Hernandez (DAL-07) missed 2 key accounts in February — 1:1 to explore root cause and route optimization.',
  ],
  aln: [
    'Jason Owens (ALN-04) at 96% — close to Tier 2 threshold, push craft placement in new Frisco accounts.',
    'Brandon Cooper (ALN-06) needs craft portfolio development — pair with Lauren Foster for mentoring.',
  ],
  ftw: [
    'Victor Okafor (FTW-08) at 88% — new hire needs route familiarization. GPS ride-along scheduled.',
    'Will Kim (FTW-07) inconsistent stop cadence — missing 2-3 accounts per day. Time management coaching priority.',
  ],
  enn: [
    'Kevin Mills (ENS-03) below target 3 weeks running — rural route optimization needed.',
    'Maria Flores (ENS-04) new to distribution — structured onboarding with daily check-ins.',
  ],
  cc: [
    'Vanessa Moreno (CRP-06) struggling with volume in rural coastal accounts — consider territory realignment.',
    'James Herrera (CRP-05) high travel time between stops — route efficiency improvement needed.',
  ],
  lar: [
    'Laredo integration on track — Fernando Reyes and Carlos Trevino above quota. Hugo Morales needs core brand development.',
    'Border market import mix is highest in company — leverage for Cinco de Mayo kicker positioning.',
  ],
};

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  'on-track': { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'ON TRACK' },
  watch: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'WATCH' },
  behind: { bg: 'rgba(248,113,113,0.1)', color: '#F87171', label: 'BEHIND' },
};

const LEADERBOARD = [...SELLERS]
  .map(s => ({
    ...s,
    ytdAttainment: s.attainment * 0.85 + (Math.sin(s.id.charCodeAt(0) * 7) * 0.08),
    projectedAnnual: s.attainment * (1 + Math.sin(s.id.charCodeAt(0)) * 0.05),
  }))
  .sort((a, b) => b.ytdAttainment - a.ytdAttainment)
  .map((s, i) => ({
    ...s,
    rank: i + 1,
    clubTier: s.ytdAttainment >= 1.20 ? 'Gold' : s.ytdAttainment >= 1.10 ? 'Silver' : s.ytdAttainment >= 1.05 ? 'Bronze' : null,
  }));

const PAYMENT_HISTORY = [
  { period: 'Jan 1\u201315', base: 4333, variable: 1680, commission: 3240, bonus: 0 },
  { period: 'Jan 16\u201331', base: 4333, variable: 1820, commission: 3440, bonus: 0 },
  { period: 'Feb 1\u201315', base: 4333, variable: 2040, commission: 3600, bonus: 500 },
  { period: 'Feb 16\u201328', base: 4333, variable: 2100, commission: 3720, bonus: 0 },
  { period: 'Mar 1\u201315', base: 4333, variable: 2210, commission: 3840, bonus: 0 },
  { period: 'Mar 16\u201331', base: 4333, variable: 2840, commission: 4280, bonus: 0 },
];

/* ---- Inline visual helper components ---- */

function MiniDonut({ segments, size = 80, strokeWidth = 10, label }: {
  segments: { value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = (size - strokeWidth) / 2;
  const c = Math.PI * 2 * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--pl-chart-bar-track)" strokeWidth={strokeWidth} />
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * c;
        const gap = c - dash;
        const rot = (offset / total) * 360 - 90;
        offset += seg.value;
        return (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={seg.color} strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rot} ${size / 2} ${size / 2})`}
            strokeLinecap="round" />
        );
      })}
      {label && (
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
          fill="var(--pl-text)" fontSize={size * 0.16} fontWeight={700}
          fontFamily="var(--pl-font)">{label}</text>
      )}
    </svg>
  );
}

function TrendArrow({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const isUp = value > 0;
  const color = isUp ? '#22C55E' : '#F87171';
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-bold font-mono" style={{ color }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill={color}>
        {isUp ? <path d="M5 1L9 6H1z" /> : <path d="M5 9L1 4H9z" />}
      </svg>
      {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
}

function ProgressRaceBar({ name, value, max, color, tier, rank }: {
  name: string; value: number; max: number; color: string; tier: string | null; rank: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const tierColors: Record<string, string> = { Gold: '#C6A052', Silver: '#94A3B8', Bronze: '#92400E' };
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="w-5 text-xs font-bold font-mono text-center flex-shrink-0" style={{ color: ACCENT }}>{rank}</div>
      <div className="w-28 text-xs font-bold font-mono truncate flex-shrink-0" style={{ color: 'var(--pl-text)' }}>{name}</div>
      <div className="flex-1 relative h-5 rounded-full overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
        <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}90, ${color})` }} />
        <div className="absolute top-0 h-full w-px" style={{ left: `${(1.05 / max) * 100}%`, background: '#92400E80' }} />
        <div className="absolute top-0 h-full w-px" style={{ left: `${(1.10 / max) * 100}%`, background: '#94A3B880' }} />
        <div className="absolute top-0 h-full w-px" style={{ left: `${(1.20 / max) * 100}%`, background: '#C6A05280' }} />
      </div>
      <div className="w-12 text-right text-xs font-bold font-mono flex-shrink-0"
        style={{ color: value >= 1.05 ? '#22C55E' : value >= 0.90 ? '#F59E0B' : '#F87171' }}>
        {(value * 100).toFixed(1)}%
      </div>
      <div className="w-14 flex-shrink-0">
        {tier ? (
          <span className="px-1.5 py-0.5 rounded text-xs font-bold font-mono"
            style={{ background: `${tierColors[tier] ?? '#555'}18`, color: tierColors[tier] ?? '#555' }}>{tier}</span>
        ) : (
          <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>&mdash;</span>
        )}
      </div>
    </div>
  );
}

function HeatCell({ value, thresholds }: { value: number; thresholds: [number, number] }) {
  const color = value >= thresholds[1] ? '#22C55E' : value >= thresholds[0] ? '#F59E0B' : '#F87171';
  const bg = value >= thresholds[1] ? 'rgba(34,197,94,0.12)' : value >= thresholds[0] ? 'rgba(245,158,11,0.12)' : 'rgba(248,113,113,0.12)';
  return (
    <div className="px-2 py-1 rounded text-center text-xs font-bold font-mono" style={{ background: bg, color }}>
      {(value * 100).toFixed(1)}%
    </div>
  );
}

/* ---- Main page ---- */

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'executive' | 'club' | 'rep' | 'manager' | 'district'>('executive');
  const [selectedRep, setSelectedRep] = useState(SELLERS[0].id);
  const [selectedHometown, setSelectedHometown] = useState(HOMETOWNS_LIST[0].id);
  const [expandedHometown, setExpandedHometown] = useState<string | null>(null);

  const tabs = [
    { key: 'executive', label: 'Executive' },
    { key: 'club', label: 'Presidents Club' },
    { key: 'rep', label: 'Sales Rep' },
    { key: 'manager', label: 'Sales Manager' },
    { key: 'district', label: 'District Manager' },
  ] as const;

  const rep = SELLERS.find(s => s.id === selectedRep) ?? SELLERS[0];
  const ht = HOMETOWNS_LIST.find(h => h.id === selectedHometown) ?? HOMETOWNS_LIST[0];
  const htReps = SELLERS.filter(s => s.hometown === selectedHometown);

  const totalRevenue = HOMETOWNS_LIST.reduce((s, h) => s + h.revenue, 0);
  const totalQuota = HOMETOWNS_LIST.reduce((s, h) => s + h.quota, 0);
  const overallAttainment = totalRevenue / totalQuota;
  const totalCompExpense = SELLERS.length * (52000 / 4 + 4200 + 2800);

  const onTrackCount = HOMETOWNS_LIST.filter(h => h.status === 'on-track').length;
  const watchCount = HOMETOWNS_LIST.filter(h => h.status === 'watch').length;
  const behindCount = HOMETOWNS_LIST.filter(h => h.status === 'behind').length;

  const revSparkline = [8.2, 8.6, 9.0, 9.3, 9.8, 10.4];
  const attSparkline = [91.2, 92.8, 93.5, 94.1, 95.0, overallAttainment * 100];
  const compSparkline = [220, 235, 248, 255, 268, totalCompExpense / 1000];

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Tab Bar */}
      <div className="flex gap-0 border-b mb-6 overflow-x-auto" style={{ borderColor: 'var(--pl-border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex-shrink-0 px-4 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-colors"
            style={{
              color: activeTab === t.key ? ACCENT : 'var(--pl-text-muted)',
              borderBottom: activeTab === t.key ? `2px solid ${ACCENT}` : '2px solid transparent',
              marginBottom: -1,
              background: 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ======== EXECUTIVE TAB ======== */}
      {activeTab === 'executive' && (
        <>
          {/* Visual Executive Summary Dashboard */}
          <LightSectionCard title="EXECUTIVE DASHBOARD">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-3">
                <MiniDonut size={120} strokeWidth={14}
                  segments={[
                    { value: totalRevenue, color: ACCENT },
                    { value: Math.max(totalQuota - totalRevenue, 0), color: 'transparent' },
                  ]}
                  label={`${(overallAttainment * 100).toFixed(0)}%`} />
                <div className="text-center">
                  <div className="text-xs font-bold font-mono uppercase" style={{ color: 'var(--pl-text-muted)' }}>Revenue vs Quota</div>
                  <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--pl-text)' }}>
                    ${(totalRevenue / 1e6).toFixed(2)}M / ${(totalQuota / 1e6).toFixed(2)}M
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <MiniDonut size={120} strokeWidth={14}
                  segments={[
                    { value: onTrackCount, color: '#22C55E' },
                    { value: watchCount, color: '#F59E0B' },
                    { value: behindCount, color: '#F87171' },
                  ]}
                  label={`${onTrackCount}/${HOMETOWNS_LIST.length}`} />
                <div className="text-center">
                  <div className="text-xs font-bold font-mono uppercase" style={{ color: 'var(--pl-text-muted)' }}>Hometown Health</div>
                  <div className="flex gap-3 mt-1 justify-center">
                    <span className="text-xs font-mono" style={{ color: '#22C55E' }}>{onTrackCount} On Track</span>
                    <span className="text-xs font-mono" style={{ color: '#F59E0B' }}>{watchCount} Watch</span>
                    <span className="text-xs font-mono" style={{ color: '#F87171' }}>{behindCount} Behind</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <MiniDonut size={120} strokeWidth={14}
                  segments={[
                    { value: 45, color: '#94A3B8' },
                    { value: 28, color: ACCENT },
                    { value: 19, color: '#2563EB' },
                    { value: 8, color: '#22C55E' },
                  ]}
                  label={`$${(totalCompExpense / 1000).toFixed(0)}K`} />
                <div className="text-center">
                  <div className="text-xs font-bold font-mono uppercase" style={{ color: 'var(--pl-text-muted)' }}>Comp Mix (QTD)</div>
                  <div className="flex gap-2 mt-1 justify-center flex-wrap">
                    {[
                      { label: 'Base', color: '#94A3B8' },
                      { label: 'Variable', color: ACCENT },
                      { label: 'Commission', color: '#2563EB' },
                      { label: 'Bonus', color: '#22C55E' },
                    ].map(item => (
                      <span key={item.label} className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                        <span className="inline-block w-2 h-2 rounded-full" style={{ background: item.color }} />
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </LightSectionCard>

          {/* KPI Cards with sparklines and deltas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <LightKpiCard label="Total Revenue" value={`$${(totalRevenue / 1e6).toFixed(2)}M`} accent={ACCENT} delta={3.2} sparkline={revSparkline} />
            <LightKpiCard label="Overall Attainment" value={`${(overallAttainment * 100).toFixed(1)}%`} accent={ACCENT} delta={1.8} sparkline={attSparkline} />
            <LightKpiCard label="Total Comp (QTD)" value={`$${(totalCompExpense / 1000).toFixed(0)}K`} accent={ACCENT} sparkline={compSparkline} />
            <LightKpiCard label="Comp-to-Revenue" value={`${((totalCompExpense / totalRevenue) * 100).toFixed(1)}%`} accent={ACCENT} delta={-0.3} sub="Target: <3.5%" />
            <LightKpiCard label="Headcount" value="36 reps" accent={ACCENT} sub="6 managers" />
          </div>

          {/* Hometown Performance with trend arrows */}
          <LightSectionCard title="HOMETOWN PERFORMANCE">
            <div className="grid gap-3">
              {HOMETOWNS_LIST.map(hometown => {
                const att = hometown.revenue / hometown.quota;
                const s = STATUS_STYLES[hometown.status];
                const barColor = att >= 1.0 ? '#22C55E' : att >= 0.90 ? '#F59E0B' : '#F87171';
                const prevAtt = att - (Math.sin(hometown.id.charCodeAt(0)) * 0.02 + 0.01);
                const delta = (att - prevAtt) * 100;
                return (
                  <div key={hometown.id} className="flex items-center gap-4 p-2 rounded-lg" style={{ background: 'var(--pl-card-alt)' }}>
                    <div className="w-28 flex-shrink-0">
                      <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{hometown.name}</div>
                      <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>{hometown.manager}</div>
                    </div>
                    <div className="flex-1 relative h-7 rounded-lg overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
                      <div className="absolute top-0 left-0 h-full rounded-lg transition-all duration-700"
                        style={{ width: `${Math.min(att * 100, 100)}%`, background: `linear-gradient(90deg, ${barColor}60, ${barColor})` }} />
                      <div className="absolute inset-0 flex items-center px-3 justify-between">
                        <span className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{(att * 100).toFixed(1)}%</span>
                        <span className="text-xs font-mono" style={{ color: 'var(--pl-text)' }}>${(hometown.revenue / 1e6).toFixed(2)}M</span>
                      </div>
                    </div>
                    <TrendArrow value={delta} />
                    <span className="flex-shrink-0 text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                      style={{ background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          {/* Top/Bottom performers with sparklines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LightSectionCard title="TOP 5 PERFORMERS">
              <div className="grid gap-2">
                {LEADERBOARD.slice(0, 5).map((seller, i) => {
                  const medalColors = ['#C6A052', '#94A3B8', '#92400E', ACCENT, ACCENT];
                  return (
                    <div key={seller.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--pl-card-alt)' }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0"
                        style={{ background: `${medalColors[i]}18`, color: medalColors[i], border: `1.5px solid ${medalColors[i]}40` }}>{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold font-mono truncate" style={{ color: 'var(--pl-text)' }}>{seller.name}</div>
                        <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>{seller.hometown} &middot; T{seller.tier}</div>
                      </div>
                      <Sparkline data={seller.weeklyAttainment} color="#22C55E" width={60} height={20} />
                      <div className="text-xs font-bold font-mono flex-shrink-0" style={{ color: '#22C55E' }}>{(seller.ytdAttainment * 100).toFixed(1)}%</div>
                    </div>
                  );
                })}
              </div>
            </LightSectionCard>
            <LightSectionCard title="BOTTOM 5 PERFORMERS">
              <div className="grid gap-2">
                {LEADERBOARD.slice(-5).reverse().map((seller, i) => (
                  <div key={seller.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--pl-card-alt)' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0"
                      style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171', border: '1.5px solid rgba(248,113,113,0.3)' }}>{LEADERBOARD.length - i}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold font-mono truncate" style={{ color: 'var(--pl-text)' }}>{seller.name}</div>
                      <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>{seller.hometown} &middot; T{seller.tier}</div>
                    </div>
                    <Sparkline data={seller.weeklyAttainment} color="#F87171" width={60} height={20} />
                    <div className="text-xs font-bold font-mono flex-shrink-0" style={{ color: '#F87171' }}>{(seller.ytdAttainment * 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </LightSectionCard>
          </div>

          {/* Comp expense breakdown with donut + bar chart */}
          <LightSectionCard title="COMP EXPENSE BREAKDOWN (QTD)">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <ProofDonutChart size={160} label={`$${(totalCompExpense / 1000).toFixed(0)}K`} labelColor="var(--pl-text)"
                  data={[
                    { name: 'Base Salary', value: 45, color: '#94A3B8' },
                    { name: 'Variable Pay', value: 28, color: ACCENT },
                    { name: 'Commission', value: 19, color: '#2563EB' },
                    { name: 'Bonus', value: 8, color: '#22C55E' },
                  ]} />
              </div>
              <div className="flex-1 w-full">
                <LightBarChart
                  data={[
                    { label: 'Base Salary', value: 36 * (52000 / 4), color: '#94A3B8' },
                    { label: 'Variable Pay', value: 36 * 4200, color: ACCENT },
                    { label: 'Commission', value: 36 * 3600, color: '#2563EB' },
                    { label: 'Bonus', value: 36 * 820, color: '#22C55E' },
                  ]}
                  formatValue={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
              </div>
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ======== PRESIDENTS CLUB TAB ======== */}
      {activeTab === 'club' && (
        <>
          {/* Club tier cards with mini donuts */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {CLUB_TIERS.map(tier => {
              const qualifiers = LEADERBOARD.filter(s => s.ytdAttainment >= tier.threshold).length;
              const projected = LEADERBOARD.filter(s => s.projectedAnnual >= tier.threshold).length;
              return (
                <div key={tier.tier} className="p-4 rounded-lg text-center relative overflow-hidden"
                  style={{ background: `${tier.color}08`, border: `1px solid ${tier.color}30` }}>
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-5" style={{ background: tier.color }} />
                  <div className="relative">
                    <div className="flex justify-center mb-3">
                      <MiniDonut size={64} strokeWidth={8}
                        segments={[
                          { value: qualifiers, color: tier.color },
                          { value: Math.max(SELLERS.length - qualifiers, 1), color: 'transparent' },
                        ]}
                        label={String(qualifiers)} />
                    </div>
                    <div className="text-xs font-bold font-mono uppercase mb-1" style={{ color: tier.color }}>{tier.label}</div>
                    <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>&ge;{(tier.threshold * 100).toFixed(0)}% YTD</div>
                    <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>Projected: {projected}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Days Remaining" value="296" accent={ACCENT} sub="in 2026 selling year" />
            <LightKpiCard label="Current Qualifiers" value={String(LEADERBOARD.filter(s => s.ytdAttainment >= 1.05).length)} accent={ACCENT} delta={2.0} sub="vs last month" />
            <LightKpiCard label="Projected Qualifiers" value={String(LEADERBOARD.filter(s => s.projectedAnnual >= 1.05).length)} accent={ACCENT} />
            <LightKpiCard label="Club Threshold" value="105% YTD" accent={ACCENT} />
          </div>

          {/* Visual Leaderboard Race */}
          <LightSectionCard title="PRESIDENTS CLUB LEADERBOARD RACE">
            <div className="mb-3 flex gap-4 text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#92400E' }} /> Bronze 105%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#94A3B8' }} /> Silver 110%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#C6A052' }} /> Gold 120%</span>
            </div>
            <div className="grid gap-0.5">
              {LEADERBOARD.slice(0, 20).map(seller => {
                const barColor = seller.ytdAttainment >= 1.20 ? '#C6A052'
                  : seller.ytdAttainment >= 1.10 ? '#94A3B8'
                  : seller.ytdAttainment >= 1.05 ? '#22C55E'
                  : seller.ytdAttainment >= 0.90 ? '#F59E0B' : '#F87171';
                return (
                  <ProgressRaceBar key={seller.id}
                    name={seller.name.split(' ')[0] + ' ' + seller.name.split(' ').slice(1).map(n => n[0]).join('')}
                    value={seller.ytdAttainment} max={1.30} color={barColor} tier={seller.clubTier} rank={seller.rank} />
                );
              })}
            </div>
            {LEADERBOARD.length > 20 && (
              <div className="text-xs font-mono mt-2 text-center" style={{ color: 'var(--pl-text-faint)' }}>+ {LEADERBOARD.length - 20} more reps below</div>
            )}
          </LightSectionCard>

          {/* Historical with visual bars */}
          <LightSectionCard title="HISTORICAL CONTEXT \u2014 2025 vs 2026 YTD">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex justify-center gap-4 items-end mb-2">
                  <div className="text-center">
                    <div className="w-10 rounded-t mx-auto" style={{ height: 44, background: '#94A3B860' }} />
                    <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>2025</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 rounded-t mx-auto" style={{ height: 56, background: ACCENT }} />
                    <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>2026</div>
                  </div>
                </div>
                <div className="text-lg font-bold font-mono" style={{ color: ACCENT }}>{LEADERBOARD.filter(s => s.ytdAttainment >= 1.05).length}</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>Current Qualifiers (vs 11 in 2025)</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center gap-4 items-end mb-2">
                  <div className="text-center">
                    <div className="w-10 rounded-t mx-auto" style={{ height: 43, background: '#94A3B860' }} />
                    <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>2025</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 rounded-t mx-auto" style={{ height: 48, background: ACCENT }} />
                    <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>2026</div>
                  </div>
                </div>
                <div className="text-lg font-bold font-mono" style={{ color: ACCENT }}>108.4%</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>2025 Avg Attainment (qualifiers)</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <svg width="80" height="56" viewBox="0 0 80 56">
                    <path d="M5 50 L20 42 L35 38 L50 30 L65 22 L75 10" fill="none" stroke={ACCENT} strokeWidth="2" />
                    <circle cx="75" cy="10" r="3" fill={ACCENT} />
                    <path d="M5 48 L20 44 L35 42 L50 38 L65 34 L75 30" fill="none" stroke="#94A3B860" strokeWidth="2" strokeDasharray="4 2" />
                  </svg>
                </div>
                <div className="text-lg font-bold font-mono" style={{ color: ACCENT }}>Marcus Webb</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>2025 Top Earner &middot; 127.3% <TrendArrow value={4.2} /></div>
              </div>
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ======== SALES REP TAB ======== */}
      {activeTab === 'rep' && (
        <>
          <div className="mb-6">
            <label className="text-xs font-bold font-mono uppercase mb-2 block" style={{ color: 'var(--pl-text-muted)' }}>Select Rep</label>
            <select value={selectedRep} onChange={e => setSelectedRep(e.target.value)}
              className="px-3 py-2 rounded text-xs font-mono"
              style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)', color: 'var(--pl-text)' }}>
              {SELLERS.map(s => (
                <option key={s.id} value={s.id}>{s.name} \u2014 {s.hometown}</option>
              ))}
            </select>
          </div>

          {/* Earnings with color bars */}
          <LightSectionCard title={`EARNINGS SUMMARY \u2014 ${rep.name.toUpperCase()}`}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Base (QTD)', value: '$13,000', color: '#94A3B8', pct: 45 },
                { label: 'Variable', value: `$${(rep.attainment * 4200).toFixed(0)}`, color: ACCENT, pct: 28 },
                { label: 'Commission', value: `$${(rep.attainment * 3600).toFixed(0)}`, color: '#2563EB', pct: 19 },
                { label: 'Bonus', value: rep.spiritsAccounts >= 3 ? `$${rep.spiritsAccounts * 25}` : '$0', color: '#22C55E', pct: 8 },
                { label: 'Total QTD', value: `$${(13000 + rep.attainment * 4200 + rep.attainment * 3600 + (rep.spiritsAccounts >= 3 ? rep.spiritsAccounts * 25 : 0)).toFixed(0)}`, color: ACCENT, pct: 100 },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg relative overflow-hidden"
                  style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b" style={{ background: 'var(--pl-chart-bar-track)' }}>
                    <div className="h-full rounded-b" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                  <div className="text-xs font-bold font-mono uppercase mb-1" style={{ color: 'var(--pl-text-muted)' }}>{item.label}</div>
                  <div className="text-lg font-bold font-mono" style={{ color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          {/* 13-week trend */}
          <LightSectionCard title="13-WEEK ATTAINMENT TREND">
            <div className="h-32 flex items-end gap-1 px-1">
              {rep.weeklyAttainment.map((val, i) => {
                const pctH = Math.min(val * 100, 130);
                const color = val >= 1.0 ? '#22C55E' : val >= 0.85 ? '#F59E0B' : '#F87171';
                const isLast = i === rep.weeklyAttainment.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5 relative">
                    {isLast && (
                      <div className="text-xs font-bold font-mono mb-0.5 px-1 rounded"
                        style={{ background: `${color}20`, color }}>{(val * 100).toFixed(0)}%</div>
                    )}
                    <div className="w-full rounded-t transition-all"
                      style={{
                        height: `${pctH * 0.8}%`,
                        background: isLast ? color : `${color}50`,
                        minHeight: 4,
                        boxShadow: isLast ? `0 0 8px ${color}40` : 'none',
                      }} />
                    <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>W{i + 1}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs font-mono mt-1 px-1" style={{ color: 'var(--pl-text-faint)' }}>
              <span>Week 1</span>
              <span style={{ color: rep.attainment >= 1.0 ? '#22C55E' : '#F59E0B' }}>
                Current: {(rep.attainment * 100).toFixed(1)}% {rep.attainment >= 1.0 ? '\u2713' : '\u26A0'}
              </span>
              <span>Week 13</span>
            </div>
          </LightSectionCard>

          {/* Gate Status with donut gauges */}
          <LightSectionCard title="GATE STATUS">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Core', value: rep.bbiGates.core, threshold: 0.75, color: '#2563EB' },
                { name: 'Import', value: rep.bbiGates.import, threshold: 0.80, color: '#7C3AED' },
                { name: 'Emerging', value: rep.bbiGates.emerging, threshold: 0.70, color: '#F59E0B' },
                { name: 'Combined', value: rep.bbiGates.combined, threshold: 0.85, color: ACCENT },
              ].map(gate => {
                const unlocked = gate.value >= gate.threshold;
                const gateColor = unlocked ? '#22C55E' : gate.value >= gate.threshold * 0.9 ? '#F59E0B' : '#F87171';
                return (
                  <div key={gate.name} className="p-4 rounded-lg flex flex-col items-center"
                    style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                    <div className="mb-2">
                      <MiniDonut size={72} strokeWidth={8}
                        segments={[
                          { value: gate.value, color: gateColor },
                          { value: Math.max(1 - gate.value, 0.001), color: 'transparent' },
                        ]}
                        label={`${(gate.value * 100).toFixed(0)}%`} />
                    </div>
                    <div className="text-xs font-bold font-mono mb-1" style={{ color: 'var(--pl-text)' }}>{gate.name}</div>
                    <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                      style={{ background: unlocked ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)', color: unlocked ? '#22C55E' : '#F87171' }}>
                      {unlocked ? '\u2713 UNLOCKED' : '\u2717 LOCKED'}
                    </span>
                    <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>threshold: {(gate.threshold * 100).toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          {/* Payment History with stacked bars */}
          <LightSectionCard title="PAYMENT HISTORY \u2014 LAST 6 PAY PERIODS">
            <div className="grid gap-2 mb-4">
              {PAYMENT_HISTORY.map((row, i) => {
                const total = row.base + row.variable + row.commission + row.bonus;
                const maxTotal = 15500;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-20 text-xs font-bold font-mono flex-shrink-0" style={{ color: 'var(--pl-text)' }}>{row.period}</div>
                    <div className="flex-1 h-6 rounded-lg overflow-hidden flex" style={{ background: 'var(--pl-chart-bar-track)' }}>
                      <div style={{ width: `${(row.base / maxTotal) * 100}%`, background: '#94A3B880' }} className="h-full" />
                      <div style={{ width: `${(row.variable / maxTotal) * 100}%`, background: `${ACCENT}80` }} className="h-full" />
                      <div style={{ width: `${(row.commission / maxTotal) * 100}%`, background: '#2563EB80' }} className="h-full" />
                      {row.bonus > 0 && <div style={{ width: `${(row.bonus / maxTotal) * 100}%`, background: '#22C55E80' }} className="h-full" />}
                    </div>
                    <div className="w-14 text-right text-xs font-bold font-mono flex-shrink-0" style={{ color: ACCENT }}>${total.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 justify-center text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ background: '#94A3B8' }} /> Base</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ background: ACCENT }} /> Variable</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ background: '#2563EB' }} /> Commission</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ background: '#22C55E' }} /> Bonus</span>
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ======== SALES MANAGER TAB ======== */}
      {activeTab === 'manager' && (
        <>
          <div className="flex gap-2 flex-wrap mb-6">
            {HOMETOWNS_LIST.map(h => {
              const s = STATUS_STYLES[h.status];
              return (
                <button key={h.id} onClick={() => setSelectedHometown(h.id)}
                  className="px-3 py-1.5 rounded text-xs font-bold font-mono uppercase transition-colors flex items-center gap-1.5"
                  style={{
                    background: selectedHometown === h.id ? ACCENT : 'var(--pl-card-alt)',
                    color: selectedHometown === h.id ? 'white' : 'var(--pl-text-muted)',
                    border: `1px solid ${selectedHometown === h.id ? ACCENT : 'var(--pl-border)'}`,
                  }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedHometown === h.id ? 'white' : s.color }} />
                  {h.name}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Avg Attainment" value={`${(htReps.reduce((s, r) => s + r.attainment, 0) / (htReps.length || 1) * 100).toFixed(1)}%`} accent={ACCENT} delta={1.4} sparkline={htReps.slice(0, 6).map(r => r.attainment * 100)} />
            <LightKpiCard label="Total Comp Expense" value={`$${(htReps.length * 7020 / 1000).toFixed(0)}K`} accent={ACCENT} />
            <LightKpiCard label="At-Risk Reps" value={String(htReps.filter(r => r.atRisk).length)} accent={ACCENT} sub={htReps.filter(r => r.atRisk).length > 0 ? 'Needs attention' : 'All clear'} />
            <LightKpiCard label="Full Gate %" value={`${Math.round(htReps.filter(r => r.bbiGates.combined >= 0.85).length / (htReps.length || 1) * 100)}%`} accent={ACCENT} />
          </div>

          {/* Team visual cards */}
          <LightSectionCard title={`${ht.name.toUpperCase()} TEAM \u2014 MANAGER: ${ht.manager.toUpperCase()}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {htReps.map(r => {
                const gatesUnlocked = [r.bbiGates.core >= 0.75, r.bbiGates.import >= 0.80, r.bbiGates.emerging >= 0.70, r.bbiGates.combined >= 0.85].filter(Boolean).length;
                const statusColor = r.attainment >= 1.0 ? '#22C55E' : r.attainment >= 0.85 ? '#F59E0B' : '#F87171';
                const statusLabel = r.attainment >= 1.0 ? 'ON TARGET' : r.attainment >= 0.85 ? 'AT RISK' : 'BELOW';
                return (
                  <div key={r.id} className="p-3 rounded-lg" style={{ background: 'var(--pl-card-alt)', border: `1px solid ${statusColor}20` }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{r.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(14,165,233,0.1)', color: ACCENT }}>T{r.tier}</span>
                          <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: `${statusColor}18`, color: statusColor }}>{statusLabel}</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold font-mono" style={{ color: statusColor }}>{(r.attainment * 100).toFixed(1)}%</div>
                    </div>
                    <div className="rounded-full overflow-hidden mb-2" style={{ height: 6, background: 'var(--pl-chart-bar-track)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(r.attainment * 100, 100)}%`, background: `linear-gradient(90deg, ${statusColor}60, ${statusColor})` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {['C', 'I', 'E', 'X'].map((g, idx) => {
                          const vals = [r.bbiGates.core >= 0.75, r.bbiGates.import >= 0.80, r.bbiGates.emerging >= 0.70, r.bbiGates.combined >= 0.85];
                          return (
                            <span key={g} className="w-5 h-5 rounded text-xs font-bold font-mono flex items-center justify-center"
                              style={{ background: vals[idx] ? 'rgba(34,197,94,0.15)' : 'rgba(248,113,113,0.1)', color: vals[idx] ? '#22C55E' : '#F87171' }}>{g}</span>
                          );
                        })}
                        <span className="text-xs font-mono ml-1 self-center" style={{ color: 'var(--pl-text-faint)' }}>{gatesUnlocked}/4</span>
                      </div>
                      <Sparkline data={r.weeklyAttainment} color={statusColor} width={60} height={18} />
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          <LightSectionCard title="COACHING RECOMMENDATIONS">
            <div className="grid gap-3">
              {(COACHING_RECS[selectedHometown] ?? COACHING_RECS['dal']).map((rec, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg" style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${ACCENT}15` }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM7 4.5h2v4H7v-4zm0 5h2v2H7v-2z" fill={ACCENT} />
                    </svg>
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pl-text)' }}>{rec}</div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          {/* Comp Budget with visual gauge */}
          <LightSectionCard title="COMP BUDGET TRACKER">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <MiniDonut size={100} strokeWidth={12}
                  segments={[{ value: 71.6, color: ACCENT }, { value: 28.4, color: 'transparent' }]}
                  label="71.6%" />
              </div>
              <div className="flex-1 w-full">
                <div className="grid grid-cols-3 gap-4 text-center mb-3">
                  <div>
                    <div className="text-lg font-bold font-mono" style={{ color: 'var(--pl-text-muted)' }}>${(htReps.length * 9800).toLocaleString()}</div>
                    <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Budget (Q1)</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold font-mono" style={{ color: ACCENT }}>${(htReps.length * 7020).toLocaleString()}</div>
                    <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Spent</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold font-mono" style={{ color: '#22C55E' }}>${(htReps.length * 9800 - htReps.length * 7020).toLocaleString()}</div>
                    <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Remaining</div>
                  </div>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 10, background: 'var(--pl-chart-bar-track)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(7020 / 9800) * 100}%`, background: `linear-gradient(90deg, ${ACCENT}80, ${ACCENT})` }} />
                </div>
                <div className="text-xs font-mono mt-1 text-right" style={{ color: 'var(--pl-text-faint)' }}>
                  Projected EOQ: ${(htReps.length * 9800 * 1.02).toLocaleString()}
                </div>
              </div>
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ======== DISTRICT MANAGER TAB ======== */}
      {activeTab === 'district' && (
        <>
          {/* District Comparison ranked chart */}
          <LightSectionCard title="DISTRICT COMPARISON \u2014 ATTAINMENT">
            <div className="grid gap-2">
              {[...HOMETOWNS_LIST].sort((a, b) => (b.revenue / b.quota) - (a.revenue / a.quota)).map(hometown => {
                const att = hometown.revenue / hometown.quota;
                const barColor = att >= 1.0 ? '#22C55E' : att >= 0.90 ? '#F59E0B' : '#F87171';
                const s = STATUS_STYLES[hometown.status];
                return (
                  <div key={hometown.id} className="flex items-center gap-3">
                    <div className="w-24 text-xs font-bold font-mono flex-shrink-0" style={{ color: 'var(--pl-text)' }}>{hometown.name}</div>
                    <div className="flex-1 relative h-8 rounded-lg overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
                      <div className="absolute top-0 left-0 h-full rounded-lg transition-all duration-700"
                        style={{ width: `${Math.min(att * 100, 100)}%`, background: `linear-gradient(90deg, ${barColor}50, ${barColor})` }} />
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{(att * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <span className="flex-shrink-0 text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                      style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          {/* Revenue vs Quota visual */}
          <LightSectionCard title="REVENUE VS QUOTA BY DISTRICT">
            <div className="grid gap-3">
              {HOMETOWNS_LIST.map(hometown => {
                const att = hometown.revenue / hometown.quota;
                const barColor = att >= 1.0 ? '#22C55E' : att >= 0.90 ? '#F59E0B' : '#F87171';
                const maxVal = Math.max(...HOMETOWNS_LIST.map(h => Math.max(h.revenue, h.quota)));
                return (
                  <div key={hometown.id} className="p-3 rounded-lg" style={{ background: 'var(--pl-card-alt)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{hometown.name}</div>
                      <TrendArrow value={att >= 1.0 ? 2.3 : att >= 0.95 ? 0.8 : -1.5} />
                    </div>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-12 text-xs font-mono flex-shrink-0" style={{ color: 'var(--pl-text-faint)' }}>Revenue</div>
                        <div className="flex-1 h-4 rounded overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
                          <div className="h-full rounded" style={{ width: `${(hometown.revenue / maxVal) * 100}%`, background: barColor }} />
                        </div>
                        <div className="w-14 text-right text-xs font-bold font-mono" style={{ color: barColor }}>${(hometown.revenue / 1e6).toFixed(2)}M</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-12 text-xs font-mono flex-shrink-0" style={{ color: 'var(--pl-text-faint)' }}>Quota</div>
                        <div className="flex-1 h-4 rounded overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
                          <div className="h-full rounded" style={{ width: `${(hometown.quota / maxVal) * 100}%`, background: '#94A3B860' }} />
                        </div>
                        <div className="w-14 text-right text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>${(hometown.quota / 1e6).toFixed(2)}M</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          {/* District cards with expanded rep breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {HOMETOWNS_LIST.map(hometown => {
              const htRepsLocal = SELLERS.filter(s => s.hometown === hometown.id);
              const avgAtt = htRepsLocal.reduce((s, r) => s + r.attainment, 0) / (htRepsLocal.length || 1);
              const topRep = [...htRepsLocal].sort((a, b) => b.attainment - a.attainment)[0];
              const att = hometown.revenue / hometown.quota;
              const barColor = att >= 1.0 ? '#22C55E' : att >= 0.90 ? '#F59E0B' : '#F87171';
              const s = STATUS_STYLES[hometown.status];
              const isExpanded = expandedHometown === hometown.id;
              const atRiskCount = htRepsLocal.filter(r => r.atRisk).length;

              return (
                <div key={hometown.id} className="rounded-lg overflow-hidden"
                  style={{ border: `1px solid ${isExpanded ? ACCENT : 'var(--pl-border)'}` }}>
                  <button className="w-full p-4 text-left"
                    style={{ background: isExpanded ? `${ACCENT}08` : 'var(--pl-card-alt)' }}
                    onClick={() => setExpandedHometown(isExpanded ? null : hometown.id)}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{hometown.name}</div>
                        <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>Mgr: {hometown.manager}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                          <path d="M2 4L6 8L10 4" fill="none" stroke="var(--pl-text-faint)" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <MiniDonut size={48} strokeWidth={6}
                        segments={[{ value: att, color: barColor }, { value: Math.max(1 - att, 0.001), color: 'transparent' }]} />
                      <div>
                        <div className="text-lg font-bold font-mono" style={{ color: barColor }}>{(att * 100).toFixed(1)}%</div>
                        <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>${(hometown.revenue / 1e6).toFixed(2)}M / ${(hometown.quota / 1e6).toFixed(2)}M</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-1.5 rounded" style={{ background: 'var(--pl-card)' }}>
                        <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{hometown.headcount}</div>
                        <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Reps</div>
                      </div>
                      <div className="text-center p-1.5 rounded" style={{ background: 'var(--pl-card)' }}>
                        <div className="text-xs font-bold font-mono" style={{ color: atRiskCount > 0 ? '#F59E0B' : '#22C55E' }}>{atRiskCount}</div>
                        <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>At Risk</div>
                      </div>
                      <div className="text-center p-1.5 rounded" style={{ background: 'var(--pl-card)' }}>
                        <div className="text-xs font-bold font-mono" style={{ color: '#22C55E' }}>{topRep ? `${(topRep.attainment * 100).toFixed(0)}%` : '\u2014'}</div>
                        <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Top Rep</div>
                      </div>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2" style={{ borderTop: `1px solid ${ACCENT}20` }}>
                      <div className="text-xs font-bold font-mono uppercase mb-2" style={{ color: ACCENT }}>Rep Breakdown</div>
                      <div className="grid gap-1.5">
                        {[...htRepsLocal].sort((a, b) => b.attainment - a.attainment).map(r => {
                          const rColor = r.attainment >= 1.0 ? '#22C55E' : r.attainment >= 0.85 ? '#F59E0B' : '#F87171';
                          return (
                            <div key={r.id} className="flex items-center gap-2">
                              <div className="flex-1 text-xs font-mono" style={{ color: 'var(--pl-text)' }}>{r.name}</div>
                              <Sparkline data={r.weeklyAttainment} color={rColor} width={50} height={14} />
                              <div className="w-10 text-right text-xs font-bold font-mono" style={{ color: rColor }}>{(r.attainment * 100).toFixed(0)}%</div>
                              <div className="text-xs font-mono w-5" style={{ color: 'var(--pl-text-faint)' }}>T{r.tier}</div>
                              {r.atRisk && <span className="text-xs font-bold px-1 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171' }}>!</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Heatmap table */}
          <LightSectionCard title="DISTRICT PERFORMANCE HEATMAP">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Hometown', 'Mgr', 'HC', 'Attainment', 'Avg Rep Att.', 'Revenue', 'Status'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOMETOWNS_LIST.map(hometown => {
                    const htRepsLocal = SELLERS.filter(s => s.hometown === hometown.id);
                    const avgAtt = htRepsLocal.reduce((s, r) => s + r.attainment, 0) / (htRepsLocal.length || 1);
                    const att = hometown.revenue / hometown.quota;
                    const s = STATUS_STYLES[hometown.status];
                    return (
                      <tr key={hometown.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                        <td className="py-2 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{hometown.name}</td>
                        <td className="py-2 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{hometown.manager}</td>
                        <td className="py-2 pr-3 text-center" style={{ color: 'var(--pl-text)' }}>{hometown.headcount}</td>
                        <td className="py-2 pr-3"><HeatCell value={att} thresholds={[0.95, 1.0]} /></td>
                        <td className="py-2 pr-3"><HeatCell value={avgAtt} thresholds={[0.90, 0.98]} /></td>
                        <td className="py-2 pr-3 font-bold" style={{ color: ACCENT }}>${(hometown.revenue / 1e6).toFixed(2)}M</td>
                        <td className="py-2">
                          <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>
        </>
      )}
    </>
  );
}
