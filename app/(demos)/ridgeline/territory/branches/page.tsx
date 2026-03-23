'use client';

import { BRANCHES, getActiveBranches, REGIONS, getEmployeeById } from '@/data/ridgeline';
import { fmtM, fmtDollar, fmt } from '@/lib/utils';

const activeBranches = getActiveBranches();
const totalRevenue = activeBranches.reduce((s, b) => s + b.annualRevenue, 0);
const totalEbitda = activeBranches.reduce((s, b) => s + b.ebitda, 0);
const totalPlan = activeBranches.reduce((s, b) => s + b.ebitdaPlan, 0);
const overallEbitdaPct = ((totalEbitda / totalPlan) * 100).toFixed(1);

export default function BranchPerformancePage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
        >
          <span className="text-3xl text-white">&#128205;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#2563EB' }}>
            Act 2 &middot; Territory & Branch Ops
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Branch Performance
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {activeBranches.length} active branches &middot; EBITDA vs Plan: {overallEbitdaPct}%
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `$${fmtM(totalRevenue)}`, color: '#1E3A5F' },
          { label: 'Total EBITDA', value: `$${fmtM(totalEbitda)}`, color: '#10B981' },
          { label: 'EBITDA vs Plan', value: `${overallEbitdaPct}%`, color: parseFloat(overallEbitdaPct) >= 100 ? '#10B981' : '#F59E0B' },
          { label: 'Active Branches', value: String(activeBranches.length), color: '#2563EB' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border p-4 text-center"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--rl-shadow)' }}
          >
            <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-1" style={{ color: 'var(--rl-text-muted)' }}>{kpi.label}</div>
            <div className="text-xl font-extrabold" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Branch Table */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Branch Detail
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ color: 'var(--rl-text-muted)' }}>
                <th className="text-left font-semibold pb-3 pl-2">Branch</th>
                <th className="text-left font-semibold pb-3">Location</th>
                <th className="text-right font-semibold pb-3">Revenue</th>
                <th className="text-right font-semibold pb-3">EBITDA</th>
                <th className="text-right font-semibold pb-3">Plan</th>
                <th className="text-right font-semibold pb-3">vs Plan</th>
                <th className="text-right font-semibold pb-3 pr-2">Staff</th>
              </tr>
            </thead>
            <tbody>
              {activeBranches.map((b, i) => {
                const ebitdaPct = ((b.ebitda / b.ebitdaPlan) * 100).toFixed(1);
                const isAbove = b.ebitda >= b.ebitdaPlan;
                return (
                  <tr key={b.id} style={i % 2 === 0 ? { background: 'var(--rl-stripe)' } : undefined}>
                    <td className="py-2.5 pl-2">
                      <div className="font-semibold" style={{ color: 'var(--rl-text)' }}>{b.shortName}</div>
                      <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>{b.number}</div>
                    </td>
                    <td className="py-2.5" style={{ color: 'var(--rl-text-muted)' }}>{b.city}, {b.state}</td>
                    <td className="py-2.5 text-right tabular-nums font-semibold" style={{ color: 'var(--rl-text)' }}>
                      ${fmtM(b.annualRevenue)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums font-semibold" style={{ color: 'var(--rl-text)' }}>
                      ${fmtM(b.ebitda)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>
                      ${fmtM(b.ebitdaPlan)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums font-bold" style={{ color: isAbove ? '#10B981' : '#EF4444' }}>
                      {ebitdaPct}%
                    </td>
                    <td className="py-2.5 text-right tabular-nums pr-2" style={{ color: 'var(--rl-text)' }}>{b.employeeCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
