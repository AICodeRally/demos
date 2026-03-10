'use client';

import { StatCard } from '@/components/demos/crestline';
import { SELLING_DEPTS, PRODUCTS, FORMATS, COLORS } from '@/data/crestline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

/* Chart data: base commission rates by selling dept */
const DEPT_RATE_DATA = [
  { name: 'Cosmetics', rate: 8 },
  { name: 'Designer', rate: 6.5 },
  { name: 'Shoes', rate: 5 },
  { name: 'Accessories', rate: 4.5 },
  { name: 'Home', rate: 4 },
];

/* Rate change history for Cosmetics (3 effective-date periods) */
const RATE_HISTORY = [
  { period: 'Jan-Mar', cosmetics: 7.0, designer: 5.5, shoes: 4.5 },
  { period: 'Apr-Jun', cosmetics: 7.5, designer: 6.0, shoes: 4.8 },
  { period: 'Jul-Dec', cosmetics: 8.0, designer: 6.5, shoes: 5.0 },
];

/* Effective-dated rate schedule: 3 periods per year */
const RATE_PERIODS = [
  { label: 'Jan 1 - Mar 31', start: '2026-01-01', end: '2026-03-31', current: false },
  { label: 'Apr 1 - Jun 30', start: '2026-04-01', end: '2026-06-30', current: true },
  { label: 'Jul 1 - Dec 31', start: '2026-07-01', end: '2026-12-31', current: false },
];

/* Simulated rate adjustments per period per dept (multiplier on base) */
const RATE_ADJUSTMENTS: Record<string, number[]> = {
  cosmetics:    [1.0, 1.0, 1.02],
  designer:     [0.95, 1.0, 1.0],
  shoes:        [1.0, 1.0, 0.98],
  accessories:  [1.0, 1.05, 1.05],
  home:         [0.90, 1.0, 1.0],
};

/* Comp plan assignments by format */
const COMP_PLANS = [
  { format: 'Flagship', plan: 'Tiered + Achiever Accelerators', description: 'Full 5-stream engine with all Achiever tiers and scorecard bonuses', streams: 5, color: COLORS.flagship },
  { format: 'Standard', plan: 'Tiered Commission', description: 'Basic + Premium commission streams; Achiever eligible', streams: 4, color: COLORS.standard },
  { format: 'Rack', plan: 'Flat + Volume Bonus', description: 'Flat rate per transaction with quarterly volume bonus tier', streams: 2, color: COLORS.rack },
  { format: 'Counter', plan: 'Base + Counter Lead Bonus', description: 'Basic commission plus 4-5-4 calendar Counter Lead Bonus', streams: 3, color: COLORS.counter },
];

