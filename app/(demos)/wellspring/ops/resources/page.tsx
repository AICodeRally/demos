'use client';

import { HeatMap, TreeMap } from '@/components/demos/wellspring';

/* ── Crew allocation heat map data ────────────────────── */

const CREW_TYPES = ['Pumpers', 'Mechanics', 'Operators', 'Engineers', 'Consultants'];
const WEEKS = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'];

// Values 0-100 (mapped from 0-10 crew count)
const CREW_DATA = [
  [80, 70, 80, 90, 80, 70, 80, 80],  // Pumpers — usually high
  [50, 60, 40, 50, 70, 60, 50, 40],  // Mechanics — moderate
  [60, 60, 70, 60, 60, 70, 60, 60],  // Operators — steady
  [30, 20, 30, 40, 30, 20, 30, 40],  // Engineers — lower count
  [20, 10, 30, 20, 10, 20, 30, 20],  // Consultants — sporadic
];

/* ── Equipment TreeMap data ───────────────────────────── */

const EQUIPMENT = [
  { label: 'Pumps', value: 12, color: '#0D9488' },
  { label: 'Tanks', value: 8, color: '#2563EB' },
  { label: 'Trucks', value: 6, color: '#EA580C' },
  { label: 'Safety Equip', value: 3, color: '#DC2626' },
  { label: 'Chemicals', value: 4, color: '#7C3AED' },
  { label: 'Rigs', value: 2, color: '#B45309' },
];

/* ── Crew schedule data ───────────────────────────────── */

const CREW_SCHEDULE = [
  { name: 'Jake Wilson', role: 'Lead Pumper', assignment: 'Diamondback Pad — well checks', location: 'Pad D', start: 'Mar 4', end: 'Mar 7' },
  { name: 'Maria Garcia', role: 'Mechanic', assignment: 'Mustang Pad — ESP repair', location: 'Pad A', start: 'Mar 4', end: 'Mar 5' },
  { name: 'Tom Nguyen', role: 'Operator', assignment: 'Sidewinder Pad — separator maintenance', location: 'Pad C', start: 'Mar 5', end: 'Mar 6' },
  { name: 'Carlos Mendoza', role: 'HSE Officer', assignment: 'Full field HSE inspection route', location: 'All Pads', start: 'Mar 4', end: 'Mar 4' },
  { name: 'Sarah Chen', role: 'Engineer', assignment: 'Rattlesnake 17-1H — drilling optimization', location: 'Pad B', start: 'Mar 4', end: 'Mar 10' },
  { name: 'Mike O\'Brien', role: 'Pumper', assignment: 'Rattlesnake Pad — daily rounds', location: 'Pad B', start: 'Mar 4', end: 'Mar 7' },
  { name: 'Halliburton Crew', role: 'Consultant', assignment: 'Copperhead 18-1H — frac monitoring', location: 'Pad D', start: 'Mar 6', end: 'Mar 12' },
  { name: 'David Kim', role: 'Operator', assignment: 'Mustang Pad — chemical injection', location: 'Pad A', start: 'Mar 5', end: 'Mar 7' },
  { name: 'Lisa Tran', role: 'Mechanic', assignment: 'Pecos Yard — truck maintenance', location: 'Yard', start: 'Mar 4', end: 'Mar 5' },
  { name: 'Robert Smith', role: 'Lead Pumper', assignment: 'Sidewinder Pad — flowback monitoring', location: 'Pad C', start: 'Mar 4', end: 'Mar 8' },
];

export default function OpsResourcesPage() {
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
          Resource Planning
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Crew allocation, equipment utilization &amp; scheduling
        </p>
      </div>

      {/* Heat Map + TreeMap Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
            Crew Allocation — 8 Week View
          </h3>
          <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
            Headcount intensity by crew type (green = low, red = high demand)
          </p>
          <HeatMap
            rows={CREW_TYPES}
            cols={WEEKS}
            data={CREW_DATA}
            colorScale={{ low: '#1E3A5F', mid: '#0D9488', high: '#DC2626' }}
          />
        </div>

        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
            Equipment Utilization
          </h3>
          <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
            Active equipment count by category
          </p>
          <TreeMap data={EQUIPMENT} />
        </div>
      </div>

      {/* Crew Schedule Table */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Next 2 Weeks — Crew Schedule
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          Assigned personnel, location, and dates
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Name</th>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Role</th>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Assignment</th>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Location</th>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Start</th>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>End</th>
              </tr>
            </thead>
            <tbody>
              {CREW_SCHEDULE.map((crew, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #252B36' }}>
                  <td className="py-2 font-medium" style={{ color: '#F1F5F9' }}>{crew.name}</td>
                  <td className="py-2" style={{ color: '#0D9488' }}>{crew.role}</td>
                  <td className="py-2" style={{ color: '#CBD5E1' }}>{crew.assignment}</td>
                  <td className="py-2 tabular-nums" style={{ color: '#94A3B8' }}>{crew.location}</td>
                  <td className="py-2 tabular-nums" style={{ color: '#CBD5E1' }}>{crew.start}</td>
                  <td className="py-2 tabular-nums" style={{ color: '#CBD5E1' }}>{crew.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
