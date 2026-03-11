'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import { SELLERS } from '@/data/proofline';
import { pct } from '@/lib/utils';

/* ── Milestone definitions ───────────────────── */
interface Milestone {
  week: number;
  label: string;
  description: string;
  color: string;
  icon: string;
}

const MILESTONES: Milestone[] = [
  { week: 1, label: 'Quarter Kickoff', description: 'New targets loaded. gates reset. Reps see fresh plan in mobile app. Manager 1:1 meetings set.', color: '#2563EB', icon: '\u{1F3AF}' },
  { week: 4, label: 'First Gate Check', description: 'Week 4 = 30% through quarter. Core gate trending visible. AI coaching cards generated for at-risk reps. Manager dashboard shows first red/yellow/green signals.', color: '#F59E0B', icon: '\u26A0' },
  { week: 7, label: 'Mid-Quarter Pivot', description: 'Mid-quarter visibility report published. Gate unlock actions assigned. Kicker eligibility projected. Territory adjustments applied. This is the "last chance to change trajectory" moment.', color: '#10B981', icon: '\u{1F504}' },
  { week: 10, label: 'Sprint to Close', description: 'Kicker windows open. Cinco de Mayo/Football/Holiday seasonals in play. High-frequency coaching for reps within 5pp of tier boundary. "Every case counts" messaging.', color: '#22C55E', icon: '\u{1F3C3}' },
  { week: 13, label: 'Quarter Close', description: 'Final attainment calculated. gates finalized. Tier assignments locked. Kicker payouts processed. True-up completed. Manager scorecards published. Next quarter preview loaded.', color: '#A855F7', icon: '\u2713' },
];

