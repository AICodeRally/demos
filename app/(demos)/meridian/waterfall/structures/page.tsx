'use client';

import { ActNavigation, SectionCard } from '@/components/demos/meridian';
import {
  WATERFALL_STRUCTURES,
  WATERFALL_COMPARISON,
  DEAL_BY_DEAL_SCENARIO,
} from '@/data/meridian/tax-governance';
import { WATERFALL_TIERS } from '@/data/meridian';

export default function WaterfallStructuresPage() {
  const totalDBDCarry = DEAL_BY_DEAL_SCENARIO.reduce((s, d) => s + d.gpCarryIfDBD, 0);
  const totalWFCarry = 334_700_000; // from whole-fund actual
  const overDistRisk = DEAL_BY_DEAL_SCENARIO[DEAL_BY_DEAL_SCENARIO.length - 1].overDistributionRisk;

  return (
    <>
      <ActNavigation currentAct={4} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#10B981' }}>
          Waterfall &middot; Structure Comparison
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Waterfall Structure Analysis
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          European (whole-fund) vs American (deal-by-deal) vs Hybrid &mdash; Fund IV uses whole-fund
        </p>
      </div>

      {/* Fund IV Current Structure Badge */}
      <div className="mb-6 p-4 rounded-xl flex items-center gap-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: '#10B98120', color: '#10B981' }}>
          <span className="text-lg">{'\u2713'}</span>
        </div>
        <div>
          <div className="text-sm font-bold" style={{ color: '#10B981' }}>Fund IV: European (Whole-Fund) Waterfall</div>
          <div className="text-xs" style={{ color: 'var(--mr-text-muted)' }}>
            4-tier structure: Return of Capital {'\u2192'} 8% Preferred Return {'\u2192'} GP Catch-Up (100/0) {'\u2192'} 80/20 Carry Split
          </div>
        </div>
      </div>

      {/* Three Structure Cards */}
      <SectionCard title="Waterfall Structure Options">
        <div className="grid grid-cols-3 gap-4">
          {WATERFALL_STRUCTURES.map((s) => (
            <div
              key={s.name}
              className="p-4 rounded-lg"
              style={{
                background: s.name.includes('Whole') ? `${s.color}10` : 'var(--mr-card-alt)',
                border: `1px solid ${s.name.includes('Whole') ? s.color : 'var(--mr-border)'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm" style={{ color: s.color }}>{'\u25C6'}</span>
                <span className="text-[14px] font-bold" style={{ color: s.color }}>{s.name}</span>
                {s.name.includes('Whole') && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded ml-auto" style={{ background: '#10B98120', color: '#10B981' }}>FUND IV</span>
                )}
              </div>
              <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'var(--mr-text-secondary)' }}>{s.description}</p>
              <div className="space-y-2">
                {[
                  { l: 'GP Liquidity', v: s.gpLiquidityTiming },
                  { l: 'Clawback Risk', v: s.clawbackRisk },
                  { l: 'LP Protection', v: s.lpProtection },
                  { l: 'Complexity', v: s.operationalComplexity },
                ].map((r) => (
                  <div key={r.l} className="flex justify-between text-[11px]">
                    <span style={{ color: 'var(--mr-text-faint)' }}>{r.l}</span>
                    <span className="font-mono font-bold" style={{
                      color: r.v === 'Low' ? '#10B981' : r.v === 'Medium' ? '#F59E0B' : r.v === 'High' ? '#EF4444' : 'var(--mr-text)',
                    }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t text-[11px]" style={{ borderColor: 'var(--mr-border)', color: 'var(--mr-text-faint)' }}>
                {s.bestFor}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Side-by-Side Comparison Table */}
      <SectionCard title="Detailed Comparison Matrix">
        <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--mr-border)' }}>
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: 'var(--mr-card-alt)' }}>
                <th className="text-left p-3 font-mono font-bold" style={{ color: 'var(--mr-text-muted)' }}>Metric</th>
                <th className="text-left p-3 font-mono font-bold" style={{ color: '#10B981' }}>Whole-Fund</th>
                <th className="text-left p-3 font-mono font-bold" style={{ color: '#EF4444' }}>Deal-by-Deal</th>
                <th className="text-left p-3 font-mono font-bold" style={{ color: '#F59E0B' }}>Hybrid</th>
              </tr>
            </thead>
            <tbody>
              {WATERFALL_COMPARISON.map((row, i) => (
                <tr key={row.metric} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--mr-card-alt)' }}>
                  <td className="p-3 font-bold" style={{ color: 'var(--mr-text)' }}>{row.metric}</td>
                  <td className="p-3" style={{ color: 'var(--mr-text-secondary)' }}>{row.wholeFund}</td>
                  <td className="p-3" style={{ color: 'var(--mr-text-secondary)' }}>{row.dealByDeal}</td>
                  <td className="p-3" style={{ color: 'var(--mr-text-secondary)' }}>{row.hybrid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Deal-by-Deal Scenario Analysis */}
      <SectionCard title="What-If: Fund IV Under Deal-by-Deal Structure">
        <p className="text-[12px] mb-4" style={{ color: 'var(--mr-text-muted)' }}>
          Illustrative scenario showing how Fund IV economics would differ under American-style deal-by-deal waterfall.
          TerraData loss creates over-distribution risk because carry was already paid on earlier exits.
        </p>
        <div className="space-y-2">
          {DEAL_BY_DEAL_SCENARIO.map((d) => (
            <div key={d.deal} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--mr-card-alt)' }}>
              <div className="flex-1">
                <div className="text-[13px] font-bold" style={{ color: d.profit < 0 ? '#EF4444' : 'var(--mr-text)' }}>{d.deal}</div>
                <div className="text-[11px] font-mono" style={{ color: 'var(--mr-text-faint)' }}>
                  Invested: ${(d.invested / 1e6).toFixed(0)}M {'\u2192'} Exit: ${(d.exitProceeds / 1e6).toFixed(0)}M
                </div>
              </div>
              <div className="text-center w-20">
                <div className="text-[10px] font-mono" style={{ color: 'var(--mr-text-faint)' }}>Profit</div>
                <div className="text-[13px] font-bold font-mono" style={{ color: d.profit < 0 ? '#EF4444' : '#10B981' }}>
                  {d.profit < 0 ? '-' : ''}${Math.abs(d.profit / 1e6).toFixed(0)}M
                </div>
              </div>
              <div className="text-center w-24">
                <div className="text-[10px] font-mono" style={{ color: 'var(--mr-text-faint)' }}>GP Carry (DBD)</div>
                <div className="text-[13px] font-bold font-mono" style={{ color: '#D4A847' }}>
                  ${(d.gpCarryIfDBD / 1e6).toFixed(1)}M
                </div>
              </div>
              <div className="text-center w-28">
                <div className="text-[10px] font-mono" style={{ color: 'var(--mr-text-faint)' }}>Over-Dist Risk</div>
                <div className="text-[13px] font-bold font-mono" style={{ color: d.overDistributionRisk > 0 ? '#EF4444' : '#10B981' }}>
                  {d.overDistributionRisk > 0 ? `$${(d.overDistributionRisk / 1e6).toFixed(0)}M` : 'None'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary comparison */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg text-center" style={{ background: '#10B98108', border: '1px solid #10B98120' }}>
            <div className="text-xs font-mono" style={{ color: '#10B981' }}>Whole-Fund Carry</div>
            <div className="text-xl font-bold font-mono" style={{ color: '#10B981' }}>${(totalWFCarry / 1e6).toFixed(1)}M</div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--mr-text-faint)' }}>After full return + pref</div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: '#EF444408', border: '1px solid #EF444420' }}>
            <div className="text-xs font-mono" style={{ color: '#EF4444' }}>Deal-by-Deal Carry</div>
            <div className="text-xl font-bold font-mono" style={{ color: '#EF4444' }}>${(totalDBDCarry / 1e6).toFixed(1)}M</div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--mr-text-faint)' }}>Sum of per-deal carry</div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: '#F59E0B08', border: '1px solid #F59E0B20' }}>
            <div className="text-xs font-mono" style={{ color: '#F59E0B' }}>Clawback Exposure</div>
            <div className="text-xl font-bold font-mono" style={{ color: '#F59E0B' }}>${(overDistRisk / 1e6).toFixed(0)}M</div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--mr-text-faint)' }}>TerraData loss creates risk</div>
          </div>
        </div>
      </SectionCard>

      {/* ILPA Best Practices */}
      <SectionCard title="ILPA Guidance & Best Practices">
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: 'Whole-Fund Preferred', desc: 'ILPA model LPA materials favor whole-fund structures for institutional investors. Fund IV aligns.', status: 'Aligned' },
            { title: 'Escrow/Holdback', desc: 'ILPA recommends escrow of 25-30% of carry distributions. Fund IV holds 30%.', status: 'Aligned' },
            { title: 'Clawback Enforcement', desc: 'Several liability for GP participants. Tax giveback provision to account for taxes paid on returned carry.', status: 'Aligned' },
            { title: 'Catch-Up Transparency', desc: 'Clear disclosure of catch-up mechanics, compounding method, and calculation methodology.', status: 'Aligned' },
          ].map((item) => (
            <div key={item.title} className="p-3 rounded-lg flex gap-3" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#10B98120', color: '#10B981' }}>
                <span className="text-xs">{'\u2713'}</span>
              </div>
              <div>
                <div className="text-[13px] font-bold" style={{ color: 'var(--mr-text)' }}>{item.title}</div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
