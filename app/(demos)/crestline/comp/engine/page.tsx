'use client';

import { StatCard, WaterfallChart } from '@/components/demos/crestline';
import { COMMISSION_COMPONENTS, COLORS, DRAW_CONFIG } from '@/data/crestline';
import { Zap, ArrowRight, Scale } from 'lucide-react';

const TYPE_BADGES: Record<string, { label: string; bg: string; fg: string }> = {
  percent_of: { label: 'percent_of', bg: '#dbeafe', fg: '#1d4ed8' },
  tiered: { label: 'tiered', bg: '#f3e8ff', fg: '#7c3aed' },
  calendar_bonus: { label: 'calendar_bonus', bg: '#fce7f3', fg: '#be185d' },
  carry_forward: { label: 'carry_forward', bg: '#fef3c7', fg: '#92400e' },
};

/* Sample calculation for Elena Vasquez (Platinum, Designer, $78K MTD sale) */
const SAMPLE_REP = 'Elena Vasquez';
const SAMPLE_SALE = 100000;
const SAMPLE_CALCS = [
  { stream: 'Basic Commission', rate: '5.0%', amount: 5000, detail: '$100K x 5.0% (Designer Apparel base rate)' },
  { stream: 'Premium Commission', rate: '3.5%', amount: 3500, detail: '$100K x 3.5% (Platinum additive rate)' },
  { stream: 'Counter Lead Bonus', rate: 'N/A', amount: 0, detail: 'Not applicable — Flagship format, not Counter' },
  { stream: 'Achiever Scorecard', rate: '0.5%', amount: 500, detail: '$100K x 0.5% (Platinum scorecard bonus)' },
  { stream: 'Negative Balance', rate: '0', amount: 0, detail: 'No negative balance to carry forward' },
];

const WATERFALL_DATA = [
  { label: 'Gross Sales', value: 100000, type: 'total' as const },
  { label: 'Basic (5%)', value: 5000, type: 'add' as const },
  { label: 'Premium (3.5%)', value: 3500, type: 'add' as const },
  { label: 'Scorecard (0.5%)', value: 500, type: 'add' as const },
  { label: 'Carry-Fwd', value: 0, type: 'subtract' as const },
  { label: 'Total Payout', value: 9000, type: 'total' as const },
];

const PIPELINE_COLORS = ['#2563eb', '#7c3aed', '#d946ef', '#059669', COLORS.accent];

