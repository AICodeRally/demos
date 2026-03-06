'use client';

import { useState } from 'react';
import { FormatSelector, StatCard, BarChart, HeatMap, ConfidenceBand, WaterfallChart } from '@/components/demos/register';
import { FORMAT_META, type FormatId } from '@/data/register/store-data';

/* ── Target data ──────────────────────────────────────────── */

const WATERFALL_DATA = [
  { label: 'Corporate', value: 1400, type: 'add' as const },
  { label: 'Flagship', value: 420, type: 'subtract' as const },
  { label: 'Standard', value: 560, type: 'subtract' as const },
  { label: 'Outlet', value: 280, type: 'subtract' as const },
  { label: 'SiS', value: 140, type: 'subtract' as const },
  { label: 'Net', value: 0, type: 'total' as const },
];

const TARGET_VS_ACTUAL: Record<FormatId, { label: string; value: number; color?: string }[]> = {
  flagship: [
    { label: 'Target', value: 420, color: '#06B6D422' },
    { label: 'Actual', value: 388, color: '#06B6D4' },
  ],
  standard: [
    { label: 'Target', value: 560, color: '#06B6D422' },
    { label: 'Actual', value: 532, color: '#06B6D4' },
  ],
  outlet: [
    { label: 'Target', value: 280, color: '#06B6D422' },
    { label: 'Actual', value: 248, color: '#06B6D4' },
  ],
  'shop-in-shop': [
    { label: 'Target', value: 140, color: '#06B6D422' },
    { label: 'Actual', value: 118, color: '#06B6D4' },
  ],
};

const STORE_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SAMPLE_STORES = [
  'NYC Flagship', 'LA Premium', 'Chicago Main', 'Dallas Hub', 'Seattle Core',
  'Miami Beach', 'Denver West', 'Boston Back Bay', 'Phoenix Center', 'ATL South',
];
const STORE_ATTAINMENT = [
  [95, 88, 102, 91, 85, 110, 98, 92, 88, 105, 112, 96],
  [82, 78, 91, 88, 76, 94, 85, 80, 75, 92, 98, 88],
  [105, 98, 108, 102, 95, 115, 110, 105, 98, 112, 120, 108],
  [72, 68, 78, 75, 65, 82, 78, 72, 68, 80, 85, 76],
  [90, 85, 95, 92, 82, 100, 95, 88, 85, 98, 105, 92],
  [88, 82, 96, 90, 78, 98, 92, 86, 82, 95, 102, 90],
  [55, 48, 62, 58, 45, 68, 60, 52, 48, 65, 72, 58],
  [98, 92, 105, 100, 88, 108, 102, 96, 92, 106, 115, 102],
  [65, 58, 72, 68, 55, 76, 70, 62, 58, 74, 80, 68],
  [78, 72, 85, 80, 68, 88, 82, 76, 72, 86, 92, 82],
];

const CONFIDENCE_DATA = [
  { label: 'Q1', value: 340, low: 310, high: 368 },
  { label: 'Q2', value: 690, low: 638, high: 742 },
  { label: 'H1', value: 710, low: 648, high: 762 },
  { label: 'Q3', value: 1060, low: 968, high: 1142 },
  { label: 'Q4', value: 1380, low: 1280, high: 1480 },
  { label: 'FY', value: 1400, low: 1280, high: 1520 },
];

