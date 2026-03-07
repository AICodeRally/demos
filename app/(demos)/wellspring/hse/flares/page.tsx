'use client';

import { StatCard, BarChart, AreaChart } from '@/components/demos/wellspring';
import { FLARE_VOLUMES } from '@/data/wellspring';

/* ── Flare volumes for bar chart ──────────────────────── */

const flareBarData = FLARE_VOLUMES.map((f) => ({
  label: f.padName.replace(' Pad', ''),
  value: f.monthlyMcf,
  color:
    f.padId === 'pad-a'
      ? '#16A34A'
      : f.padId === 'pad-b'
        ? '#EA580C'
        : f.padId === 'pad-c'
          ? '#2563EB'
          : '#7C3AED',
}));

const totalFlare = FLARE_VOLUMES.reduce((sum, f) => sum + f.monthlyMcf, 0);
const rrcLimit = 8000; // MCF/month
const rrcPct = ((totalFlare / rrcLimit) * 100).toFixed(1);

/* ── 12-month flare trend ─────────────────────────────── */

const flareTrend = [
  { label: 'Apr', value: 5800 },
  { label: 'May', value: 5600 },
  { label: 'Jun', value: 5900 },
  { label: 'Jul', value: 6200 },
  { label: 'Aug', value: 6100 },
  { label: 'Sep', value: 5700 },
  { label: 'Oct', value: 5500 },
  { label: 'Nov', value: 5800 },
  { label: 'Dec', value: 6000 },
  { label: 'Jan', value: 5900 },
  { label: 'Feb', value: 6000 },
  { label: 'Mar', value: totalFlare },
];

export default function HseFlaresPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-mono mb-1"
          style={{ color: '#DC2626' }}
        >
          Act 5 &middot; HSE Officer
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#F1F5F9' }}>
          Flare Monitoring
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Flare volumes, RRC compliance &amp; capture rates by pad
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total Flare (MCF/mo)"
          value={totalFlare.toLocaleString()}
          color="#DC2626"
          sparkline={[5800, 5600, 5900, 6000, 5900, totalFlare]}
        />
        <StatCard
          label="RRC Limit %"
          value={`${rrcPct}%`}
          trend="flat"
          trendValue={`of ${rrcLimit.toLocaleString()} MCF`}
          color="#EA580C"
        />
        <StatCard
          label="Compliance Status"
          value="Compliant"
          trend="up"
          trendValue="within limits"
          color="#059669"
        />
        <StatCard
          label="Avg Capture Rate"
          value="95.5%"
          trend="up"
          trendValue="+0.3%"
          color="#059669"
          sparkline={[94.8, 95.0, 95.1, 95.2, 95.4, 95.5]}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Flare by Pad */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
            Flare Volumes by Pad
          </h3>
          <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
            Monthly MCF — Diamondback highest (new wells)
          </p>
          <BarChart data={flareBarData} unit=" MCF" />
        </div>

        {/* Monthly Trend with RRC limit */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
            Monthly Flare Trend
          </h3>
          <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
            12-month trend — dashed line = RRC limit (8,000 MCF)
          </p>
          <div className="relative">
            <AreaChart data={flareTrend} color="#EA580C" height={220} showDots />
            {/* RRC limit line overlay */}
            <div
              className="absolute left-0 right-0"
              style={{
                top: `${Math.round((1 - rrcLimit / 9000) * 220)}px`,
                borderTop: '2px dashed #DC2626',
                opacity: 0.6,
              }}
            >
              <span
                className="absolute right-0 -top-4 text-[9px] font-mono font-bold"
                style={{ color: '#DC2626' }}
              >
                RRC Limit
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Capture Rate Table + Satellite Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Capture Rate Detail */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#F1F5F9' }}>
            Pad Flare Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Pad</th>
                  <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>MCF/mo</th>
                  <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Capture</th>
                  <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Permit Exp.</th>
                </tr>
              </thead>
              <tbody>
                {FLARE_VOLUMES.map((f) => (
                  <tr key={f.padId} style={{ borderBottom: '1px solid #252B36' }}>
                    <td className="py-2 font-medium" style={{ color: '#F1F5F9' }}>{f.padName}</td>
                    <td className="py-2 text-right font-mono" style={{ color: '#CBD5E1' }}>
                      {f.monthlyMcf.toLocaleString()}
                    </td>
                    <td className="py-2 text-right font-mono" style={{ color: f.captureRate >= 0.96 ? '#059669' : '#EAB308' }}>
                      {(f.captureRate * 100).toFixed(0)}%
                    </td>
                    <td className="py-2 text-right font-mono" style={{ color: '#94A3B8' }}>
                      {f.expirationDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Satellite Imagery Placeholder */}
        <div
          className="rounded-xl p-5 flex flex-col items-center justify-center"
          style={{
            backgroundColor: '#1E2530',
            border: '2px dashed #334155',
            minHeight: 200,
          }}
        >
          <div
            className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-3"
            style={{ backgroundColor: 'rgba(124, 58, 237, 0.15)', color: '#7C3AED' }}
          >
            Coming Soon
          </div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
            Satellite Imagery Integration
          </h3>
          <p className="text-[11px] text-center max-w-xs" style={{ color: '#64748B' }}>
            Real-time satellite-based flare detection and emissions quantification.
            Integrates with Kayrros, GHGSat, and Planet Labs data feeds.
          </p>
        </div>
      </div>
    </>
  );
}
