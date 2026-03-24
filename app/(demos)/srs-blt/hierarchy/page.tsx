'use client';

import { useState } from 'react';
import { EMPLOYEES, getDirectReports, ROLE_COLORS, ROLE_LABELS } from '@/data/srs-blt';
import { fmtDollar, fmtM } from '@/lib/utils';

const svps = EMPLOYEES.filter((e) => e.role === 'SVP');

export default function HierarchyPage() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [divisionFilter, setDivisionFilter] = useState<'all' | 'SRS' | 'Heritage'>('all');

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = divisionFilter === 'all' ? svps : svps.filter((e) => e.division === divisionFilter);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes expandDown { from { max-height: 0; opacity: 0 } to { max-height: 800px; opacity: 1 } }
        @keyframes barReveal { from { width: 0 } }
        @keyframes nodeGlow { 0%, 100% { box-shadow: 0 0 6px rgba(5,150,105,0.1) } 50% { box-shadow: 0 0 14px rgba(5,150,105,0.25) } }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #0F2942 0%, #1E4D7B 100%)', boxShadow: '0 4px 12px rgba(15,41,66,0.3)' }}>
          <span className="text-3xl text-white">&#128101;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#059669' }}>Branch Operations</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--sb-text)' }}>Org Hierarchy</h1>
          <p className="text-[13px]" style={{ color: 'var(--sb-text-muted)' }}>
            {svps.length} SVPs &middot; Click to expand reporting tree &middot; Filter by division
          </p>
        </div>
      </div>

      {/* Division Filter */}
      <div className="flex gap-2 mb-6" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        {(['all', 'SRS', 'Heritage'] as const).map((div) => {
          const isActive = divisionFilter === div;
          const color = div === 'SRS' ? '#2563EB' : div === 'Heritage' ? '#D97706' : '#0F2942';
          return (
            <button key={div} onClick={() => setDivisionFilter(div)}
              className="px-4 py-2 rounded-lg text-[12px] font-bold transition-all"
              style={{
                background: isActive ? color : 'var(--sb-card)',
                color: isActive ? 'white' : color,
                border: `1.5px solid ${isActive ? color : 'var(--sb-border)'}`,
              }}>
              {div === 'all' ? 'All Divisions' : div}
            </button>
          );
        })}
      </div>

      {/* SVG Org Overview */}
      <div className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--sb-card)', borderColor: 'var(--sb-border)', boxShadow: 'var(--sb-shadow)', animation: 'fadeUp 0.5s ease-out' }}>
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--sb-text-muted)' }}>
          Executive Overview &mdash; {filtered.length} SVPs, {EMPLOYEES.filter((e) => e.role === 'RVP').length} RVPs
        </div>

        <svg viewBox="0 0 600 200" className="w-full">
          {/* CEO level */}
          <rect x="250" y="10" width="100" height="30" rx="6" fill="#0F2942" />
          <text x="300" y="29" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">CEO</text>

          {/* SVP nodes */}
          {filtered.map((svp, i) => {
            const x = 30 + i * (540 / Math.max(filtered.length, 1));
            const w = Math.min(120, 520 / filtered.length);
            const color = svp.division === 'SRS' ? '#2563EB' : '#D97706';
            const isHovered = hoveredId === svp.id;
            const isExpanded = expandedIds.has(svp.id);

            return (
              <g key={svp.id} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredId(svp.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => toggle(svp.id)}>
                {/* Connection line */}
                <line x1="300" y1="40" x2={x + w / 2} y2="70" stroke="var(--sb-border)" strokeWidth="1.5" strokeDasharray="4 3" />

                {/* Glow on hover */}
                {(isHovered || isExpanded) && (
                  <rect x={x - 2} y="68" width={w + 4} height="44" rx="10" fill="none" stroke={color} strokeWidth="2" opacity="0.3" />
                )}

                {/* Node */}
                <rect x={x} y="70" width={w} height="40" rx="8" fill={isHovered || isExpanded ? color : 'var(--sb-card)'} stroke={color} strokeWidth="1.5" />
                <text x={x + w / 2} y="85" textAnchor="middle" fontSize="8" fontWeight="700"
                  fill={isHovered || isExpanded ? 'white' : 'var(--sb-text)'}>{svp.name.split(' ')[0]}</text>
                <text x={x + w / 2} y="96" textAnchor="middle" fontSize="7"
                  fill={isHovered || isExpanded ? 'rgba(255,255,255,0.8)' : 'var(--sb-text-muted)'}>{svp.division} SVP</text>
                <text x={x + w / 2} y="106" textAnchor="middle" fontSize="6"
                  fill={isHovered || isExpanded ? 'rgba(255,255,255,0.7)' : 'var(--sb-text-faint)'}>{svp.branchCount} branches</text>

                {/* Direct report count */}
                {(() => {
                  const reports = getDirectReports(svp.id);
                  return reports.length > 0 ? (
                    <>
                      <line x1={x + w / 2} y1="110" x2={x + w / 2} y2="130" stroke={color} strokeWidth="1" strokeDasharray="3 2" />
                      <circle cx={x + w / 2} cy="135" r="8" fill={`${color}20`} stroke={color} strokeWidth="1" />
                      <text x={x + w / 2} y="138" textAnchor="middle" fontSize="7" fontWeight="700" fill={color}>{reports.length}</text>
                      <text x={x + w / 2} y="152" textAnchor="middle" fontSize="6" fill="var(--sb-text-faint)">RVPs</text>
                    </>
                  ) : null;
                })()}
              </g>
            );
          })}

          {/* Legend */}
          <circle cx="30" cy="180" r="5" fill="#2563EB" />
          <text x="40" y="183" fontSize="7" fill="var(--sb-text-muted)">SRS Core</text>
          <circle cx="110" cy="180" r="5" fill="#D97706" />
          <text x="120" y="183" fontSize="7" fill="var(--sb-text-muted)">Heritage</text>
          <text x="530" y="183" textAnchor="end" fontSize="6" fill="var(--sb-text-faint)">Click a node to expand</text>
        </svg>
      </div>

      {/* Expandable Hierarchy Cards */}
      <div className="space-y-3">
        {filtered.map((svp, idx) => {
          const reports = getDirectReports(svp.id);
          const isExpanded = expandedIds.has(svp.id);
          const divColor = svp.division === 'SRS' ? '#2563EB' : '#D97706';
          const attColor = svp.attainment >= 100 ? '#10B981' : svp.attainment >= 95 ? '#F59E0B' : '#EF4444';

          return (
            <div key={svp.id} style={{ animation: `fadeUp ${0.3 + idx * 0.08}s ease-out` }}>
              <button onClick={() => toggle(svp.id)} className="w-full text-left">
                <div className="rounded-xl border p-5 transition-all"
                  style={{
                    borderColor: isExpanded ? divColor : 'var(--sb-border)',
                    borderLeft: `4px solid ${divColor}`,
                    background: isExpanded ? `${divColor}05` : 'var(--sb-card)',
                    boxShadow: 'var(--sb-shadow)',
                  }}>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: `linear-gradient(135deg, ${ROLE_COLORS[svp.role]}, ${divColor})` }}>
                        {svp.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold" style={{ color: 'var(--sb-text)' }}>{svp.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${divColor}15`, color: divColor }}>{svp.division}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${ROLE_COLORS[svp.role]}15`, color: ROLE_COLORS[svp.role] }}>{svp.role}</span>
                        </div>
                        <div className="text-[11px]" style={{ color: 'var(--sb-text-muted)' }}>{svp.branchCount} branches &middot; {reports.length} direct reports</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-extrabold tabular-nums" style={{ color: attColor }}>{svp.attainment}%</div>
                      <div className="text-[9px]" style={{ color: 'var(--sb-text-muted)' }}>attainment</div>
                    </div>
                  </div>

                  {/* EBITDA bar */}
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="shrink-0 w-16" style={{ color: 'var(--sb-text-muted)' }}>EBITDA</span>
                    <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'var(--sb-stripe)' }}>
                      <div className="h-full rounded-full flex items-center px-2"
                        style={{
                          width: `${Math.min((svp.ebitdaActual / svp.ebitdaPlan) * 100, 100)}%`,
                          background: `linear-gradient(90deg, ${divColor}80, ${divColor})`,
                          animation: `barReveal 0.8s ease-out ${idx * 0.1}s both`,
                        }}>
                        <span className="text-[9px] font-bold text-white tabular-nums">{fmtM(svp.ebitdaActual)}</span>
                      </div>
                    </div>
                    <span className="shrink-0 text-[9px] tabular-nums" style={{ color: 'var(--sb-text-faint)' }}>/ {fmtM(svp.ebitdaPlan)}</span>
                  </div>

                  <div className="text-[9px] mt-2 text-right" style={{ color: divColor }}>
                    {isExpanded ? '\u25B2 Collapse' : `\u25BC ${reports.length} RVPs`}
                  </div>
                </div>
              </button>

              {/* Expanded: RVP children */}
              {isExpanded && reports.length > 0 && (
                <div className="ml-6 mt-2 space-y-2 border-l-2 pl-4" style={{ borderColor: `${divColor}30`, animation: 'fadeUp 0.3s ease-out' }}>
                  {reports.map((rvp, ri) => {
                    const rvpReports = getDirectReports(rvp.id);
                    const isRvpExpanded = expandedIds.has(rvp.id);
                    const rvpAttColor = rvp.attainment >= 100 ? '#10B981' : rvp.attainment >= 95 ? '#F59E0B' : '#EF4444';

                    return (
                      <div key={rvp.id}>
                        <button onClick={() => toggle(rvp.id)} className="w-full text-left"
                          style={{ animation: `fadeUp ${0.15 + ri * 0.06}s ease-out` }}>
                          <div className="rounded-lg border p-4 transition-all"
                            style={{
                              borderColor: isRvpExpanded ? ROLE_COLORS.RVP : 'var(--sb-border)',
                              borderLeft: `3px solid ${ROLE_COLORS.RVP}`,
                              background: isRvpExpanded ? `${ROLE_COLORS.RVP}05` : 'var(--sb-card)',
                            }}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                                  style={{ background: ROLE_COLORS.RVP }}>
                                  {rvp.name.split(' ').map((n) => n[0]).join('')}
                                </div>
                                <div>
                                  <span className="text-[13px] font-bold" style={{ color: 'var(--sb-text)' }}>{rvp.name}</span>
                                  <div className="text-[10px]" style={{ color: 'var(--sb-text-muted)' }}>
                                    {rvp.branchCount} branches &middot; {fmtDollar(rvp.incentiveTarget)} target
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="text-lg font-extrabold tabular-nums" style={{ color: rvpAttColor }}>{rvp.attainment}%</div>
                                </div>
                                <span className="text-[9px]" style={{ color: ROLE_COLORS.RVP }}>
                                  {isRvpExpanded ? '\u25B2' : `\u25BC ${rvpReports.length}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* RM children */}
                        {isRvpExpanded && rvpReports.length > 0 && (
                          <div className="ml-5 mt-1.5 space-y-1.5 border-l-2 pl-3" style={{ borderColor: `${ROLE_COLORS.RM}30`, animation: 'fadeUp 0.2s ease-out' }}>
                            {rvpReports.map((rm) => {
                              const rmAttColor = rm.attainment >= 100 ? '#10B981' : rm.attainment >= 95 ? '#F59E0B' : '#EF4444';
                              return (
                                <div key={rm.id} className="rounded-lg border p-3 flex items-center justify-between"
                                  style={{ borderLeft: `3px solid ${ROLE_COLORS.RM}`, borderColor: 'var(--sb-border)', background: 'var(--sb-card)' }}>
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                                      style={{ background: ROLE_COLORS.RM }}>
                                      {rm.name.split(' ').map((n) => n[0]).join('')}
                                    </div>
                                    <div>
                                      <span className="text-[12px] font-semibold" style={{ color: 'var(--sb-text)' }}>{rm.name}</span>
                                      <div className="text-[9px]" style={{ color: 'var(--sb-text-muted)' }}>{rm.branchCount} branches</div>
                                    </div>
                                  </div>
                                  <span className="text-[14px] font-extrabold tabular-nums" style={{ color: rmAttColor }}>{rm.attainment}%</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
