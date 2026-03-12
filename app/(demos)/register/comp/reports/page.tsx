'use client';

import { StatCard, BarChart, AreaChart } from '@/components/demos/register';
import { TEAM_EARNINGS, COMP_AS_PCT_REVENUE } from '@/data/register/comp-data';

const totalComp = TEAM_EARNINGS.reduce((sum, r) => sum + r.earnings, 0);
const avgPerRep = Math.round(totalComp / TEAM_EARNINGS.length);
const topEarner = TEAM_EARNINGS[0];
const latestPct = COMP_AS_PCT_REVENUE[COMP_AS_PCT_REVENUE.length - 1].pct;

const teamBarData = TEAM_EARNINGS.map((r) => ({
  label: r.name,
  value: r.earnings,
  color: r.color,
}));

const costTrendData = COMP_AS_PCT_REVENUE.map((m) => ({
  label: m.month,
  value: m.pct,
}));

export default function Reports() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Compensation Reports</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Team earnings, cost of comp, and YTD analytics for managers and HR
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Comp Paid YTD"
          value={`$${totalComp.toLocaleString()}`}
          color="#1E3A5F"
          trendValue="All reps combined"
        />
        <StatCard
          label="Cost of Comp"
          value={`${latestPct}%`}
          color="#F59E0B"
          trendValue="of revenue (latest)"
        />
        <StatCard
          label="Avg Per Rep"
          value={`$${avgPerRep.toLocaleString()}`}
          color="#06B6D4"
          trendValue="YTD average"
        />
        <StatCard
          label="Top Earner"
          value={topEarner.name}
          color="#10B981"
          trendValue={`$${topEarner.earnings.toLocaleString()} YTD`}
        />
      </div>

      {/* Team Earnings BarChart */}
      <div className="rounded-xl bg-white border p-6 mb-6" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Team Earnings YTD ($)</p>
          <button
            onClick={() => alert('CSV export coming in production')}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all hover:shadow-sm"
            style={{ borderColor: '#CBD5E1', color: '#475569' }}
          >
            Export CSV
          </button>
        </div>
        <BarChart data={teamBarData} />

        {/* Role legend */}
        <div className="mt-5 pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
          <div className="grid grid-cols-3 gap-3">
            {TEAM_EARNINGS.map((r) => (
              <div key={r.name} className="flex items-center gap-2">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: r.color }}
                >
                  {r.name[0]}
                </span>
                <div>
                  <p className="text-[11px] font-semibold" style={{ color: '#0F172A' }}>{r.name}</p>
                  <p className="text-[10px]" style={{ color: '#94A3B8' }}>
                    {r.role} — ${r.earnings.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Trend AreaChart */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Comp as % of Revenue</p>
            <p className="text-[11px] mt-0.5" style={{ color: '#94A3B8' }}>
              Monthly cost of compensation as a share of total revenue
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1E3A5F' }} />
            <span className="text-[11px]" style={{ color: '#475569' }}>Target: 8.0%</span>
          </div>
        </div>
        <AreaChart data={costTrendData} color="#1E3A5F" />

        {/* Min/max summary */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>Lowest</p>
            <p className="text-[14px] font-bold" style={{ color: '#10B981' }}>
              {Math.min(...COMP_AS_PCT_REVENUE.map((m) => m.pct))}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>Average</p>
            <p className="text-[14px] font-bold" style={{ color: '#0F172A' }}>
              {(COMP_AS_PCT_REVENUE.reduce((sum, m) => sum + m.pct, 0) / COMP_AS_PCT_REVENUE.length).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#94A3B8' }}>Highest</p>
            <p className="text-[14px] font-bold" style={{ color: '#F59E0B' }}>
              {Math.max(...COMP_AS_PCT_REVENUE.map((m) => m.pct))}%
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
