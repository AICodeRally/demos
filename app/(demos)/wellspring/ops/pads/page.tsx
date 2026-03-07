'use client';

import { RadarChart, BarChart } from '@/components/demos/wellspring';
import { PADS } from '@/data/wellspring';

/* ── Radar data: normalize pad metrics to 0-100 scale ── */

const radarAxes = [
  {
    label: 'Production',
    value: 0, // placeholder
  },
  { label: 'Uptime', value: 0 },
  { label: 'LOE Efficiency', value: 0 },
  { label: 'Water Cut', value: 0 },
  { label: 'Safety Score', value: 0 },
];

function padRadar(pad: (typeof PADS)[number]) {
  return [
    { label: 'Production', value: Math.round((pad.avgOilBpd / 160) * 100) },
    { label: 'Uptime', value: Math.round(pad.uptime * 100) },
    { label: 'LOE Efficiency', value: Math.round((1 - pad.loeBoe / 20) * 100) },
    { label: 'Water Cut', value: Math.round((1 - pad.avgWaterCut) * 100) },
    { label: 'Safety Score', value: Math.round(pad.safety * 100) },
  ];
}

const PAD_COLORS: Record<string, string> = {
  'pad-a': '#16A34A',
  'pad-b': '#EA580C',
  'pad-c': '#2563EB',
  'pad-d': '#7C3AED',
};

const productionComparison = PADS.map((p) => ({
  label: p.name.replace(' Pad', ''),
  value: p.avgOilBpd * p.activeWells,
  color: PAD_COLORS[p.id],
}));

export default function OpsPadsPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-mono mb-1"
          style={{ color: '#0D9488' }}
        >
          Act 4 &middot; Operations Manager
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#F1F5F9' }}>
          Pad Comparison
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Side-by-side performance across 4 pad locations
        </p>
      </div>

      {/* Radar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {PADS.map((pad) => (
          <div
            key={pad.id}
            className="rounded-xl border p-5 flex flex-col items-center"
            style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
          >
            <h3 className="text-sm font-semibold mb-1 self-start" style={{ color: '#F1F5F9' }}>
              {pad.name}
            </h3>
            <p className="text-[11px] mb-3 self-start" style={{ color: '#64748B' }}>
              {pad.wellCount} wells &middot; {pad.county} County
            </p>
            <RadarChart
              axes={padRadar(pad)}
              maxVal={100}
              color={PAD_COLORS[pad.id]}
              size={240}
            />
          </div>
        ))}
      </div>

      {/* Production Comparison */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Production Comparison
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          Total daily BOE by pad
        </p>
        <BarChart data={productionComparison} unit=" BOE/d" />
      </div>

      {/* Detailed Metrics Table */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Detailed Pad Metrics
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          Comprehensive comparison across all operational KPIs
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Pad</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Wells</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Avg Oil</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Avg Gas</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Water Cut</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>LOE/BOE</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Uptime</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Safety</th>
              </tr>
            </thead>
            <tbody>
              {PADS.map((pad) => (
                <tr key={pad.id} style={{ borderBottom: '1px solid #252B36' }}>
                  <td className="py-2">
                    <span className="font-medium" style={{ color: PAD_COLORS[pad.id] }}>
                      {pad.name}
                    </span>
                  </td>
                  <td className="py-2 text-right font-mono" style={{ color: '#CBD5E1' }}>
                    {pad.activeWells}/{pad.wellCount}
                  </td>
                  <td className="py-2 text-right font-mono" style={{ color: '#CBD5E1' }}>
                    {pad.avgOilBpd} bpd
                  </td>
                  <td className="py-2 text-right font-mono" style={{ color: '#CBD5E1' }}>
                    {Math.round(pad.avgOilBpd * 2.1)} Mcfd
                  </td>
                  <td className="py-2 text-right font-mono" style={{ color: pad.avgWaterCut > 0.4 ? '#DC2626' : '#CBD5E1' }}>
                    {(pad.avgWaterCut * 100).toFixed(0)}%
                  </td>
                  <td className="py-2 text-right font-mono" style={{ color: '#CBD5E1' }}>
                    ${pad.loeBoe.toFixed(2)}
                  </td>
                  <td className="py-2 text-right font-mono" style={{ color: pad.uptime >= 0.95 ? '#059669' : '#CBD5E1' }}>
                    {(pad.uptime * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 text-right font-mono" style={{ color: pad.safety >= 1.0 ? '#059669' : '#CBD5E1' }}>
                    {(pad.safety * 100).toFixed(0)}%
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
