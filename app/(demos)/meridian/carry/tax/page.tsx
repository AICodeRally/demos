'use client';

import { ActNavigation, SectionCard, KpiCard } from '@/components/demos/meridian';
import {
  SECTION_1061_ITEMS,
  SECTION_1061_SUMMARY,
  ACCOUNTING_ITEMS,
  CARRY_KPIS,
  ADVISORY_LANDSCAPE,
} from '@/data/meridian/tax-governance';

export default function CarryTaxPage() {
  const s = SECTION_1061_SUMMARY;

  return (
    <>
      <ActNavigation currentAct={5} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#D4A847' }}>
          Tax &amp; Accounting &middot; Carry Treatment
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Tax &amp; Accounting Dashboard
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          IRC Section 1061 holding period analysis, ASC 718/606 compliance, and carry KPIs
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <KpiCard label="LTCG Qualified" value={`$${(s.ltcgQualified / 1e6).toFixed(0)}M`} accent="#10B981" sub={`${((s.ltcgQualified / s.totalAPIGains) * 100).toFixed(0)}% of API gains`} stagger={0} />
        <KpiCard label="Recharacterized" value={`$${(s.recharacterized / 1e6).toFixed(0)}M`} accent="#EF4444" sub={`${((s.recharacterized / s.totalAPIGains) * 100).toFixed(0)}% held <3 years`} stagger={1} />
        <KpiCard label="Tax Savings" value={`$${(s.potentialTaxSavings / 1e6).toFixed(1)}M`} accent="#D4A847" sub="If all held >3 years" stagger={2} />
        <KpiCard label="Blended Rate" value={`${(s.blendedEffectiveRate * 100).toFixed(1)}%`} accent="#3B82F6" sub="vs 23.8% target" stagger={3} />
      </div>

      {/* Section 1061 Analysis */}
      <SectionCard title="IRC Section 1061 \u2014 Applicable Partnership Interest Analysis">
        <p className="text-[12px] mb-4" style={{ color: 'var(--mr-text-muted)' }}>
          Section 1061 requires a 3-year holding period for LTCG treatment on gains allocated to an Applicable Partnership Interest (API).
          Final regulations published January 2021. Technical corrections issued 2022-2024.
        </p>
        <div className="space-y-2">
          {SECTION_1061_ITEMS.map((item) => (
            <div key={item.category} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--mr-card-alt)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.color}15`, color: item.color }}>
                <span className="text-xs font-bold">
                  {item.treatment === 'LTCG' ? '\u2713' : item.treatment === 'Exempt' ? '\u2606' : '\u2717'}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold" style={{ color: 'var(--mr-text)' }}>{item.category}</div>
                <div className="text-[11px]" style={{ color: 'var(--mr-text-faint)' }}>{item.notes}</div>
              </div>
              <div className="text-center w-20">
                <div className="text-[10px] font-mono" style={{ color: 'var(--mr-text-faint)' }}>Holding</div>
                <div className="text-[13px] font-mono font-bold" style={{ color: 'var(--mr-text)' }}>{item.holding}</div>
              </div>
              <div className="text-center w-20">
                <div className="text-[10px] font-mono" style={{ color: 'var(--mr-text-faint)' }}>Gains</div>
                <div className="text-[13px] font-mono font-bold" style={{ color: 'var(--mr-text)' }}>${(item.gains / 1e6).toFixed(1)}M</div>
              </div>
              <div className="text-center w-24">
                <span className="text-xs font-mono font-bold px-2 py-1 rounded" style={{ background: `${item.color}15`, color: item.color }}>
                  {item.treatment}
                </span>
              </div>
              <div className="text-center w-16">
                <div className="text-[10px] font-mono" style={{ color: 'var(--mr-text-faint)' }}>Rate</div>
                <div className="text-[13px] font-mono font-bold" style={{ color: item.rate > 0.30 ? '#EF4444' : '#10B981' }}>
                  {(item.rate * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visual bar */}
        <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)' }}>
          <div className="flex justify-between text-[10px] font-mono mb-1" style={{ color: 'var(--mr-text-faint)' }}>
            <span>API Gains by Tax Treatment</span>
            <span>${(s.totalAPIGains / 1e6).toFixed(0)}M total</span>
          </div>
          <div className="h-6 rounded-full flex overflow-hidden">
            <div
              className="h-full flex items-center justify-center text-[10px] font-mono font-bold text-white"
              style={{ width: `${(s.ltcgQualified / s.totalAPIGains) * 100}%`, background: '#10B981' }}
            >
              LTCG {((s.ltcgQualified / s.totalAPIGains) * 100).toFixed(0)}%
            </div>
            <div
              className="h-full flex items-center justify-center text-[10px] font-mono font-bold text-white"
              style={{ width: `${(s.recharacterized / s.totalAPIGains) * 100}%`, background: '#EF4444' }}
            >
              STCG {((s.recharacterized / s.totalAPIGains) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ASC 718 / 606 / 820 */}
      <SectionCard title="Accounting Standards Compliance">
        <div className="space-y-3">
          {ACCOUNTING_ITEMS.map((item) => (
            <div key={`${item.standard}-${item.scope}`} className="p-4 rounded-lg" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)' }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-bold px-2 py-1 rounded" style={{ background: '#3B82F615', color: '#3B82F6' }}>
                  {item.standard}
                </span>
                <span className="text-[13px] font-bold" style={{ color: 'var(--mr-text)' }}>{item.scope}</span>
                <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${item.color}15`, color: item.color }}>
                  {item.status}
                </span>
              </div>
              <p className="text-[12px] mb-1" style={{ color: 'var(--mr-text-secondary)' }}>{item.treatment}</p>
              <p className="text-[11px] font-mono" style={{ color: 'var(--mr-text-faint)' }}>{item.impact}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Carry KPIs */}
      <SectionCard title="Carry Operations KPIs">
        <div className="grid grid-cols-4 gap-3">
          {CARRY_KPIS.map((kpi) => (
            <div key={kpi.name} className="p-3 rounded-lg text-center" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)' }}>
              <div className="text-xs font-mono mb-1" style={{ color: 'var(--mr-text-faint)' }}>{kpi.name}</div>
              <div className="text-lg font-bold font-mono" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--mr-text-faint)' }}>Target: {kpi.target}</div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded mt-1 inline-block" style={{
                background: `${kpi.color}15`, color: kpi.color,
              }}>
                {kpi.status}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Advisory Landscape */}
      <SectionCard title="Advisory Landscape \u2014 Carry Tax & Accounting">
        <div className="grid grid-cols-3 gap-3">
          {ADVISORY_LANDSCAPE.map((firm) => (
            <div key={firm.name} className="p-3 rounded-lg" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)' }}>
              <div className="text-[14px] font-bold mb-1" style={{ color: firm.color }}>{firm.name}</div>
              <div className="text-[11px] mb-2" style={{ color: 'var(--mr-text-muted)' }}>{firm.strengths}</div>
              <div className="text-[11px] font-mono p-2 rounded" style={{ background: 'var(--mr-card)', color: 'var(--mr-text-faint)' }}>
                {firm.carryFocus}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
