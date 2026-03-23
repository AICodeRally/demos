'use client';

import { useState } from 'react';
import { COMP_TIERS, EMPLOYEES, getTierByAttainment } from '@/data/ridgeline';

const repEmployees = EMPLOYEES.filter((e) => e.attainment > 0);
const tierDistribution = COMP_TIERS.map((tier) => {
  const reps = repEmployees.filter((e) => {
    const att = e.attainment / 100;
    return att >= tier.floor && att < tier.ceiling;
  });
  return { ...tier, reps, count: reps.length, pct: repEmployees.length > 0 ? ((reps.length / repEmployees.length) * 100).toFixed(0) : '0' };
});

export default function AttainmentTiersPage() {
  const [hoveredRep, setHoveredRep] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  // Build attainment points for SVG curve
  const curvePoints: { x: number; y: number; att: number; rate: number; color: string }[] = [];
  for (let att = 0; att <= 150; att += 1) {
    const tier = getTierByAttainment(att / 100);
    curvePoints.push({
      x: (att / 150) * 100,
      y: 100 - (tier.rate / 1.6) * 100,
      att,
      rate: tier.rate,
      color: tier.color,
    });
  }

  // Build SVG path for the stair-step curve
  const pathSegments: string[] = [];
  let prevY = curvePoints[0].y;
  curvePoints.forEach((pt, i) => {
    if (i === 0) {
      pathSegments.push(`M ${pt.x} ${pt.y}`);
    } else if (pt.y !== prevY) {
      pathSegments.push(`L ${pt.x} ${prevY}`);
      pathSegments.push(`L ${pt.x} ${pt.y}`);
    }
    prevY = pt.y;
  });
  pathSegments.push(`L 100 ${prevY}`);
  const curvePath = pathSegments.join(' ');
  const areaPath = curvePath + ' L 100 100 L 0 100 Z';

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes drawPath { from { stroke-dashoffset: 400 } to { stroke-dashoffset: 0 } }
        @keyframes areaFade { from { opacity: 0 } to { opacity: 0.15 } }
        @keyframes dotPop { from { r: 0; opacity: 0 } to { opacity: 1 } }
        @keyframes tierPulse { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.03) } }
        @keyframes repSlide { from { opacity: 0; transform: translateX(-10px) } to { opacity: 1; transform: translateX(0) } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
        >
          <span className="text-3xl text-white">&#128200;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#2563EB' }}>
            Act 3 &middot; Sales Comp & Incentives
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Attainment Tiers
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Payout curve with live rep positions &middot; {repEmployees.length} active reps
          </p>
        </div>
      </div>

      {/* Tier Cards — Interactive */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {tierDistribution.map((tier, idx) => {
          const isSelected = selectedTier === tier.level;
          return (
            <button
              key={tier.level}
              onClick={() => setSelectedTier(isSelected ? null : tier.level)}
              className="rounded-xl border p-5 text-center transition-all"
              style={{
                background: isSelected ? `${tier.color}15` : 'var(--rl-card)',
                borderColor: isSelected ? tier.color : 'var(--rl-border)',
                borderTop: `4px solid ${tier.color}`,
                boxShadow: isSelected ? `0 0 20px ${tier.color}30` : 'var(--rl-shadow)',
                animation: `fadeUp ${0.3 + idx * 0.1}s ease-out`,
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div className="text-xs uppercase tracking-[1.5px] font-semibold mb-2" style={{ color: tier.color }}>
                {tier.label}
              </div>
              <div className="text-4xl font-extrabold mb-1" style={{ color: tier.color }}>
                {tier.rate}x
              </div>
              <div className="text-[11px] tabular-nums mb-3" style={{ color: 'var(--rl-text-muted)' }}>
                {(tier.floor * 100).toFixed(0)}% &mdash; {tier.ceiling < 900 ? `${(tier.ceiling * 100).toFixed(0)}%` : 'Uncapped'}
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-extrabold text-white"
                  style={{ background: tier.color }}
                >
                  {tier.count}
                </div>
                <span className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>reps ({tier.pct}%)</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SVG Payout Curve with Rep Scatter */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.6s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Payout Curve — Rep Positions Mapped
        </div>

        <div className="relative">
          <svg viewBox="-8 -4 116 112" className="w-full" style={{ maxHeight: '360px' }}>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--rl-border)" strokeWidth="0.3" />
            ))}
            {[0, 20, 40, 53.3, 60, 76.7, 80, 100].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="var(--rl-border)" strokeWidth="0.2" strokeDasharray="2 2" />
            ))}

            {/* Tier zone fills */}
            {COMP_TIERS.map((tier) => {
              const x1 = (tier.floor / 1.5) * 100;
              const x2 = Math.min((tier.ceiling / 1.5) * 100, 100);
              return (
                <rect
                  key={tier.level}
                  x={x1}
                  y={0}
                  width={x2 - x1}
                  height={100}
                  fill={selectedTier === tier.level ? tier.color : tier.color}
                  opacity={selectedTier === tier.level ? 0.12 : 0.04}
                  style={{ transition: 'opacity 0.3s' }}
                />
              );
            })}

            {/* Area fill under curve */}
            <path d={areaPath} fill="url(#curveGradient)" style={{ animation: 'areaFade 1.2s ease-out both' }} />

            {/* Gradient def */}
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="53%" stopColor="#F59E0B" />
                <stop offset="67%" stopColor="#2563EB" />
                <stop offset="77%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>

            {/* Stair-step curve */}
            <path
              d={curvePath}
              fill="none"
              stroke="var(--rl-text)"
              strokeWidth="0.8"
              strokeDasharray="400"
              style={{ animation: 'drawPath 1.5s ease-out both' }}
            />

            {/* Rep scatter dots */}
            {repEmployees.map((emp, i) => {
              const att = emp.attainment / 100;
              const tier = getTierByAttainment(att);
              const x = (att / 1.5) * 100;
              const y = 100 - (tier.rate / 1.6) * 100;
              const isHovered = hoveredRep === emp.id;
              const isFiltered = selectedTier !== null && tier.level !== selectedTier;

              return (
                <g key={emp.id} style={{ opacity: isFiltered ? 0.15 : 1, transition: 'opacity 0.3s' }}>
                  <circle
                    cx={x}
                    cy={y - 2}
                    r={isHovered ? 3 : 2}
                    fill={tier.color}
                    stroke="white"
                    strokeWidth="0.5"
                    style={{
                      animation: `dotPop 0.4s ease-out ${0.8 + i * 0.05}s both`,
                      cursor: 'pointer',
                      filter: isHovered ? `drop-shadow(0 0 4px ${tier.color})` : 'none',
                      transition: 'r 0.2s, filter 0.2s',
                    }}
                    onMouseEnter={() => setHoveredRep(emp.id)}
                    onMouseLeave={() => setHoveredRep(null)}
                  />
                  {isHovered && (
                    <g>
                      <rect x={x - 18} y={y - 18} width="36" height="12" rx="2" fill="var(--rl-text)" opacity="0.9" />
                      <text x={x} y={y - 10} textAnchor="middle" fontSize="4" fill="white" fontWeight="700">
                        {emp.name.split(' ')[1]} {emp.attainment}%
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Y-axis labels */}
            <text x="-3" y="3" textAnchor="end" fontSize="3.5" fill="var(--rl-text-muted)">1.5x</text>
            <text x="-3" y="22" textAnchor="end" fontSize="3.5" fill="var(--rl-text-muted)">1.25x</text>
            <text x="-3" y="38" textAnchor="end" fontSize="3.5" fill="var(--rl-text-muted)">1.0x</text>
            <text x="-3" y="69" textAnchor="end" fontSize="3.5" fill="var(--rl-text-muted)">0.5x</text>
            <text x="-3" y="103" textAnchor="end" fontSize="3.5" fill="var(--rl-text-muted)">0x</text>

            {/* X-axis labels */}
            <text x="0" y="107" textAnchor="middle" fontSize="3.5" fill="var(--rl-text-muted)">0%</text>
            <text x="53.3" y="107" textAnchor="middle" fontSize="3.5" fill="var(--rl-text-muted)" fontWeight="700">80%</text>
            <text x="66.7" y="107" textAnchor="middle" fontSize="3.5" fill="var(--rl-text-muted)" fontWeight="700">100%</text>
            <text x="76.7" y="107" textAnchor="middle" fontSize="3.5" fill="var(--rl-text-muted)" fontWeight="700">115%</text>
            <text x="100" y="107" textAnchor="middle" fontSize="3.5" fill="var(--rl-text-muted)">150%</text>

            {/* Tier labels at top */}
            {COMP_TIERS.map((tier) => {
              const x1 = (tier.floor / 1.5) * 100;
              const x2 = Math.min((tier.ceiling / 1.5) * 100, 100);
              const cx = (x1 + x2) / 2;
              return (
                <text key={tier.level} x={cx} y={-1} textAnchor="middle" fontSize="3" fontWeight="700" fill={tier.color}>
                  {tier.label}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Rep Leaderboard — Visual, No Table */}
      <div
        className="rounded-xl border p-6"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.8s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Rep Attainment Ranking
        </div>

        <div className="space-y-2">
          {repEmployees
            .filter((e) => selectedTier === null || getTierByAttainment(e.attainment / 100).level === selectedTier)
            .sort((a, b) => b.attainment - a.attainment)
            .map((emp, i) => {
              const tier = getTierByAttainment(emp.attainment / 100);
              const barWidth = (emp.attainment / 120) * 100;
              const isHovered = hoveredRep === emp.id;

              return (
                <div
                  key={emp.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                  style={{
                    background: isHovered ? `${tier.color}10` : 'transparent',
                    animation: `repSlide ${0.3 + i * 0.04}s ease-out`,
                  }}
                  onMouseEnter={() => setHoveredRep(emp.id)}
                  onMouseLeave={() => setHoveredRep(null)}
                >
                  <div className="w-6 text-[12px] font-bold tabular-nums text-right" style={{ color: 'var(--rl-text-muted)' }}>
                    {i + 1}
                  </div>
                  <div className="w-28 truncate">
                    <div className="text-[12px] font-bold" style={{ color: 'var(--rl-text)' }}>{emp.name}</div>
                    <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>{emp.role} &middot; {emp.title.split(' — ')[1] || emp.title}</div>
                  </div>
                  <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'var(--rl-stripe)' }}>
                    <div
                      className="h-full rounded-full flex items-center px-2"
                      style={{
                        width: `${Math.min(barWidth, 100)}%`,
                        background: `linear-gradient(90deg, ${tier.color}90, ${tier.color})`,
                        animation: `barReveal 0.6s ease-out ${i * 0.04}s both`,
                      }}
                    >
                      <span className="text-[9px] font-bold text-white">{emp.attainment}%</span>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: `${tier.color}15`, color: tier.color }}
                  >
                    {tier.label} {tier.rate}x
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
