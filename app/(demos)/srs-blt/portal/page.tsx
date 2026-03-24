'use client';

import { useState } from 'react';
import { BRANCHES, REGIONS, BRANCH_STATS, getBranchesByDivision, getBranchesByRegion } from '@/data/srs-blt/branches';
import { EMPLOYEES, ROLE_COLORS } from '@/data/srs-blt/employees';
import { fmtDollar, fmtM } from '@/lib/utils';

const allBranches = BRANCHES.filter((b) => b.status === 'ACTIVE');
const totalEbitdaActual = allBranches.reduce((s, b) => s + b.ebitdaActual, 0);
const totalEbitdaPlan = allBranches.reduce((s, b) => s + b.ebitdaPlan, 0);
const totalSalesActual = allBranches.reduce((s, b) => s + b.salesActual, 0);
const totalSalesPlan = allBranches.reduce((s, b) => s + b.salesPlan, 0);

export default function PortalPage() {
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [divisionFilter, setDivisionFilter] = useState<'all' | 'SRS' | 'Heritage'>('all');
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'ebitda' | 'sales'>('ebitda');

  let filtered = allBranches;
  if (divisionFilter !== 'all') filtered = filtered.filter((b) => b.division === divisionFilter);
  if (regionFilter) filtered = filtered.filter((b) => b.region === regionFilter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'ebitda') return b.ebitdaActual - a.ebitdaActual;
    if (sortBy === 'sales') return b.salesActual - a.salesActual;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes barReveal { from { width: 0 } }
        @keyframes countUp { from { opacity: 0 } to { opacity: 1 } }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
          <span className="text-3xl text-white">&#127970;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#059669' }}>Branch Operations</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--sb-text)' }}>Branch Portal</h1>
          <p className="text-[13px]" style={{ color: 'var(--sb-text-muted)' }}>
            {filtered.length} branches &middot; Filter by division and region &middot; Sort by performance
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'EBITDA Actual', value: fmtDollar(totalEbitdaActual), sub: `Plan: ${fmtDollar(totalEbitdaPlan)}`, color: '#059669', pct: ((totalEbitdaActual / totalEbitdaPlan) * 100).toFixed(0) },
          { label: 'Revenue', value: fmtDollar(totalSalesActual), sub: `Plan: ${fmtDollar(totalSalesPlan)}`, color: '#2563EB', pct: ((totalSalesActual / totalSalesPlan) * 100).toFixed(0) },
          { label: 'Active Branches', value: String(BRANCH_STATS.activeBranches), sub: `${BRANCH_STATS.greenfieldBranches} greenfield`, color: '#0F2942' },
          { label: 'Regions', value: String(BRANCH_STATS.regions), sub: `${BRANCH_STATS.states} states`, color: '#7C3AED' },
        ].map((kpi, i) => (
          <div key={kpi.label} className="rounded-xl border p-4 text-center"
            style={{ background: 'var(--sb-card)', borderColor: 'var(--sb-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--sb-shadow)', animation: `fadeUp ${0.3 + i * 0.1}s ease-out` }}>
            <div className="text-xl font-extrabold tabular-nums" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--sb-text-muted)' }}>{kpi.label}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--sb-text-faint)' }}>
              {kpi.sub}{kpi.pct ? ` (${kpi.pct}%)` : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6" style={{ animation: 'fadeUp 0.5s ease-out' }}>
        {/* Division filter */}
        {(['all', 'SRS', 'Heritage'] as const).map((div) => {
          const isActive = divisionFilter === div;
          const color = div === 'SRS' ? '#2563EB' : div === 'Heritage' ? '#D97706' : '#0F2942';
          return (
            <button key={div} onClick={() => setDivisionFilter(div)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
              style={{ background: isActive ? color : 'var(--sb-card)', color: isActive ? 'white' : color, border: `1.5px solid ${isActive ? color : 'var(--sb-border)'}` }}>
              {div === 'all' ? 'All' : div}
            </button>
          );
        })}
        <div className="w-px mx-1" style={{ background: 'var(--sb-border)' }} />
        {/* Region filter */}
        <button onClick={() => setRegionFilter(null)}
          className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
          style={{ background: !regionFilter ? '#7C3AED' : 'var(--sb-card)', color: !regionFilter ? 'white' : '#7C3AED', border: `1.5px solid ${!regionFilter ? '#7C3AED' : 'var(--sb-border)'}` }}>
          All Regions
        </button>
        {REGIONS.slice(0, 5).map((r) => (
          <button key={r.name} onClick={() => setRegionFilter(regionFilter === r.name ? null : r.name)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
            style={{ background: regionFilter === r.name ? '#7C3AED' : 'var(--sb-card)', color: regionFilter === r.name ? 'white' : 'var(--sb-text)', border: `1.5px solid ${regionFilter === r.name ? '#7C3AED' : 'var(--sb-border)'}` }}>
            {r.name}
          </button>
        ))}
        <div className="w-px mx-1" style={{ background: 'var(--sb-border)' }} />
        {/* Sort */}
        {(['ebitda', 'sales', 'name'] as const).map((s) => (
          <button key={s} onClick={() => setSortBy(s)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
            style={{ background: sortBy === s ? '#059669' : 'var(--sb-card)', color: sortBy === s ? 'white' : '#059669', border: `1.5px solid ${sortBy === s ? '#059669' : 'var(--sb-border)'}` }}>
            {s === 'ebitda' ? 'EBITDA' : s === 'sales' ? 'Revenue' : 'A-Z'}
          </button>
        ))}
      </div>

      {/* Region Performance Bars */}
      <div className="rounded-xl border p-6 mb-6"
        style={{ background: 'var(--sb-card)', borderColor: 'var(--sb-border)', boxShadow: 'var(--sb-shadow)', animation: 'fadeUp 0.5s ease-out' }}>
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--sb-text-muted)' }}>
          Branch Count by Region
        </div>
        <div className="space-y-2">
          {REGIONS.map((region, i) => {
            const total = region.srsBranches + region.heritageBranches;
            const maxTotal = Math.max(...REGIONS.map((r) => r.srsBranches + r.heritageBranches));
            const isActive = regionFilter === region.name;
            return (
              <button key={region.name} onClick={() => setRegionFilter(isActive ? null : region.name)}
                className="w-full flex items-center gap-3 text-left" style={{ animation: `fadeUp ${0.3 + i * 0.05}s ease-out` }}>
                <div className="w-28 text-[11px] font-semibold truncate" style={{ color: isActive ? '#7C3AED' : 'var(--sb-text)' }}>{region.name}</div>
                <div className="flex-1 h-6 rounded-lg overflow-hidden flex" style={{ background: 'var(--sb-stripe)' }}>
                  <div className="h-full flex items-center px-1.5"
                    style={{ width: `${(region.srsBranches / maxTotal) * 100}%`, background: '#2563EB', animation: `barReveal 0.6s ease-out ${i * 0.06}s both` }}>
                    <span className="text-[8px] font-bold text-white tabular-nums">{region.srsBranches}</span>
                  </div>
                  <div className="h-full flex items-center px-1.5"
                    style={{ width: `${(region.heritageBranches / maxTotal) * 100}%`, background: '#D97706', animation: `barReveal 0.6s ease-out ${i * 0.06 + 0.15}s both` }}>
                    <span className="text-[8px] font-bold text-white tabular-nums">{region.heritageBranches}</span>
                  </div>
                </div>
                <div className="w-8 text-[10px] font-bold tabular-nums text-right" style={{ color: 'var(--sb-text-muted)' }}>{total}</div>
              </button>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-[9px]" style={{ color: 'var(--sb-text-faint)' }}>
          <span><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: '#2563EB' }} />SRS Core</span>
          <span><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: '#D97706' }} />Heritage</span>
        </div>
      </div>

      {/* Branch Cards */}
      <div className="rounded-xl border p-6"
        style={{ background: 'var(--sb-card)', borderColor: 'var(--sb-border)', boxShadow: 'var(--sb-shadow)', animation: 'fadeUp 0.6s ease-out' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] uppercase tracking-[1.5px] font-semibold" style={{ color: 'var(--sb-text-muted)' }}>
            {sorted.length} Branches
          </div>
        </div>

        <div className="space-y-2">
          {sorted.map((branch, i) => {
            const isExpanded = expandedBranch === branch.id;
            const divColor = branch.division === 'SRS' ? '#2563EB' : '#D97706';
            const ebitdaPct = (branch.ebitdaActual / branch.ebitdaPlan) * 100;
            const ebitdaColor = ebitdaPct >= 100 ? '#10B981' : ebitdaPct >= 95 ? '#F59E0B' : '#EF4444';
            const manager = branch.managerId ? EMPLOYEES.find((e) => e.id === branch.managerId) : null;

            return (
              <button key={branch.id} onClick={() => setExpandedBranch(isExpanded ? null : branch.id)}
                className="w-full text-left" style={{ animation: `fadeUp ${0.3 + i * 0.04}s ease-out` }}>
                <div className="rounded-lg border p-4 transition-all"
                  style={{ borderLeft: `4px solid ${divColor}`, borderColor: isExpanded ? divColor : 'var(--sb-border)', background: isExpanded ? `${divColor}05` : 'transparent' }}>

                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: `${divColor}15`, color: divColor }}>#{branch.number}</span>
                      <span className="text-[13px] font-bold" style={{ color: 'var(--sb-text)' }}>{branch.name}</span>
                      {branch.status !== 'ACTIVE' && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#F59E0B15', color: '#F59E0B' }}>{branch.status}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] font-extrabold tabular-nums" style={{ color: ebitdaColor }}>{ebitdaPct.toFixed(0)}%</span>
                      <span className="text-[9px]" style={{ color: divColor }}>{isExpanded ? '\u25B2' : '\u25BC'}</span>
                    </div>
                  </div>

                  <div className="flex gap-6 text-[10px]" style={{ color: 'var(--sb-text-muted)' }}>
                    <span>{branch.region} &middot; {branch.state}</span>
                    <span>EBITDA: <strong className="tabular-nums" style={{ color: ebitdaColor }}>{fmtDollar(branch.ebitdaActual)}</strong></span>
                    <span>Sales: <strong className="tabular-nums" style={{ color: 'var(--sb-text)' }}>{fmtDollar(branch.salesActual)}</strong></span>
                    {manager && <span>Mgr: <strong style={{ color: 'var(--sb-text)' }}>{manager.name}</strong></span>}
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 grid grid-cols-4 gap-4" style={{ borderTop: '1px solid var(--sb-border)', animation: 'fadeUp 0.2s ease-out' }}>
                      <div>
                        <div className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--sb-text-faint)' }}>EBITDA Plan</div>
                        <div className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--sb-text)' }}>{fmtDollar(branch.ebitdaPlan)}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--sb-text-faint)' }}>Sales Plan</div>
                        <div className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--sb-text)' }}>{fmtDollar(branch.salesPlan)}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--sb-text-faint)' }}>Credit Region</div>
                        <div className="text-[13px] font-bold" style={{ color: divColor }}>{branch.creditRegion}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--sb-text-faint)' }}>Division</div>
                        <div className="text-[13px] font-bold" style={{ color: divColor }}>{branch.division}</div>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
