'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import { SELLERS } from '@/data/proofline';

const ACCENT = '#0EA5E9';

const HOMETOWNS_LIST = [
  { id: 'sa', name: 'San Antonio', manager: 'Laura Mendez', quota: 2200000, revenue: 2354000, headcount: 6, status: 'on-track' },
  { id: 'austin', name: 'Austin', manager: 'Derek Walsh', quota: 1900000, revenue: 1862000, headcount: 6, status: 'watch' },
  { id: 'laredo', name: 'Laredo', manager: 'Carmen Torres', quota: 1600000, revenue: 1584000, headcount: 6, status: 'watch' },
  { id: 'victoria', name: 'Victoria', manager: 'Sam Patel', quota: 1400000, revenue: 1498000, headcount: 6, status: 'on-track' },
  { id: 'corpus', name: 'Corpus Christi', manager: 'Tanya Nguyen', quota: 1700000, revenue: 1564000, headcount: 6, status: 'behind' },
  { id: 'nb', name: 'New Braunfels', manager: 'Joe Castillo', quota: 1500000, revenue: 1545000, headcount: 6, status: 'on-track' },
];

const CLUB_TIERS = [
  { tier: 'Gold', label: 'Gold Club', threshold: 1.20, color: '#C6A052' },
  { tier: 'Silver', label: 'Silver Club', threshold: 1.10, color: '#94A3B8' },
  { tier: 'Bronze', label: 'Bronze Club', threshold: 1.05, color: '#92400E' },
];

const COACHING_RECS: Record<string, string[]> = {
  sa: [
    'Marcus is 4pp from T3 threshold \u2014 focus next 2 weeks on Corona display compliance in convenience accounts.',
    "SA Route 3 showing declining spirits penetration \u2014 push Tito's and High Noon bundle in on-premise chain accounts.",
  ],
  austin: [
    'Austin-2 rep at 87% \u2014 Modelo push in 3 remaining Whataburger accounts could close the gap.',
    'Import gate at 78% territory-wide \u2014 schedule joint sales call with Constellation rep for HEB chain accounts.',
  ],
  laredo: [
    'Territory is 1pp below gate threshold \u2014 4 accounts close to ordering Heineken. Coordinate with brand rep.',
    "Spirits adder opportunity: 6 on-premise independents not yet carrying Tito's.",
  ],
  victoria: [
    "Victoria-4 is top T1 rep \u2014 consider nominating for Presidents Club pace board.",
    'Combined gate at 94% \u2014 strong momentum, maintain Corona + spirits mix.',
  ],
  corpus: [
    'Territory 8pp below quota \u2014 identify 5 chain accounts for immediate outreach.',
    'Core gate at 71% \u2014 below threshold. Priority: Miller Lite and Coors Light in convenience channel.',
  ],
  nb: [
    'New Braunfels on track \u2014 maintain current mix and focus on Presidents Club positioning.',
    'Spirits adder opportunity in 4 tourist corridor accounts near River Walk.',
  ],
};

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  'on-track': { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'ON TRACK' },
  watch: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'WATCH' },
  behind: { bg: 'rgba(248,113,113,0.1)', color: '#F87171', label: 'BEHIND' },
};

