'use client';

import { useState } from 'react';
import { PERSONAS, EMPLOYEES, ROLE_COLORS, ROLE_LABELS } from '@/data/srs-blt';
import { BRANCH_STATS } from '@/data/srs-blt/branches';
import { fmtDollar } from '@/lib/utils';

const totalEbitda = EMPLOYEES.filter((e) => e.role === 'SVP').reduce((s, e) => s + e.ebitdaActual, 0);
const totalSales = EMPLOYEES.filter((e) => e.role === 'SVP').reduce((s, e) => s + e.salesActual, 0);

export default function SrsBltLanding() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.7 } }
        @keyframes slideRight { from { width: 0 } }
        @keyframes orbit { from { transform: rotate(0deg) translateX(90px) rotate(0deg) } to { transform: rotate(360deg) translateX(90px) rotate(-360deg) } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 8px rgba(5,150,105,0.15) } 50% { box-shadow: 0 0 20px rgba(5,150,105,0.3) } }
      `}</style>

      {/* Hero with animated stats */}
      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #0F2942 0%, #1E4D7B 100%)', boxShadow: '0 4px 14px rgba(15,41,66,0.3)' }}>
          <span className="text-3xl text-white">&#127970;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#059669' }}>SRS Distribution</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--sb-text)' }}>Branch Leadership Team</h1>
          <p className="text-[13px]" style={{ color: 'var(--sb-text-muted)' }}>
            {BRANCH_STATS.srsBranches} SRS + {BRANCH_STATS.heritageBranches} Heritage branches across {BRANCH_STATS.states} states
          </p>
        </div>
      </div>

      {/* Animated KPI Strip */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Branches', value: String(BRANCH_STATS.totalBranches), color: '#0F2942', sub: `${BRANCH_STATS.activeBranches} active` },
          { label: 'SRS Core', value: String(BRANCH_STATS.srsBranches), color: '#2563EB', sub: '10 regions' },
          { label: 'Heritage', value: String(BRANCH_STATS.heritageBranches), color: '#D97706', sub: '10 regions' },
          { label: 'YTD EBITDA', value: `$${(totalEbitda / 1e6).toFixed(0)}M`, color: '#059669', sub: `$${(totalSales / 1e6).toFixed(0)}M revenue` },
        ].map((kpi, i) => (
          <div key={kpi.label} className="rounded-xl border p-4 text-center"
            style={{ background: 'var(--sb-card)', borderColor: 'var(--sb-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--sb-shadow)', animation: `fadeUp ${0.3 + i * 0.1}s ease-out` }}>
            <div className="text-2xl font-extrabold tabular-nums" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-[10px] uppercase tracking-[1px] mt-1" style={{ color: 'var(--sb-text-muted)' }}>{kpi.label}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--sb-text-faint)' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Division Split Visualization — SVG */}
      <div className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--sb-card)', borderColor: 'var(--sb-border)', boxShadow: 'var(--sb-shadow)', animation: 'fadeUp 0.5s ease-out' }}>
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--sb-text-muted)' }}>
          Dual Division Structure
        </div>
        <svg viewBox="0 0 600 160" className="w-full">
          {/* SRS side */}
          <rect x="20" y="20" width={560 * (551 / 982)} height="50" rx="8" fill="#2563EB" opacity="0.15" style={{ animation: 'slideRight 0.8s ease-out' }} />
          <rect x="20" y="20" width={560 * (551 / 982)} height="50" rx="8" fill="none" stroke="#2563EB" strokeWidth="2" />
          <text x={20 + 560 * (551 / 982) / 2} y="42" textAnchor="middle" fontSize="14" fontWeight="800" fill="#2563EB">SRS Core</text>
          <text x={20 + 560 * (551 / 982) / 2} y="58" textAnchor="middle" fontSize="10" fill="#2563EB" opacity="0.7">551 branches</text>

          {/* Heritage side */}
          <rect x={20 + 560 * (551 / 982) + 4} y="20" width={560 * (431 / 982)} height="50" rx="8" fill="#D97706" opacity="0.15" style={{ animation: 'slideRight 0.8s ease-out 0.2s both' }} />
          <rect x={20 + 560 * (551 / 982) + 4} y="20" width={560 * (431 / 982)} height="50" rx="8" fill="none" stroke="#D97706" strokeWidth="2" />
          <text x={20 + 560 * (551 / 982) + 4 + 560 * (431 / 982) / 2} y="42" textAnchor="middle" fontSize="14" fontWeight="800" fill="#D97706">Heritage</text>
          <text x={20 + 560 * (551 / 982) + 4 + 560 * (431 / 982) / 2} y="58" textAnchor="middle" fontSize="10" fill="#D97706" opacity="0.7">431 branches</text>

          {/* Role hierarchy mini */}
          {(['SVP', 'RVP', 'RM', 'BM'] as const).map((role, i) => {
            const x = 80 + i * 140;
            const color = ROLE_COLORS[role];
            return (
              <g key={role}>
                <rect x={x} y="95" width="80" height="28" rx="6" fill={color} opacity="0.12" />
                <rect x={x} y="95" width="80" height="28" rx="6" fill="none" stroke={color} strokeWidth="1.5" />
                <text x={x + 40} y="113" textAnchor="middle" fontSize="9" fontWeight="700" fill={color}>{ROLE_LABELS[role].split(' ').map((w) => w[0]).join('')}</text>
                {i < 3 && <line x1={x + 80} y1="109" x2={x + 140} y2="109" stroke="var(--sb-border)" strokeWidth="1" strokeDasharray="4 3" />}
              </g>
            );
          })}
          <text x="300" y="145" textAnchor="middle" fontSize="8" fill="var(--sb-text-faint)">SVP &rarr; RVP &rarr; RM &rarr; BM hierarchy across both divisions</text>
        </svg>
      </div>

      {/* Persona Picker */}
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--sb-text-muted)' }}>
          Select a Persona to Explore
        </div>
        <div className="grid grid-cols-2 gap-4">
          {PERSONAS.map((persona, i) => {
            const isSelected = selectedPersona === persona.id;
            const isHovered = hoveredPersona === persona.id;
            const isAdmin = persona.type === 'admin';
            const color = isAdmin ? '#7C3AED' : '#059669';

            return (
              <button key={persona.id}
                onClick={() => setSelectedPersona(isSelected ? null : persona.id)}
                onMouseEnter={() => setHoveredPersona(persona.id)}
                onMouseLeave={() => setHoveredPersona(null)}
                className="text-left w-full"
                style={{ animation: `fadeUp ${0.4 + i * 0.1}s ease-out` }}>
                <div className="rounded-xl border p-5 transition-all"
                  style={{
                    background: isSelected ? `${color}08` : 'var(--sb-card)',
                    borderColor: isSelected || isHovered ? color : 'var(--sb-border)',
                    borderLeft: `4px solid ${color}`,
                    boxShadow: isSelected ? `0 0 16px ${color}15` : 'var(--sb-shadow)',
                    ...(isSelected ? { animation: 'glow 2s ease-in-out infinite' } : {}),
                  }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: color }}>
                      {persona.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-[14px] font-bold" style={{ color: 'var(--sb-text)' }}>{persona.name}</div>
                      <div className="text-[11px]" style={{ color: 'var(--sb-text-muted)' }}>{persona.title}</div>
                    </div>
                    <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${color}15`, color }}>
                      {persona.type}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--sb-text-muted)' }}>
                    {persona.description}
                  </p>

                  {/* Expanded detail */}
                  {isSelected && (
                    <div className="mt-3 pt-3 grid grid-cols-2 gap-3" style={{ borderTop: '1px solid var(--sb-border)', animation: 'fadeUp 0.2s ease-out' }}>
                      <div>
                        <div className="text-[9px] uppercase" style={{ color: 'var(--sb-text-faint)' }}>Default View</div>
                        <div className="text-[12px] font-semibold" style={{ color }}>{persona.defaultView}</div>
                      </div>
                      {persona.employeeRole && (
                        <div>
                          <div className="text-[9px] uppercase" style={{ color: 'var(--sb-text-faint)' }}>Role Level</div>
                          <div className="text-[12px] font-semibold" style={{ color: ROLE_COLORS[persona.employeeRole] }}>
                            {ROLE_LABELS[persona.employeeRole]}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-[9px] mt-2 text-right" style={{ color }}>
                    {isSelected ? '\u25B2 Less' : '\u25BC More detail'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Methodology note */}
      <div className="rounded-xl px-6 py-4 mt-4" style={{ background: 'rgba(15,41,66,0.05)', borderLeft: '3px solid #0F2942', animation: 'fadeUp 0.8s ease-out' }}>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--sb-text-muted)' }}>
          <strong style={{ color: 'var(--sb-text)' }}>SRS Distribution</strong> is a leading specialty trade distributor of roofing materials and building products,
          operating {BRANCH_STATS.totalBranches} branches across {BRANCH_STATS.states} states under two divisions: <strong style={{ color: '#2563EB' }}>SRS Core</strong> ({BRANCH_STATS.srsBranches} branches)
          and <strong style={{ color: '#D97706' }}>Heritage</strong> ({BRANCH_STATS.heritageBranches} acquired brand locations).
          The BLT system manages the full comp lifecycle: territory assignment, plan configuration, scorecard calculation, and payout governance.
        </p>
      </div>
    </>
  );
}
