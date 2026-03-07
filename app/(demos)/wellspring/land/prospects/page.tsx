'use client';

import { StatCard, BubbleChart } from '@/components/demos/wellspring';

/* ── Prospect pipeline data ──────────────────────────── */

const PROSPECTS = [
  {
    name: 'Eagle Ford Prospect',
    county: 'Pecos',
    acreage: 3200,
    estReserves: 12000,
    costPerAcre: 2800,
    totalCost: 8960000,
    recommendation: 'Strong Buy',
    recColor: '#059669',
  },
  {
    name: 'Salt Creek Unit',
    county: 'Reeves',
    acreage: 640,
    estReserves: 2400,
    costPerAcre: 3100,
    totalCost: 1984000,
    recommendation: 'Evaluate',
    recColor: '#C2A04E',
  },
  {
    name: 'Bone Spring Play',
    county: 'Loving',
    acreage: 480,
    estReserves: 3600,
    costPerAcre: 4200,
    totalCost: 2016000,
    recommendation: 'Strong Buy',
    recColor: '#059669',
  },
  {
    name: 'Delaware Basin Ext.',
    county: 'Reeves',
    acreage: 800,
    estReserves: 1800,
    costPerAcre: 2200,
    totalCost: 1760000,
    recommendation: 'Evaluate',
    recColor: '#C2A04E',
  },
  {
    name: 'Toyah Basin Wildcat',
    county: 'Reeves',
    acreage: 200,
    estReserves: 600,
    costPerAcre: 1500,
    totalCost: 300000,
    recommendation: 'Pass',
    recColor: '#DC2626',
  },
];

/* ── Normalize to 0-100 scale for BubbleChart ────────── */

const maxAcreage = 3500;
const maxReserves = 13000;
const maxCost = 9000000;

const BUBBLE_DATA = PROSPECTS.map((p) => ({
  x: (p.acreage / maxAcreage) * 100,
  y: (p.estReserves / maxReserves) * 100,
  size: (p.totalCost / maxCost) * 100,
  color: p.recColor,
  label: p.name,
}));

const pipelineValue = PROSPECTS.reduce((s, p) => s + p.totalCost, 0);

export default function ProspectsPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-mono mb-1"
          style={{ color: '#C2A04E' }}
        >
          Act 1 &middot; The Landman
        </div>
        <h1
          className="text-2xl font-extrabold"
          style={{ color: '#F1F5F9' }}
        >
          Prospect Pipeline
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Acquisition targets &middot; Permian Basin expansion opportunities
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard
          label="Pipeline Value"
          value={`$${(pipelineValue / 1_000_000).toFixed(1)}M`}
          trend="up"
          trendValue="+$2.1M"
          color="#C2A04E"
          sparkline={[8.2, 9.1, 10.5, 11.8, 13.2, pipelineValue / 1_000_000]}
        />
        <StatCard
          label="Prospects"
          value={String(PROSPECTS.length)}
          trend="flat"
          trendValue="active"
          color="#C2A04E"
        />
        <StatCard
          label="Under Evaluation"
          value="3"
          trend="up"
          trendValue="2 strong buy"
          color="#C2A04E"
          sparkline={[1, 1, 2, 2, 3, 3]}
        />
      </div>

      {/* Bubble Chart */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3
          className="text-sm font-semibold mb-1"
          style={{ color: '#F1F5F9' }}
        >
          Prospect Matrix
        </h3>
        <p
          className="text-[11px] mb-4"
          style={{ color: '#64748B' }}
        >
          X: Acreage &middot; Y: Est. Reserves (MBOE) &middot; Size: Acquisition
          Cost
        </p>
        <BubbleChart
          data={BUBBLE_DATA}
          xLabel="Acreage (0–3,500 ac)"
          yLabel="Est. Reserves (0–13K MBOE)"
          height={320}
        />
      </div>

      {/* Prospects Table */}
      <div
        className="rounded-xl border p-5 overflow-x-auto"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: '#F1F5F9' }}
        >
          Prospect Detail
        </h3>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {[
                'Prospect',
                'County',
                'Acreage',
                'Est. Reserves',
                'Cost/Acre',
                'Recommendation',
              ].map((h) => (
                <th
                  key={h}
                  className="text-left py-2 px-2 font-semibold uppercase tracking-wider"
                  style={{ color: '#94A3B8', fontSize: 10 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROSPECTS.map((p, i) => (
              <tr
                key={i}
                style={{ borderBottom: '1px solid #252B36' }}
              >
                <td className="py-2 px-2 font-medium" style={{ color: '#F1F5F9' }}>
                  {p.name}
                </td>
                <td className="py-2 px-2" style={{ color: '#CBD5E1' }}>
                  {p.county}
                </td>
                <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                  {p.acreage.toLocaleString()}
                </td>
                <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                  {p.estReserves.toLocaleString()} MBOE
                </td>
                <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                  ${p.costPerAcre.toLocaleString()}
                </td>
                <td className="py-2 px-2">
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: p.recColor }}
                  >
                    {p.recommendation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
