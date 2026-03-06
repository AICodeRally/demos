'use client';

import { StatCard, BarChart, DonutChart, AreaChart, HeatMap, TreeMap } from '@/components/demos/register';

/* ── Days of supply by SKU ───────────────────────────────── */

const DAYS_OF_SUPPLY = [
  { label: 'King Tempur-Cloud', value: 4, color: '#EF4444' },
  { label: 'Queen Sealy Posture', value: 6, color: '#EF4444' },
  { label: 'King Purple Hybrid', value: 8, color: '#F59E0B' },
  { label: 'Queen Beautyrest', value: 9, color: '#F59E0B' },
  { label: 'Cal King S&F Reserve', value: 11, color: '#F59E0B' },
  { label: 'Twin XL Serta iComfort', value: 14, color: '#F59E0B' },
  { label: 'Full Purple Plus', value: 18, color: '#10B981' },
  { label: 'Queen Tempur-Adapt', value: 22, color: '#10B981' },
  { label: 'King Beautyrest Black', value: 28, color: '#10B981' },
  { label: 'Queen Serta Perfect', value: 35, color: '#10B981' },
];

/* ── Inventory value treemap ─────────────────────────────── */

const INVENTORY_VALUE = [
  { label: 'Mattresses', value: 4200000, color: '#1E3A5F' },
  { label: 'Adjustable Bases', value: 1800000, color: '#06B6D4' },
  { label: 'Floor Models', value: 1200000, color: '#475569' },
  { label: 'Bedding', value: 800000, color: '#10B981' },
  { label: 'Sleep Tech', value: 420000, color: '#8B5CF6' },
  { label: 'Accessories', value: 280000, color: '#F59E0B' },
];

/* ── Stock coverage heatmap ──────────────────────────────── */

const CATEGORIES = ['Mattresses', 'Adj. Bases', 'Bedding', 'Sleep Tech', 'Accessories'];
const FORMATS = ['Flagship', 'Standard', 'Outlet', 'Shop-in-Shop'];

const STOCK_COVERAGE: number[][] = [
  [92, 78, 55, 68],  // Mattresses
  [88, 72, 42, 62],  // Adj. Bases
  [95, 85, 68, 58],  // Bedding
  [82, 64, 32, 45],  // Sleep Tech
  [98, 90, 75, 70],  // Accessories
];

/* ── Showroom floor allocation ───────────────────────────── */

const FLOOR_ALLOCATION = [
  { label: 'Mattress Display', value: 45, color: '#1E3A5F' },
  { label: 'Bases & Accessories', value: 20, color: '#06B6D4' },
  { label: 'Bedding Wall', value: 15, color: '#10B981' },
  { label: 'Sleep Tech Corner', value: 10, color: '#8B5CF6' },
  { label: 'Checkout', value: 10, color: '#EF4444' },
];

/* ── Low stock alerts ────────────────────────────────────── */

const LOW_STOCK = [
  { sku: 'TPC-K-001', name: 'King Tempur-Cloud Supreme', stock: 3, reorder: 12, daysOut: 4, status: 'Critical' as const },
  { sku: 'SPP-Q-014', name: 'Queen Sealy Posturepedic Plus', stock: 5, reorder: 15, daysOut: 6, status: 'Critical' as const },
  { sku: 'PHB-K-008', name: 'King Purple Hybrid Premier', stock: 8, reorder: 12, daysOut: 8, status: 'Warning' as const },
  { sku: 'BRS-Q-022', name: 'Queen Beautyrest Silver', stock: 7, reorder: 10, daysOut: 9, status: 'Warning' as const },
  { sku: 'SFR-CK-003', name: 'Cal King Stearns & Foster Reserve', stock: 4, reorder: 8, daysOut: 11, status: 'Warning' as const },
  { sku: 'SIC-TX-011', name: 'Twin XL Serta iComfort', stock: 6, reorder: 8, daysOut: 14, status: 'Warning' as const },
  { sku: 'ABS-K-007', name: 'King Adjustable Smart Base', stock: 2, reorder: 6, daysOut: 3, status: 'Critical' as const },
  { sku: 'PRO-U-019', name: 'Universal Mattress Protector', stock: 18, reorder: 50, daysOut: 5, status: 'Critical' as const },
];

/* ── Monthly inventory turns ─────────────────────────────── */