export default function CommissionEngine() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--pl-text)' }}>Commission Engine</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          5-stream calculation pipeline — Phil Burnett Steps 2-6
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Components" value="5" color={COLORS.primary} />
        <StatCard label="Active Reps" value="3,200" color={COLORS.accent} />
        <StatCard label="Avg Commission Rate" value="5.8%" color="#7c3aed" />
        <StatCard label="Engine Latency" value="<50ms" color="#059669" />
      </div>

      {/* Pipeline Visualization */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <p className="text-sm font-semibold mb-6" style={{ color: 'var(--pl-text)' }}>
          Calculation Pipeline — 5 Connected Streams
        </p>

        <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
          {COMMISSION_COMPONENTS.map((comp, idx) => {
            const badge = TYPE_BADGES[comp.type];
            const calc = SAMPLE_CALCS[idx];
            const pipeColor = PIPELINE_COLORS[idx];

            return (
              <div key={comp.id} className="flex items-stretch shrink-0">
                <div
                  className="w-52 rounded-xl border-2 p-4 flex flex-col"
                  style={{ borderColor: pipeColor, backgroundColor: `${pipeColor}06` }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: pipeColor }}
                    >
                      {comp.philStep}
                    </div>
                    <span className="text-xs font-bold" style={{ color: 'var(--pl-text)' }}>
                      {comp.label}
                    </span>
                  </div>

                  {/* Type badge */}
                  <span
                    className="inline-block self-start text-[10px] px-2 py-0.5 rounded-full mb-2"
                    style={{ backgroundColor: badge.bg, color: badge.fg }}
                  >
                    {badge.label}
                  </span>

                  {/* Description */}
                  <p className="text-[11px] leading-snug mb-3 flex-1" style={{ color: 'var(--pl-text-secondary)' }}>
                    {comp.description}
                  </p>

                  {/* Sample calc */}
                  <div className="rounded-xl p-2" style={{ backgroundColor: `${pipeColor}10` }}>
                    <p className="text-[10px] font-semibold mb-0.5" style={{ color: pipeColor }}>
                      {SAMPLE_REP}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>{calc.detail}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: pipeColor }}>
                      {calc.amount > 0 ? `$${calc.amount.toLocaleString()}` : '$0'}
                    </p>
                  </div>
                </div>

                {/* Arrow connector */}
                {idx < COMMISSION_COMPONENTS.length - 1 && (
                  <div className="flex items-center px-1">
                    <ArrowRight size={18} style={{ color: '#CBD5E1' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs mt-4" style={{ color: 'var(--pl-text-muted)' }}>
          Sample: {SAMPLE_REP} (Platinum, Designer Apparel) on ${SAMPLE_SALE.toLocaleString()} commissionable sale
        </p>
      </div>

      {/* Waterfall: How $100K flows through streams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            $100K Sale: Commission Waterfall
          </p>
          <WaterfallChart data={WATERFALL_DATA} height={280} />
        </div>

        {/* Stream breakdown table */}
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Stream-by-Stream Breakdown
          </p>
          <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ color: 'var(--pl-text-muted)' }}>
                <th className="text-left pb-3 font-semibold">Stream</th>
                <th className="text-left pb-3 font-semibold">Rate</th>
                <th className="text-right pb-3 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_CALCS.map((c, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--pl-stripe)' }}>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: PIPELINE_COLORS[i] }}
                      />
                      <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{c.stream}</span>
                    </div>
                  </td>
                  <td className="py-2.5 tabular-nums" style={{ color: 'var(--pl-text-secondary)' }}>{c.rate}</td>
                  <td className="py-2.5 text-right font-semibold" style={{ color: c.amount > 0 ? PIPELINE_COLORS[i] : 'var(--pl-text-muted)' }}>
                    ${c.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2" style={{ borderColor: COLORS.primary }}>
                <td className="py-2.5 font-bold" style={{ color: 'var(--pl-text)' }}>Total Payout</td>
                <td className="py-2.5 tabular-nums" style={{ color: 'var(--pl-text-secondary)' }}>9.0%</td>
                <td className="py-2.5 text-right font-bold text-base" style={{ color: COLORS.accent }}>$9,000</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Component Registry */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
          Component Registry
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {COMMISSION_COMPONENTS.map((comp, i) => {
            const badge = TYPE_BADGES[comp.type];
            return (
              <div key={comp.id} className="rounded-xl border p-3" style={{ borderColor: 'var(--pl-border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: PIPELINE_COLORS[i] }}
                  >
                    {comp.philStep}
                  </div>
                  <span className="text-[11px] font-semibold truncate" style={{ color: 'var(--pl-text)' }}>
                    {comp.label}
                  </span>
                </div>
                <span
                  className="inline-block text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: badge.bg, color: badge.fg }}
                >
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Draw vs Commission Mechanic */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Scale size={18} style={{ color: COLORS.primary }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>
            Draw vs. Commission — &ldquo;Whichever Is Higher&rdquo;
          </p>
        </div>
        <p className="text-xs mb-5" style={{ color: 'var(--pl-text-secondary)' }}>
          Associates earn either their hourly draw rate or their commission on sales — whichever is greater.
          Sales Per Hour (SPH) is the gating metric: if SPH is too low, commission won&apos;t beat the draw.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {DRAW_CONFIG.map((dc) => (
            <div
              key={dc.format}
              className="rounded-xl border p-4"
              style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-bg)' }}
            >
              <p className="text-xs font-bold mb-2" style={{ color: 'var(--pl-text)' }}>{dc.format}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-lg font-bold tabular-nums" style={{ color: COLORS.accent }}>${dc.hourlyDraw}</span>
                <span className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>/hr draw</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-[10px]" style={{ color: 'var(--pl-text-secondary)' }}>Commission threshold:</span>
                <span className="text-xs font-bold tabular-nums" style={{ color: '#059669' }}>${dc.commissionThresholdSPH} SPH</span>
              </div>
              <p className="text-[10px] leading-snug" style={{ color: 'var(--pl-text-muted)' }}>{dc.description}</p>
            </div>
          ))}
        </div>

        {/* Visual: How SPH determines pay mode */}
        <div className="rounded-xl p-4" style={{ backgroundColor: `${COLORS.primary}06`, border: `1px solid ${COLORS.primary}15` }}>
          <p className="text-[11px] font-semibold mb-3" style={{ color: 'var(--pl-text)' }}>
            How It Works — Flagship Example ($20/hr draw, 5% Designer rate)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="rounded-xl p-3" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
              <p className="text-[10px] font-semibold mb-1" style={{ color: '#EF4444' }}>Below Draw</p>
              <p className="text-xs tabular-nums" style={{ color: 'var(--pl-text)' }}>SPH $300 &times; 5% = $15/hr</p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--pl-text-secondary)' }}>Earns draw: <strong>$20/hr</strong></p>
              <p className="text-[9px] mt-0.5" style={{ color: '#EF4444' }}>Commission doesn&apos;t beat draw</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: '#FEF9C3', border: '1px solid #FDE68A' }}>
              <p className="text-[10px] font-semibold mb-1" style={{ color: '#D97706' }}>At Threshold</p>
              <p className="text-xs tabular-nums" style={{ color: 'var(--pl-text)' }}>SPH $400 &times; 5% = $20/hr</p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--pl-text-secondary)' }}>Break-even: <strong>$20/hr</strong></p>
              <p className="text-[9px] mt-0.5" style={{ color: '#D97706' }}>Commission = draw exactly</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: '#D1FAE5', border: '1px solid #A7F3D0' }}>
              <p className="text-[10px] font-semibold mb-1" style={{ color: '#059669' }}>Making Commission</p>
              <p className="text-xs tabular-nums" style={{ color: 'var(--pl-text)' }}>SPH $600 &times; 5% = $30/hr</p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--pl-text-secondary)' }}>Earns commission: <strong>$30/hr</strong></p>
              <p className="text-[9px] mt-0.5" style={{ color: '#059669' }}>+$10/hr above draw</p>
            </div>
          </div>
        </div>
      </div>

      {/* Build vs Buy Callout */}
      <div
        className="rounded-xl border-2 p-6 flex items-start gap-4"
        style={{ borderColor: COLORS.accent, backgroundColor: `${COLORS.accent}08` }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${COLORS.accent}20` }}
        >
          <Zap size={20} style={{ color: COLORS.accent }} />
        </div>
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--pl-text)' }}>Build vs Buy</p>
          <p className="text-sm" style={{ color: 'var(--pl-text-secondary)' }}>
            This engine replaces <span className="font-semibold" style={{ color: 'var(--pl-text)' }}>7 custom-built services</span> identified
            in the Workday assessment. By unifying all 5 calculation streams into a single pipeline,
            Crestline eliminates rate synchronization errors, reduces payroll processing time by 60%,
            and provides real-time commission visibility to 3,200 associates.
          </p>
        </div>
      </div>
    </>
  );
}
