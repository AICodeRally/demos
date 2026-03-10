'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import { SELLERS, HOMETOWNS } from '@/data/proofline';

const ACCENT = '#0EA5E9';

const TIER_COLORS: Record<number, string> = {
  1: '#22C55E',
  2: '#2563EB',
  3: '#F59E0B',
  4: '#94A3B8',
};

const RATE_SCHEDULE = [
  { tier: 1, label: 'Elite', floor: 110, ceiling: Infinity, ratePerCase: 3.80, range: '110%+' },
  { tier: 2, label: 'Achiever', floor: 90, ceiling: 110, ratePerCase: 3.20, range: '90\u2013110%' },
  { tier: 3, label: 'Contributor', floor: 75, ceiling: 90, ratePerCase: 2.60, range: '75\u201390%' },
  { tier: 4, label: 'Developing', floor: 0, ceiling: 75, ratePerCase: 2.00, range: '<75%' },
];

const HOMETOWNS_LIST = HOMETOWNS.map(h => ({ id: h.id, name: h.name }));

const ACTIVE_BONUSES = [
  { name: 'Q1 Volume Kicker', description: 'Extra $0.40/case for \u2265100% attainment', threshold: 1.00 },
  { name: 'Import Push Bonus', description: '$500 for unlocking Import gate + 5% over', threshold: 0.80 },
  { name: 'Spirits Adder', description: '$25/new spirits account in quarter', threshold: null },
];

// Build rep rewards data from SELLERS
const REP_REWARDS = SELLERS.map(seller => {
  const baseSalary = 52000;
  const variableTarget = 18000;
  const attPct = seller.attainment;
  const tierLevel = seller.tier;
  const casesQTD = Math.round(800 + attPct * 400 + Math.sin(seller.id.charCodeAt(0)) * 120);
  const ratePerCase = RATE_SCHEDULE.find(r => tierLevel === r.tier)?.ratePerCase ?? 2.00;
  const commissionEarned = Math.round(casesQTD * ratePerCase);
  const variableEarned = Math.round(variableTarget * Math.min(attPct / 1.0, 1.3));
  const bonusEarned = seller.spiritsAccounts >= 3 ? seller.spiritsAccounts * 25 : 0;
  const status = attPct >= 1.0 ? 'above' : attPct >= 0.85 ? 'at-risk' : 'below';

  return {
    ...seller,
    baseSalary,
    variableTarget,
    variableEarned,
    commissionEarned,
    bonusEarned,
    casesQTD,
    ratePerCase,
    status,
    attPct,
  };
});

const HOMETOWN_ROLLUP = HOMETOWNS_LIST.map(ht => {
  const reps = REP_REWARDS.filter(r => r.hometown === ht.id);
  const totalComm = reps.reduce((s, r) => s + r.commissionEarned, 0);
  const avgRate = reps.length > 0 ? reps.reduce((s, r) => s + r.ratePerCase, 0) / reps.length : 0;
  const top = [...reps].sort((a, b) => b.commissionEarned - a.commissionEarned)[0];
  return { ...ht, reps: reps.length, totalComm, avgRate, topEarner: top?.name ?? '\u2014', topAmount: top?.commissionEarned ?? 0 };
});

