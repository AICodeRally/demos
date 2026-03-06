'use client';

import { StatCard, BarChart, DonutChart, AreaChart, HeatMap, WaterfallChart } from '@/components/demos/register';

/* ── 30-day transaction volume trend ─────────────────────── */

const DAILY_VOLUME = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  value: 35 + Math.round(Math.sin(i * 0.4) * 8 + Math.random() * 6 + (i % 7 >= 5 ? 6 : 0)),
}));

/* ── ASP by product category ─────────────────────────────── */

const ASP_BY_CATEGORY = [
  { label: 'Mattresses', value: 1400, color: '#1E3A5F' },
  { label: 'Adj. Bases', value: 890, color: '#06B6D4' },
  { label: 'Sleep Tech', value: 280, color: '#8B5CF6' },
  { label: 'Bedding', value: 120, color: '#10B981' },
  { label: 'Accessories', value: 65, color: '#F59E0B' },
];

/* ── Transaction size distribution ───────────────────────── */

const TX_SIZE_DIST = [
  { label: '<$1K', value: 18, color: '#94A3B8' },
  { label: '$1-2K', value: 32, color: '#06B6D4' },
  { label: '$2-3K', value: 28, color: '#1E3A5F' },
  { label: '$3-5K', value: 15, color: '#8B5CF6' },
  { label: '$5K+', value: 7, color: '#10B981' },
];

/* ── Heatmap: transaction volume by day x hour ───────────── */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM'];

const TX_HEATMAP: number[][] = [
  [8, 12, 18, 28, 22, 20, 24, 30, 26, 22, 18, 14, 10, 6],   // Mon
  [6, 10, 16, 24, 20, 18, 22, 28, 24, 20, 16, 12, 8, 4],     // Tue
  [10, 14, 20, 32, 26, 24, 28, 34, 30, 26, 22, 16, 12, 8],   // Wed
  [8, 12, 18, 26, 22, 20, 26, 32, 28, 24, 20, 14, 10, 6],    // Thu
  [12, 18, 26, 38, 32, 28, 34, 42, 38, 32, 28, 22, 16, 10],  // Fri
  [18, 28, 38, 52, 46, 42, 48, 58, 52, 46, 40, 34, 26, 18],  // Sat
  [14, 24, 34, 48, 42, 38, 44, 54, 48, 42, 36, 28, 20, 12],  // Sun
];

/* ── Top 20 transactions ─────────────────────────────────── */

const TOP_TRANSACTIONS = [
  { date: 'Mar 1', rep: 'Sarah J.', items: 'King Tempur-Pedic LuxeBreeze + Power Base + ...', total: '$8,420', margin: 42, financing: true },
  { date: 'Mar 1', rep: 'Marcus W.', items: 'Cal King Stearns & Foster Reserve + Adj Base', total: '$7,890', margin: 45, financing: true },
  { date: 'Mar 2', rep: 'Diana K.', items: 'King Purple Hybrid Premier + Base + Sheets', total: '$6,420', margin: 38, financing: true },
  { date: 'Mar 2', rep: 'Sarah J.', items: 'Queen Beautyrest Black + Power Base + Pillows', total: '$5,840', margin: 40, financing: true },
  { date: 'Feb 28', rep: 'James T.', items: 'King Sealy Posturepedic Plus + Base', total: '$5,210', margin: 36, financing: false },
  { date: 'Feb 28', rep: 'Emily R.', items: 'Queen Tempur-ProAdapt + SmartBase', total: '$4,980', margin: 41, financing: true },
  { date: 'Mar 1', rep: 'Raj P.', items: 'Cal King Serta iSeries + Adj Base + Protector', total: '$4,760', margin: 35, financing: true },
  { date: 'Feb 27', rep: 'Marcus W.', items: 'King Beautyrest Harmony Lux + Base', total: '$4,520', margin: 39, financing: false },
  { date: 'Mar 2', rep: 'Diana K.', items: 'Queen Purple Hybrid + Pillows + Protector', total: '$4,290', margin: 37, financing: true },
  { date: 'Feb 27', rep: 'Sarah J.', items: 'King Tempur-Cloud + SmartBase', total: '$4,180', margin: 43, financing: true },
  { date: 'Feb 26', rep: 'James T.', items: 'Queen Stearns & Foster + Adj Base', total: '$3,890', margin: 42, financing: false },
  { date: 'Mar 1', rep: 'Emily R.', items: 'King Serta Perfect Sleeper + Frame + Bedding', total: '$3,640', margin: 34, financing: true },
  { date: 'Feb 28', rep: 'Raj P.', items: 'Queen Beautyrest + Pillows + Sheets', total: '$3,420', margin: 36, financing: false },
  { date: 'Feb 26', rep: 'Marcus W.', items: 'Twin XL Tempur-Adapt (x2) + Frames', total: '$3,280', margin: 38, financing: true },
  { date: 'Mar 2', rep: 'Sarah J.', items: 'Full Purple + Protector + Pillows', total: '$2,980', margin: 35, financing: false },
  { date: 'Feb 27', rep: 'Diana K.', items: 'Queen Sealy + Frame + Sheets', total: '$2,640', margin: 32, financing: false },
  { date: 'Mar 1', rep: 'James T.', items: 'King Serta iComfort + Protector', total: '$2,490', margin: 33, financing: true },
  { date: 'Feb 26', rep: 'Emily R.', items: 'Queen Beautyrest + Pillow Pack', total: '$2,180', margin: 36, financing: false },
  { date: 'Feb 28', rep: 'Raj P.', items: 'Full Sealy + Frame', total: '$1,890', margin: 30, financing: false },
  { date: 'Mar 2', rep: 'Marcus W.', items: 'Twin Serta + Bedding Bundle', total: '$1,640', margin: 28, financing: false },
];

