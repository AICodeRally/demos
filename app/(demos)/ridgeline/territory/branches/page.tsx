'use client';

import { useState } from 'react';
import { BRANCHES, getActiveBranches, getBranchesByRegion } from '@/data/ridgeline';
import { REGIONS, DIVISIONS } from '@/data/ridgeline';
import { fmtM } from '@/lib/utils';

const activeBranches = getActiveBranches();
const totalRevenue = activeBranches.reduce((s, b) => s + b.annualRevenue, 0);
const totalEbitda = activeBranches.reduce((s, b) => s + b.ebitda, 0);
const totalPlan = activeBranches.reduce((s, b) => s + b.ebitdaPlan, 0);
const overallPct = (totalEbitda / totalPlan) * 100;
const totalStaff = activeBranches.reduce((s, b) => s + b.employeeCount, 0);

// Sort by EBITDA attainment
const ranked = [...activeBranches].sort((a, b) => (b.ebitda / b.ebitdaPlan) - (a.ebitda / a.ebitdaPlan));
const topPerformers = ranked.slice(0, 5);
const bottomPerformers = ranked.slice(-3).reverse();

// Group by region for the strip
const regionGroups = REGIONS.filter((r) => getBranchesByRegion(r.id).length > 0).map((r) => ({
  region: r,
  branches: getBranchesByRegion(r.id),
  totalRevenue: getBranchesByRegion(r.id).reduce((s, b) => s + b.annualRevenue, 0),
  totalEbitda: getBranchesByRegion(r.id).reduce((s, b) => s + b.ebitda, 0),
  totalPlan: getBranchesByRegion(r.id).reduce((s, b) => s + b.ebitdaPlan, 0),
}));