const STATUS_CFG = {
  above: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'ABOVE' },
  'at-risk': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'AT RISK' },
  below: { bg: 'rgba(248,113,113,0.1)', color: '#F87171', label: 'BELOW' },
};

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'variable' | 'commission' | 'bonus'>('variable');
  const [hometownFilter, setHometownFilter] = useState<string | null>(null);

  const tabs = [
    { key: 'variable', label: 'Variable Pay' },
    { key: 'commission', label: 'Commission' },
    { key: 'bonus', label: 'Bonus' },
  ] as const;

  const filteredReps = hometownFilter
    ? REP_REWARDS.filter(r => r.hometown === hometownFilter)
    : REP_REWARDS;

  const sorted = [...filteredReps].sort((a, b) => b.attPct - a.attPct);

  const aboveCount = REP_REWARDS.filter(r => r.status === 'above').length;
  const belowCount = REP_REWARDS.filter(r => r.status === 'below').length;
  const totalVariable = REP_REWARDS.reduce((s, r) => s + r.variableEarned, 0);
  const avgRatio = REP_REWARDS.reduce((s, r) => s + r.variableEarned / r.variableTarget, 0) / REP_REWARDS.length;

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Tab Bar */}
      <div className="flex gap-0 border-b mb-6" style={{ borderColor: 'var(--pl-border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-colors"
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

      {/* Variable Pay Tab */}
      {activeTab === 'variable' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Total Variable Paid (QTD)" value={`$${(totalVariable / 1000).toFixed(0)}K`} accent={ACCENT} />
            <LightKpiCard label="Avg Payout Ratio" value={`${(avgRatio * 100).toFixed(0)}%`} accent={ACCENT} />
            <LightKpiCard label="Above Target" value={String(aboveCount)} accent={ACCENT} sub="of 36 reps" />
            <LightKpiCard label="Below Target" value={String(belowCount)} accent={ACCENT} />
          </div>

          {/* Hometown Filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => setHometownFilter(null)}
              className="px-3 py-1 rounded text-[10px] font-bold font-mono uppercase transition-colors"
              style={{
                background: hometownFilter === null ? ACCENT : 'var(--pl-card-alt)',
                color: hometownFilter === null ? 'white' : 'var(--pl-text-muted)',
                border: `1px solid ${hometownFilter === null ? ACCENT : 'var(--pl-border)'}`,
              }}
            >
              All
            </button>
            {HOMETOWNS_LIST.map(ht => (
              <button
                key={ht.id}
                onClick={() => setHometownFilter(ht.id)}
                className="px-3 py-1 rounded text-[10px] font-bold font-mono uppercase transition-colors"
                style={{
                  background: hometownFilter === ht.id ? ACCENT : 'var(--pl-card-alt)',
                  color: hometownFilter === ht.id ? 'white' : 'var(--pl-text-muted)',
                  border: `1px solid ${hometownFilter === ht.id ? ACCENT : 'var(--pl-border)'}`,
                }}
              >
                {ht.name}
              </button>
            ))}
          </div>

          <LightSectionCard title={`VARIABLE PAY \u2014 ${sorted.length} REPS`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rep', 'Route', 'Base Salary', 'Variable Target', 'Earned', '% of Target', 'Status'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(rep => {
                    const ratio = rep.variableEarned / rep.variableTarget;
                    const cfg = STATUS_CFG[rep.status as keyof typeof STATUS_CFG];
                    return (
                      <tr key={rep.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{rep.name}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{rep.routeId}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>$52,000</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>$18,000</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: ACCENT }}>${rep.variableEarned.toLocaleString()}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text)' }}>{(ratio * 100).toFixed(0)}%</td>
                        <td className="py-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                            style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>

          {/* Distribution */}
          <LightSectionCard title="PAYOUT RATIO DISTRIBUTION">
            <div className="flex gap-3 items-end h-24">
              {[
                { label: '<60%', count: REP_REWARDS.filter(r => r.attPct < 0.60).length, color: '#F87171' },
                { label: '60\u201375%', count: REP_REWARDS.filter(r => r.attPct >= 0.60 && r.attPct < 0.75).length, color: '#F87171' },
                { label: '75\u201390%', count: REP_REWARDS.filter(r => r.attPct >= 0.75 && r.attPct < 0.90).length, color: '#F59E0B' },
                { label: '90\u2013100%', count: REP_REWARDS.filter(r => r.attPct >= 0.90 && r.attPct < 1.00).length, color: '#2563EB' },
                { label: '100\u2013110%', count: REP_REWARDS.filter(r => r.attPct >= 1.00 && r.attPct < 1.10).length, color: '#22C55E' },
                { label: '110%+', count: REP_REWARDS.filter(r => r.attPct >= 1.10).length, color: '#22C55E' },
              ].map(b => {
                const maxCount = 12;
                const pctH = (b.count / maxCount) * 100;
                return (
                  <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] font-mono font-bold" style={{ color: b.color }}>{b.count}</div>
                    <div className="w-full rounded-t" style={{ height: `${pctH}%`, background: `${b.color}60`, minHeight: 4 }} />
                    <div className="text-[8px] font-mono text-center" style={{ color: 'var(--pl-text-faint)' }}>{b.label}</div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Commission Tab */}
      {activeTab === 'commission' && (
        <>
          <LightSectionCard title="COMMISSION RATE SCHEDULE">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {RATE_SCHEDULE.map(tier => (
                <div key={tier.tier} className="p-4 rounded-lg text-center"
                  style={{ background: `${TIER_COLORS[tier.tier]}12`, border: `1px solid ${TIER_COLORS[tier.tier]}30` }}>
                  <div className="text-[10px] font-bold font-mono uppercase mb-1" style={{ color: TIER_COLORS[tier.tier] }}>
                    T{tier.tier} \u2014 {tier.label}
                  </div>
                  <div className="text-2xl font-bold font-mono mb-1" style={{ color: TIER_COLORS[tier.tier] }}>
                    ${tier.ratePerCase.toFixed(2)}
                  </div>
                  <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>per case</div>
                  <div className="text-[10px] font-mono mt-2" style={{ color: 'var(--pl-text-muted)' }}>
                    Attainment: {tier.range}
                  </div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          <LightSectionCard title="REP COMMISSION \u2014 QTD">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rep', 'Tier', 'Volume (Cases)', 'Rate/Case', 'Commission', 'QTD Total'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...REP_REWARDS].sort((a, b) => b.commissionEarned - a.commissionEarned).map(rep => (
                    <tr key={rep.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                      <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{rep.name}</td>
                      <td className="py-1.5 pr-3">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                          style={{ background: `${TIER_COLORS[rep.tier]}18`, color: TIER_COLORS[rep.tier] }}>
                          T{rep.tier} {RATE_SCHEDULE.find(r => r.tier === rep.tier)?.label}
                        </span>
                      </td>
                      <td className="py-1.5 pr-3 text-right" style={{ color: 'var(--pl-text)' }}>{rep.casesQTD.toLocaleString()}</td>
                      <td className="py-1.5 pr-3 text-right" style={{ color: 'var(--pl-text-muted)' }}>${rep.ratePerCase.toFixed(2)}</td>
                      <td className="py-1.5 pr-3 font-bold text-right" style={{ color: ACCENT }}>${rep.commissionEarned.toLocaleString()}</td>
                      <td className="py-1.5 font-bold text-right" style={{ color: ACCENT }}>${(rep.commissionEarned + rep.variableEarned).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LightSectionCard>

          <LightSectionCard title="HOMETOWN COMMISSION ROLLUP">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {HOMETOWN_ROLLUP.map(ht => (
                <div key={ht.id} className="p-4 rounded-lg" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="text-xs font-bold font-mono uppercase mb-2" style={{ color: 'var(--pl-text)' }}>{ht.name}</div>
                  <div className="text-xl font-bold font-mono" style={{ color: ACCENT }}>${ht.totalComm.toLocaleString()}</div>
                  <div className="text-[9px] font-mono mb-2" style={{ color: 'var(--pl-text-faint)' }}>total commission &middot; {ht.reps} reps</div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>Avg rate: ${ht.avgRate.toFixed(2)}/case</div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>Top: {ht.topEarner}</div>
                </div>
              ))}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Bonus Tab */}
      {activeTab === 'bonus' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Total Bonus Paid (QTD)" value={`$${REP_REWARDS.reduce((s, r) => s + r.bonusEarned, 0).toLocaleString()}`} accent={ACCENT} />
            <LightKpiCard label="Q1 Kicker Qualifiers" value={String(REP_REWARDS.filter(r => r.attPct >= 1.0).length)} accent={ACCENT} sub="of 36 reps" />
            <LightKpiCard label="Spirits Adder Total" value={`$${REP_REWARDS.reduce((s, r) => s + (r.spiritsAccounts >= 3 ? r.spiritsAccounts * 25 : 0), 0).toLocaleString()}`} accent={ACCENT} />
            <LightKpiCard label="Avg Bonus / Rep" value={`$${Math.round(REP_REWARDS.reduce((s, r) => s + r.bonusEarned, 0) / REP_REWARDS.length).toLocaleString()}`} accent={ACCENT} />
          </div>

          <LightSectionCard title="ACTIVE BONUS PROGRAMS">
            <div className="grid gap-3">
              {ACTIVE_BONUSES.map(bonus => {
                const qualifiers = bonus.threshold
                  ? REP_REWARDS.filter(r => r.attPct >= bonus.threshold!).length
                  : REP_REWARDS.filter(r => r.spiritsAccounts >= 3).length;
                return (
                  <div key={bonus.name} className="flex items-center gap-4 p-3 rounded-lg"
                    style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                    <div className="flex-1">
                      <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{bonus.name}</div>
                      <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--pl-text-muted)' }}>{bonus.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono" style={{ color: ACCENT }}>{qualifiers}</div>
                      <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>qualifiers</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          <LightSectionCard title="BONUS PAYOUT TABLE">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rep', 'Bonus Type', 'Qualification', 'Payout', 'Pay Date'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REP_REWARDS.filter(r => r.attPct >= 1.0 || r.spiritsAccounts >= 3).map(rep => (
                    <tr key={rep.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                      <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{rep.name}</td>
                      <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>
                        {rep.attPct >= 1.0 ? 'Q1 Volume Kicker' : 'Spirits Adder'}
                      </td>
                      <td className="py-1.5 pr-3">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                          style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>EARNED</span>
                      </td>
                      <td className="py-1.5 pr-3 font-bold" style={{ color: ACCENT }}>
                        ${rep.bonusEarned > 0 ? rep.bonusEarned.toLocaleString() : Math.round(rep.casesQTD * 0.40).toLocaleString()}
                      </td>
                      <td className="py-1.5" style={{ color: 'var(--pl-text-muted)' }}>Mar 28</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LightSectionCard>
        </>
      )}
    </>
  );
}