/* ── Attach rate waterfall ───────────────────────────────── */

const ATTACH_WATERFALL = [
  { label: 'Mattress', value: 100, type: 'add' as const },
  { label: '+Base', value: 42, type: 'add' as const },
  { label: '+Protector', value: 65, type: 'add' as const },
  { label: '+Pillows', value: 28, type: 'add' as const },
  { label: '+Sheets', value: 18, type: 'add' as const },
  { label: 'Avg Bundle', value: 0, type: 'total' as const },
];

export default function POSAnalytics() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>POS Analytics</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Point-of-sale transaction patterns, product mix, and attach rate analysis across all 200 stores
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Transactions/Day" value="47" trend="up" trendValue="+8%" color="#1E3A5F" />
        <StatCard label="Avg Items/Transaction" value="2.3" trend="up" trendValue="+0.2" color="#06B6D4" />
        <StatCard label="Return Rate" value="4.2%" trend="down" trendValue="-0.6%" color="#10B981" />
        <StatCard label="Financing Approval" value="87%" trend="up" trendValue="+3%" color="#8B5CF6" />
      </div>

      {/* 30-day volume + ASP by category */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            30-Day Transaction Volume
          </p>
          <AreaChart data={DAILY_VOLUME} color="#1E3A5F" showDots={false} />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Average Selling Price by Category
          </p>
          <BarChart data={ASP_BY_CATEGORY} unit="" />
        </div>
      </div>

      {/* Donut + HeatMap */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Transaction Size Distribution
          </p>
          <div className="flex justify-center">
            <DonutChart segments={TX_SIZE_DIST} centerValue="$1,893" centerLabel="avg sale" size={200} />
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Transaction Volume Heatmap (Day x Hour)
          </p>
          <HeatMap
            rows={DAYS}
            cols={HOURS}
            data={TX_HEATMAP}
            colorScale={{ low: '#DBEAFE', mid: '#3B82F6', high: '#1E3A5F' }}
          />
        </div>
      </div>

      {/* Top 20 Transactions Table */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Top 20 Transactions This Month
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E2E8F0' }}>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Date</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Rep</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Items</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>Total</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>Margin</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-center" style={{ color: '#94A3B8' }}>Financing</th>
              </tr>
            </thead>
            <tbody>
              {TOP_TRANSACTIONS.map((tx, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0"
                  style={{ borderColor: '#F1F5F9', backgroundColor: i % 2 === 0 ? '#F8FAFC' : 'transparent' }}
                >
                  <td className="py-2 text-[12px] font-mono" style={{ color: '#475569' }}>{tx.date}</td>
                  <td className="py-2 text-[12px] font-medium" style={{ color: '#1E3A5F' }}>{tx.rep}</td>
                  <td className="py-2 text-[12px] max-w-[280px] truncate" style={{ color: '#475569' }}>{tx.items}</td>
                  <td className="py-2 text-[12px] font-bold text-right" style={{ color: '#0F172A' }}>{tx.total}</td>
                  <td className="py-2 text-[12px] font-mono text-right" style={{ color: tx.margin >= 40 ? '#10B981' : tx.margin >= 35 ? '#F59E0B' : '#EF4444' }}>
                    {tx.margin}%
                  </td>
                  <td className="py-2 text-center">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: tx.financing ? '#EDE9FE' : '#F1F5F9',
                        color: tx.financing ? '#7C3AED' : '#94A3B8',
                      }}
                    >
                      {tx.financing ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attach Rate Waterfall */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
            Attach Rate Waterfall
          </p>
          <span className="text-[11px] font-mono" style={{ color: '#94A3B8' }}>Avg Bundle: $2,340</span>
        </div>
        <WaterfallChart data={ATTACH_WATERFALL} height={260} />
      </div>
    </>
  );
}
