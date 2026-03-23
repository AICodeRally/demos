'use client';

import { COMPANY, DIVISIONS, REGIONS, EMPLOYEES, BRANCHES, getActiveBranches } from '@/data/ridgeline';
import { fmt, fmtM, fmtDollar } from '@/lib/utils';

const activeBranches = getActiveBranches();
const totalRevenue = activeBranches.reduce((s, b) => s + b.annualRevenue, 0);
const totalEbitda = activeBranches.reduce((s, b) => s + b.ebitda, 0);
const totalEmployees = activeBranches.reduce((s, b) => s + b.employeeCount, 0);

export default function DivisionOverviewPage() {
  return (
    <>
      {/* Hero */}
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F1D30 100%)', boxShadow: '0 4px 12px rgba(30,58,95,0.3)' }}
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
            {COMPANY.name} &middot; {COMPANY.hq} &middot; A {COMPANY.parentCompany} Company
          </p>
        </div>
      </div>

      {/* Top-line KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `$${fmtM(COMPANY.annualRevenue * 1e6)}`, color: '#1E3A5F' },
          { label: 'Total Branches', value: fmt(COMPANY.totalBranches), color: '#2563EB' },
          { label: 'Total Employees', value: fmt(COMPANY.totalEmployees), color: '#10B981' },
          { label: 'States Covered', value: String(COMPANY.totalStates), color: '#F59E0B' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border p-5 text-center"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--rl-shadow)' }}
          >
            <div className="text-xs uppercase tracking-[1.5px] font-semibold mb-2" style={{ color: 'var(--rl-text-muted)' }}>
              {kpi.label}
            </div>
            <div className="text-2xl font-extrabold" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Division Breakdown */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Division Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {DIVISIONS.map((div) => {
            const divRegions = REGIONS.filter((r) => r.divisionId === div.id);
            return (
              <div
                key={div.id}
                className="rounded-lg border p-5"
                style={{ borderColor: 'var(--rl-border)', borderLeft: `4px solid ${div.color}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold" style={{ color: 'var(--rl-text)' }}>{div.shortName}</h3>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${div.color}15`, color: div.color }}
                  >
                    {div.branchCount} branches
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-[11px] uppercase text-gray-500">Revenue</div>
                    <div className="text-lg font-bold" style={{ color: 'var(--rl-text)' }}>${fmtM(div.annualRevenue * 1e6)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-gray-500">Employees</div>
                    <div className="text-lg font-bold" style={{ color: 'var(--rl-text)' }}>{fmt(div.employeeCount)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-gray-500">Regions</div>
                    <div className="text-lg font-bold" style={{ color: 'var(--rl-text)' }}>{divRegions.length}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  {divRegions.map((r) => (
                    <div key={r.id} className="flex items-center justify-between text-[12px] py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                        <span style={{ color: 'var(--rl-text)' }}>{r.name}</span>
                      </div>
                      <span className="tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>{r.branchCount} branches</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verticals */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Business Verticals
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COMPANY.verticals.map((v, i) => (
            <div
              key={v}
              className="rounded-lg border p-4 text-center"
              style={{ borderColor: 'var(--rl-border)' }}
            >
              <div className="text-2xl mb-2">{['🏗️', '🌿', '🏊', '🔧'][i]}</div>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--rl-text)' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ICM Platform Banner */}
      <div
        className="rounded-lg px-6 py-4"
        style={{ background: 'rgba(30,58,95,0.06)', borderLeft: '3px solid #1E3A5F' }}
      >
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--rl-text-secondary)' }}>
          <strong>Current ICM Platform:</strong> {COMPANY.currentICMVendor} &middot; Managing incentive compensation
          across {fmt(COMPANY.totalBranches)} branches and {fmt(COMPANY.totalEmployees)} employees.
          Multi-entity complexity with continuous acquisitions requiring effective-dated master data and reconciled transaction feeds.
        </p>
      </div>
    </>
  );
}