/* ── 13-Week Area Chart with Milestones (SVG) ── */
function StoryChart({ activeMilestone, onSelectMilestone }: { activeMilestone: number; onSelectMilestone: (i: number) => void }) {
  const w = 700, h = 240;
  const padL = 40, padR = 20, padT = 20, padB = 40;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  // Use Marcus (DAL-03) as the story protagonist
  const marcus = SELLERS.find(s => s.id === 'SEL-DAL-03')!;
  const data = marcus.weeklyAttainment;
  const max = 1.15;

  const toX = (week: number) => padL + (week / (data.length - 1)) * chartW;
  const toY = (val: number) => padT + chartH - (val / max) * chartH;

  // Build area path
  const linePath = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');
  const areaPath = linePath + ` L${toX(data.length - 1)},${toY(0)} L${toX(0)},${toY(0)} Z`;

  // "Before PROOFLINE" comparison line (flat, lower)
  const beforeData = data.map((v, i) => v * 0.82 + (Math.sin(i * 0.5) * 0.02)); // ~82% of actual with noise

  const beforePath = beforeData.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');

  return (
    <>
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      {/* Grid lines */}
      {[0.25, 0.50, 0.75, 1.00].map(val => (
        <g key={val}>
          <line x1={padL} y1={toY(val)} x2={w - padR} y2={toY(val)} stroke="#F1F5F9" strokeWidth="1" />
          <text x={padL - 6} y={toY(val) + 3} textAnchor="end" fontSize="12" fill="#A0AEC0" fontFamily="monospace">
            {(val * 100).toFixed(0)}%
          </text>
        </g>
      ))}

      {/* Target line at 100% */}
      <line x1={padL} y1={toY(1.0)} x2={w - padR} y2={toY(1.0)} stroke="#22C55E" strokeWidth="1.5" strokeDasharray="6 3" />
      <text x={w - padR + 4} y={toY(1.0) + 3} fontSize="12" fill="#22C55E" fontFamily="monospace">TARGET</text>

      {/* Before PROOFLINE area (gray) */}
      <path d={beforePath + ` L${toX(data.length - 1)},${toY(0)} L${toX(0)},${toY(0)} Z`} fill="rgba(160,174,192,0.08)" />
      <path d={beforePath} fill="none" stroke="#CBD5E0" strokeWidth="1.5" strokeDasharray="4 2" />

      {/* PROOFLINE area (copper) */}
      <path d={areaPath} fill="rgba(16,185,129,0.08)" />
      <path d={linePath} fill="none" stroke="#10B981" strokeWidth="2.5" />

      {/* Data dots */}
      {data.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r={i <= 8 ? 3 : 2} fill={i <= 8 ? '#10B981' : '#CBD5E0'} />
      ))}

      {/* Milestone markers */}
      {MILESTONES.map((m, i) => {
        const x = toX(m.week - 1);
        const y = toY(data[m.week - 1] ?? 0);
        const isActive = activeMilestone === i;

        return (
          <g key={m.week} className="cursor-pointer" onClick={() => onSelectMilestone(i)}>
            {/* Vertical line */}
            <line x1={x} y1={padT} x2={x} y2={h - padB} stroke={m.color} strokeWidth={isActive ? 2 : 1} strokeDasharray="3 2" opacity={isActive ? 1 : 0.4} />

            {/* Diamond marker */}
            <polygon
              points={`${x},${y - 8} ${x + 6},${y} ${x},${y + 8} ${x - 6},${y}`}
              fill={isActive ? m.color : 'white'} stroke={m.color} strokeWidth="2"
            />

            {/* Label */}
            <text x={x} y={h - padB + 14} textAnchor="middle" fontSize="12" fontWeight="bold" fill={m.color} fontFamily="monospace">
              W{m.week}
            </text>
            <text x={x} y={h - padB + 24} textAnchor="middle" fontSize="12" fill="#718096" fontFamily="monospace">
              {m.label.split(' ')[0]}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${padL + 10}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={20} y2={0} stroke="#10B981" strokeWidth="2" />
        <text x={24} y={3} fontSize="12" fill="#10B981" fontFamily="monospace">With PROOFLINE</text>
        <line x1={0} y1={14} x2={20} y2={14} stroke="#CBD5E0" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x={24} y={17} fontSize="12" fill="#A0AEC0" fontFamily="monospace">Before PROOFLINE</text>
      </g>

      {/* Week axis labels */}
      {data.map((_, i) => (
        <text key={i} x={toX(i)} y={h - padB + 8} textAnchor="middle" fontSize="12" fill="#CBD5E0" fontFamily="monospace">
          {i + 1}
        </text>
      ))}
    </svg>
    </>
  );
}

export default function ThirteenWeekStoryPage() {
  const [activeMilestone, setActiveMilestone] = useState(2); // Mid-Quarter Pivot

  const marcus = SELLERS.find(s => s.id === 'SEL-DAL-03')!;
  const ms = MILESTONES[activeMilestone];

  // Before/after metrics
  const beforeAfter = [
    { label: 'Avg Attainment', before: '84%', after: pct(marcus.attainment), improvement: '+17pp' },
    { label: 'Gate Unlock Rate', before: '1.2/4', after: '3.1/4', improvement: '+158%' },
    { label: 'Coaching Frequency', before: 'Monthly', after: 'Weekly AI', improvement: '4x' },
    { label: 'Visibility Lag', before: '3 weeks', after: 'Real-time', improvement: '-100%' },
  ];

  return (
    <>
    
      <ActNavigation currentAct={4} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#10B981' }}>
          The Narrative &middot; One Quarter in PROOFLINE
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A2E', fontFamily: 'var(--pl-font)' }}>
          The 13-Week Story
        </h1>
        <p className="text-[13px] mt-1" style={{ color: '#718096' }}>
          Follow Marcus Reyes through one quarter — from kickoff to close — and see how PROOFLINE transforms the journey.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3 mb-6 items-stretch">
        <LightKpiCard label="Current Week" value="Week 9" accent="#10B981" sub="69% through quarter" />
        <LightKpiCard label="Marcus Attainment" value={pct(marcus.attainment)} accent="#22C55E" sub="On track for T2" />
        <LightKpiCard label="Milestones Passed" value="3/5" accent="#2563EB" sub="Mid-Quarter Pivot complete" />
        <LightKpiCard label="Projected Close" value="101%" accent="#22C55E" sub="Above target" />
      </div>

      {/* Main Chart */}
      <LightSectionCard title="13-Week Journey — Click Milestones to Explore" className="mb-4">
        <StoryChart activeMilestone={activeMilestone} onSelectMilestone={setActiveMilestone} />
      </LightSectionCard>

      {/* Active Milestone Detail */}
      <LightSectionCard title={`${ms.icon} ${ms.label} — Week ${ms.week}`} className="mb-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-[20px]" style={{ background: `${ms.color}15` }}>
            {ms.icon}
          </div>
          <div className="flex-1">
            <p className="text-[13px] mb-3" style={{ color: '#4A5568' }}>{ms.description}</p>

            {/* Milestone timeline navigation */}
            <div className="flex gap-2">
              {MILESTONES.map((m, i) => (
                <button
                  key={m.week}
                  onClick={() => setActiveMilestone(i)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all"
                  style={{
                    background: activeMilestone === i ? m.color : '#F1F5F9',
                    color: activeMilestone === i ? 'white' : '#718096',
                  }}
                >
                  W{m.week}
                </button>
              ))}
            </div>
          </div>
        </div>
      </LightSectionCard>

      {/* Before / After Comparison */}
      <LightSectionCard title="Before vs. After PROOFLINE" className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Before */}
          <div className="rounded-lg p-4" style={{ background: '#F7FAFC', border: '1px solid #E2E8F0' }}>
            <div className="text-xs font-bold font-mono mb-3" style={{ color: '#A0AEC0' }}>BEFORE PROOFLINE</div>
            <div className="space-y-3">
              {beforeAfter.map(item => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-[13px]" style={{ color: '#718096' }}>{item.label}</span>
                  <span className="text-[13px] font-bold font-mono" style={{ color: '#A0AEC0' }}>{item.before}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs italic" style={{ color: '#A0AEC0' }}>
              Spreadsheet-based tracking. Monthly coaching. No real-time gate visibility. Reps discover attainment at quarter close.
            </div>
          </div>

          {/* After */}
          <div className="rounded-lg p-4" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="text-xs font-bold font-mono mb-3" style={{ color: '#10B981' }}>WITH PROOFLINE</div>
            <div className="space-y-3">
              {beforeAfter.map(item => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-[13px]" style={{ color: '#718096' }}>{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold font-mono" style={{ color: '#1A1A2E' }}>{item.after}</span>
                    <span className="text-xs font-bold font-mono px-1 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>
                      {item.improvement}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs italic" style={{ color: '#10B981' }}>
              Real-time dashboard. AI coaching cards weekly. Gate visibility from day 1. Reps can self-correct at any milestone.
            </div>
          </div>
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: '#A0AEC0' }}>
        The 13-Week Story follows Marcus Reyes (DAL-03) as a representative example. &quot;Before PROOFLINE&quot; estimates are based on
        industry benchmarks for spreadsheet-managed comp programs. 5 milestone check-ins align with Lone Star Beverage&apos;s management rhythm.
      </div>
    
    </>
  );
}
