'use client';

import { BranchMap, HeatMap, BarChart } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const BRANCHES = [
  { id: 'b1', name: 'Main Street Flagship', x: 140, y: 140, county: 'Lakeshore', deposits: '$142M', members: 18200, status: 'flagship' as const },
  { id: 'b2', name: 'Harbor View', x: 180, y: 120, county: 'Lakeshore', deposits: '$98M', members: 12400, status: 'standard' as const },
  { id: 'b3', name: 'County Seat', x: 120, y: 180, county: 'Lakeshore', deposits: '$94M', members: 11800, status: 'standard' as const },
  { id: 'b4', name: 'Lakefront Plaza', x: 200, y: 160, county: 'Lakeshore', deposits: '$76M', members: 9200, status: 'standard' as const },
  { id: 'b5', name: 'Westside Express', x: 80, y: 150, county: 'Lakeshore', deposits: '$52M', members: 6800, status: 'express' as const },
  { id: 'b6', name: 'University Branch', x: 160, y: 200, county: 'Lakeshore', deposits: '$48M', members: 7400, status: 'standard' as const },
  { id: 'b7', name: 'Riverside Drive', x: 220, y: 200, county: 'Lakeshore', deposits: '$44M', members: 5600, status: 'express' as const },
  { id: 'b8', name: 'Bayfield Central', x: 340, y: 100, county: 'Bayfield', deposits: '$88M', members: 10600, status: 'flagship' as const },
  { id: 'b9', name: 'Washburn Station', x: 380, y: 140, county: 'Bayfield', deposits: '$72M', members: 8800, status: 'standard' as const },
  { id: 'b10', name: 'Red Cliff Commons', x: 310, y: 80, county: 'Bayfield', deposits: '$56M', members: 6200, status: 'standard' as const },
  { id: 'b11', name: 'Iron River Express', x: 420, y: 110, county: 'Bayfield', deposits: '$38M', members: 4800, status: 'express' as const },
  { id: 'b12', name: 'Cable Junction', x: 360, y: 180, county: 'Bayfield', deposits: '$32M', members: 3600, status: 'express' as const },
  { id: 'b13', name: 'Northshore Plaza', x: 460, y: 130, county: 'Ashland', deposits: '$82M', members: 9800, status: 'flagship' as const },
  { id: 'b14', name: 'Ashland Main', x: 500, y: 160, county: 'Ashland', deposits: '$68M', members: 8200, status: 'standard' as const },
  { id: 'b15', name: 'Marengo Valley', x: 530, y: 200, county: 'Ashland', deposits: '$46M', members: 5400, status: 'standard' as const },
  { id: 'b16', name: 'Mellen Express', x: 480, y: 220, county: 'Ashland', deposits: '$28M', members: 3200, status: 'express' as const },
  { id: 'b17', name: 'Glidden Square', x: 440, y: 190, county: 'Ashland', deposits: '$22M', members: 2800, status: 'express' as const },
  { id: 'b18', name: 'Butternut Creek', x: 520, y: 240, county: 'Ashland', deposits: '$18M', members: 2200, status: 'express' as const },
];

const HEATMAP_BRANCHES = [
  'Main Street Flagship',
  'Bayfield Central',
  'Northshore Plaza',
  'Harbor View',
  'County Seat',
  'Washburn Station',
];

const HEATMAP_KPIS = ['Deposits', 'Loans', 'Members', 'Satisfaction'];

const HEATMAP_DATA = [
  [92, 88, 95, 91],
  [85, 82, 78, 88],
  [80, 76, 72, 85],
  [78, 74, 82, 79],
  [75, 72, 76, 82],
  [70, 68, 64, 86],
];

const TOP_BRANCHES_BY_DEPOSITS = [
  { label: 'Main St Flagship', value: 142 },
  { label: 'Harbor View', value: 98 },
  { label: 'County Seat', value: 94 },
  { label: 'Bayfield Central', value: 88 },
  { label: 'Northshore Plaza', value: 82 },
  { label: 'Lakefront Plaza', value: 76 },
  { label: 'Washburn Station', value: 72 },
  { label: 'Ashland Main', value: 68 },
  { label: 'Red Cliff Commons', value: 56 },
  { label: 'Westside Express', value: 52 },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function BranchNetwork() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Branch Network</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>18 branches across Lakeshore, Bayfield &amp; Ashland counties</p>
      </div>

      {/* Branch Map */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Geographic Coverage</h2>
        <BranchMap branches={BRANCHES} />
      </div>

      {/* HeatMap */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Branch Performance Matrix</h2>
        <HeatMap
          rows={HEATMAP_BRANCHES}
          cols={HEATMAP_KPIS}
          data={HEATMAP_DATA}
          colorScale={{ low: '#B91C1C', mid: '#F59E0B', high: '#6B8F71' }}
        />
      </div>

      {/* Top 10 Branches by Deposits */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Top 10 Branches by Deposits ($M)</h2>
        <BarChart data={TOP_BRANCHES_BY_DEPOSITS} color="#475569" unit="M" />
      </div>
    </>
  );
}
