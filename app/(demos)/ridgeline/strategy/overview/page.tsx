'use client';

import { useState } from 'react';
import { COMPANY, DIVISIONS, REGIONS, getActiveBranches } from '@/data/ridgeline';
import { fmt, fmtM } from '@/lib/utils';

const activeBranches = getActiveBranches();
const totalRevenue = activeBranches.reduce((s, b) => s + b.annualRevenue, 0);
const totalEbitda = activeBranches.reduce((s, b) => s + b.ebitda, 0);

export default function DivisionOverviewPage() {
  const [activeDivision, setActiveDivision] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes barReveal { from { width: 0 } }
        @keyframes countUp { from { opacity: 0; transform: scale(0.8) } to { opacity: 1; transform: scale(1) } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 4px 12px rgba(30,58,95,0.2) } 50% { box-shadow: 0 4px 24px rgba(30,58,95,0.4) } }
        @keyframes ringDraw { from { stroke-dashoffset: 283 } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-12px) } to { opacity: 1; transform: translateX(0) } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F1D30 100%)', boxShadow: '0 4px 12px rgba(30,58,95,0.3)', animation: 'pulseGlow 3s ease-in-out infinite' }}
        >
          <span className="text-3xl text-white">&#9650;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#1E3A5F' }}>
            Act 1 &middot; Executive Strategy
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Division Overview
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {COMPANY.name} &middot; {COMPANY.hq}
          </p>
        </div>
      </div>

      {/* Hero KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Annual Revenue', value: `$${fmtM(COMPANY.annualRevenue * 1e6)}`, sub: 'FY2026', color: '#1E3A5F', icon: '📈' },
          { label: 'Branch Network', value: fmt(COMPANY.totalBranches), sub: `${COMPANY.totalStates} states`, color: '#2563EB', icon: '🏗️' },
          { label: 'Workforce', value: fmt(COMPANY.totalEmployees), sub: '2 divisions', color: '#10B981', icon: '👥' },
          { label: 'ICM Platform', value: COMPANY.currentICMVendor, sub: 'Enterprise SPM', color: '#F59E0B', icon: '⚙️' },
        ].map((kpi, i) => (
          <div
            key={kpi.label}
            className="rounded-xl border p-5 text-center"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--rl-shadow)', animation: `countUp ${0.3 + i * 0.1}s ease-out` }}
          >
            <div className="text-2xl mb-1">{kpi.icon}</div>
            <div className="text-2xl font-extrabold tabular-nums" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--rl-text-muted)' }}>{kpi.label}</div>
            <div className="text-[9px]" style={{ color: 'var(--rl-text-muted)' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Division Split — SVG Donut + Click-to-Drill */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.5s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-5" style={{ color: 'var(--rl-text-muted)' }}>
          Division Revenue Split — Click to drill into regions
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-8 items-start">
          {/* SVG Donut */}
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 100 100" className="w-48 h-48">
              {DIVISIONS.map((div, i) => {
                const total = DIVISIONS.reduce((s, d) => s + d.annualRevenue, 0);
                const pct = div.annualRevenue / total;
                const radius = 38;
                const circumference = 2 * Math.PI * radius;
                const offset = i === 0 ? 0 : (DIVISIONS.slice(0, i).reduce((s, d) => s + d.annualRevenue, 0) / total) * circumference;
                const isActive = activeDivision === div.id;

                return (
                  <circle
                    key={div.id}
                    cx="50" cy="50" r={radius}
                    fill="none"
                    stroke={div.color}
                    strokeWidth={isActive ? 16 : 12}
                    strokeDasharray={`${pct * circumference} ${circumference - pct * circumference}`}
                    strokeDashoffset={-offset}
                    transform="rotate(-90 50 50)"
                    style={{ cursor: 'pointer', transition: 'stroke-width 0.3s', animation: `ringDraw 1s ease-out ${i * 0.3}s both`, filter: isActive ? `drop-shadow(0 0 8px ${div.color}60)` : 'none' }}
                    onClick={() => setActiveDivision(isActive ? null : div.id)}
                  />
                );
              })}
              <text x="50" y="46" textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--rl-text)">
                ${fmtM(COMPANY.annualRevenue * 1e6)}
              </text>
              <text x="50" y="58" textAnchor="middle" fontSize="5" fill="var(--rl-text-muted)">
                total revenue
              </text>
            </svg>

            {/* Legend */}
            <div className="mt-3 space-y-2">
              {DIVISIONS.map((div) => (
                <button
                  key={div.id}
                  onClick={() => setActiveDivision(activeDivision === div.id ? null : div.id)}
                  className="flex items-center gap-2 text-left w-full rounded-lg px-2 py-1 transition-all"
                  style={{ background: activeDivision === div.id ? `${div.color}10` : 'transparent' }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: div.color }} />
                  <span className="text-[12px] font-bold" style={{ color: 'var(--rl-text)' }}>{div.shortName}</span>
                  <span className="text-[11px] tabular-nums ml-auto" style={{ color: div.color }}>${fmtM(div.annualRevenue * 1e6)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Division Detail / Region Bars */}
          <div className="space-y-4">
            {DIVISIONS.filter((d) => activeDivision === null || activeDivision === d.id).map((div, di) => {
              const divRegions = REGIONS.filter((r) => r.divisionId === div.id);
              const maxBranches = Math.max(...divRegions.map((r) => r.branchCount));

              return (
                <div
                  key={div.id}
                  className="rounded-xl border p-5"
                  style={{ borderColor: `${div.color}30`, borderLeft: `4px solid ${div.color}`, animation: `slideIn ${0.3 + di * 0.1}s ease-out` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-[15px] font-bold" style={{ color: 'var(--rl-text)' }}>{div.name}</h3>
                      <div className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>
                        {div.branchCount} branches &middot; {fmt(div.employeeCount)} employees
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-extrabold tabular-nums" style={{ color: div.color }}>${fmtM(div.annualRevenue * 1e6)}</div>
                      <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                        {((div.annualRevenue / COMPANY.annualRevenue) * 100).toFixed(0)}% of total
                      </div>
                    </div>
                  </div>

                  {/* Region bars */}
                  <div className="space-y-2">
                    {divRegions.map((r, ri) => (
                      <div key={r.id} className="flex items-center gap-3" style={{ animation: `slideIn ${0.2 + ri * 0.05}s ease-out` }}>
                        <div className="w-28 text-[11px] font-semibold truncate" style={{ color: 'var(--rl-text)' }}>{r.name}</div>
                        <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'var(--rl-stripe)' }}>
                          <div
                            className="h-full rounded-full flex items-center px-2"
                            style={{
                              width: `${(r.branchCount / maxBranches) * 100}%`,
                              background: `linear-gradient(90deg, ${r.color}80, ${r.color})`,
                              animation: `barReveal 0.6s ease-out ${ri * 0.08}s both`,
                            }}
                          >
                            <span className="text-[9px] font-bold text-white">{r.branchCount}</span>
                          </div>
                        </div>
                        <div className="w-20 text-[9px] tabular-nums text-right" style={{ color: 'var(--rl-text-muted)' }}>
                          {r.states.slice(0, 3).join(', ')}{r.states.length > 3 ? ` +${r.states.length - 3}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Verticals — Visual Cards */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.7s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Business Verticals
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Roofing', icon: '🏗️', pct: 62, color: '#1E3A5F' },
            { name: 'Landscaping', icon: '🌿', pct: 18, color: '#10B981' },
            { name: 'Pool Supplies', icon: '🏊', pct: 12, color: '#2563EB' },
            { name: 'Building Products', icon: '🔧', pct: 8, color: '#F59E0B' },
          ].map((v, i) => (
            <div
              key={v.name}
              className="rounded-xl border p-4 text-center"
              style={{ borderColor: 'var(--rl-border)', borderBottom: `3px solid ${v.color}`, animation: `fadeUp ${0.5 + i * 0.1}s ease-out` }}
            >
              <div className="text-3xl mb-2">{v.icon}</div>
              <div className="text-[14px] font-bold mb-1" style={{ color: 'var(--rl-text)' }}>{v.name}</div>
              <div className="w-full h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--rl-stripe)' }}>
                <div className="h-full rounded-full" style={{ width: `${v.pct}%`, background: v.color, animation: `barReveal 0.7s ease-out ${0.5 + i * 0.1}s both` }} />
              </div>
              <div className="text-[12px] font-extrabold tabular-nums" style={{ color: v.color }}>{v.pct}% of revenue</div>
            </div>
          ))}
        </div>
      </div>

      {/* ICM Platform Banner */}
      <div
        className="rounded-xl border p-5"
        style={{ background: 'linear-gradient(135deg, rgba(30,58,95,0.05), rgba(30,58,95,0.02))', borderColor: 'rgba(30,58,95,0.2)', animation: 'fadeUp 0.8s ease-out' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ background: '#1E3A5F' }}>
            <span className="text-white">⚙️</span>
          </div>
          <div>
            <div className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>
              Current ICM Platform: {COMPANY.currentICMVendor}
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--rl-text-muted)' }}>
              Managing incentive compensation across {fmt(COMPANY.totalBranches)} branches and {fmt(COMPANY.totalEmployees)} employees.
              Multi-entity complexity with continuous acquisitions requiring effective-dated master data.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
