'use client';

import { StatCard, AreaChart, DonutChart, BarChart, ConfidenceBand } from '@/components/demos/register';
import { COMMISSION_LOG, STATEMENTS } from '@/data/register/comp-data';

/* ── 12-month earnings trend (stacked components) ────────── */

const EARNINGS_TREND = [
  { label: 'Mar', value: 4.5 }, { label: 'Apr', value: 4.2 }, { label: 'May', value: 5.1 },
  { label: 'Jun', value: 4.8 }, { label: 'Jul', value: 4.6 }, { label: 'Aug', value: 4.3 },
  { label: 'Sep', value: 5.4 }, { label: 'Oct', value: 4.9 }, { label: 'Nov', value: 5.8 },
  { label: 'Dec', value: 5.2 }, { label: 'Jan', value: 3.8 }, { label: 'Feb', value: 4.3 },
];

/* ── Earnings breakdown ──────────────────────────────────── */

const EARNINGS_BREAKDOWN = [
  { label: 'Base', value: 45, color: '#475569' },
  { label: 'Commission', value: 38, color: '#1E3A5F' },
  { label: 'SPIFFs', value: 12, color: '#06B6D4' },
  { label: 'Accelerators', value: 5, color: '#10B981' },
];

/* ── Monthly earnings vs target ──────────────────────────── */

const MONTHLY_EARNINGS = [
  { label: 'Mar', value: 4.5, color: '#10B981' },
  { label: 'Apr', value: 4.2, color: '#10B981' },
  { label: 'May', value: 5.1, color: '#10B981' },
  { label: 'Jun', value: 4.8, color: '#10B981' },
  { label: 'Jul', value: 4.6, color: '#F59E0B' },
  { label: 'Aug', value: 4.3, color: '#F59E0B' },
  { label: 'Sep', value: 5.4, color: '#10B981' },
  { label: 'Oct', value: 4.9, color: '#10B981' },
  { label: 'Nov', value: 5.8, color: '#10B981' },
  { label: 'Dec', value: 5.2, color: '#10B981' },
  { label: 'Jan', value: 3.8, color: '#EF4444' },
  { label: 'Feb', value: 4.3, color: '#F59E0B' },
];

/* ── Tier attainment by month ────────────────────────────── */

const TIER_ATTAINMENT = [
  { month: 'Jan', tier: 2, label: 'T2' },
  { month: 'Feb', tier: 3, label: 'T3' },
  { month: 'Mar', tier: 3, label: 'T3' },
  { month: 'Apr', tier: 2, label: 'T2' },
];

const TIER_COLORS: Record<number, string> = {
  1: '#E2E8F0',
  2: '#94A3B8',
  3: '#475569',
  4: '#10B981',
};

/* ── Year-end W-2 projection ────────────────────────────── */

const W2_PROJECTION = [
  { label: 'Mar', value: 62, low: 56, high: 68 },
  { label: 'May', value: 62, low: 57, high: 67 },
  { label: 'Jul', value: 63, low: 58, high: 68 },
  { label: 'Sep', value: 62, low: 57, high: 67 },
  { label: 'Nov', value: 62, low: 56, high: 68 },
  { label: 'Dec', value: 62, low: 56, high: 68 },
];

/* ── Payout history ──────────────────────────────────────── */

const PAYOUT_HISTORY = [
  { period: 'Feb 16-28', base: 1440, commission: 980, spiffs: 275, accelerators: 180, total: 2875, ytd: 38400 },
  { period: 'Feb 1-15', base: 1440, commission: 1120, spiffs: 325, accelerators: 220, total: 3105, ytd: 35525 },
  { period: 'Jan 16-31', base: 1440, commission: 680, spiffs: 150, accelerators: 0, total: 2270, ytd: 32420 },
  { period: 'Jan 1-15', base: 1440, commission: 720, spiffs: 200, accelerators: 0, total: 2360, ytd: 30150 },
  { period: 'Dec 16-31', base: 1440, commission: 1380, spiffs: 450, accelerators: 340, total: 3610, ytd: 27790 },
  { period: 'Dec 1-15', base: 1440, commission: 1260, spiffs: 400, accelerators: 280, total: 3380, ytd: 24180 },
];

