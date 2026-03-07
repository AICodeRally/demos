'use client';

import { StatCard, GanttChart } from '@/components/demos/wellspring';
import type { GanttBar } from '@/components/demos/wellspring';

/* ── Gantt bars: wells across 4 pads ─────────────────── */

const GANTT_BARS: GanttBar[] = [
  { id: 'w1', label: 'PBR Fed 24-1H', start: 0, duration: 36, color: '#6B7280', phase: 'Drilling' },
  { id: 'w2', label: 'PBR Fed 24-2H', start: 38, duration: 32, color: '#6B7280', phase: 'Planned' },
  { id: 'w3', label: 'Rattlesnake 17-1H', start: 8, duration: 35, color: '#2563EB', phase: 'Drilling' },
  { id: 'w4', label: 'Rattlesnake 17-2H', start: 45, duration: 30, color: '#2563EB', phase: 'Planned' },
  { id: 'w5', label: 'Sidewinder 12-1H', start: 55, duration: 28, color: '#B45309', phase: 'Planned' },
  { id: 'w6', label: 'Sidewinder 12-2H', start: 60, duration: 28, color: '#B45309', phase: 'Planned' },
  { id: 'w7', label: 'Mustang 25-1H', start: 70, duration: 30, color: '#059669', phase: 'Planned' },
  { id: 'w8', label: 'Mustang 25-2H', start: 75, duration: 30, color: '#059669', phase: 'Planned' },
];

/* ── Rig move schedule ───────────────────────────────── */

const RIG_MOVES = [
  { rig: 'Rig 47', from: 'PBR Fed 24-1H', to: 'PBR Fed 24-2H', date: '2026-03-20', status: 'Scheduled' },
  { rig: 'Rig 22', from: 'Rattlesnake 17-1H', to: 'Rattlesnake 17-2H', date: '2026-03-27', status: 'Scheduled' },
  { rig: 'Rig 47', from: 'PBR Fed 24-2H', to: 'Sidewinder 12-1H', date: '2026-04-22', status: 'Tentative' },
  { rig: 'Rig 22', from: 'Rattlesnake 17-2H', to: 'Sidewinder 12-2H', date: '2026-04-28', status: 'Tentative' },
  { rig: 'Rig 47', from: 'Sidewinder 12-1H', to: 'Mustang 25-1H', date: '2026-05-20', status: 'Tentative' },
];

const MOVE_BADGE: Record<string, { bg: string; text: string }> = {
  Scheduled: { bg: '#14432A', text: '#34D399' },
  Tentative: { bg: '#4A3400', text: '#FBBF24' },
};

export default function PadSchedulePage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-mono mb-1"
          style={{ color: '#6B7280' }}
        >
          Act 2 &middot; Drilling Superintendent
        </div>
        <h1
          className="text-2xl font-extrabold"
          style={{ color: '#F1F5F9' }}
        >
          Pad Schedule
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          2026 drilling program &middot; 8 wells across 4 pads
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Active Rigs"
          value="2"
          trend="flat"
          trendValue="Rig 47 + Rig 22"
          color="#6B7280"
        />
        <StatCard
          label="Wells Drilling"
          value="2"
          trend="flat"
          trendValue="on schedule"
          color="#6B7280"
          sparkline={[1, 1, 2, 2, 2, 2]}
        />
        <StatCard
          label="Avg Days to TD"
          value="18"
          trend="down"
          trendValue="-2 days"
          color="#6B7280"
          sparkline={[22, 21, 20, 19, 18, 18]}
        />
        <StatCard
          label="Rig Utilization"
          value="87%"
          trend="up"
          trendValue="+4%"
          color="#6B7280"
          sparkline={[78, 80, 82, 84, 86, 87]}
        />
      </div>

      {/* Gantt Chart */}
      <div className="mb-6">
        <GanttChart bars={GANTT_BARS} totalDays={110} todayOffset={22} />
      </div>

      {/* Rig Move Schedule Table */}
      <div
        className="rounded-xl border p-5 overflow-x-auto"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: '#F1F5F9' }}
        >
          Rig Move Schedule
        </h3>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['Rig', 'From Well', 'To Well', 'Move Date', 'Status'].map(
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
            {RIG_MOVES.map((m, i) => {
              const badge = MOVE_BADGE[m.status] ?? MOVE_BADGE.Tentative;
              return (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid #252B36' }}
                >
                  <td className="py-2 px-2 font-medium" style={{ color: '#F1F5F9' }}>
                    {m.rig}
                  </td>
                  <td className="py-2 px-2" style={{ color: '#CBD5E1' }}>
                    {m.from}
                  </td>
                  <td className="py-2 px-2" style={{ color: '#CBD5E1' }}>
                    {m.to}
                  </td>
                  <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                    {m.date}
                  </td>
                  <td className="py-2 px-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                      style={{ backgroundColor: badge.bg, color: badge.text }}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
