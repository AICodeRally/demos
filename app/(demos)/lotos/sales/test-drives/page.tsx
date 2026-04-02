'use client';

import { VEHICLES } from '@/data/lotos';

type Outcome = 'purchased' | 'interested' | 'follow-up' | 'not-interested';

interface TestDrive {
  date: string;
  customer: string;
  vehicle: string;
  salesperson: string;
  duration: string;
  outcome: Outcome;
}

const TEST_DRIVES: TestDrive[] = [
  { date: '2026-03-31', customer: 'Nicole Anderson', vehicle: 'STK-018', salesperson: 'Jake Moreno', duration: '35 min', outcome: 'interested' },
  { date: '2026-03-30', customer: 'David Thompson', vehicle: 'STK-013', salesperson: 'Jake Moreno', duration: '45 min', outcome: 'purchased' },
  { date: '2026-03-29', customer: 'Ashley Brown', vehicle: 'STK-011', salesperson: 'Lisa Park', duration: '30 min', outcome: 'interested' },
  { date: '2026-03-28', customer: 'Jennifer Lee', vehicle: 'STK-020', salesperson: 'Lisa Park', duration: '25 min', outcome: 'purchased' },
  { date: '2026-03-27', customer: 'Tyler Jackson', vehicle: 'STK-008', salesperson: 'Jake Moreno', duration: '20 min', outcome: 'follow-up' },
  { date: '2026-03-26', customer: 'Robert Martinez', vehicle: 'STK-017', salesperson: 'Lisa Park', duration: '30 min', outcome: 'purchased' },
  { date: '2026-03-25', customer: 'Marcus Rivera', vehicle: 'STK-016', salesperson: 'Jake Moreno', duration: '40 min', outcome: 'purchased' },
  { date: '2026-03-24', customer: 'Sarah Chen', vehicle: 'STK-009', salesperson: 'Lisa Park', duration: '35 min', outcome: 'purchased' },
  { date: '2026-03-23', customer: 'Maria Gonzalez', vehicle: 'STK-003', salesperson: 'Jake Moreno', duration: '25 min', outcome: 'not-interested' },
  { date: '2026-03-22', customer: 'James Wilson', vehicle: 'STK-002', salesperson: 'Lisa Park', duration: '30 min', outcome: 'follow-up' },
];

const OUTCOME_CONFIG: Record<Outcome, { label: string; color: string; bg: string }> = {
  purchased: { label: 'Purchased', color: '#16A34A', bg: '#F0FDF4' },
  interested: { label: 'Interested', color: '#2563EB', bg: '#EFF6FF' },
  'follow-up': { label: 'Follow-up Scheduled', color: '#D97706', bg: '#FFFBEB' },
  'not-interested': { label: 'Not Interested', color: '#6B7280', bg: '#F9FAFB' },
};

function getVehicleLabel(stockId: string): string {
  const v = VEHICLES.find((v) => v.id === stockId);
  if (!v) return stockId;
  return `${v.year} ${v.make} ${v.model} ${v.trim}`;
}

export default function TestDrivesPage() {
  const totalDrives = TEST_DRIVES.length;
  const purchased = TEST_DRIVES.filter((d) => d.outcome === 'purchased').length;
  const conversionRate = Math.round((purchased / totalDrives) * 100);

  // Parse duration minutes for average
  const totalMinutes = TEST_DRIVES.reduce((sum, d) => {
    return sum + parseInt(d.duration);
  }, 0);
  const avgMinutes = Math.round(totalMinutes / totalDrives);

  const outcomeCounts = TEST_DRIVES.reduce<Record<Outcome, number>>(
    (acc, d) => { acc[d.outcome] = (acc[d.outcome] || 0) + 1; return acc; },
    { purchased: 0, interested: 0, 'follow-up': 0, 'not-interested': 0 }
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Test Drive Log
        </h1>
        <p className="mt-1 text-base" style={{ color: '#57534E' }}>
          {totalDrives} test drives recorded — March 2026
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Total Drives (March)
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>
            {totalDrives}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>this month</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Conversion Rate
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#16A34A' }}>
            {conversionRate}%
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>{purchased} purchased after drive</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Avg Test Drive Time
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#2563EB' }}>
            {avgMinutes} min
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>per customer</p>
        </div>
      </div>

      {/* Outcome Breakdown */}
      <div className="grid grid-cols-4 gap-3">
        {(Object.entries(OUTCOME_CONFIG) as [Outcome, typeof OUTCOME_CONFIG[Outcome]][]).map(([outcome, cfg]) => (
          <div
            key={outcome}
            className="rounded-xl border p-4"
            style={{ backgroundColor: cfg.bg, borderColor: '#E7E5E4' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
              {cfg.label}
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: cfg.color }}>
              {outcomeCounts[outcome]}
            </p>
          </div>
        ))}
      </div>

      {/* Test Drive Table */}
      <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E7E5E4' }}>
              <th className="text-left px-5 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Date
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Customer
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Vehicle
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Salesperson
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Duration
              </th>
              <th className="text-left px-5 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Outcome
              </th>
            </tr>
          </thead>
          <tbody>
            {TEST_DRIVES.map((drive, i) => {
              const cfg = OUTCOME_CONFIG[drive.outcome];
              const vehicleLabel = getVehicleLabel(drive.vehicle);
              return (
                <tr
                  key={i}
                  style={{ borderBottom: i < TEST_DRIVES.length - 1 ? '1px solid #F5F5F4' : undefined }}
                >
                  <td className="px-5 py-3" style={{ color: '#57534E' }}>
                    {drive.date}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1C1917' }}>
                    {drive.customer}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: '#1C1917' }}>{vehicleLabel}</p>
                    <p className="text-xs" style={{ color: '#78716C' }}>{drive.vehicle}</p>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#57534E' }}>
                    {drive.salesperson}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#57534E' }}>
                    {drive.duration}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}20` }}
                    >
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
