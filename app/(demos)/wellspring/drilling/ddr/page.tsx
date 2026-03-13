'use client';

import { StatCard, DepthCurve, DonutChart } from '@/components/demos/wellspring';
import { ACTIVE_DRILLING } from '@/data/wellspring/drilling';

/* ── Use the first active well for the DDR ───────────── */

const well = ACTIVE_DRILLING[0];

const depthData = well.depthTime.map((d) => ({
  day: d.day,
  depth: d.depth,
}));

/* ── Time breakdown for donut ────────────────────────── */

const TIME_SEGMENTS = [
  { label: 'Drilling', value: 68, color: '#6B7280' },
  { label: 'Tripping', value: 15, color: '#2563EB' },
  { label: 'Circulating', value: 12, color: '#B45309' },
  { label: 'Other', value: 5, color: '#94A3B8' },
];

/* ── 24-hour activity log ────────────────────────────── */

const ACTIVITY_LOG = [
  { time: '0000', entry: 'Drilling ahead at 8,100 ft — 310 ft/hr ROP, 10.2 ppg OBM' },
  { time: '0200', entry: 'Tripped to surface for BHA change — replaced stabilizer' },
  { time: '0430', entry: 'BHA #4 run in hole — motor + MWD + RSS assembly' },
  { time: '0600', entry: 'Tag bottom at 8,100 ft — resumed drilling, WOB 32 klbs' },
  { time: '0800', entry: 'Drilling ahead — 8,200 ft, adjusted toolface to 224°' },
  { time: '1000', entry: 'Survey at 8,250 ft — Inc 89.2°, Azi 224.5°, TVD 7,812 ft' },
  { time: '1200', entry: 'Circulated bottoms up — no gas shows, MW stable at 10.2 ppg' },
  { time: '1400', entry: 'Drilling ahead — 8,350 ft, ROP increased to 320 ft/hr' },
  { time: '1600', entry: 'Connection at 8,380 ft — flow check OK, no losses' },
  { time: '1800', entry: 'Drilled to 8,420 ft — current depth, torque 12,400 ft-lbs' },
  { time: '2000', entry: 'Short trip to shoe at 5,200 ft — verified hole condition good' },
  { time: '2200', entry: 'RIH to bottom — preparing to resume drilling at 8,420 ft' },
];

export default function DailyDrillingReportPage() {
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
          Daily Drilling Report
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          {well.name} &middot; {well.rigName} ({well.rigContractor}) &middot;
          Day {well.depthTime.length}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard
          label="Current Depth"
          value={`${well.currentDepth.toLocaleString()} ft`}
          trend="up"
          trendValue={`of ${well.targetDepth.toLocaleString()} ft TD`}
          color="#6B7280"
        />
        <StatCard
          label="ROP"
          value={`${well.currentRop} ft/hr`}
          trend="up"
          trendValue={`avg ${well.avgRop}`}
          color="#6B7280"
          sparkline={[240, 260, 280, 290, 300, well.currentRop]}
        />
        <StatCard
          label="Mud Weight"
          value={`${well.mudWeight} ppg`}
          trend="flat"
          trendValue={well.mudType}
          color="#6B7280"
        />
        <StatCard
          label="BHA Status"
          value="Good"
          trend="flat"
          trendValue="BHA #4"
          color="#059669"
        />
        <StatCard
          label="WOB"
          value="32 klbs"
          trend="flat"
          trendValue="on target"
          color="#6B7280"
        />
        <StatCard
          label="Torque"
          value="12,400 ft-lbs"
          trend="flat"
          trendValue="normal range"
          color="#6B7280"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Depth Curve */}
        <DepthCurve
          data={depthData}
          targetDepth={well.targetDepth}
          color="#6B7280"
          height={260}
        />

        {/* Time Breakdown */}
        <div
          className="rounded-xl border p-5 flex flex-col items-center"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3
            className="text-sm font-semibold mb-1 self-start"
            style={{ color: '#F1F5F9' }}
          >
            Time Breakdown
          </h3>
          <p
            className="text-[11px] mb-4 self-start"
            style={{ color: '#64748B' }}
          >
            Last 24 hours operational split
          </p>
          <DonutChart
            segments={TIME_SEGMENTS}
            centerValue="24h"
            centerLabel="period"
            size={200}
          />
        </div>
      </div>

      {/* 24-Hour Activity Log */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: '#F1F5F9' }}
        >
          24-Hour Activity Log
        </h3>
        <div className="max-h-96 overflow-y-auto space-y-1">
          {ACTIVITY_LOG.map((entry, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg px-3 py-2 text-[12px]"
              style={{ backgroundColor: i % 2 === 0 ? '#2A3241' : 'transparent' }}
            >
              <span
                className="font-bold tabular-nums shrink-0"
                style={{ color: '#C2A04E', width: 40 }}
              >
                {entry.time}
              </span>
              <span style={{ color: '#CBD5E1' }}>
                {entry.entry}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
