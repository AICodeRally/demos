'use client';

import { useState } from 'react';
import { BarChart, DonutChart, HeatMap, AreaChart } from '@/components/demos/register';

/* ── Promotion data ───────────────────────────────────────── */

const PROMOS = [
  { name: 'Presidents\' Day', months: [1], span: 'Feb 14-20', color: '#1E3A5F', formats: ['Flagship', 'Standard', 'Outlet'], budget: '$2.8M', lift: '18%', coOp: '35%' },
  { name: 'Memorial Day', months: [4], span: 'May 22-29', color: '#06B6D4', formats: ['Flagship', 'Standard', 'Outlet', 'SiS'], budget: '$3.4M', lift: '22%', coOp: '40%' },
  { name: 'July 4th', months: [6], span: 'Jun 28 - Jul 5', color: '#EF4444', formats: ['Standard', 'Outlet'], budget: '$1.6M', lift: '12%', coOp: '25%' },
  { name: 'Labor Day', months: [8], span: 'Aug 30 - Sep 6', color: '#10B981', formats: ['Flagship', 'Standard', 'Outlet', 'SiS'], budget: '$3.8M', lift: '24%', coOp: '42%' },
  { name: 'Black Friday', months: [10], span: 'Nov 21-28', color: '#8B5CF6', formats: ['All Formats'], budget: '$5.2M', lift: '35%', coOp: '50%' },
  { name: 'Holiday Sale', months: [11], span: 'Dec 10-31', color: '#F59E0B', formats: ['Flagship', 'Standard'], budget: '$4.1M', lift: '28%', coOp: '38%' },
];

const MONTH_LABELS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

const ROI_DATA = [
  { label: 'Black Friday', value: 35, color: '#8B5CF6' },
  { label: 'Holiday', value: 28, color: '#F59E0B' },
  { label: 'Labor Day', value: 24, color: '#10B981' },
  { label: 'Memorial Day', value: 22, color: '#06B6D4' },
  { label: 'Presidents\' Day', value: 18, color: '#1E3A5F' },
  { label: 'July 4th', value: 12, color: '#EF4444' },
];

const PROMO_FORMAT_MATRIX = [
  [100, 100, 100, 50],  // Presidents' Day
  [100, 100, 100, 100], // Memorial Day
  [0, 100, 100, 0],     // July 4th
  [100, 100, 100, 100], // Labor Day
  [100, 100, 100, 100], // Black Friday
  [100, 100, 0, 0],     // Holiday Sale
];

const SPEND_SEGMENTS = [
  { label: 'Advertising', value: 35, color: '#1E3A5F' },
  { label: 'Markdowns', value: 28, color: '#06B6D4' },
  { label: 'SPIFFs', value: 22, color: '#10B981' },
  { label: 'Events', value: 15, color: '#8B5CF6' },
];

const BASELINE_REVENUE = MONTH_LABELS.map((label) => ({ label, value: 105 }));
const PROMOTED_REVENUE = [
  { label: 'Mar', value: 105 }, { label: 'Apr', value: 108 },
  { label: 'May', value: 132 }, { label: 'Jun', value: 110 },
  { label: 'Jul', value: 118 }, { label: 'Aug', value: 108 },
  { label: 'Sep', value: 135 }, { label: 'Oct', value: 110 },
  { label: 'Nov', value: 148 }, { label: 'Dec', value: 138 },
  { label: 'Jan', value: 102 }, { label: 'Feb', value: 125 },
];

