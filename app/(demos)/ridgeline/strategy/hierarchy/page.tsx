'use client';

import { useState } from 'react';
import { EMPLOYEES, ROLE_HIERARCHY, getRoleHierarchy, getDirectReports, getEmployeesByRole } from '@/data/ridgeline';
import { fmtDollar } from '@/lib/utils';

const roleStats = getRoleHierarchy();

const ROLE_LABELS: Record<string, string> = {
  SVP: 'Senior Vice President', RVP: 'Regional Vice President', RSM: 'Regional Sales Manager',
  RM: 'Regional Manager', DM: 'District Manager', BD: 'Branch Director', BM: 'Branch Manager', ABM: 'Asst Branch Manager',
};

const ROLE_COLORS: Record<string, string> = {
  SVP: '#1E3A5F', RVP: '#2563EB', RSM: '#7C3AED', RM: '#10B981', DM: '#F59E0B', BD: '#EF4444', BM: '#06B6D4', ABM: '#94A3B8',
};

export default function OrgHierarchyPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const svps = getEmployeesByRole('SVP');
  const totalEmps = EMPLOYEES.filter((e) => e.attainment > 0).length;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes barReveal { from { width: 0 } }
        @keyframes nodeGrow { from { transform: scale(0); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes connectorDraw { from { height: 0 } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-10px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes pulseRing { 0%, 100% { box-shadow: 0 0 0 0 currentColor } 50% { box-shadow: 0 0 0 4px transparent } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F1D30 100%)', boxShadow: '0 4px 12px rgba(30,58,95,0.3)' }}
        >
          <span className="text-3xl text-white">&#9783;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#1E3A5F' }}>
            Act 1 &middot; Executive Strategy
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Organization Hierarchy
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {totalEmps} active employees &middot; 8-level hierarchy &middot; Click to expand
          </p>
        </div>
      </div>

      {/* Role Pyramid — SVG Visualization */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.5s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Role Pyramid — Hover for details
        </div>

        <div className="flex flex-col items-center gap-2">
          {roleStats.map((r, i) => {
            const maxWidth = 100;
            const width = 20 + (i / (roleStats.length - 1)) * (maxWidth - 20);
            const color = ROLE_COLORS[r.role];
            const isHovered = hoveredRole === r.role;

            return (
              <div
                key={r.role}
                className="flex items-center gap-4 w-full"
                style={{ animation: `fadeUp ${0.3 + i * 0.08}s ease-out` }}
                onMouseEnter={() => setHoveredRole(r.role)}
                onMouseLeave={() => setHoveredRole(null)}
              >
                <div className="w-12 text-right">
                  <span className="text-[10px] font-bold" style={{ color }}>{r.role}</span>
                </div>
                <div className="flex-1 flex justify-center">
                  <div
                    className="h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                    style={{
                      width: `${width}%`,
                      background: isHovered ? color : `${color}20`,
                      color: isHovered ? 'white' : color,
                      border: `2px solid ${isHovered ? color : `${color}40`}`,
                      boxShadow: isHovered ? `0 0 16px ${color}40` : 'none',
                      transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                    }}
                  >
                    <span className="text-[12px] font-bold">{r.count} {r.count === 1 ? 'person' : 'people'}</span>
                    {isHovered && r.avgAttainment > 0 && (
                      <span className="text-[10px] font-semibold ml-2">
                        | Avg: {r.avgAttainment}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-24 text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                  {ROLE_LABELS[r.role] ?? r.role}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Org Tree */}
      <div
        className="rounded-xl border p-6"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.6s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-5" style={{ color: 'var(--rl-text-muted)' }}>
          Leadership Tree — Click any leader to expand
        </div>

        <div className="space-y-4">
          {svps.map((svp, si) => {
            const reports = getDirectReports(svp.id);
            const isExpanded = expandedId === svp.id;
            const color = ROLE_COLORS.SVP;

            return (
              <div key={svp.id} style={{ animation: `fadeUp ${0.4 + si * 0.15}s ease-out` }}>
                {/* SVP Node */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : svp.id)}
                  className="w-full text-left"
                >
                  <div
                    className="rounded-xl border p-4 flex items-center gap-4 transition-all"
                    style={{
                      borderColor: isExpanded ? color : 'var(--rl-border)',
                      borderLeft: `4px solid ${color}`,
                      background: isExpanded ? `${color}05` : 'transparent',
                      boxShadow: isExpanded ? `0 0 16px ${color}15` : 'none',
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-extrabold text-[14px] shrink-0"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)`, animation: `nodeGrow ${0.3 + si * 0.15}s ease-out` }}
                    >
                      {svp.role}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-bold" style={{ color: 'var(--rl-text)' }}>{svp.name}</div>
                      <div className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>{svp.title}</div>
                      <div className="flex gap-4 mt-1 text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                        <span>{svp.branchCount} branches</span>
                        <span>EBITDA: {svp.ebitdaVsPlan}%</span>
                        <span>Sales: {svp.salesVsPlan}%</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-extrabold tabular-nums" style={{ color: svp.attainment >= 100 ? '#10B981' : '#F59E0B' }}>
                        {svp.attainment}%
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>attainment</div>
                      <div className="text-[10px] mt-1" style={{ color }}>
                        {isExpanded ? '▲ Collapse' : `▼ ${reports.length} reports`}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded tree */}
                {isExpanded && (
                  <div className="ml-6 mt-2 space-y-2 pl-4" style={{ borderLeft: `2px solid ${ROLE_COLORS.RVP}40` }}>
                    {reports.map((rvp, ri) => {
                      const rvpReports = getDirectReports(rvp.id);
                      const rvpExpanded = expandedId === rvp.id;
                      const rvpColor = ROLE_COLORS[rvp.role];

                      return (
                        <div key={rvp.id} style={{ animation: `slideIn ${0.2 + ri * 0.08}s ease-out` }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setExpandedId(rvpExpanded ? svp.id : rvp.id); }}
                            className="w-full text-left"
                          >
                            <div
                              className="rounded-lg border p-3 flex items-center gap-3 transition-all"
                              style={{ borderColor: rvpExpanded ? rvpColor : 'var(--rl-border)', borderLeft: `3px solid ${rvpColor}`, background: rvpExpanded ? `${rvpColor}05` : 'transparent' }}
                            >
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                                style={{ background: rvpColor }}
                              >
                                {rvp.role}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{rvp.name}</div>
                                <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>{rvp.title} &middot; {rvp.branchCount} branches</div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <div className="w-16 h-3 rounded-full overflow-hidden" style={{ background: 'var(--rl-stripe)' }}>
                                  <div className="h-full rounded-full" style={{ width: `${Math.min(rvp.attainment, 120)}%`, background: rvp.attainment >= 100 ? '#10B981' : '#F59E0B', animation: `barReveal 0.5s ease-out ${ri * 0.1}s both` }} />
                                </div>
                                <span className="text-[12px] font-bold tabular-nums w-12 text-right" style={{ color: rvp.attainment >= 100 ? '#10B981' : '#F59E0B' }}>
                                  {rvp.attainment}%
                                </span>
                                {rvpReports.length > 0 && (
                                  <span className="text-[9px]" style={{ color: rvpColor }}>{rvpExpanded ? '▲' : `▼ ${rvpReports.length}`}</span>
                                )}
                              </div>
                            </div>
                          </button>

                          {/* RSM+ level */}
                          {rvpExpanded && rvpReports.length > 0 && (
                            <div className="ml-6 mt-1 space-y-1 pl-3" style={{ borderLeft: `2px solid ${ROLE_COLORS[rvpReports[0]?.role || 'RSM']}30` }}>
                              {rvpReports.map((rep, rri) => {
                                const repColor = ROLE_COLORS[rep.role] || '#94A3B8';
                                const subReports = getDirectReports(rep.id);
                                return (
                                  <div key={rep.id}>
                                    <div
                                      className="rounded border p-2 flex items-center gap-2 text-[11px]"
                                      style={{ borderColor: 'var(--rl-border)', borderLeft: `2px solid ${repColor}`, animation: `slideIn ${0.15 + rri * 0.05}s ease-out` }}
                                    >
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white shrink-0" style={{ background: repColor }}>{rep.role}</span>
                                      <span className="font-semibold truncate" style={{ color: 'var(--rl-text)' }}>{rep.name}</span>
                                      <span className="text-[9px] truncate" style={{ color: 'var(--rl-text-muted)' }}>{rep.branchCount} br.</span>
                                      <div className="w-12 h-2 rounded-full overflow-hidden ml-auto shrink-0" style={{ background: 'var(--rl-stripe)' }}>
                                        <div className="h-full rounded-full" style={{ width: `${Math.min(rep.attainment, 120)}%`, background: rep.attainment >= 100 ? '#10B981' : '#F59E0B' }} />
                                      </div>
                                      <span className="font-bold tabular-nums w-10 text-right shrink-0" style={{ color: rep.attainment >= 100 ? '#10B981' : '#F59E0B' }}>
                                        {rep.attainment}%
                                      </span>
                                    </div>
                                    {/* Sub-reports (RM, DM, etc.) */}
                                    {subReports.length > 0 && (
                                      <div className="ml-5 mt-0.5 space-y-0.5 pl-2" style={{ borderLeft: `1px solid ${ROLE_COLORS[subReports[0].role] || '#94A3B8'}20` }}>
                                        {subReports.map((sr) => {
                                          const srColor = ROLE_COLORS[sr.role] || '#94A3B8';
                                          return (
                                            <div
                                              key={sr.id}
                                              className="rounded px-2 py-1 flex items-center gap-2 text-[10px]"
                                              style={{ background: 'var(--rl-stripe)' }}
                                            >
                                              <span className="text-[8px] font-bold px-1 py-0.5 rounded text-white" style={{ background: srColor }}>{sr.role}</span>
                                              <span className="font-semibold" style={{ color: 'var(--rl-text)' }}>{sr.name}</span>
                                              <span className="ml-auto font-bold tabular-nums" style={{ color: sr.attainment >= 100 ? '#10B981' : '#F59E0B' }}>
                                                {sr.attainment}%
                                              </span>
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