export default function BranchPerformancePage() {
  const [view, setView] = useState<'all' | 'region'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const displayBranches = selectedRegion
    ? ranked.filter((b) => b.regionId === selectedRegion)
    : ranked;

  return (
    <>
      <style>{`
        @keyframes barGrow { from { width: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
          50% { box-shadow: 0 0 12px 2px rgba(16,185,129,0.15); }
        }
        .branch-row { animation: fadeUp 0.3s ease-out backwards; }
        .bar-fill { animation: barGrow 0.8s ease-out; }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-6 mt-6 mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#2563EB' }}>
            Act 2 &middot; Territory &amp; Branch Ops
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Branch Scoreboard
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {activeBranches.length} branches &middot; {totalStaff} employees &middot; EBITDA {overallPct.toFixed(1)}% of plan
          </p>
        </div>
      </div>

      {/* Headline KPIs — glass cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `$${fmtM(totalRevenue)}`, sub: 'Annual run rate', color: '#1E3A5F', icon: '📊' },
          { label: 'Total EBITDA', value: `$${fmtM(totalEbitda)}`, sub: `Plan: $${fmtM(totalPlan)}`, color: '#10B981', icon: '💰' },
          { label: 'EBITDA vs Plan', value: `${overallPct.toFixed(1)}%`, sub: overallPct >= 100 ? 'Above target' : 'Below target', color: overallPct >= 100 ? '#10B981' : '#EF4444', icon: '🎯' },
          { label: 'Active Branches', value: String(activeBranches.length), sub: `${regionGroups.length} regions`, color: '#2563EB', icon: '🏢' },
        ].map((kpi, i) => (
          <div
            key={kpi.label}
            className="rounded-2xl border p-5 relative overflow-hidden"
            style={{
              background: 'var(--rl-card)',
              borderColor: 'var(--rl-border)',
              boxShadow: `0 4px 20px ${kpi.color}12`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}80)` }}
            />
            <div
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full"
              style={{ background: kpi.color, opacity: 0.04 }}
            />
            <div className="text-[10px] uppercase tracking-[2px] font-semibold mb-2" style={{ color: 'var(--rl-text-muted)' }}>
              {kpi.label}
            </div>
            <div className="text-2xl font-extrabold tabular-nums mb-1" style={{ color: kpi.color }}>
              {kpi.value}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Top & Bottom Performers — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Top 5 */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: '3px solid #10B981', boxShadow: 'var(--rl-shadow)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏆</span>
            <h3 className="text-[12px] uppercase tracking-[2px] font-bold" style={{ color: '#10B981' }}>Top Performers</h3>
          </div>
          <div className="space-y-3">
            {topPerformers.map((b, i) => {
              const pct = (b.ebitda / b.ebitdaPlan) * 100;
              const region = REGIONS.find((r) => r.id === b.regionId);
              return (
                <div key={b.id} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[13px] font-extrabold shrink-0"
                    style={{
                      background: i === 0 ? 'linear-gradient(135deg, #F59E0B, #EAB308)' : i === 1 ? 'linear-gradient(135deg, #94A3B8, #CBD5E1)' : i === 2 ? 'linear-gradient(135deg, #D97706, #B45309)' : 'var(--rl-stripe)',
                      color: i < 3 ? 'white' : 'var(--rl-text-muted)',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{b.shortName}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: `${region?.color}15`, color: region?.color }}>
                          {region?.name.split(' ')[0]}
                        </span>
                      </div>
                      <span className="text-[13px] font-extrabold tabular-nums" style={{ color: '#10B981' }}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative h-2 rounded-full mt-1.5 overflow-hidden" style={{ background: 'var(--rl-stripe)' }}>
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bar-fill"
                        style={{
                          width: `${Math.min((pct / 130) * 100, 100)}%`,
                          background: 'linear-gradient(90deg, #10B981, #34D399)',
                          boxShadow: '0 0 8px rgba(16,185,129,0.4)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom 3 — needs attention */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: '3px solid #EF4444', boxShadow: 'var(--rl-shadow)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⚠️</span>
            <h3 className="text-[12px] uppercase tracking-[2px] font-bold" style={{ color: '#EF4444' }}>Needs Attention</h3>
          </div>
          <div className="space-y-4">
            {bottomPerformers.map((b) => {
              const pct = (b.ebitda / b.ebitdaPlan) * 100;
              const gap = b.ebitdaPlan - b.ebitda;
              const region = REGIONS.find((r) => r.id === b.regionId);
              return (
                <div
                  key={b.id}
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold" style={{ color: 'var(--rl-text)' }}>{b.shortName}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: `${region?.color}15`, color: region?.color }}>
                        {region?.name.split(' ')[0]}
                      </span>
                    </div>
                    <span className="text-[14px] font-extrabold tabular-nums" style={{ color: '#EF4444' }}>
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="relative h-3 rounded-full overflow-hidden mb-2" style={{ background: 'var(--rl-stripe)' }}>
                    {/* Plan marker at the scaled 100% position */}
                    <div className="absolute inset-y-0 rounded-full bar-fill" style={{ width: `${(pct / 110) * 100}%`, background: 'linear-gradient(90deg, #EF4444, #F87171)' }} />
                    <div className="absolute top-0 bottom-0 w-0.5" style={{ left: `${(100 / 110) * 100}%`, background: '#1E3A5F', opacity: 0.5 }} />
                  </div>
                  <div className="flex justify-between text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                    <span>EBITDA: ${fmtM(b.ebitda)}</span>
                    <span>Gap: <strong style={{ color: '#EF4444' }}>-${fmtM(gap)}</strong></span>
                    <span>Plan: ${fmtM(b.ebitdaPlan)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insight callout */}
          <div className="rounded-lg p-3 mt-4" style={{ background: 'rgba(239,68,68,0.04)', borderLeft: '3px solid #EF4444' }}>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--rl-text-muted)' }}>
              <strong style={{ color: '#EF4444' }}>Action Required:</strong> 3 branches below EBITDA plan.
              Combined gap of ${fmtM(bottomPerformers.reduce((s, b) => s + Math.max(0, b.ebitdaPlan - b.ebitda), 0))}.
              Territory reassignment or quota adjustment may be warranted.
            </p>
          </div>
        </div>
      </div>

      {/* Region Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => { setView('all'); setSelectedRegion(null); }}
          className="text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-all"
          style={{
            background: !selectedRegion ? '#2563EB' : 'var(--rl-stripe)',
            color: !selectedRegion ? 'white' : 'var(--rl-text-muted)',
          }}
        >
          All Branches
        </button>
        {regionGroups.map((rg) => (
          <button
            key={rg.region.id}
            onClick={() => { setView('region'); setSelectedRegion(rg.region.id); }}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5"
            style={{
              background: selectedRegion === rg.region.id ? rg.region.color : 'var(--rl-stripe)',
              color: selectedRegion === rg.region.id ? 'white' : 'var(--rl-text-muted)',
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: selectedRegion === rg.region.id ? 'white' : rg.region.color }} />
            {rg.region.name}
          </button>
        ))}
      </div>

      {/* Full Branch Scoreboard — Visual Bar Race */}
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--rl-text-muted)' }}>
            {selectedRegion ? `${REGIONS.find((r) => r.id === selectedRegion)?.name} Branches` : 'All Branches'} — EBITDA Race
          </h3>
          <div className="flex items-center gap-4 text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 rounded-full" style={{ background: '#10B981' }} /> Above plan
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 rounded-full" style={{ background: '#EF4444' }} /> Below plan
            </span>
            <span className="flex items-center gap-1">
              <span className="w-px h-3" style={{ background: 'var(--rl-text)' }} /> 100% line
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {displayBranches.map((b, i) => {
            const pct = (b.ebitda / b.ebitdaPlan) * 100;
            const isAbove = pct >= 100;
            const region = REGIONS.find((r) => r.id === b.regionId);
            const maxPct = 130; // scale bar to 130%
            return (
              <div
                key={b.id}
                className="branch-row flex items-center gap-3 group"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {/* Rank */}
                <div
                  className="w-6 text-right text-[11px] font-bold tabular-nums shrink-0"
                  style={{ color: 'var(--rl-text-muted)' }}
                >
                  {i + 1}
                </div>

                {/* Branch name + region dot */}
                <div className="w-28 shrink-0 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: region?.color }} />
                  <span className="text-[12px] font-semibold truncate" style={{ color: 'var(--rl-text)' }}>{b.shortName}</span>
                </div>

                {/* Bar */}
                <div className="flex-1 relative h-7 rounded-lg overflow-hidden" style={{ background: 'var(--rl-stripe)' }}>
                  {/* 100% line */}
                  <div
                    className="absolute top-0 bottom-0 w-px z-10"
                    style={{ left: `${(100 / maxPct) * 100}%`, background: 'var(--rl-text)', opacity: 0.2 }}
                  />
                  {/* Fill bar */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-lg bar-fill flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.min((pct / maxPct) * 100, 100)}%`,
                      background: isAbove
                        ? `linear-gradient(90deg, ${region?.color}CC, #10B981)`
                        : `linear-gradient(90deg, ${region?.color}CC, #EF4444)`,
                      animationDelay: `${i * 0.04}s`,
                      animationDuration: '0.6s',
                    }}
                  >
                    <span className="text-[10px] font-bold text-white drop-shadow-sm tabular-nums">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Revenue */}
                <div className="w-16 text-right shrink-0">
                  <div className="text-[11px] font-bold tabular-nums" style={{ color: 'var(--rl-text)' }}>${fmtM(b.annualRevenue)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Region Performance Heat Strip */}
      <div className="mt-6 rounded-2xl border p-5" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h3 className="text-[10px] uppercase tracking-[2px] font-bold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Region Heat Map — EBITDA vs Plan
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {regionGroups.map((rg) => {
            const pct = (rg.totalEbitda / rg.totalPlan) * 100;
            const isAbove = pct >= 100;
            // Heat intensity: green glow for above, red for below
            return (
              <button
                key={rg.region.id}
                onClick={() => setSelectedRegion(rg.region.id === selectedRegion ? null : rg.region.id)}
                className="rounded-xl p-4 text-center transition-all relative overflow-hidden"
                style={{
                  background: 'var(--rl-stripe)',
                  border: `2px solid ${selectedRegion === rg.region.id ? rg.region.color : 'transparent'}`,
                  boxShadow: isAbove ? `inset 0 0 30px rgba(16,185,129,0.06)` : `inset 0 0 30px rgba(239,68,68,0.06)`,
                  cursor: 'pointer',
                }}
              >
                {/* Glow dot */}
                <div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                  style={{
                    background: isAbove ? '#10B981' : '#EF4444',
                    boxShadow: isAbove ? '0 0 6px #10B981' : '0 0 6px #EF4444',
                  }}
                />
                <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: rg.region.color }}>
                  {rg.region.name}
                </div>
                <div className="text-2xl font-extrabold tabular-nums" style={{ color: isAbove ? '#10B981' : '#EF4444' }}>
                  {pct.toFixed(1)}%
                </div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--rl-text-muted)' }}>
                  ${fmtM(rg.totalEbitda)} / ${fmtM(rg.totalPlan)}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                  {rg.branches.length} branches
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
