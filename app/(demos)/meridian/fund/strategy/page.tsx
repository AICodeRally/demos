'use client';

import { ActNavigation, SectionCard, KpiCard, DonutChart } from '@/components/demos/meridian';
import { FUND, FUND_PERFORMANCE, LPS, STRATEGIC_PRIORITIES } from '@/data/meridian';
import { fmt, pct } from '@/lib/utils';

const LP_TYPE_COLORS: Record<string, string> = {
  Pension: '#3B82F6',
  Endowment: '#8B5CF6',
  SWF: '#D4A847',
  FoF: '#10B981',
  'Family Office': '#F59E0B',
  Insurance: '#0EA5E9',
  Foundation: '#EF4444',
};

const lpTypeData = Object.entries(
  LPS.reduce<Record<string, number>>((acc, lp) => {
    acc[lp.type] = (acc[lp.type] || 0) + lp.commitment;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value, color: LP_TYPE_COLORS[name] || '#6B7280' }));

export default function FundStrategyPage() {
  return (
    <>
      <ActNavigation currentAct={1} />

      {/* Hero */}
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #D4A847 0%, #9A7B2E 100%)', boxShadow: '0 4px 12px rgba(212,168,71,0.3)' }}
        >
          <span className="text-3xl">&#9670;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#D4A847' }}>
            Act 1 &middot; Fund Overview
          </div>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
            {FUND.name}
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--mr-text-muted)' }}>
            Vintage {FUND.vintage} &middot; M&amp;A / Growth Equity &middot; ${(FUND.committedCapital / 1e9).toFixed(2)}B Committed
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        <KpiCard label="Committed Capital" value={`$${(FUND.committedCapital / 1e9).toFixed(2)}B`} accent="#D4A847" sub={`Target: $${(FUND.targetSize / 1e9).toFixed(1)}B`} stagger={0} />
        <KpiCard label="Net IRR" value={`${(FUND_PERFORMANCE.netIRR * 100).toFixed(1)}%`} accent="#10B981" sub={`Gross: ${(FUND_PERFORMANCE.grossIRR * 100).toFixed(1)}%`} stagger={1} />
        <KpiCard label="Net TVPI" value={`${FUND_PERFORMANCE.netTVPI.toFixed(2)}x`} accent="#3B82F6" sub={`Gross: ${FUND_PERFORMANCE.grossTVPI.toFixed(2)}x`} stagger={2} />
        <KpiCard label="DPI" value={`${FUND_PERFORMANCE.netDPI.toFixed(2)}x`} accent="#8B5CF6" sub="Distributions / Paid-In" stagger={3} />
        <KpiCard label="PME Alpha" value={`+${(FUND_PERFORMANCE.pmeAlpha * 100).toFixed(1)}%`} accent="#F59E0B" sub="vs S&P 500" stagger={4} />
      </div>

      {/* LP Composition */}
      <SectionCard title="Limited Partner Composition">
        <div className="flex items-center gap-8">
          <DonutChart data={lpTypeData} size={200} label={`${LPS.length} LPs`} />
          <div className="flex-1 grid grid-cols-2 gap-3">
            {lpTypeData.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--mr-text)' }}>{d.name}</div>
                  <div className="text-[13px] font-mono" style={{ color: 'var(--mr-text-muted)' }}>
                    ${(d.value / 1e9).toFixed(2)}B
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Top LPs Table */}
      <SectionCard title="Investor Register (Top LPs)">
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ color: 'var(--mr-text-muted)' }}>
              <th className="text-left font-medium pb-3 pl-2">LP</th>
              <th className="text-left font-medium pb-3">Type</th>
              <th className="text-right font-medium pb-3">Commitment</th>
              <th className="text-right font-medium pb-3">Called</th>
              <th className="text-right font-medium pb-3">NAV</th>
              <th className="text-right font-medium pb-3 pr-2">TVPI</th>
            </tr>
          </thead>
          <tbody>
            {LPS.slice(0, 8).map((lp, i) => (
              <tr key={lp.name} style={i % 2 === 0 ? { background: 'var(--mr-stripe)' } : undefined}>
                <td className="py-2.5 pl-2 font-semibold" style={{ color: 'var(--mr-text)' }}>{lp.name}</td>
                <td className="py-2.5">
                  <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${LP_TYPE_COLORS[lp.type]}15`, color: LP_TYPE_COLORS[lp.type] }}>
                    {lp.type}
                  </span>
                </td>
                <td className="py-2.5 text-right font-mono" style={{ color: 'var(--mr-text)' }}>${fmt(lp.commitment / 1e6)}M</td>
                <td className="py-2.5 text-right font-mono" style={{ color: 'var(--mr-text-muted)' }}>${fmt(lp.called / 1e6)}M</td>
                <td className="py-2.5 text-right font-mono" style={{ color: 'var(--mr-text)' }}>${fmt(lp.nav / 1e6)}M</td>
                <td className="py-2.5 text-right font-mono font-bold pr-2" style={{ color: '#10B981' }}>{lp.tvpi.toFixed(2)}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* Strategic Priorities */}
      <div className="mb-4">
        <div className="text-[13px] uppercase tracking-[1.5px] font-mono mb-4" style={{ color: 'var(--mr-text-muted)' }}>
          Investment Thesis & Strategic Priorities
        </div>
        <div className="grid grid-cols-2 gap-4">
          {STRATEGIC_PRIORITIES.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border p-5 hover:shadow-md transition-shadow"
              style={{ background: 'var(--mr-card)', borderColor: 'var(--mr-border)', borderLeft: '3px solid #D4A847', boxShadow: 'var(--mr-shadow)' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{p.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-bold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>{p.title}</span>
                    <span className="text-[12px] font-bold font-mono px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,168,71,0.10)', color: '#D4A847' }}>
                      {p.stat}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--mr-text-muted)' }}>{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LP Letter Quote */}
      <div className="rounded-lg px-6 py-4 mt-6" style={{ background: 'rgba(212,168,71,0.06)', borderLeft: '3px solid #D4A847' }}>
        <p className="text-[14px] italic leading-relaxed" style={{ color: 'var(--mr-text-secondary)' }}>
          &ldquo;Fund IV is positioned at the intersection of complexity and value. Our M&amp;A-driven strategy targets sectors where operational
          improvement and strategic bolt-ons create compounding returns. We expect to return 2.0x+ net to our limited partners.&rdquo;
        </p>
        <p className="text-[12px] font-semibold mt-2" style={{ color: '#D4A847' }}>
          &mdash; James Hartwell, Managing Partner &middot; Q4 2025 LP Letter
        </p>
      </div>
    </>
  );
}
