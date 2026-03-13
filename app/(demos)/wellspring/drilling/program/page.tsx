'use client';

import { StatCard, WellboreSchematic } from '@/components/demos/wellspring';
import { ACTIVE_DRILLING } from '@/data/wellspring/drilling';

/* ── Use first active well's casing program ──────────── */

const well = ACTIVE_DRILLING[0];
const casing = well.casingProgram;

/* ── Casing table data ───────────────────────────────── */

const CASING_TABLE = [
  { section: 'Surface', diameter: '13-3/8"', weight: '68 lb/ft', depth: '1,800 ft', cement: 'Returns to surface' },
  { section: 'Intermediate', diameter: '9-5/8"', weight: '47 lb/ft', depth: '5,200 ft', cement: '500 ft above shoe' },
  { section: 'Production', diameter: '5-1/2"', weight: '23 lb/ft', depth: '12,800 ft', cement: 'Full lateral' },
  { section: 'Liner', diameter: '4-1/2"', weight: '13.5 lb/ft', depth: '12,800 ft', cement: 'Cemented liner' },
];

export default function WellProgramPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase mb-1"
          style={{ color: '#6B7280' }}
        >
          Act 2 &middot; Drilling Superintendent
        </div>
        <h1
          className="text-3xl font-extrabold"
          style={{ color: '#F1F5F9' }}
        >
          Well Program
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          {well.name} &middot; Wolfcamp A lateral &middot; Reeves County
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total Depth"
          value="12,450 ft"
          trend="flat"
          trendValue="MD"
          color="#6B7280"
        />
        <StatCard
          label="Lateral Length"
          value="10,200 ft"
          trend="flat"
          trendValue="Wolfcamp A"
          color="#6B7280"
        />
        <StatCard
          label="Perf Clusters"
          value="42"
          trend="flat"
          trendValue="3 zones"
          color="#6B7280"
        />
        <StatCard
          label="Frac Stages"
          value="38"
          trend="flat"
          trendValue="plug & perf"
          color="#6B7280"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Wellbore Schematic */}
        <WellboreSchematic
          surfaceCasing={{ depth: casing[1].depth, diameter: casing[1].size }}
          intermediateCasing={{ depth: casing[2].depth, diameter: casing[2].size }}
          productionCasing={{ depth: casing[3].depth, diameter: casing[3].size }}
          liner={{ depth: 12800, diameter: '4-1/2"' }}
          lateralLength={10200}
          targetZone="Wolfcamp A"
          totalDepth={12450}
          perforations={42}
        />

        {/* Target Zone Info Card */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
          >
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: '#F1F5F9' }}
            >
              Target Zone
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Formation', value: 'Wolfcamp A' },
                { label: 'Lateral Length', value: '10,200 ft' },
                { label: 'TVD at Landing', value: '7,812 ft' },
                { label: 'Inclination', value: '89.2°' },
                { label: 'Azimuth', value: '224.5°' },
                { label: 'Perf Clusters', value: '42 clusters in 3 zones' },
                { label: 'Frac Design', value: '38 stages — plug & perf' },
                { label: 'Proppant Load', value: '2,400 lbs/ft' },
                { label: 'Fluid Volume', value: '12.5 MMgal slickwater' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5"
                  style={{ borderBottom: '1px solid #252B36' }}
                >
                  <span className="text-[12px]" style={{ color: '#94A3B8' }}>
                    {item.label}
                  </span>
                  <span
                    className="text-[12px] font-bold tabular-nums"
                    style={{ color: '#F1F5F9' }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Casing Program Table */}
      <div
        className="rounded-xl border p-5 overflow-x-auto"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: '#F1F5F9' }}
        >
          Casing Program
        </h3>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['Section', 'Diameter', 'Weight', 'Set Depth', 'Cement'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-2 font-semibold uppercase tracking-wider"
                    style={{ color: '#94A3B8', fontSize: 10 }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {CASING_TABLE.map((c, i) => (
              <tr
                key={i}
                style={{ borderBottom: '1px solid #252B36' }}
              >
                <td className="py-2 px-2 font-medium" style={{ color: '#F1F5F9' }}>
                  {c.section}
                </td>
                <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                  {c.diameter}
                </td>
                <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                  {c.weight}
                </td>
                <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                  {c.depth}
                </td>
                <td className="py-2 px-2" style={{ color: '#94A3B8' }}>
                  {c.cement}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
