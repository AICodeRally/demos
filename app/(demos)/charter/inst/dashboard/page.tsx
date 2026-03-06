'use client';

import { StatCard, AreaChart, SparklineRow } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const SPARKLINE_ASSETS = [1.92, 1.94, 1.96, 1.98, 1.99, 2.01, 2.02, 2.04, 2.05, 2.07, 2.08, 2.1];
const SPARKLINE_MEMBERS = [134, 135, 136, 137, 137, 138, 139, 139, 140, 141, 141, 142];
const SPARKLINE_NIM = [3.04, 3.05, 3.06, 3.07, 3.08, 3.08, 3.09, 3.10, 3.10, 3.11, 3.11, 3.12];
const SPARKLINE_DEPOSITS = [1.58, 1.60, 1.62, 1.63, 1.64, 1.65, 1.66, 1.67, 1.68, 1.69, 1.69, 1.70];
const SPARKLINE_LOANS = [1.32, 1.33, 1.34, 1.34, 1.35, 1.36, 1.36, 1.37, 1.38, 1.38, 1.39, 1.40];
const SPARKLINE_DIGITAL = [53, 54, 55, 56, 56, 57, 58, 58, 59, 60, 60, 61];

const ASSET_TREND = [
  { label: 'Jan', value: 1920 },
  { label: 'Feb', value: 1940 },
  { label: 'Mar', value: 1960 },
  { label: 'Apr', value: 1980 },
  { label: 'May', value: 1995 },
  { label: 'Jun', value: 2010 },
  { label: 'Jul', value: 2025 },
  { label: 'Aug', value: 2040 },
  { label: 'Sep', value: 2055 },
  { label: 'Oct', value: 2070 },
  { label: 'Nov', value: 2085 },
  { label: 'Dec', value: 2100 },
];

interface BranchHighlight {
  name: string;
  deposits: string;
  members: string;
  growth: string;
  sparkline: number[];
}

const BRANCH_HIGHLIGHTS: BranchHighlight[] = [
  { name: 'Main Street Flagship', deposits: '$142M', members: '18,200', growth: '+6.2%', sparkline: [120, 124, 128, 130, 132, 135, 136, 138, 139, 140, 141, 142] },
  { name: 'Harbor View', deposits: '$98M', members: '12,400', growth: '+5.8%', sparkline: [82, 84, 86, 88, 89, 91, 92, 93, 94, 96, 97, 98] },
  { name: 'County Seat', deposits: '$94M', members: '11,800', growth: '+4.9%', sparkline: [80, 82, 83, 85, 86, 88, 89, 90, 91, 92, 93, 94] },
  { name: 'Bayfield Central', deposits: '$88M', members: '10,600', growth: '+5.4%', sparkline: [74, 76, 78, 80, 81, 82, 83, 84, 86, 87, 87, 88] },
  { name: 'Northshore Plaza', deposits: '$82M', members: '9,800', growth: '+4.1%', sparkline: [70, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82] },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function ExecutiveDashboard() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Executive Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>Lakeshore Credit Union &mdash; institution performance at a glance</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Assets" value="$2.1B" trend="up" trendValue="+4.2%" color="#B87333" sparkline={SPARKLINE_ASSETS} />
        <StatCard label="Members" value="142,000" trend="up" trendValue="+3.1%" color="#475569" sparkline={SPARKLINE_MEMBERS} />
        <StatCard label="Net Interest Margin" value="3.12%" trend="up" trendValue="+0.08%" color="#6B8F71" sparkline={SPARKLINE_NIM} />
        <StatCard label="Total Deposits" value="$1.7B" trend="up" trendValue="+5.1%" color="#475569" sparkline={SPARKLINE_DEPOSITS} />
        <StatCard label="Total Loans" value="$1.4B" trend="up" trendValue="+3.8%" color="#B87333" sparkline={SPARKLINE_LOANS} />
        <StatCard label="Digital Adoption" value="61%" trend="up" trendValue="+8%" color="#6B8F71" sparkline={SPARKLINE_DIGITAL} />
      </div>

      {/* Asset Growth Trend */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>12-Month Asset Trend ($M)</h2>
        <AreaChart data={ASSET_TREND} color="#475569" height={220} />
      </div>

      {/* Branch Highlights Table */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Top Performing Branches</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #E7E5E4' }}>
                <th className="text-left pb-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#A8A29E' }}>Branch</th>
                <th className="text-left pb-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#A8A29E' }}>Deposits</th>
                <th className="text-left pb-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#A8A29E' }}>Members</th>
                <th className="text-left pb-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#A8A29E' }}>Growth</th>
                <th className="text-right pb-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#A8A29E' }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {BRANCH_HIGHLIGHTS.map((b, i) => (
                <tr key={i} style={{ borderBottom: i < BRANCH_HIGHLIGHTS.length - 1 ? '1px solid #F5F5F4' : 'none' }}>
                  <td className="py-3 font-medium" style={{ color: '#1C1917' }}>{b.name}</td>
                  <td className="py-3" style={{ color: '#57534E' }}>{b.deposits}</td>
                  <td className="py-3" style={{ color: '#57534E' }}>{b.members}</td>
                  <td className="py-3">
                    <span className="text-sm font-semibold" style={{ color: '#059669' }}>{b.growth}</span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="inline-block">
                      <SparklineRow data={b.sparkline} color="#475569" width={80} height={24} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
