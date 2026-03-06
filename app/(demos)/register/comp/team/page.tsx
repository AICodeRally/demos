'use client';

import { useState } from 'react';
import { FormatSelector, RadarChart, BarChart, HeatMap, BubbleChart } from '@/components/demos/register';
import { type FormatId } from '@/data/register/store-data';

/* ── Team leaderboard data ───────────────────────────────── */

const LEADERBOARD = [
  { rank: 1, name: 'Sarah J.', totalComp: '$6,840', asp: '$2,890', attachRate: '48%', conversion: '42%', csat: '4.9', format: 'flagship' },
  { rank: 2, name: 'Marcus W.', totalComp: '$5,620', asp: '$2,410', attachRate: '42%', conversion: '38%', csat: '4.7', format: 'flagship' },
  { rank: 3, name: 'Diana K.', totalComp: '$5,180', asp: '$2,280', attachRate: '39%', conversion: '36%', csat: '4.8', format: 'standard' },
  { rank: 4, name: 'Emily R.', totalComp: '$4,520', asp: '$1,940', attachRate: '35%', conversion: '34%', csat: '4.6', format: 'standard' },
  { rank: 5, name: 'James T.', totalComp: '$4,100', asp: '$1,420', attachRate: '31%', conversion: '32%', csat: '4.5', format: 'standard' },
  { rank: 6, name: 'Raj P.', totalComp: '$3,880', asp: '$1,680', attachRate: '28%', conversion: '30%', csat: '4.4', format: 'outlet' },
  { rank: 7, name: 'Kim L.', totalComp: '$3,420', asp: '$1,520', attachRate: '24%', conversion: '28%', csat: '4.3', format: 'outlet' },
  { rank: 8, name: 'Casey M.', totalComp: '$2,640', asp: '$1,180', attachRate: '12%', conversion: '22%', csat: '4.1', format: 'shop-in-shop' },
];

/* ── Radar: Sarah J. vs store average ────────────────────── */

const SARAH_RADAR = [
  { label: 'Revenue', value: 92 },
  { label: 'ASP', value: 88 },
  { label: 'Attach Rate', value: 85 },
  { label: 'Conversion', value: 78 },
  { label: 'SPIFFs', value: 90 },
  { label: 'CSAT', value: 95 },
];

const STORE_AVG_BENCHMARK = [65, 62, 58, 55, 52, 72];

/* ── Commission distribution ─────────────────────────────── */

const COMMISSION_DIST = [
  { label: 'Sarah J.', value: 6.84, color: '#10B981' },
  { label: 'Marcus W.', value: 5.62, color: '#10B981' },
  { label: 'Diana K.', value: 5.18, color: '#1E3A5F' },
  { label: 'Emily R.', value: 4.52, color: '#1E3A5F' },
  { label: 'James T.', value: 4.10, color: '#06B6D4' },
  { label: 'Raj P.', value: 3.88, color: '#06B6D4' },
  { label: 'Kim L.', value: 3.42, color: '#8B5CF6' },
  { label: 'Casey M.', value: 2.64, color: '#8B5CF6' },
];

/* ── HeatMap: 8 reps x 5 dimensions ─────────────────────── */

const REP_NAMES = ['Sarah J.', 'Marcus W.', 'Diana K.', 'Emily R.', 'James T.', 'Raj P.', 'Kim L.', 'Casey M.'];
const PERF_DIMS = ['Revenue', 'ASP', 'Attach', 'Conversion', 'CSAT'];
const PERF_DATA = [
  [92, 88, 85, 78, 95],  // Sarah
  [82, 78, 72, 70, 88],  // Marcus
  [76, 72, 68, 65, 90],  // Diana
  [65, 60, 58, 62, 85],  // Emily
  [58, 42, 52, 58, 82],  // James
  [52, 55, 45, 48, 78],  // Raj
  [45, 48, 40, 42, 75],  // Kim
  [32, 35, 18, 28, 68],  // Casey
];

/* ── BubbleChart: Experience vs Earnings ─────────────────── */

const FORMAT_COLORS: Record<string, string> = {
  flagship: '#1E3A5F',
  standard: '#06B6D4',
  outlet: '#8B5CF6',
  'shop-in-shop': '#10B981',
};

const EXPERIENCE_DATA = [
  { x: 90, y: 85, size: 42, color: FORMAT_COLORS.flagship, label: 'Sarah J.' },
  { x: 75, y: 72, size: 38, color: FORMAT_COLORS.flagship, label: 'Marcus W.' },
  { x: 60, y: 65, size: 36, color: FORMAT_COLORS.standard, label: 'Diana K.' },
  { x: 50, y: 58, size: 34, color: FORMAT_COLORS.standard, label: 'Emily R.' },
  { x: 42, y: 52, size: 32, color: FORMAT_COLORS.standard, label: 'James T.' },
  { x: 35, y: 50, size: 30, color: FORMAT_COLORS.outlet, label: 'Raj P.' },
  { x: 25, y: 44, size: 28, color: FORMAT_COLORS.outlet, label: 'Kim L.' },
  { x: 8, y: 34, size: 22, color: FORMAT_COLORS['shop-in-shop'], label: 'Casey M.' },
];

/* ── Coaching cards ──────────────────────────────────────── */