const REP_QUOTAS: Record<FormatId, { name: string; format: string; store: string; quota: string; actual: string; attainment: number; pacing: string }[]> = {
  flagship: [
    { name: 'Alex Rivera', format: 'Flagship', store: 'NYC SoHo', quota: '$1.8M', actual: '$1.62M', attainment: 90, pacing: 'On Track' },
    { name: 'Brianna Lee', format: 'Flagship', store: 'LA Beverly', quota: '$2.0M', actual: '$1.92M', attainment: 96, pacing: 'On Track' },
    { name: 'Carlos Mendez', format: 'Flagship', store: 'Chicago Gold', quota: '$1.6M', actual: '$1.28M', attainment: 80, pacing: 'At Risk' },
    { name: 'Diana Foster', format: 'Flagship', store: 'Dallas NP', quota: '$1.5M', actual: '$1.65M', attainment: 110, pacing: 'Ahead' },
    { name: 'Eric Yang', format: 'Flagship', store: 'Miami Design', quota: '$1.7M', actual: '$1.19M', attainment: 70, pacing: 'Behind' },
    { name: 'Fatima Hassan', format: 'Flagship', store: 'Seattle Pike', quota: '$1.4M', actual: '$1.33M', attainment: 95, pacing: 'On Track' },
    { name: 'George Park', format: 'Flagship', store: 'Boston Back', quota: '$1.6M', actual: '$0.96M', attainment: 60, pacing: 'Behind' },
    { name: 'Hannah Webb', format: 'Flagship', store: 'Denver LoDo', quota: '$1.3M', actual: '$1.24M', attainment: 95, pacing: 'On Track' },
    { name: 'Ivan Torres', format: 'Flagship', store: 'Phoenix Sctd', quota: '$1.4M', actual: '$1.54M', attainment: 110, pacing: 'Ahead' },
    { name: 'Julia Kapoor', format: 'Flagship', store: 'ATL Buckhead', quota: '$1.5M', actual: '$1.35M', attainment: 90, pacing: 'On Track' },
  ],
  standard: [
    { name: 'Kevin Shaw', format: 'Standard', store: '#104 Raleigh', quota: '$520K', actual: '$468K', attainment: 90, pacing: 'On Track' },
    { name: 'Laura Chen', format: 'Standard', store: '#108 Tampa', quota: '$480K', actual: '$408K', attainment: 85, pacing: 'On Track' },
    { name: 'Mike Adams', format: 'Standard', store: '#112 Portland', quota: '$440K', actual: '$396K', attainment: 90, pacing: 'On Track' },
    { name: 'Nina Patel', format: 'Standard', store: '#115 Austin', quota: '$500K', actual: '$350K', attainment: 70, pacing: 'Behind' },
    { name: 'Oscar Ruiz', format: 'Standard', store: '#118 Nashville', quota: '$460K', actual: '$460K', attainment: 100, pacing: 'On Track' },
    { name: 'Priya Gupta', format: 'Standard', store: '#121 Charlotte', quota: '$440K', actual: '$484K', attainment: 110, pacing: 'Ahead' },
    { name: 'Quinn Davis', format: 'Standard', store: '#125 SLC', quota: '$400K', actual: '$320K', attainment: 80, pacing: 'At Risk' },
    { name: 'Rachel Kim', format: 'Standard', store: '#130 Columbus', quota: '$420K', actual: '$378K', attainment: 90, pacing: 'On Track' },
    { name: 'Sam Wright', format: 'Standard', store: '#134 Memphis', quota: '$380K', actual: '$342K', attainment: 90, pacing: 'On Track' },
    { name: 'Tina Moore', format: 'Standard', store: '#138 Detroit', quota: '$460K', actual: '$276K', attainment: 60, pacing: 'Behind' },
  ],
  outlet: [
    { name: 'Uma Nair', format: 'Outlet', store: 'OTL Phoenix', quota: '$280K', actual: '$252K', attainment: 90, pacing: 'On Track' },
    { name: 'Victor Soto', format: 'Outlet', store: 'OTL Orlando', quota: '$300K', actual: '$270K', attainment: 90, pacing: 'On Track' },
    { name: 'Wendy Lu', format: 'Outlet', store: 'OTL Houston', quota: '$260K', actual: '$182K', attainment: 70, pacing: 'Behind' },
    { name: 'Xander Voss', format: 'Outlet', store: 'OTL Vegas', quota: '$320K', actual: '$352K', attainment: 110, pacing: 'Ahead' },
    { name: 'Yara Diaz', format: 'Outlet', store: 'OTL Dallas', quota: '$240K', actual: '$216K', attainment: 90, pacing: 'On Track' },
    { name: 'Zach Bell', format: 'Outlet', store: 'OTL Atlanta', quota: '$260K', actual: '$208K', attainment: 80, pacing: 'At Risk' },
    { name: 'Amy Lin', format: 'Outlet', store: 'OTL Denver', quota: '$220K', actual: '$198K', attainment: 90, pacing: 'On Track' },
    { name: 'Ben Cruz', format: 'Outlet', store: 'OTL Miami', quota: '$280K', actual: '$168K', attainment: 60, pacing: 'Behind' },
    { name: 'Cora Wang', format: 'Outlet', store: 'OTL Chicago', quota: '$240K', actual: '$264K', attainment: 110, pacing: 'Ahead' },
    { name: 'Dan Kim', format: 'Outlet', store: 'OTL Seattle', quota: '$200K', actual: '$180K', attainment: 90, pacing: 'On Track' },
  ],
  'shop-in-shop': [
    { name: 'Eva Scott', format: 'SiS', store: 'Macys NYC', quota: '$120K', actual: '$108K', attainment: 90, pacing: 'On Track' },
    { name: 'Finn Walsh', format: 'SiS', store: 'Macys LA', quota: '$110K', actual: '$99K', attainment: 90, pacing: 'On Track' },
    { name: 'Gina Tran', format: 'SiS', store: 'Nordstrom SF', quota: '$100K', actual: '$70K', attainment: 70, pacing: 'Behind' },
    { name: 'Harry Cole', format: 'SiS', store: 'Macys Chicago', quota: '$90K', actual: '$81K', attainment: 90, pacing: 'On Track' },
    { name: 'Iris Novak', format: 'SiS', store: 'Nordstrom SEA', quota: '$95K', actual: '$104K', attainment: 110, pacing: 'Ahead' },
    { name: 'Jake Park', format: 'SiS', store: 'Macys Dallas', quota: '$85K', actual: '$76K', attainment: 90, pacing: 'On Track' },
    { name: 'Kira Jain', format: 'SiS', store: 'Nordstrom ATL', quota: '$80K', actual: '$56K', attainment: 70, pacing: 'Behind' },
    { name: 'Leo Nash', format: 'SiS', store: 'Macys Miami', quota: '$100K', actual: '$90K', attainment: 90, pacing: 'On Track' },
    { name: 'Mia Young', format: 'SiS', store: 'Nordstrom DEN', quota: '$75K', actual: '$82K', attainment: 110, pacing: 'Ahead' },
    { name: 'Nate Fox', format: 'SiS', store: 'Macys Boston', quota: '$90K', actual: '$72K', attainment: 80, pacing: 'At Risk' },
  ],
};

