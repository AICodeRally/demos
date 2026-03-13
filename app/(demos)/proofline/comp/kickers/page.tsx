'use client';

import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import { KICKERS, SELLERS, SPIRITS_ADDER } from '@/data/proofline';
import { fmt } from '@/lib/utils';

/* ── Kicker Timeline SVG ─────────────────────── */
function KickerTimeline() {
  const w = 700, h = 120;
  // Calendar spans Q2-Q4 (Apr-Dec = 9 months, weeks 14-52)
  const weekStart = 14, weekEnd = 52;
  const weekRange = weekEnd - weekStart;

  const toX = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
    const week = Math.floor(dayOfYear / 7);
    return 60 + ((week - weekStart) / weekRange) * (w - 80);
  };

  const kickerColors = ['#F59E0B', '#2563EB', '#10B981'];
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <>
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      {/* Month labels */}
      {months.map((m, i) => {
        const x = 60 + (i / months.length) * (w - 80);
        return (
          <g key={m}>
            <text x={x} y={14} fontSize="12" fill="var(--pl-text-faint)" fontFamily="monospace">{m}</text>
            <line x1={x} y1={20} x2={x} y2={h - 10} stroke="var(--pl-stripe)" strokeWidth="1" />
          </g>
        );
      })}

      {/* Timeline axis */}
      <line x1={60} y1={50} x2={w - 20} y2={50} stroke="var(--pl-border)" strokeWidth="2" />

      {/* Kicker bars */}
      {KICKERS.map((k, i) => {
        const x1 = toX(k.startDate);
        const x2 = toX(k.endDate);
        const color = kickerColors[i % kickerColors.length];
        const y = 35;

        return (
          <g key={k.id}>
            {/* Bar */}
            <rect x={x1} y={y} width={x2 - x1} height={30} rx={6} fill={`${color}20`} stroke={color} strokeWidth="1.5" />

            {/* Label */}
            <text x={(x1 + x2) / 2} y={y + 13} textAnchor="middle" fontSize="12" fontWeight="bold" fill={color} fontFamily="monospace">
              {k.name.length > 25 ? k.name.slice(0, 22) + '...' : k.name}
            </text>
            <text x={(x1 + x2) / 2} y={y + 24} textAnchor="middle" fontSize="12" fill="var(--pl-text-muted)" fontFamily="monospace">
              ${fmt(k.reward)} bonus
            </text>

            {/* Connector to detail */}
            <line x1={(x1 + x2) / 2} y1={y + 30} x2={(x1 + x2) / 2} y2={h - 18} stroke={color} strokeWidth="1" strokeDasharray="3 2" />
            <circle cx={(x1 + x2) / 2} cy={h - 15} r={3} fill={color} />
          </g>
        );
      })}

      {/* "Now" marker */}
      <g>
        <line x1={toX('2026-03-01')} y1={20} x2={toX('2026-03-01')} y2={h - 10} stroke="#F87171" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x={toX('2026-03-01')} y={h - 2} textAnchor="middle" fontSize="12" fill="#F87171" fontWeight="bold" fontFamily="monospace">NOW</text>
      </g>
    </svg>
    </>
  );
}