// Build leaderboard from SELLERS
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

      {/* Executive Tab */}
      {activeTab === 'executive' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <LightKpiCard label="Total Revenue" value={`$${(totalRevenue / 1000000).toFixed(2)}M`} accent={ACCENT} />
            <LightKpiCard label="Overall Attainment" value={`${(overallAttainment * 100).toFixed(1)}%`} accent={ACCENT} />
            <LightKpiCard label="Total Comp Expense (QTD)" value={`$${(totalCompExpense / 1000).toFixed(0)}K`} accent={ACCENT} />
            <LightKpiCard label="Comp-to-Revenue Ratio" value={`${((totalCompExpense / totalRevenue) * 100).toFixed(1)}%`} accent={ACCENT} />
            <LightKpiCard label="Headcount" value="36 reps" accent={ACCENT} sub="6 managers" />
          </div>

          <LightSectionCard title="HOMETOWN PERFORMANCE">
            <div className="grid gap-3">
              {HOMETOWNS_LIST.map(hometown => {
                const att = hometown.revenue / hometown.quota;
                const s = STATUS_STYLES[hometown.status];
                const barColor = att >= 1.0 ? '#22C55E' : att >= 0.90 ? '#F59E0B' : '#F87171';
                return (
                  <div key={hometown.id} className="flex items-center gap-4">
                    <div className="w-28 text-[10px] font-bold font-mono flex-shrink-0" style={{ color: 'var(--pl-text)' }}>
                      {hometown.name}
                    </div>
                    <div className="flex-1 relative h-6 rounded overflow-hidden"
                      style={{ background: 'var(--pl-chart-bar-track)' }}>
                      <div className="absolute top-0 left-0 h-full rounded"
                        style={{ width: `${Math.min(att * 100, 100)}%`, background: `${barColor}80` }} />
                      <div className="absolute inset-0 flex items-center px-2 text-[10px] font-bold font-mono"
                        style={{ color: 'var(--pl-text)' }}>
                        {(att * 100).toFixed(1)}% &middot; ${(hometown.revenue / 1000000).toFixed(2)}M
                      </div>
                    </div>
                    <span className="flex-shrink-0 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                      style={{ background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LightSectionCard title="TOP 5 PERFORMERS">
              <div className="grid gap-2">
                {LEADERBOARD.slice(0, 5).map((seller, i) => (
                  <div key={seller.id} className="flex items-center gap-3">
                    <div className="text-sm font-bold font-mono w-5 text-center flex-shrink-0" style={{ color: ACCENT }}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{seller.name}</div>
                      <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{seller.hometown}</div>
                    </div>
                    <div className="text-xs font-bold font-mono" style={{ color: '#22C55E' }}>
                      {(seller.ytdAttainment * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </LightSectionCard>

            <LightSectionCard title="BOTTOM 5 PERFORMERS">
              <div className="grid gap-2">
                {LEADERBOARD.slice(-5).reverse().map((seller, i) => (
                  <div key={seller.id} className="flex items-center gap-3">
                    <div className="text-sm font-bold font-mono w-5 text-center flex-shrink-0" style={{ color: '#F87171' }}>
                      {LEADERBOARD.length - i}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{seller.name}</div>
                      <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{seller.hometown}</div>
                    </div>
                    <div className="text-xs font-bold font-mono" style={{ color: '#F87171' }}>
                      {(seller.ytdAttainment * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </LightSectionCard>
          </div>

          <LightSectionCard title="COMP EXPENSE BREAKDOWN (QTD)">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Base Salary', amount: 36 * (52000 / 4), color: '#94A3B8', pct: 45 },
                { label: 'Variable Pay', amount: 36 * 4200, color: ACCENT, pct: 28 },
                { label: 'Commission', amount: 36 * 3600, color: '#2563EB', pct: 19 },
                { label: 'Bonus', amount: 36 * 820, color: '#22C55E', pct: 8 },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg text-center"
                  style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="text-[10px] font-bold font-mono uppercase mb-1" style={{ color: item.color }}>
                    {item.label}
                  </div>
                  <div className="text-lg font-bold font-mono" style={{ color: item.color }}>
                    {item.pct}%
                  </div>
                  <div className="text-[10px] font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>
                    ${(item.amount / 1000).toFixed(0)}K
                  </div>
                  <div className="mt-2 rounded-full overflow-hidden" style={{ height: 4, background: 'var(--pl-chart-bar-track)' }}>
                    <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Presidents Club Tab */}
      {activeTab === 'club' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {CLUB_TIERS.map(tier => {
              const qualifiers = LEADERBOARD.filter(s => s.ytdAttainment >= tier.threshold).length;
              return (
                <div key={tier.tier} className="p-4 rounded-lg text-center"
                  style={{ background: `${tier.color}10`, border: `1px solid ${tier.color}30` }}>
                  <div className="text-xs font-bold font-mono uppercase mb-2" style={{ color: tier.color }}>
                    {tier.label}
                  </div>
                  <div className="text-2xl font-bold font-mono mb-1" style={{ color: tier.color }}>
                    {qualifiers}
                  </div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                    current qualifiers &middot; &ge;{(tier.threshold * 100).toFixed(0)}% YTD
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Days Remaining" value="296" accent={ACCENT} sub="in 2026 selling year" />
            <LightKpiCard label="Current Qualifiers" value={String(LEADERBOARD.filter(s => s.ytdAttainment >= 1.05).length)} accent={ACCENT} />
            <LightKpiCard label="Projected Qualifiers" value={String(LEADERBOARD.filter(s => s.projectedAnnual >= 1.05).length)} accent={ACCENT} />
            <LightKpiCard label="Club Threshold" value="105% YTD" accent={ACCENT} />
          </div>

          <LightSectionCard title="PRESIDENTS CLUB LEADERBOARD">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rank', 'Rep', 'Hometown', 'YTD Att.', 'Proj. Annual', 'Club Tier', 'Trend'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEADERBOARD.map(seller => {
                    const clubTierData = CLUB_TIERS.find(t => t.tier === seller.clubTier);
                    const onPace = seller.projectedAnnual >= 1.05;
                    return (
                      <tr key={seller.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                        <td className="py-1.5 pr-3 text-center font-bold" style={{ color: ACCENT }}>{seller.rank}</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{seller.name}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{seller.hometown}</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: seller.ytdAttainment >= 1.05 ? '#22C55E' : seller.ytdAttainment >= 0.90 ? '#F59E0B' : '#F87171' }}>
                          {(seller.ytdAttainment * 100).toFixed(1)}%
                        </td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>
                          {(seller.projectedAnnual * 100).toFixed(1)}%
                        </td>
                        <td className="py-1.5 pr-3">
                          {clubTierData ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                              style={{ background: `${clubTierData.color}18`, color: clubTierData.color }}>
                              {clubTierData.label}
                            </span>
                          ) : (
                            <span className="text-[9px]" style={{ color: 'var(--pl-text-faint)' }}>\u2014</span>
                          )}
                        </td>
                        <td className="py-1.5">
                          <span className="text-[9px] font-mono" style={{ color: onPace ? '#22C55E' : '#F59E0B' }}>
                            {onPace ? '\u25B2 On Pace' : '\u25BC Needs push'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>

          <LightSectionCard title="HISTORICAL CONTEXT \u2014 2025">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold font-mono mb-1" style={{ color: ACCENT }}>11</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>2025 Qualifiers</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono mb-1" style={{ color: ACCENT }}>108.4%</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>2025 Avg Attainment (qualifiers)</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono mb-1" style={{ color: ACCENT }}>Marcus Webb</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>2025 Top Earner &middot; 127.3%</div>
              </div>
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Sales Rep Tab */}
      {activeTab === 'rep' && (
        <>
          <div className="mb-6">
            <label className="text-[10px] font-bold font-mono uppercase mb-2 block" style={{ color: 'var(--pl-text-muted)' }}>
              Select Rep
            </label>
            <select
              value={selectedRep}
              onChange={e => setSelectedRep(e.target.value)}
              className="px-3 py-2 rounded text-xs font-mono"
              style={{
                background: 'var(--pl-card-alt)',
                border: '1px solid var(--pl-border)',
                color: 'var(--pl-text)',
              }}
            >
              {SELLERS.map(s => (
                <option key={s.id} value={s.id}>{s.name} \u2014 {s.hometown}</option>
              ))}
            </select>
          </div>

          <LightSectionCard title={`EARNINGS SUMMARY \u2014 ${rep.name.toUpperCase()}`}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Base (QTD)', value: '$13,000' },
                { label: 'Variable', value: `$${(rep.attainment * 4200).toFixed(0)}` },
                { label: 'Commission', value: `$${(rep.attainment * 3600).toFixed(0)}` },
                { label: 'Bonus', value: rep.spiritsAccounts >= 3 ? `$${rep.spiritsAccounts * 25}` : '$0' },
                { label: 'Total QTD', value: `$${(13000 + rep.attainment * 4200 + rep.attainment * 3600 + (rep.spiritsAccounts >= 3 ? rep.spiritsAccounts * 25 : 0)).toFixed(0)}` },
              ].map(item => (
                <LightKpiCard key={item.label} label={item.label} value={item.value} accent={ACCENT} />
              ))}
            </div>
          </LightSectionCard>

          <LightSectionCard title="13-WEEK ATTAINMENT TREND">
            <div className="h-24 flex items-end gap-1">
              {rep.weeklyAttainment.map((val, i) => {
                const pctH = Math.min(val * 100, 130);
                const color = val >= 1.0 ? '#22C55E' : val >= 0.85 ? '#F59E0B' : '#F87171';
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full rounded-t transition-all"
                      style={{ height: `${pctH * 0.7}%`, background: `${color}80`, minHeight: 4 }} />
                    <div className="text-[7px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>W{i + 1}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>
              <span>Week 1</span>
              <span>Current attainment: {(rep.attainment * 100).toFixed(1)}%</span>
              <span>Week 13</span>
            </div>
          </LightSectionCard>

          <LightSectionCard title="GATE STATUS">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Core', value: rep.emcoGates.core, threshold: 0.75, color: '#2563EB' },
                { name: 'Import', value: rep.emcoGates.import, threshold: 0.80, color: '#7C3AED' },
                { name: 'Emerging', value: rep.emcoGates.emerging, threshold: 0.70, color: '#F59E0B' },
                { name: 'Combined', value: rep.emcoGates.combined, threshold: 0.85, color: ACCENT },
              ].map(gate => {
                const pctVal = Math.min(gate.value * 100, 100);
                const unlocked = gate.value >= gate.threshold;
                const gateColor = unlocked ? '#22C55E' : gate.value >= gate.threshold * 0.9 ? '#F59E0B' : gate.color;
                return (
                  <div key={gate.name} className="p-3 rounded-lg" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{gate.name}</span>
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                        style={{ background: unlocked ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)', color: unlocked ? '#22C55E' : '#F87171' }}>
                        {unlocked ? '\u2713 UNLOCKED' : '\u2717 LOCKED'}
                      </span>
                    </div>
                    <div className="rounded-full overflow-hidden mb-1" style={{ height: 8, background: 'var(--pl-chart-bar-track)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pctVal}%`, background: gateColor }} />
                    </div>
                    <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                      {(gate.value * 100).toFixed(0)}% / {(gate.threshold * 100).toFixed(0)}% threshold
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          <LightSectionCard title="PAYMENT HISTORY \u2014 LAST 6 PAY PERIODS">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Period', 'Base', 'Variable', 'Commission', 'Bonus', 'Total'].map(h => (
                      <th key={h} className="text-left pb-2 pr-4 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_HISTORY.map((row, i) => {
                    const total = row.base + row.variable + row.commission + row.bonus;
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                        <td className="py-1.5 pr-4 font-bold" style={{ color: 'var(--pl-text)' }}>{row.period}</td>
                        <td className="py-1.5 pr-4 text-right" style={{ color: 'var(--pl-text-muted)' }}>${row.base.toLocaleString()}</td>
                        <td className="py-1.5 pr-4 text-right" style={{ color: 'var(--pl-text-muted)' }}>${row.variable.toLocaleString()}</td>
                        <td className="py-1.5 pr-4 text-right" style={{ color: 'var(--pl-text-muted)' }}>${row.commission.toLocaleString()}</td>
                        <td className="py-1.5 pr-4 text-right" style={{ color: row.bonus > 0 ? '#22C55E' : 'var(--pl-text-faint)' }}>
                          {row.bonus > 0 ? `$${row.bonus.toLocaleString()}` : '\u2014'}
                        </td>
                        <td className="py-1.5 text-right font-bold" style={{ color: ACCENT }}>${total.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Sales Manager Tab */}
      {activeTab === 'manager' && (
        <>
          <div className="flex gap-2 flex-wrap mb-6">
            {HOMETOWNS_LIST.map(h => (
              <button
                key={h.id}
                onClick={() => setSelectedHometown(h.id)}
                className="px-3 py-1.5 rounded text-[10px] font-bold font-mono uppercase transition-colors"
                style={{
                  background: selectedHometown === h.id ? ACCENT : 'var(--pl-card-alt)',
                  color: selectedHometown === h.id ? 'white' : 'var(--pl-text-muted)',
                  border: `1px solid ${selectedHometown === h.id ? ACCENT : 'var(--pl-border)'}`,
                }}
              >
                {h.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Avg Attainment" value={`${(htReps.reduce((s, r) => s + r.attainment, 0) / (htReps.length || 1) * 100).toFixed(1)}%`} accent={ACCENT} />
            <LightKpiCard label="Total Comp Expense" value={`$${(htReps.length * 7020 / 1000).toFixed(0)}K`} accent={ACCENT} />
            <LightKpiCard label="At-Risk Reps" value={String(htReps.filter(r => r.atRisk).length)} accent={ACCENT} />
            <LightKpiCard label="Full Gate %" value={`${Math.round(htReps.filter(r => r.emcoGates.combined >= 0.85).length / (htReps.length || 1) * 100)}%`} accent={ACCENT} />
          </div>

          <LightSectionCard title={`${ht.name.toUpperCase()} TEAM \u2014 MANAGER: ${ht.manager.toUpperCase()}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rep', 'Attainment', 'Tier', 'Gates Unlocked', 'Earned vs Target', 'Status'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {htReps.map(r => {
                    const gatesUnlocked = [r.emcoGates.core >= 0.75, r.emcoGates.import >= 0.80, r.emcoGates.emerging >= 0.70, r.emcoGates.combined >= 0.85].filter(Boolean).length;
                    const statusColor = r.attainment >= 1.0 ? '#22C55E' : r.attainment >= 0.85 ? '#F59E0B' : '#F87171';
                    const statusLabel = r.attainment >= 1.0 ? 'ON TARGET' : r.attainment >= 0.85 ? 'AT RISK' : 'BELOW';
                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{r.name}</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: statusColor }}>
                          {(r.attainment * 100).toFixed(1)}%
                        </td>
                        <td className="py-1.5 pr-3">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                            style={{ background: 'rgba(14,165,233,0.1)', color: ACCENT }}>T{r.tier}</span>
                        </td>
                        <td className="py-1.5 pr-3 text-center">
                          <span className="font-bold" style={{ color: gatesUnlocked === 4 ? '#22C55E' : gatesUnlocked >= 2 ? '#F59E0B' : '#F87171' }}>
                            {gatesUnlocked}/4
                          </span>
                        </td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: ACCENT }}>
                          ${Math.round(r.attainment * 4200).toLocaleString()} / $4,200
                        </td>
                        <td className="py-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                            style={{ background: `${statusColor}18`, color: statusColor }}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>

          <LightSectionCard title="COACHING RECOMMENDATIONS">
            <div className="grid gap-3">
              {(COACHING_RECS[selectedHometown] ?? COACHING_RECS['sa']).map((rec, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg"
                  style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}>
                  <div className="flex-shrink-0 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                    style={{ background: `${ACCENT}20`, color: ACCENT }}>AI</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pl-text)' }}>{rec}</div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          <LightSectionCard title="COMP BUDGET TRACKER">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-lg font-bold font-mono mb-1" style={{ color: 'var(--pl-text-muted)' }}>
                  ${(htReps.length * 9800).toLocaleString()}
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Budget Allocated (Q1)</div>
              </div>
              <div>
                <div className="text-lg font-bold font-mono mb-1" style={{ color: ACCENT }}>
                  ${(htReps.length * 7020).toLocaleString()}
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Spent to Date</div>
              </div>
              <div>
                <div className="text-lg font-bold font-mono mb-1" style={{ color: '#22C55E' }}>
                  ${(htReps.length * 9800 - htReps.length * 7020).toLocaleString()}
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Remaining</div>
              </div>
            </div>
            <div className="mt-3 rounded-full overflow-hidden" style={{ height: 8, background: 'var(--pl-chart-bar-track)' }}>
              <div className="h-full rounded-full" style={{ width: `${(7020 / 9800) * 100}%`, background: ACCENT }} />
            </div>
            <div className="text-[10px] font-mono mt-1 text-right" style={{ color: 'var(--pl-text-faint)' }}>
              71.6% of budget used &middot; Projected EOQ: ${(htReps.length * 9800 * 1.02).toLocaleString()}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* District Manager Tab */}
      {activeTab === 'district' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {HOMETOWNS_LIST.map(hometown => {
              const htRepsLocal = SELLERS.filter(s => s.hometown === hometown.id);
              const avgAtt = htRepsLocal.reduce((s, r) => s + r.attainment, 0) / (htRepsLocal.length || 1);
              const topRep = [...htRepsLocal].sort((a, b) => b.attainment - a.attainment)[0];
              const att = hometown.revenue / hometown.quota;
              const barColor = att >= 1.0 ? '#22C55E' : att >= 0.90 ? '#F59E0B' : '#F87171';
              const s = STATUS_STYLES[hometown.status];
              const isExpanded = expandedHometown === hometown.id;

              return (
                <div key={hometown.id} className="rounded-lg overflow-hidden"
                  style={{ border: `1px solid ${isExpanded ? ACCENT : 'var(--pl-border)'}` }}>
                  <button
                    className="w-full p-4 text-left"
                    style={{ background: isExpanded ? `${ACCENT}08` : 'var(--pl-card-alt)' }}
                    onClick={() => setExpandedHometown(isExpanded ? null : hometown.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{hometown.name}</div>
                        <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>Mgr: {hometown.manager}</div>
                      </div>
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                        style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </div>

                    <div className="rounded-full overflow-hidden mb-1" style={{ height: 6, background: 'var(--pl-chart-bar-track)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(att * 100, 100)}%`, background: barColor }} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Revenue vs Quota</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: barColor }}>
                          ${(hometown.revenue / 1000000).toFixed(2)}M / ${(hometown.quota / 1000000).toFixed(2)}M
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Avg Attainment</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: barColor }}>{(avgAtt * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Headcount</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{hometown.headcount} reps</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Top Performer</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: '#22C55E' }}>
                          {topRep ? `${topRep.name.split(' ')[0]} ${(topRep.attainment * 100).toFixed(0)}%` : '\u2014'}
                        </div>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2" style={{ borderTop: `1px solid ${ACCENT}20` }}>
                      <div className="text-[9px] font-bold font-mono uppercase mb-2" style={{ color: ACCENT }}>Rep Breakdown</div>
                      <div className="grid gap-1.5">
                        {[...htRepsLocal].sort((a, b) => b.attainment - a.attainment).map(r => {
                          const rColor = r.attainment >= 1.0 ? '#22C55E' : r.attainment >= 0.85 ? '#F59E0B' : '#F87171';
                          return (
                            <div key={r.id} className="flex items-center gap-2">
                              <div className="flex-1 text-[10px] font-mono" style={{ color: 'var(--pl-text)' }}>{r.name}</div>
                              <div className="text-[10px] font-bold font-mono" style={{ color: rColor }}>
                                {(r.attainment * 100).toFixed(0)}%
                              </div>
                              <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>T{r.tier}</div>
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

          <LightSectionCard title="DISTRICT COMPARISON TABLE">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Hometown', 'Manager', 'Headcount', 'Revenue', 'Quota', 'Attainment', 'Avg Att. %', 'Status'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOMETOWNS_LIST.map(hometown => {
                    const htRepsLocal = SELLERS.filter(s => s.hometown === hometown.id);
                    const avgAtt = htRepsLocal.reduce((s, r) => s + r.attainment, 0) / (htRepsLocal.length || 1);
                    const att = hometown.revenue / hometown.quota;
                    const attColor = att >= 1.0 ? '#22C55E' : att >= 0.90 ? '#F59E0B' : '#F87171';
                    const s = STATUS_STYLES[hometown.status];
                    return (
                      <tr key={hometown.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{hometown.name}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{hometown.manager}</td>
                        <td className="py-1.5 pr-3 text-center" style={{ color: 'var(--pl-text)' }}>{hometown.headcount}</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: ACCENT }}>${(hometown.revenue / 1000000).toFixed(2)}M</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>${(hometown.quota / 1000000).toFixed(2)}M</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: attColor }}>{(att * 100).toFixed(1)}%</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{(avgAtt * 100).toFixed(1)}%</td>
                        <td className="py-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                            style={{ background: s.bg, color: s.color }}>{s.label}</span>
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
