'use client';

import { StatCard, WaterfallChart, DeclineCurve } from '@/components/demos/wellspring';
import { REVENUE_WATERFALL, PAD_ECONOMICS, DECLINE_CURVE } from '@/data/wellspring';

/* ── Waterfall data adapted for the component ─────────── */

const waterfallData = [
  { label: 'Gross Rev', value: 2424000, type: 'add' as const },
  { label: 'Royalties', value: 605000, type: 'subtract' as const },
  { label: 'LOE', value: 492000, type: 'subtract' as const },
  { label: 'Sev. Tax', value: 151000, type: 'subtract' as const },
  { label: 'Net Income', value: 0, type: 'total' as const },
];

/* ── Decline curve data adapted to component format ───── */

const actualData = DECLINE_CURVE
  .filter((d) => d.type === 'actual')
  .map((d, i) => ({ month: i + 1, oilBpd: d.actual ?? 0 }));

const forecastData = DECLINE_CURVE
  .filter((d) => d.type === 'forecast')
  .map((d, i) => ({ month: actualData.length + i + 1, oilBpd: d.forecast ?? 0 }));

const typeCurveData = Array.from({ length: 60 }, (_, i) => ({
  month: i + 1,
  oilBpd: Math.round(2200 * Math.exp(-0.025 * i)),
}));

/* ── Per-well economics table ─────────────────────────── */

const WELL_ECONOMICS = [
  { name: 'Diamondback 1-1H', revenue: 324000, loe: 18200, net: 248000, irr: 52, payout: 14 },
  { name: 'Diamondback 2-1H', revenue: 282000, loe: 16400, net: 210000, irr: 48, payout: 16 },
  { name: 'Diamondback 3-2H', revenue: 256000, loe: 15800, net: 188000, irr: 45, payout: 17 },
  { name: 'Sidewinder 5-1H', revenue: 228000, loe: 14200, net: 164000, irr: 42, payout: 19 },
  { name: 'Sidewinder 3-1H', revenue: 198000, loe: 12800, net: 140000, irr: 38, payout: 22 },
  { name: 'Rattlesnake 8-1H', revenue: 152000, loe: 11400, net: 98000, irr: 34, payout: 24 },
  { name: 'Rattlesnake 12-2H', revenue: 124000, loe: 10200, net: 76000, irr: 30, payout: 26 },
  { name: 'Mustang 4-1H', revenue: 82000, loe: 9800, net: 42000, irr: 22, payout: 32 },
  { name: 'Mustang 11-2H', revenue: 64000, loe: 9200, net: 28000, irr: 18, payout: 36 },
  { name: 'Mustang 15-1H', revenue: 48000, loe: 8600, net: 16000, irr: 12, payout: 42 },
];

export default function OpsEconomicsPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase mb-1"
          style={{ color: '#0D9488' }}
        >
          Act 4 &middot; Operations Manager
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: '#F1F5F9' }}>
          Well Economics
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Revenue waterfall, decline curves &amp; per-well returns &middot; February 2026
        </p>
      </div>

      {/* Revenue Waterfall */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Revenue Waterfall
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          Gross revenue to net operating income — Feb 2026
        </p>
        <WaterfallChart data={waterfallData} height={280} />
      </div>

      {/* Decline Curve */}
      <div className="mb-6">
        <DeclineCurve
          actual={actualData}
          forecast={forecastData}
          typeCurve={typeCurveData}
          eur={842}
          height={260}
        />
      </div>

      {/* Per-Well Economics Table */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Per-Well Economics
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          Top 10 wells — revenue, LOE, net income, IRR%, payout months
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th className="text-left py-2 font-semibold" style={{ color: '#94A3B8' }}>Well</th>
                <th className="text-right py-2 font-semibold" style={{ color: '#94A3B8' }}>Revenue</th>
                <th className="text-right py-2 font-semibold" style={{ color: '#94A3B8' }}>LOE</th>
                <th className="text-right py-2 font-semibold" style={{ color: '#94A3B8' }}>Net</th>
                <th className="text-right py-2 font-semibold" style={{ color: '#94A3B8' }}>IRR %</th>
                <th className="text-right py-2 font-semibold" style={{ color: '#94A3B8' }}>Payout (mo)</th>
              </tr>
            </thead>
            <tbody>
              {WELL_ECONOMICS.map((w, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #252B36' }}>
                  <td className="py-2 font-medium" style={{ color: '#F1F5F9' }}>{w.name}</td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#CBD5E1' }}>
                    ${(w.revenue / 1000).toFixed(0)}K
                  </td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#DC2626' }}>
                    ${(w.loe / 1000).toFixed(1)}K
                  </td>
                  <td className="py-2 text-right tabular-nums font-bold" style={{ color: '#059669' }}>
                    ${(w.net / 1000).toFixed(0)}K
                  </td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#0D9488' }}>
                    {w.irr}%
                  </td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#94A3B8' }}>
                    {w.payout}
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
