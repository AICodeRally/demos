'use client';

import { ActNavigation, SectionCard, KpiCard } from '@/components/demos/meridian';
import { EXIT_PIPELINE, PORTFOLIO } from '@/data/meridian';

export default function ExitPlanningPage() {
  const totalExitNAV = EXIT_PIPELINE.reduce((s, e) => s + e.nav, 0);

  return (
    <>
      <ActNavigation currentAct={3} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
          Exit Planning &middot; Realization
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Exit Pipeline & Readiness
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <KpiCard label="Exit Pipeline NAV" value={`$${totalExitNAV}M`} accent="#D4A847" sub={`${EXIT_PIPELINE.length} companies`} stagger={0} />
        <KpiCard label="Near-Term Exits" value="2" accent="#10B981" sub="Next 12 months" stagger={1} />
        <KpiCard label="Avg Hold Period" value="3.2 yrs" accent="#3B82F6" sub="Portfolio average" stagger={2} />
        <KpiCard label="Target Net MOIC" value="2.0x+" accent="#8B5CF6" sub="Fund IV target" stagger={3} />
      </div>

      {/* Exit readiness cards */}
      <SectionCard title="Exit Readiness Assessment">
        <div className="space-y-4">
          {EXIT_PIPELINE.map((exit) => {
            const pc = PORTFOLIO.find((p) => p.name === exit.company);
            return (
              <div key={exit.company} className="p-4 rounded-lg border" style={{ borderColor: 'var(--mr-border)', background: 'var(--mr-card-alt)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[15px] font-bold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>{exit.company}</div>
                    <div className="text-xs font-mono" style={{ color: 'var(--mr-text-muted)' }}>
                      {exit.strategy} &middot; Target: {exit.timeline} &middot; NAV: ${exit.nav}M
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono" style={{ color: pc && pc.moic >= 1.5 ? '#10B981' : '#3B82F6' }}>
                      {pc?.moic.toFixed(2)}x
                    </div>
                    <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>MOIC</div>
                  </div>
                </div>

                {/* Readiness bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs font-mono mb-1" style={{ color: 'var(--mr-text-muted)' }}>
                    <span>Exit Readiness</span>
                    <span style={{ color: exit.readiness > 0.7 ? '#10B981' : '#F59E0B' }}>{(exit.readiness * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-3 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
                    <div className="h-full rounded-full" style={{ width: `${exit.readiness * 100}%`, background: exit.readiness > 0.7 ? '#10B981' : '#F59E0B' }} />
                  </div>
                </div>

                {/* Exit checklist */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { item: 'Vendor DD complete', done: exit.readiness > 0.5 },
                    { item: 'Management presentation', done: exit.readiness > 0.6 },
                    { item: 'Data room populated', done: exit.readiness > 0.4 },
                    { item: 'Banker selected', done: exit.readiness > 0.3 },
                    { item: 'Buyer list curated', done: exit.readiness > 0.5 },
                    { item: 'Board approval', done: exit.readiness > 0.8 },
                  ].map((c) => (
                    <div key={c.item} className="flex items-center gap-1.5 text-[12px]" style={{ color: c.done ? '#10B981' : 'var(--mr-text-faint)' }}>
                      <span>{c.done ? '\u2713' : '\u25CB'}</span>
                      <span>{c.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Exit Strategy Distribution */}
      <SectionCard title="Exit Strategy by Portfolio Company">
        <div className="grid grid-cols-2 gap-3">
          {(['Strategic Sale', 'Sponsor-to-Sponsor', 'IPO', 'Recapitalization', 'Hold'] as const).map((strategy) => {
            const companies = PORTFOLIO.filter((p) => p.exitStrategy === strategy);
            if (companies.length === 0) return null;
            const colors: Record<string, string> = { 'Strategic Sale': '#10B981', 'Sponsor-to-Sponsor': '#3B82F6', 'IPO': '#8B5CF6', 'Recapitalization': '#F59E0B', 'Hold': '#6B7280' };
            return (
              <div key={strategy} className="p-3 rounded-lg" style={{ background: `${colors[strategy]}06`, border: `1px solid ${colors[strategy]}20` }}>
                <div className="text-xs font-bold font-mono mb-2" style={{ color: colors[strategy] }}>{strategy}</div>
                {companies.map((c) => (
                  <div key={c.id} className="flex justify-between text-[12px] mb-1">
                    <span style={{ color: 'var(--mr-text)' }}>{c.name}</span>
                    <span className="font-mono" style={{ color: 'var(--mr-text-muted)' }}>{c.exitTimeline}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
