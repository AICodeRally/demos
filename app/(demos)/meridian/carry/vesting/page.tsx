'use client';

import { ActNavigation, SectionCard, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { TEAM, VESTING_SCHEDULE } from '@/data/meridian';

const LEVEL_COLORS: Record<string, string> = {
  Partner: '#D4A847',
  'Managing Director': '#3B82F6',
  Principal: '#8B5CF6',
  'Vice President': '#10B981',
  Associate: '#F59E0B',
};

export default function VestingPage() {
  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Avg Vested', value: `${(TEAM.reduce((s, t) => s + t.vestedPct, 0) / TEAM.length * 100).toFixed(0)}%`, status: 'green', detail: 'Team average' },
          { label: 'Unvested Pool', value: `$${(TEAM.reduce((s, t) => s + t.estimatedCarry * t.unvestedPct, 0) / 1e6).toFixed(0)}M`, status: 'amber', detail: 'Golden handcuffs' },
          { label: 'Cliff Period', value: '1 Year', status: 'green', detail: 'Standard cliff' },
          { label: 'Retention Risk', value: 'Low', status: 'green', detail: 'No departures pending' },
        ]}
      />

      {/* Hero */}
      <div className="mt-2 mb-8 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#0EA5E9' }}>
          Retention &middot; Vesting
        </div>
        <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Vesting Schedule & Retention
        </h1>
        <p className="text-[14px]" style={{ color: 'var(--mr-text-muted)' }}>
          5-year ratable vesting &middot; 1-year cliff &middot; 30% escrow holdback
        </p>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="Retention Architecture: Time-Based Alignment"
        insight="The vesting schedule is designed to lock in key talent through the critical value creation period. Accelerated vesting triggers on fund liquidation, change of control, or death/disability protect team interests while maintaining retention incentives."
        accentColor="#10B981"
        implications={[
          'Total unvested carry across the team creates significant departure cost — each year of additional tenure unlocks meaningful incremental value.',
          'The 30% escrow holdback extends economic alignment beyond the vesting period, protecting LPs against potential clawback scenarios.',
        ]}
      />

      {/* Vesting Schedule Visual */}
      <SectionCard title="Standard Vesting Schedule (5-Year, 1-Year Cliff)" variant="hero" accentColor="#D4A847">
        <div className="flex items-end gap-3 h-40 mb-4">
          {VESTING_SCHEDULE.map((v) => (
            <div key={v.year} className="flex-1 flex flex-col items-center">
              <div className="text-xs font-bold tabular-nums mb-1" style={{ color: '#D4A847' }}>{(v.pct * 100).toFixed(0)}%</div>
              <div
                className="w-full rounded-t-lg transition-all"
                style={{ height: `${v.pct * 100}%`, background: `linear-gradient(180deg, #D4A847, #D4A84740)` }}
              />
              <div className="text-xs tabular-nums mt-2" style={{ color: 'var(--mr-text-muted)' }}>Yr {v.year}</div>
            </div>
          ))}
        </div>
        <div className="text-[14px]" style={{ color: 'var(--mr-text-secondary)' }}>
          20% vests annually over 5 years with a 1-year cliff. Unvested carry forfeited on voluntary departure.
          Accelerated vesting on fund liquidation, change of control, or death/disability.
        </div>
      </SectionCard>

      {/* Individual Vesting Status */}
      <SectionCard title="Team Vesting Status" meta={`${TEAM.length} professionals`}>
        <div className="space-y-3">
          {TEAM.map((t, i) => (
            <div
              key={t.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in"
              style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)', animationDelay: `${i * 60}ms` }}
            >
              <div className="w-48 shrink-0">
                <div className="text-[13px] font-bold" style={{ color: 'var(--mr-text)' }}>{t.name}</div>
                <div className="text-xs" style={{ color: LEVEL_COLORS[t.level] }}>{t.level}</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs tabular-nums mb-1" style={{ color: 'var(--mr-text-muted)' }}>
                  <span>Vested: {(t.vestedPct * 100).toFixed(0)}%</span>
                  <span>Unvested: {(t.unvestedPct * 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'var(--mr-chart-bar-track)' }}>
                  <div className="h-full" style={{ width: `${t.vestedPct * 100}%`, background: '#10B981' }} />
                  <div className="h-full" style={{ width: `${t.unvestedPct * 100}%`, background: '#F59E0B40' }} />
                </div>
              </div>
              <div className="text-right w-28">
                <div className="text-xs" style={{ color: 'var(--mr-text-faint)' }}>Vested Carry</div>
                <div className="text-sm font-bold tabular-nums" style={{ color: '#10B981' }}>
                  ${((t.estimatedCarry * t.vestedPct) / 1e6).toFixed(1)}M
                </div>
              </div>
              <div className="text-right w-28">
                <div className="text-xs" style={{ color: 'var(--mr-text-faint)' }}>At Risk</div>
                <div className="text-sm font-bold tabular-nums" style={{ color: '#F59E0B' }}>
                  ${((t.estimatedCarry * t.unvestedPct) / 1e6).toFixed(1)}M
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Retention Analysis */}
      <div
        className="rounded-xl px-6 py-5 mt-2 animate-mr-fade-in"
        style={{
          background: 'rgba(212,168,71,0.06)',
          borderLeft: '3px solid #D4A847',
          boxShadow: 'var(--mr-shadow)',
          animationDelay: '400ms',
        }}
      >
        <div className="text-xs font-bold font-semibold mb-1" style={{ color: '#D4A847' }}>RETENTION INSIGHT</div>
        <p className="text-[14px]" style={{ color: 'var(--mr-text-secondary)' }}>
          Total unvested carry across the team: ${(TEAM.reduce((s, t) => s + t.estimatedCarry * t.unvestedPct, 0) / 1e6).toFixed(0)}M.
          This represents significant &ldquo;golden handcuffs&rdquo; — the cost of departure increases each year as carry vests.
          The 30% escrow holdback further extends retention incentives past the vesting period.
        </p>
      </div>
    </>
  );
}