/* ── Projection Chart (13-week pacing with kicker window) ── */
function ProjectionChart({ kicker, color }: { kicker: typeof KICKERS[0]; color: string }) {
  const w = 300, h = 100;
  const maxY = 1.15;
  const target = 1.0;
  const kickerStart = 9; // week 10 (0-indexed)

  // 13-week projections: baseline (no kicker incentive) vs with kicker push
  const baseline  = [0.52, 0.56, 0.59, 0.63, 0.66, 0.69, 0.72, 0.75, 0.78, 0.81, 0.84, 0.87, 0.90];
  const withKick  = [0.52, 0.56, 0.59, 0.63, 0.66, 0.69, 0.72, 0.76, 0.80, 0.86, 0.93, 0.98, 1.04];

  const toSvgX = (i: number) => (i / 12) * w;
  const toSvgY = (v: number) => h - (v / maxY) * h;

  const basePath = baseline.map((v, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(i)},${toSvgY(v)}`).join(' ');
  const kickPath = withKick.map((v, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(i)},${toSvgY(v)}`).join(' ');

  // Confidence band (±5% around withKicker)
  const bandUp = withKick.map((v, i) => `${toSvgX(i)},${toSvgY(Math.min(v + 0.05, maxY))}`);
  const bandDn = [...withKick].reverse().map((v, i) => `${toSvgX(12 - i)},${toSvgY(Math.max(v - 0.05, 0))}`);
  const bandPath = `M${bandUp.join(' L')} L${bandDn.join(' L')} Z`;

  return (
    <>
    <svg viewBox={`0 0 ${w} ${h + 14}`} width={300} height={h + 14}>
      {/* Kicker window highlight */}
      <rect x={toSvgX(kickerStart)} y={0} width={toSvgX(12) - toSvgX(kickerStart)} height={h}
        fill={`${color}08`} stroke={`${color}30`} strokeWidth="1" strokeDasharray="3 2" />
      <text x={toSvgX(kickerStart) + 2} y={10} fontSize="12" fill={color} fontFamily="monospace" fontWeight="bold">KICKER WINDOW</text>

      {/* Target line */}
      <line x1={0} y1={toSvgY(target)} x2={w} y2={toSvgY(target)} stroke="#22C55E" strokeWidth="1" strokeDasharray="4 2" />
      <text x={w - 2} y={toSvgY(target) - 3} textAnchor="end" fontSize="12" fill="#22C55E" fontFamily="monospace">TARGET</text>

      {/* Confidence band */}
      <path d={bandPath} fill={`${color}08`} />

      {/* Baseline (without kicker) — dashed */}
      <path d={basePath} fill="none" stroke="#CBD5E0" strokeWidth="1.5" strokeDasharray="4 2" />

      {/* With-kicker line — solid */}
      <path d={kickPath} fill="none" stroke={color} strokeWidth="2" />

      {/* Delta annotation at week 13 */}
      <line x1={toSvgX(12) + 4} y1={toSvgY(baseline[12])} x2={toSvgX(12) + 4} y2={toSvgY(withKick[12])} stroke="#22C55E" strokeWidth="1.5" />
      <text x={toSvgX(12) + 8} y={(toSvgY(baseline[12]) + toSvgY(withKick[12])) / 2 + 3}
        fontSize="12" fontWeight="bold" fill="#22C55E" fontFamily="monospace">
        +{((withKick[12] - baseline[12]) * 100).toFixed(0)}pp
      </text>

      {/* End dots */}
      <circle cx={toSvgX(12)} cy={toSvgY(baseline[12])} r={2.5} fill="#CBD5E0" />
      <circle cx={toSvgX(12)} cy={toSvgY(withKick[12])} r={3} fill={withKick[12] >= target ? '#22C55E' : color} />

      {/* Week labels */}
      {[0, 3, 6, 9, 12].map(i => (
        <text key={i} x={toSvgX(i)} y={h + 10} textAnchor="middle" fontSize="12" fill="var(--pl-text-faint)" fontFamily="monospace">W{i + 1}</text>
      ))}

      {/* Legend */}
      <line x1={0} y1={h + 14} x2={12} y2={h + 14} stroke={color} strokeWidth="1.5" />
      <text x={14} y={h + 14} fontSize="12" fill="var(--pl-text-muted)" fontFamily="monospace" dominantBaseline="middle">w/ kicker</text>
      <line x1={60} y1={h + 14} x2={72} y2={h + 14} stroke="#CBD5E0" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x={74} y={h + 14} fontSize="12" fill="var(--pl-text-faint)" fontFamily="monospace" dominantBaseline="middle">baseline</text>
    </svg>
    </>
  );
}