const COACHING = [
  {
    rep: 'Casey M.',
    tenure: '2mo',
    area: 'Attach rate 12%',
    target: 'Target 35%',
    action: 'Shadow Sarah J. for 1 week',
    impact: '+$340/mo',
    color: '#EF4444',
  },
  {
    rep: 'Raj P.',
    tenure: '8mo',
    area: 'ASP $1,680',
    target: 'Target $2,100',
    action: 'Focus premium tier during next 10 ups',
    impact: '+$220/mo',
    color: '#F59E0B',
  },
  {
    rep: 'James T.',
    tenure: '14mo',
    area: 'Conversion 32%',
    target: 'Target 38%',
    action: 'Review closing techniques with Marcus',
    impact: '+$180/mo',
    color: '#F59E0B',
  },
];

export default function TeamPerformance() {
  const [format, setFormat] = useState<string>('flagship');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Team Performance</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Leaderboard, equity analysis, and coaching recommendations across all reps
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Leaderboard Table */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Sales Rep Leaderboard
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Rank</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Name</th>
                <th className="text-right py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Total Comp</th>
                <th className="text-right py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>ASP</th>
                <th className="text-right py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Attach Rate</th>
                <th className="text-right py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Conversion %</th>
                <th className="text-right py-2 font-semibold" style={{ color: '#94A3B8' }}>CSAT</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((rep) => {
                const isTop3 = rep.rank <= 3;
                return (
                  <tr
                    key={rep.rank}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      backgroundColor: isTop3 ? '#F0FDF4' : 'transparent',
                    }}
                  >
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-1.5">
                        {rep.rank === 1 ? (
                          <span
                            className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold text-white"
                            style={{ backgroundColor: '#F59E0B' }}
                          >
                            1
                          </span>
                        ) : (
                          <span
                            className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold"
                            style={{
                              backgroundColor: isTop3 ? '#10B98120' : '#F1F5F9',
                              color: isTop3 ? '#10B981' : '#475569',
                            }}
                          >
                            {rep.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 font-semibold" style={{ color: '#0F172A' }}>{rep.name}</td>
                    <td className="py-2.5 pr-4 text-right font-mono font-bold" style={{ color: '#10B981' }}>{rep.totalComp}</td>
                    <td className="py-2.5 pr-4 text-right font-mono" style={{ color: '#475569' }}>{rep.asp}</td>
                    <td className="py-2.5 pr-4 text-right font-mono" style={{ color: '#475569' }}>{rep.attachRate}</td>
                    <td className="py-2.5 pr-4 text-right font-mono" style={{ color: '#475569' }}>{rep.conversion}</td>
                    <td className="py-2.5 text-right font-mono" style={{ color: '#475569' }}>{rep.csat}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar + Commission Distribution */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>
            Sarah J. vs Store Average
          </p>
          <div className="flex justify-center">
            <RadarChart
              axes={SARAH_RADAR}
              benchmarkData={STORE_AVG_BENCHMARK}
              color="#10B981"
              size={260}
            />
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ backgroundColor: '#10B981' }} />
              <span className="text-[10px]" style={{ color: '#475569' }}>Sarah J.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded border-b border-dashed" style={{ borderColor: '#94A3B8' }} />
              <span className="text-[10px]" style={{ color: '#475569' }}>Store Avg</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Commission Distribution ($K)
          </p>
          <BarChart data={COMMISSION_DIST} unit="K" />
          <div className="mt-3 pt-2 border-t text-center" style={{ borderColor: '#F1F5F9' }}>
            <span className="text-[10px]" style={{ color: '#94A3B8' }}>
              Top 2 reps earn <span className="font-bold" style={{ color: '#10B981' }}>34%</span> of total comp &mdash; moderate concentration
            </span>
          </div>
        </div>
      </div>

      {/* HeatMap + BubbleChart */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Performance Matrix (0-100 score)
          </p>
          <HeatMap
            rows={REP_NAMES}
            cols={PERF_DIMS}
            data={PERF_DATA}
            colorScale={{ low: '#EF4444', mid: '#F59E0B', high: '#10B981' }}
          />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>
            Experience vs Earnings
          </p>
          <p className="text-[10px] mb-3" style={{ color: '#94A3B8' }}>
            x = tenure (months), y = monthly earnings ($K), size = conversion rate
          </p>
          <BubbleChart
            data={EXPERIENCE_DATA}
            xLabel="Experience (months)"
            yLabel="Monthly Earnings ($K)"
            height={280}
          />
          <div className="flex justify-center gap-3 mt-2">
            {Object.entries(FORMAT_COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] capitalize" style={{ color: '#94A3B8' }}>
                  {key === 'shop-in-shop' ? 'SiS' : key}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coaching Cards */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Coaching Recommendations
        </p>
        <div className="grid grid-cols-3 gap-4">
          {COACHING.map((coach, i) => (
            <div
              key={i}
              className="rounded-lg border-l-4 p-4"
              style={{ borderLeftColor: coach.color, backgroundColor: '#F8FAFC' }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[13px] font-bold" style={{ color: '#0F172A' }}>
                  {coach.rep}
                </p>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: '#F1F5F9', color: '#94A3B8' }}>
                  {coach.tenure}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono" style={{ color: coach.color }}>
                  {coach.area}
                </span>
                <span className="text-[10px]" style={{ color: '#94A3B8' }}>
                  ({coach.target})
                </span>
              </div>
              <div className="flex items-start gap-1.5 mb-2">
                <span className="text-[10px] font-medium shrink-0 mt-px" style={{ color: '#10B981' }}>Action:</span>
                <p className="text-[11px]" style={{ color: '#475569' }}>{coach.action}</p>
              </div>
              <div className="pt-2 border-t" style={{ borderColor: '#E2E8F0' }}>
                <span className="text-[10px] font-mono" style={{ color: '#94A3B8' }}>
                  Projected impact: <span className="font-bold" style={{ color: '#10B981' }}>{coach.impact}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