const MONTHLY_TURNS = [
  { label: 'Mar', value: 3.8 }, { label: 'Apr', value: 4.0 }, { label: 'May', value: 4.6 },
  { label: 'Jun', value: 4.2 }, { label: 'Jul', value: 4.4 }, { label: 'Aug', value: 4.0 },
  { label: 'Sep', value: 4.8 }, { label: 'Oct', value: 4.2 }, { label: 'Nov', value: 5.6 },
  { label: 'Dec', value: 5.2 }, { label: 'Jan', value: 3.4 }, { label: 'Feb', value: 3.8 },
];

export default function InventoryMerchandising() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Inventory & Merchandising</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Stock levels, display utilization, and supply chain intelligence across 200 stores
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="SKUs in Stock" value="342" trend="flat" trendValue="of 380 total" color="#1E3A5F" />
        <StatCard label="Stock Turn Rate" value="4.2x" trend="up" trendValue="+0.3x" color="#06B6D4" />
        <StatCard label="Display Utilization" value="87%" trend="up" trendValue="+4%" color="#8B5CF6" />
        <StatCard label="Delivery Lead Time" value="3.2 days" trend="down" trendValue="-0.5d" color="#10B981" />
      </div>

      {/* TreeMap + HeatMap */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Inventory Value by Category ($8.7M total)
          </p>
          <TreeMap data={INVENTORY_VALUE} />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Stock Coverage Level by Format (0-100)
          </p>
          <HeatMap
            rows={CATEGORIES}
            cols={FORMATS}
            data={STOCK_COVERAGE}
            colorScale={{ low: '#EF4444', mid: '#F59E0B', high: '#10B981' }}
          />
        </div>
      </div>

      {/* Days of Supply + Donut */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
              Days of Supply by Top 10 SKUs
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                <span className="text-[9px]" style={{ color: '#94A3B8' }}>&lt;7d</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                <span className="text-[9px]" style={{ color: '#94A3B8' }}>7-14d</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
                <span className="text-[9px]" style={{ color: '#94A3B8' }}>&gt;14d</span>
              </div>
            </div>
          </div>
          <BarChart data={DAYS_OF_SUPPLY} unit=" days" />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Showroom Floor Allocation
          </p>
          <div className="flex justify-center">
            <DonutChart segments={FLOOR_ALLOCATION} centerValue="87%" centerLabel="utilized" size={200} />
          </div>
        </div>
      </div>

      {/* Low Stock Alerts Table */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
            Low Stock Alerts
          </p>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
            style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
          >
            {LOW_STOCK.filter(s => s.status === 'Critical').length} Critical
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E2E8F0' }}>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>SKU</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Product Name</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>Current</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>Reorder Pt</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>Days Out</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-center" style={{ color: '#94A3B8' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {LOW_STOCK.map((item, i) => (
                <tr
                  key={item.sku}
                  className="border-b last:border-0"
                  style={{ borderColor: '#F1F5F9', backgroundColor: i % 2 === 0 ? '#F8FAFC' : 'transparent' }}
                >
                  <td className="py-2 text-[12px] font-mono" style={{ color: '#475569' }}>{item.sku}</td>
                  <td className="py-2 text-[12px] font-medium" style={{ color: '#0F172A' }}>{item.name}</td>
                  <td className="py-2 text-[12px] font-mono text-right" style={{ color: item.stock <= 5 ? '#EF4444' : '#F59E0B' }}>
                    {item.stock}
                  </td>
                  <td className="py-2 text-[12px] font-mono text-right" style={{ color: '#475569' }}>{item.reorder}</td>
                  <td className="py-2 text-[12px] font-bold font-mono text-right" style={{ color: item.daysOut <= 5 ? '#EF4444' : item.daysOut <= 10 ? '#F59E0B' : '#475569' }}>
                    {item.daysOut}d
                  </td>
                  <td className="py-2 text-center">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: item.status === 'Critical' ? '#FEE2E2' : '#FEF3C7',
                        color: item.status === 'Critical' ? '#DC2626' : '#D97706',
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Inventory Turns */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Monthly Inventory Turns (12-Month Trend)
        </p>
        <AreaChart data={MONTHLY_TURNS} color="#06B6D4" />
        <div className="flex justify-center gap-6 mt-2">
          <span className="text-[10px]" style={{ color: '#94A3B8' }}>
            Peak: Nov (5.6x) &mdash; holiday pre-season
          </span>
          <span className="text-[10px]" style={{ color: '#94A3B8' }}>
            Low: Jan (3.4x) &mdash; post-holiday reset
          </span>
        </div>
      </div>
    </>
  );
}