export default function KickerModelingPage() {
  const totalKickerValue = KICKERS.reduce((s, k) => s + k.reward, 0);
  const totalEligible = KICKERS.reduce((s, k) => s + k.eligibleReps, 0);
  const avgBonusPerRep = totalKickerValue; // per rep if they qualify for all 3
  const kickerColors = ['#F59E0B', '#2563EB', '#10B981'];

  return (
    <>
    
      <ActNavigation currentAct={4} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#10B981' }}>
          Quarterly Kickers &middot; Bonus Incentives
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          Kicker Modeling
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {KICKERS.length} quarterly kickers &middot; Up to ${fmt(totalKickerValue)} per rep per year &middot; Brand-focused bonus opportunities
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <LightKpiCard label="Total Kicker Value" value={`$${fmt(totalKickerValue)}`} accent="#10B981" sub="Per qualifying rep/yr" stagger={0} />
        <LightKpiCard label="Active Kickers" value={String(KICKERS.length)} accent="#2563EB" sub="Q2, Q3, Q4" stagger={1} />
        <LightKpiCard label="Next Up" value={KICKERS[0].name.split(' ').slice(0, 2).join(' ')} accent="#F59E0B" sub={KICKERS[0].startDate} stagger={2} />
        <LightKpiCard label="Spirits Kicker" value={`$${fmt(KICKERS[2].reward)}`} accent="#10B981" sub="Holiday Q4 bonus" stagger={3} />
      </div>

      {/* Timeline */}
      <LightSectionCard title="Kicker Calendar" className="mb-4">
        <KickerTimeline />
      </LightSectionCard>

      {/* Kicker Detail Cards */}
      <div className="space-y-4 mb-6">
        {KICKERS.map((kicker, i) => {
          const color = kickerColors[i % kickerColors.length];
          const qualifyRate = kicker.eligibleReps / SELLERS.length;

          return (
            <LightSectionCard key={kicker.id} title={kicker.name} className="">
              <div className="flex gap-6">
                {/* Left: Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold tabular-nums px-2 py-0.5 rounded" style={{ background: `${color}15`, color }}>
                      {kicker.quarter}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--pl-text-muted)' }}>
                      {kicker.startDate} → {kicker.endDate}
                    </span>
                  </div>

                  <p className="text-[12px] mb-3" style={{ color: 'var(--pl-text-secondary)' }}>{kicker.description}</p>

                  <div className="rounded-md px-3 py-2 mb-3" style={{ background: 'var(--pl-card-alt)' }}>
                    <div className="text-xs font-bold tabular-nums mb-1" style={{ color: '#2563EB' }}>TARGET</div>
                    <p className="text-[13px]" style={{ color: 'var(--pl-text)' }}>{kicker.target}</p>
                  </div>

                  {/* Brand focus badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {kicker.brandFocus.map(b => (
                      <span key={b} className="text-xs px-2 py-0.5 rounded" style={{ background: `${color}10`, color }}>
                        {b.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Eligibility bar */}
                  <div className="flex items-center gap-2">
                    <div className="text-xs" style={{ color: 'var(--pl-text-muted)' }}>Eligibility:</div>
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: 'var(--pl-chart-bar-track)' }}>
                      <div className="h-full rounded-full" style={{ width: `${qualifyRate * 100}%`, background: color }} />
                    </div>
                    <div className="text-xs font-bold tabular-nums" style={{ color }}>
                      {kicker.eligibleReps}/{SELLERS.length} reps ({(qualifyRate * 100).toFixed(0)}%)
                    </div>
                  </div>
                </div>

                {/* Right: Reward + Projection */}
                <div className="flex-shrink-0 text-right" style={{ width: 320 }}>
                  <div className="text-[32px] font-bold tabular-nums mb-1" style={{ color }}>${fmt(kicker.reward)}</div>
                  <div className="text-xs mb-3" style={{ color: 'var(--pl-text-muted)' }}>bonus per qualifying rep</div>

                  <div className="text-xs font-bold tabular-nums mb-1 text-left" style={{ color: 'var(--pl-text-muted)' }}>PACING PROJECTION</div>
                  <ProjectionChart kicker={kicker} color={color} />

                  <div className="text-xs mt-1" style={{ color: 'var(--pl-text-faint)' }}>
                    Total payout if {kicker.eligibleReps} qualify: ${fmt(kicker.reward * kicker.eligibleReps)}
                  </div>
                </div>
              </div>
            </LightSectionCard>
          );
        })}
      </div>

      {/* Spirits Bonus Spotlight */}
      <LightSectionCard title="Spirits Bonus Stack" className="mb-6">
        <div className="rounded-xl p-4" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="text-[13px] font-bold mb-2" style={{ color: 'var(--pl-text)' }}>
            How Spirits Bonuses Stack
          </div>
          <p className="text-[13px] mb-3" style={{ color: 'var(--pl-text-muted)' }}>
            A rep who qualifies for the Holiday Spirits Showcase kicker AND maintains the 1.5% Sazerac adder earns from both:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--pl-card-alt)' }}>
              <div className="text-xs font-bold tabular-nums mb-1" style={{ color: '#10B981' }}>SPIRITS ADDER</div>
              <div className="text-[18px] font-bold tabular-nums" style={{ color: 'var(--pl-text)' }}>+{(SPIRITS_ADDER.rate * 100).toFixed(1)}%</div>
              <div className="text-xs" style={{ color: 'var(--pl-text-muted)' }}>on all Sazerac revenue</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--pl-card-alt)' }}>
              <div className="text-xs font-bold tabular-nums mb-1" style={{ color: '#10B981' }}>HOLIDAY KICKER</div>
              <div className="text-[18px] font-bold tabular-nums" style={{ color: 'var(--pl-text)' }}>${fmt(KICKERS[2].reward)}</div>
              <div className="text-xs" style={{ color: 'var(--pl-text-muted)' }}>Q4 bonus</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(34,197,94,0.04)' }}>
              <div className="text-xs font-bold tabular-nums mb-1" style={{ color: '#22C55E' }}>COMBINED IMPACT</div>
              <div className="text-[18px] font-bold tabular-nums" style={{ color: '#22C55E' }}>$2,920+</div>
              <div className="text-xs" style={{ color: 'var(--pl-text-muted)' }}>adder + kicker per Q4</div>
            </div>
          </div>
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[13px]" style={{ color: 'var(--pl-text-faint)' }}>
        Kickers are time-bound bonus incentives tied to seasonal events and supplier priorities. Eligibility is based on hitting
        specific volume or placement targets during the kicker window. Kicker bonuses are additive to base + variable + gate + spirits adder.
        Pacing projections use 4-week rolling averages within the kicker period.
      </div>
    
    </>
  );
}
