'use client';

import { ActNavigation, SectionCard, DonutChart } from '@/components/demos/meridian';
import { SECTOR_ALLOCATION, PORTFOLIO } from '@/data/meridian';

export default function SectorAnalysisPage() {
  const totalDeployed = SECTOR_ALLOCATION.reduce((s, sec) => s + sec.deployed, 0);
  const donutData = SECTOR_ALLOCATION.map((s) => ({ name: s.sector, value: s.deployed, color: s.color }));

  return (
    <>
      <ActNavigation currentAct={2} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#8B5CF6' }}>
          Sector Strategy &middot; Allocation
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Sector Analysis & Allocation
        </h1>
      </div>

      <SectionCard title="Capital Allocation by Sector">
        <div className="flex items-center gap-8">
          <DonutChart data={donutData} size={220} label={`$${(totalDeployed / 1e3).toFixed(1)}B`} />
          <div className="flex-1 space-y-3">
            {SECTOR_ALLOCATION.map((sec) => (
              <div key={sec.sector}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: sec.color }} />
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--mr-text)' }}>{sec.sector}</span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: sec.color }}>
                    ${sec.deployed}M / ${sec.target}M target
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(sec.deployed / sec.target) * 100}%`, background: sec.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Sector thesis cards */}
      <SectionCard title="Sector Investment Theses">
        <div className="grid grid-cols-2 gap-4">
          {[
            { sector: 'Healthcare Services', thesis: 'Fragmented physician practice management. Platform + bolt-on strategy. Aging demographics = secular tailwind. 30%+ IRR targets.', color: '#10B981', ev: '12-15x', growth: '15-20%' },
            { sector: 'Industrial Tech', thesis: 'Corporate carve-outs at complexity discount. Strong IP moats in automation, sensors, IoT. Operational improvement drives 200-400bp margin uplift.', color: '#3B82F6', ev: '10-14x', growth: '12-18%' },
            { sector: 'Financial Services', thesis: 'Insurance brokerage and wealth management consolidation. 90%+ revenue retention. Recurring fee income = premium multiples.', color: '#8B5CF6', ev: '14-18x', growth: '10-15%' },
            { sector: 'Technology', thesis: 'Vertical SaaS with 130%+ NDR. Capital-efficient growth. Cross-sell into existing portfolio. IPO-track potential.', color: '#F59E0B', ev: '15-20x', growth: '25-35%' },
          ].map((s) => (
            <div key={s.sector} className="p-4 rounded-lg" style={{ background: `${s.color}06`, border: `1px solid ${s.color}20` }}>
              <div className="text-[14px] font-bold mb-2" style={{ color: s.color }}>{s.sector}</div>
              <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'var(--mr-text-secondary)' }}>{s.thesis}</p>
              <div className="flex gap-4">
                <div>
                  <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>Entry EV/EBITDA</div>
                  <div className="text-sm font-bold font-mono" style={{ color: s.color }}>{s.ev}</div>
                </div>
                <div>
                  <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>Revenue Growth</div>
                  <div className="text-sm font-bold font-mono" style={{ color: s.color }}>{s.growth}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Concentration limits */}
      <div className="rounded-lg px-6 py-4" style={{ background: 'rgba(239,68,68,0.04)', borderLeft: '3px solid #EF4444' }}>
        <div className="text-xs font-bold font-mono mb-1" style={{ color: '#EF4444' }}>CONCENTRATION LIMITS (LPA)</div>
        <div className="grid grid-cols-3 gap-4 text-[13px]" style={{ color: 'var(--mr-text-secondary)' }}>
          <div>Single investment: <strong className="font-mono">max 20%</strong> of commitments</div>
          <div>Single sector: <strong className="font-mono">max 40%</strong> of commitments</div>
          <div>Single geography: <strong className="font-mono">max 30%</strong> of commitments</div>
        </div>
      </div>
    </>
  );
}