export default function RateTables() {
  /* Group products by department */
  const productsByDept: Record<string, typeof PRODUCTS> = {};
  for (const p of PRODUCTS) {
    if (!productsByDept[p.department]) productsByDept[p.department] = [];
    productsByDept[p.department].push(p);
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>Rate Tables</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          Effective-dated selling department commission rates and merchandise mapping
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Selling Depts" value="5" color={COLORS.primary} />
        <StatCard label="Rate Changes / Year" value="12" color={COLORS.accent} />
        <StatCard label="Effective-Date Ranges" value="3" color="#7c3aed" />
        <StatCard label="Comp Plans" value="4" color="#059669" />
      </div>

      {/* Rate Table Grid */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
          Commission Rate Schedule by Selling Department
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left pb-3 font-medium" style={{ color: 'var(--pl-text-muted)' }}>Department</th>
                {RATE_PERIODS.map((p) => (
                  <th key={p.label} colSpan={2} className="text-center pb-1 font-medium" style={{ color: 'var(--pl-text-muted)' }}>
                    <span className={p.current ? 'font-bold' : ''}>{p.label}</span>
                    {p.current && (
                      <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                        CURRENT
                      </span>
                    )}
                  </th>
                ))}
              </tr>
              <tr style={{ color: 'var(--pl-text-muted)' }}>
                <th className="text-left pb-3 font-medium" />
                {RATE_PERIODS.map((p) => (
                  <th key={`base-${p.label}`} className="text-center pb-3 font-medium" colSpan={1}>Base</th>
                )).flatMap((el, i) => [
                  <th key={`b-${i}`} className="text-center pb-3 font-medium" style={{ color: 'var(--pl-text-muted)' }}>Base</th>,
                  <th key={`p-${i}`} className="text-center pb-3 font-medium" style={{ color: 'var(--pl-text-muted)' }}>Premium</th>,
                ]).slice(0, 6)}
              </tr>
            </thead>
            <tbody>
              {SELLING_DEPTS.map((dept) => {
                const adj = RATE_ADJUSTMENTS[dept.id] ?? [1, 1, 1];
                return (
                  <tr key={dept.id} className="border-t" style={{ borderColor: 'var(--pl-stripe)' }}>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                        <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{dept.name}</span>
                      </div>
                    </td>
                    {adj.map((m, pi) => {
                      const base = (dept.baseRate * m * 100).toFixed(1);
                      const prem = (dept.premiumRate * m * 100).toFixed(1);
                      const isCurrent = RATE_PERIODS[pi].current;
                      return (
                        <td key={`${dept.id}-${pi}`} colSpan={2} className="py-3">
                          <div className="flex justify-center gap-6">
                            <span
                              className="font-mono"
                              style={{
                                color: isCurrent ? dept.color : 'var(--pl-text-secondary)',
                                fontWeight: isCurrent ? 700 : 400,
                              }}
                            >
                              {base}%
                            </span>
                            <span
                              className="font-mono"
                              style={{
                                color: isCurrent ? dept.color : 'var(--pl-text-secondary)',
                                fontWeight: isCurrent ? 700 : 400,
                              }}
                            >
                              {prem}%
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Merch-to-Dept Mapping */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
          Merchandise-to-Department Mapping
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {SELLING_DEPTS.map((dept) => {
            const products = productsByDept[dept.id] ?? [];
            return (
              <div key={dept.id} className="rounded-lg border p-3" style={{ borderColor: 'var(--pl-border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--pl-text)' }}>{dept.name}</span>
                </div>
                <div className="space-y-1.5">
                  {products.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-[11px]">
                      <span className="truncate pr-1" style={{ color: 'var(--pl-text-secondary)' }}>{p.name}</span>
                      <span className="font-mono shrink-0" style={{ color: 'var(--pl-text-muted)' }}>${p.price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t text-[10px] font-medium" style={{ borderColor: 'var(--pl-stripe)', color: dept.color }}>
                  {products.length} products
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comp Plan Assignments */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
          Comp Plan Assignment by Store Format
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COMP_PLANS.map((cp) => (
            <div
              key={cp.format}
              className="rounded-xl border-2 p-4"
              style={{ borderColor: cp.color, backgroundColor: `${cp.color}06` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold" style={{ color: 'var(--pl-text)' }}>{cp.format}</span>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${cp.color}18`, color: cp.color }}
                >
                  {cp.streams} streams
                </span>
              </div>
              <p className="text-xs font-semibold mb-1" style={{ color: cp.color }}>{cp.plan}</p>
              <p className="text-[11px] leading-snug" style={{ color: 'var(--pl-text-secondary)' }}>{cp.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Horizontal Bar Chart — Base Rates by Department */}
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>
            Base Commission Rate by Department
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
            Current effective-period base rates (%)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DEPT_RATE_DATA} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
              <XAxis type="number" domain={[0, 10]} tickFormatter={(v) => `${v}%`} tick={{ fill: 'var(--pl-text-muted)', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'var(--pl-text)', fontSize: 11 }} width={85} />
              <Tooltip formatter={(v) => [`${v}%`, 'Base Rate']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="rate" fill="#1a1f3d" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart — Rate Change History */}
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>
            Rate Change History
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
            Effective-dated rate progression across 3 periods
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={RATE_HISTORY} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
              <XAxis dataKey="period" tick={{ fill: 'var(--pl-text-muted)', fontSize: 11 }} />
              <YAxis domain={[3, 9]} tickFormatter={(v) => `${v}%`} tick={{ fill: 'var(--pl-text-muted)', fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="cosmetics" stroke="#d946ef" fill="#d946ef" fillOpacity={0.15} strokeWidth={2} name="Cosmetics" />
              <Area type="monotone" dataKey="designer" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.1} strokeWidth={2} name="Designer" />
              <Area type="monotone" dataKey="shoes" stroke="#2563eb" fill="#2563eb" fillOpacity={0.08} strokeWidth={2} name="Shoes" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Callout */}
      <div
        className="rounded-xl border-2 p-6 flex items-start gap-4"
        style={{ borderColor: '#059669', backgroundColor: '#f0fdf408' }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm"
          style={{ backgroundColor: '#dcfce7', color: '#166534' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--pl-text)' }}>Effective-Dated Architecture</p>
          <p className="text-sm" style={{ color: 'var(--pl-text-secondary)' }}>
            All rates are effective-dated — no hardcoded values. Historical rates are preserved for retro calculations.
            When a rate change takes effect, the engine automatically uses the correct rate for each transaction based on
            its <span className="font-semibold" style={{ color: 'var(--pl-text)' }}>business date</span>, not processing date.
            This eliminates the most common source of commission disputes.
          </p>
        </div>
      </div>
    </>
  );
}