export default function PromotionCalendar() {
  const [selectedPromo, setSelectedPromo] = useState<number>(0);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Promotion Calendar</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          6 major promotional events driving $20.9M in annual spend with 22% average revenue lift
        </p>
      </div>

      {/* Timeline */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Annual Promotion Timeline</p>
        <div className="relative">
          {/* Month grid */}
          <div className="flex mb-2">
            {MONTH_LABELS.map((m) => (
              <div key={m} className="flex-1 text-center text-[10px] font-medium" style={{ color: '#94A3B8' }}>{m}</div>
            ))}
          </div>
          {/* Promo bars */}
          <div className="space-y-2">
            {PROMOS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-[100px] text-right text-[11px] shrink-0 truncate" style={{ color: '#475569' }}>{p.name}</span>
                <div className="flex-1 relative h-6">
                  {p.months.map((m) => {
                    const left = (m / 12) * 100;
                    const width = (1 / 12) * 100;
                    return (
                      <div
                        key={m}
                        className="absolute top-0 h-full rounded cursor-pointer transition-opacity"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          backgroundColor: p.color,
                          opacity: selectedPromo === i ? 1 : 0.6,
                        }}
                        onClick={() => setSelectedPromo(i)}
                      >
                        <span className="text-[8px] text-white font-medium px-1 truncate block leading-6">{p.span}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Bar + Spend Donut */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Revenue Lift by Promotion (%)</p>
          <BarChart data={ROI_DATA} unit="%" />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Promotional Spend Breakdown</p>
          <DonutChart segments={SPEND_SEGMENTS} centerValue="$20.9M" centerLabel="Total Spend" size={200} />
        </div>
      </div>

      {/* Format Participation HeatMap */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Promotion x Format Participation</p>
        <HeatMap
          rows={PROMOS.map((p) => p.name)}
          cols={['Flagship', 'Standard', 'Outlet', 'SiS']}
          data={PROMO_FORMAT_MATRIX}
          colorScale={{ low: '#F1F5F9', mid: '#06B6D4', high: '#1E3A5F' }}
        />
        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#1E3A5F' }} />
            <span className="text-[10px]" style={{ color: '#94A3B8' }}>Full participation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#06B6D4' }} />
            <span className="text-[10px]" style={{ color: '#94A3B8' }}>Limited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0' }} />
            <span className="text-[10px]" style={{ color: '#94A3B8' }}>Not participating</span>
          </div>
        </div>
      </div>

      {/* Baseline vs Promoted Revenue */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>Baseline Revenue ($M/mo)</p>
          <p className="text-[11px] mb-3" style={{ color: '#94A3B8' }}>Flat ~$105M baseline without promotions</p>
          <AreaChart data={BASELINE_REVENUE} color="#94A3B8" height={160} />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>Promoted Revenue ($M/mo)</p>
          <p className="text-[11px] mb-3" style={{ color: '#94A3B8' }}>Revenue spikes during promo windows</p>
          <AreaChart data={PROMOTED_REVENUE} color="#06B6D4" height={160} />
        </div>
      </div>

      {/* Promo Detail Cards */}
      <div className="grid grid-cols-3 gap-4">
        {PROMOS.map((p, i) => (
          <div
            key={p.name}
            className="rounded-xl border p-4 cursor-pointer transition-all"
            style={{
              borderColor: selectedPromo === i ? p.color : '#E2E8F0',
              borderWidth: selectedPromo === i ? 2 : 1,
              borderTopWidth: 3,
              borderTopColor: p.color,
              backgroundColor: selectedPromo === i ? `${p.color}08` : '#FFFFFF',
            }}
            onClick={() => setSelectedPromo(i)}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>{p.name}</p>
            <p className="text-[11px] mb-3" style={{ color: '#94A3B8' }}>{p.span}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Formats</span>
                <div className="flex gap-1">
                  {p.formats.map((f) => (
                    <span key={f} className="rounded px-1 py-0.5 text-[9px] font-medium" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>{f}</span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Budget</span>
                <span className="font-mono font-medium" style={{ color: '#0F172A' }}>{p.budget}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Projected Lift</span>
                <span className="font-mono font-semibold" style={{ color: '#10B981' }}>+{p.lift}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Vendor Co-op</span>
                <span className="font-mono font-medium" style={{ color: '#06B6D4' }}>{p.coOp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