function pacingColor(pacing: string) {
  if (pacing === 'Ahead') return '#10B981';
  if (pacing === 'On Track') return '#06B6D4';
  if (pacing === 'At Risk') return '#F59E0B';
  return '#EF4444';
}

export default function StoreTargets() {
  const [format, setFormat] = useState<string>('flagship');
  const currentFormat = format as FormatId;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Store Targets</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          $1.4B corporate target cascading through districts, formats, stores, and rep quotas
        </p>
      </div>

      {/* Waterfall: Target Cascade */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Target Cascade — Corporate to Format Allocation ($M)
        </p>
        <WaterfallChart data={WATERFALL_DATA} height={280} />
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* KPI + Bar Chart */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="On Target" value="142 stores" trend="up" trendValue="+8 vs Q3" color="#10B981" />
        <StatCard label="At Risk" value="38 stores" trend="flat" trendValue="no change" color="#F59E0B" />
        <StatCard label="Below Plan" value="20 stores" trend="down" trendValue="-3 vs Q3" color="#EF4444" />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Target vs Actual — {FORMAT_META[currentFormat].name} ($M)
          </p>
          <BarChart data={TARGET_VS_ACTUAL[currentFormat]} unit="M" />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Year-End Revenue Projection ($M)
          </p>
          <ConfidenceBand data={CONFIDENCE_DATA} color="#06B6D4" height={180} />
          <div className="flex justify-center gap-4 mt-2">
            <span className="text-[10px]" style={{ color: '#94A3B8' }}>Low: $1.28B</span>
            <span className="text-[10px] font-semibold" style={{ color: '#06B6D4' }}>Center: $1.40B</span>
            <span className="text-[10px]" style={{ color: '#94A3B8' }}>High: $1.52B</span>
          </div>
        </div>
      </div>

      {/* Store x Month Attainment HeatMap */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Store Attainment by Month (% of target)
        </p>
        <HeatMap
          rows={SAMPLE_STORES}
          cols={STORE_MONTHS}
          data={STORE_ATTAINMENT}
          colorScale={{ low: '#EF4444', mid: '#F59E0B', high: '#10B981' }}
        />
      </div>

      {/* Rep Quota Table */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Rep Quotas — {FORMAT_META[currentFormat].name}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                {['Name', 'Format', 'Store', 'Quota', 'Actual', 'Attainment', 'Pacing'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-semibold" style={{ color: '#94A3B8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REP_QUOTAS[currentFormat].map((r) => (
                <tr key={r.name} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td className="py-2 px-3 font-medium" style={{ color: '#0F172A' }}>{r.name}</td>
                  <td className="py-2 px-3" style={{ color: '#475569' }}>{r.format}</td>
                  <td className="py-2 px-3" style={{ color: '#475569' }}>{r.store}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: '#0F172A' }}>{r.quota}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: '#0F172A' }}>{r.actual}</td>
                  <td className="py-2 px-3 font-mono font-semibold" style={{ color: r.attainment >= 100 ? '#10B981' : r.attainment >= 80 ? '#06B6D4' : '#EF4444' }}>
                    {r.attainment}%
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: `${pacingColor(r.pacing)}18`, color: pacingColor(r.pacing) }}
                    >
                      {r.pacing}
                    </span>
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
