'use client';

import { EMPLOYEES, ROLE_HIERARCHY, getRoleHierarchy, getDirectReports, getEmployeesByRole } from '@/data/ridgeline';
import { fmt, fmtDollar } from '@/lib/utils';

const roleStats = getRoleHierarchy();

const ROLE_LABELS: Record<string, string> = {
  SVP: 'Senior Vice President',
  RVP: 'Regional Vice President',
  RSM: 'Regional Sales Manager',
  RM: 'Regional Manager',
  DM: 'District Manager',
  BD: 'Branch Director',
  BM: 'Branch Manager',
  ABM: 'Assistant Branch Manager',
};

const ROLE_COLORS: Record<string, string> = {
  SVP: '#1E3A5F',
  RVP: '#2563EB',
  RSM: '#7C3AED',
  RM: '#10B981',
  DM: '#F59E0B',
  BD: '#EF4444',
  BM: '#06B6D4',
  ABM: '#94A3B8',
};

export default function OrgHierarchyPage() {
  const svps = getEmployeesByRole('SVP');

  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
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
            SVP &rarr; RVP &rarr; RSM &rarr; RM &rarr; DM &rarr; BD &rarr; BM &rarr; ABM
          </p>
        </div>
      </div>

      {/* Role Summary Bar */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Role Distribution
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {roleStats.map((r) => (
            <div key={r.role} className="text-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-xs font-bold"
                style={{ background: ROLE_COLORS[r.role] }}
              >
                {r.role}
              </div>
              <div className="text-[12px] font-bold" style={{ color: 'var(--rl-text)' }}>{r.count}</div>
              <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                {r.avgAttainment > 0 ? `${r.avgAttainment}%` : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Org Tree */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Leadership Tree
        </h2>
        <div className="space-y-4">
          {svps.map((svp) => {
            const reports = getDirectReports(svp.id);
            return (
              <div key={svp.id}>
                {/* SVP Card */}
                <div
                  className="rounded-lg border p-4 mb-3"
                  style={{ borderColor: 'var(--rl-border)', borderLeft: `4px solid ${ROLE_COLORS.SVP}`, background: 'rgba(30,58,95,0.03)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ background: ROLE_COLORS.SVP }}>{svp.role}</span>
                        <span className="text-[15px] font-bold" style={{ color: 'var(--rl-text)' }}>{svp.name}</span>
                      </div>
                      <div className="text-[12px] mt-1" style={{ color: 'var(--rl-text-muted)' }}>{svp.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px]" style={{ color: 'var(--rl-text-muted)' }}>Attainment</div>
                      <div className="text-lg font-bold" style={{ color: svp.attainment >= 100 ? '#10B981' : '#F59E0B' }}>
                        {svp.attainment}%
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6 mt-3 text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>
                    <span>{svp.branchCount} branches</span>
                    <span>EBITDA vs Plan: {svp.ebitdaVsPlan}%</span>
                    <span>Sales vs Plan: {svp.salesVsPlan}%</span>
                    <span>Base: {fmtDollar(svp.baseSalary)}</span>
                  </div>
                </div>

                {/* RVP Reports */}
                <div className="ml-8 space-y-2">
                  {reports.map((rvp) => {
                    const rvpReports = getDirectReports(rvp.id);
                    return (
                      <div key={rvp.id}>
                        <div
                          className="rounded-lg border p-3 flex items-center justify-between"
                          style={{ borderColor: 'var(--rl-border)', borderLeft: `3px solid ${ROLE_COLORS.RVP}` }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: ROLE_COLORS.RVP }}>{rvp.role}</span>
                            <span className="text-[13px] font-semibold" style={{ color: 'var(--rl-text)' }}>{rvp.name}</span>
                            <span className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>&middot; {rvp.title}</span>
                          </div>
                          <div className="flex items-center gap-4 text-[11px]">
                            <span style={{ color: 'var(--rl-text-muted)' }}>{rvp.branchCount} branches</span>
                            <span className="font-bold" style={{ color: rvp.attainment >= 100 ? '#10B981' : '#F59E0B' }}>
                              {rvp.attainment}%
                            </span>
                          </div>
                        </div>

                        {/* RSM Reports */}
                        {rvpReports.length > 0 && (
                          <div className="ml-8 mt-1 space-y-1">
                            {rvpReports.map((rsm) => (
                              <div
                                key={rsm.id}
                                className="rounded border p-2 flex items-center justify-between text-[12px]"
                                style={{ borderColor: 'var(--rl-border)', borderLeft: `2px solid ${ROLE_COLORS[rsm.role]}` }}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-bold px-1 py-0.5 rounded text-white" style={{ background: ROLE_COLORS[rsm.role] }}>{rsm.role}</span>
                                  <span className="font-semibold" style={{ color: 'var(--rl-text)' }}>{rsm.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span style={{ color: 'var(--rl-text-muted)' }}>{rsm.branchCount} br.</span>
                                  <span className="font-bold" style={{ color: rsm.attainment >= 100 ? '#10B981' : '#F59E0B' }}>
                                    {rsm.attainment}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comp Plan Summary by Role */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Role-Level Compensation Summary
        </h2>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ color: 'var(--rl-text-muted)' }}>
              <th className="text-left font-semibold pb-2 pl-2">Role</th>
              <th className="text-left font-semibold pb-2">Full Title</th>
              <th className="text-right font-semibold pb-2">Headcount</th>
              <th className="text-right font-semibold pb-2">Avg Attainment</th>
            </tr>
          </thead>
          <tbody>
            {roleStats.map((r, i) => (
              <tr key={r.role} style={i % 2 === 0 ? { background: 'var(--rl-stripe)' } : undefined}>
                <td className="py-2 pl-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: ROLE_COLORS[r.role] }}>
                    {r.role}
                  </span>
                </td>
                <td className="py-2 font-semibold" style={{ color: 'var(--rl-text)' }}>{ROLE_LABELS[r.role] ?? r.role}</td>
                <td className="py-2 text-right tabular-nums font-bold" style={{ color: 'var(--rl-text)' }}>{r.count}</td>
                <td className="py-2 text-right tabular-nums font-bold" style={{ color: r.avgAttainment >= 100 ? '#10B981' : r.avgAttainment > 0 ? '#F59E0B' : 'var(--rl-text-muted)' }}>
                  {r.avgAttainment > 0 ? `${r.avgAttainment}%` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