export default function PayoutAnalytics() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Payout Analytics</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Earnings tracking, W-2 projections, and payout history for your current comp plan
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="MTD Earnings" value="$4,280" trend="up" trendValue="+$320 vs last mo" color="#10B981" />
        <StatCard
          label="Projected Monthly"
          value="$5,100"
          trend="up"
          trendValue="+4.1%"
          color="#1E3A5F"
          sparkline={[42, 44, 46, 48, 49, 51]}
        />
        <StatCard label="YTD Total" value="$38,400" color="#06B6D4" />
        <StatCard label="W-2 Projection" value="$62K" trend="up" trendValue="on track" color="#8B5CF6" />
      </div>

      {/* AreaChart + DonutChart */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            12-Month Earnings Trend ($K)
          </p>
          <AreaChart data={EARNINGS_TREND} color="#10B981" />
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#475569' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>Base ~$2.5K</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#1E3A5F' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>Commission ~$1.5K</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#06B6D4' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>SPIFFs ~$500</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Earnings Breakdown
          </p>
          <DonutChart
            segments={EARNINGS_BREAKDOWN}
            centerValue="$4.3K"
            centerLabel="Avg/Month"
          />
        </div>
      </div>

      {/* Monthly Earnings vs Target + Tier Attainment */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
              Monthly Earnings vs $5K Target ($K)
            </p>
            <div className="flex items-center gap-1">
              <span className="w-6 h-0.5" style={{ backgroundColor: '#EF4444' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>$5K target</span>
            </div>
          </div>
          <BarChart data={MONTHLY_EARNINGS} maxVal={6} unit="K" />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Tier Attainment
          </p>
          <div className="grid grid-cols-4 gap-3">
            {TIER_ATTAINMENT.map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: TIER_COLORS[t.tier] }}
                >
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: t.tier >= 3 ? '#FFFFFF' : '#0F172A' }}
                  >
                    {t.label}
                  </span>
                </div>
                <span className="text-[10px] font-medium" style={{ color: '#475569' }}>{t.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t" style={{ borderColor: '#F1F5F9' }}>
            <p className="text-[10px] text-center" style={{ color: '#94A3B8' }}>
              Avg tier: <span className="font-bold" style={{ color: '#10B981' }}>T2.5</span> &mdash; Trending up
            </p>
          </div>
        </div>
      </div>

      {/* W-2 Projection Confidence Band */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
            Year-End W-2 Projection ($K)
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono" style={{ color: '#10B981' }}>High: $68K</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: '#0F172A' }}>Center: $62K</span>
            <span className="text-[10px] font-mono" style={{ color: '#F59E0B' }}>Low: $56K</span>
          </div>
        </div>
        <ConfidenceBand data={W2_PROJECTION} color="#10B981" />
      </div>

      {/* Payout History Table */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Payout History (Last 6 Periods)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Period</th>
                <th className="text-right py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Base</th>
                <th className="text-right py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Commission</th>
                <th className="text-right py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>SPIFFs</th>
                <th className="text-right py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Accelerators</th>
                <th className="text-right py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Total</th>
                <th className="text-right py-2 font-semibold" style={{ color: '#94A3B8' }}>YTD</th>
              </tr>
            </thead>
            <tbody>
              {PAYOUT_HISTORY.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td className="py-2.5 pr-4 font-medium" style={{ color: '#0F172A' }}>{row.period}</td>
                  <td className="py-2.5 pr-4 text-right font-mono" style={{ color: '#475569' }}>${row.base.toLocaleString()}</td>
                  <td className="py-2.5 pr-4 text-right font-mono" style={{ color: '#1E3A5F' }}>${row.commission.toLocaleString()}</td>
                  <td className="py-2.5 pr-4 text-right font-mono" style={{ color: '#06B6D4' }}>${row.spiffs.toLocaleString()}</td>
                  <td className="py-2.5 pr-4 text-right font-mono" style={{ color: '#10B981' }}>${row.accelerators.toLocaleString()}</td>
                  <td className="py-2.5 pr-4 text-right font-mono font-bold" style={{ color: '#0F172A' }}>${row.total.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-mono" style={{ color: '#94A3B8' }}>${row.ytd.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Commission Detail Log ─────────────────────────── */}
      <div className="rounded-xl bg-white border p-6 mt-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Commission Detail</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Date</th>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Transaction</th>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Items</th>
                <th className="text-right py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Sale Total</th>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Tier</th>
                <th className="text-right py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Rate</th>
                <th className="text-right py-2 font-semibold" style={{ color: '#94A3B8' }}>Commission</th>
              </tr>
            </thead>
            <tbody>
              {COMMISSION_LOG.map((entry, i) => {
                const tierColor =
                  entry.tierApplied === 'Platinum' ? '#E5E4E2' :
                  entry.tierApplied === 'Gold' ? '#FFD700' :
                  entry.tierApplied === 'Silver' ? '#C0C0C0' : '#CD7F32';
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td className="py-2.5 pr-3" style={{ color: '#475569' }}>{entry.date}</td>
                    <td className="py-2.5 pr-3 font-mono" style={{ color: '#1E3A5F' }}>{entry.transactionId}</td>
                    <td className="py-2.5 pr-3" style={{ color: '#475569' }}>{entry.items}</td>
                    <td className="py-2.5 pr-3 text-right font-mono" style={{ color: '#0F172A' }}>
                      ${entry.saleTotal.toLocaleString()}
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: tierColor }} />
                        <span style={{ color: '#475569' }}>{entry.tierApplied}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono" style={{ color: '#10B981' }}>
                      {(entry.rate * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold" style={{ color: '#10B981' }}>
                      ${entry.commission.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              {/* Running total */}
              <tr style={{ borderTop: '2px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                <td colSpan={6} className="py-3 pr-3 text-right text-[12px] font-semibold" style={{ color: '#475569' }}>
                  Running Total
                </td>
                <td className="py-3 text-right font-mono font-bold text-[13px]" style={{ color: '#10B981' }}>
                  ${COMMISSION_LOG.reduce((sum, e) => sum + e.commission, 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── YTD Earnings + Projection ────────────────────── */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div
          className="rounded-xl border p-5 flex items-center justify-between"
          style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#16A34A' }}>
              YTD Earnings
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: '#475569' }}>Across all pay periods</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
            ${STATEMENTS.reduce((sum, s) => sum + s.netPayout, 0).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div
          className="rounded-xl border p-5 flex items-center justify-between"
          style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#1D4ED8' }}>
              Projected This Period
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: '#475569' }}>Based on current pace</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#1D4ED8' }}>~$4,120</p>
        </div>
      </div>
    </>
  );
}
