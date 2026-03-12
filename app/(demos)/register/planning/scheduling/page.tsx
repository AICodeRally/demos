'use client';

import { StatCard } from '@/components/demos/register';
import { SHIFT_SCHEDULE, type ShiftBlock } from '@/data/register/planning-data';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ROLE_COLORS: Record<ShiftBlock['role'], { bg: string; border: string; text: string; label: string }> = {
  floor: { bg: '#EDE9FE', border: '#8B5CF6', text: '#5B21B6', label: 'Floor' },
  lead: { bg: '#CFFAFE', border: '#06B6D4', text: '#0E7490', label: 'Lead' },
  closer: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E', label: 'Closer' },
};

function formatHour(h: number): string {
  if (h === 0) return '12AM';
  if (h < 12) return `${h}AM`;
  if (h === 12) return '12PM';
  return `${h - 12}PM`;
}

/* Peak day = day with most shifts */
function peakDay(): string {
  const counts: Record<string, number> = {};
  SHIFT_SCHEDULE.forEach((s) => {
    counts[s.day] = (counts[s.day] ?? 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

export default function Scheduling() {
  const totalShifts = SHIFT_SCHEDULE.length;
  const peak = peakDay();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Shift Optimization</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Weekly shift schedule by rep and role — coverage scoring and peak-day analysis
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Shifts This Week"
          value={String(totalShifts)}
          color="#1E3A5F"
        />
        <StatCard
          label="Coverage Score"
          value="92%"
          trend="up"
          trendValue="+4pp vs last week"
          color="#10B981"
        />
        <StatCard
          label="Peak Day"
          value={peak}
          color="#F59E0B"
        />
      </div>

      {/* Role legend */}
      <div className="flex items-center gap-6 mb-4">
        {(Object.entries(ROLE_COLORS) as [ShiftBlock['role'], typeof ROLE_COLORS[ShiftBlock['role']]][]).map(([role, cfg]) => (
          <div key={role} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm border"
              style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
            />
            <span className="text-[11px] font-medium" style={{ color: '#475569' }}>{cfg.label}</span>
          </div>
        ))}
        <span className="text-[11px]" style={{ color: '#94A3B8' }}>— Colors: floor=purple, lead=cyan, closer=amber</span>
      </div>

      {/* Schedule grid */}
      <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-5" style={{ color: '#0F172A' }}>Weekly Schedule Grid</p>

        {/* Day header row */}
        <div className="grid mb-2" style={{ gridTemplateColumns: '90px repeat(7, 1fr)', gap: '6px' }}>
          <div />
          {DAYS.map((d) => {
            const shiftsOnDay = SHIFT_SCHEDULE.filter((s) => s.day === d).length;
            return (
              <div key={d} className="text-center">
                <p className="text-[11px] font-bold" style={{ color: '#0F172A' }}>{d}</p>
                <p className="text-[9px]" style={{ color: '#94A3B8' }}>{shiftsOnDay} shifts</p>
              </div>
            );
          })}
        </div>

        {/* Rep rows */}
        {['Casey M.', 'Raj P.', 'James W.', 'Sarah L.', 'Mike T.', 'Anna K.'].map((rep) => {
          const repShifts = SHIFT_SCHEDULE.filter((s) => s.rep === rep);
          return (
            <div
              key={rep}
              className="grid items-center mb-2"
              style={{ gridTemplateColumns: '90px repeat(7, 1fr)', gap: '6px' }}
            >
              <span className="text-[11px] font-medium text-right pr-3" style={{ color: '#475569' }}>{rep}</span>
              {DAYS.map((day) => {
                const shift = repShifts.find((s) => s.day === day);
                if (!shift) {
                  return (
                    <div
                      key={day}
                      className="rounded-md h-10"
                      style={{ backgroundColor: '#F8FAFC' }}
                    />
                  );
                }
                const cfg = ROLE_COLORS[shift.role];
                return (
                  <div
                    key={day}
                    className="rounded-md border px-2 py-1 h-10 flex flex-col justify-center"
                    style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
                  >
                    <span className="text-[9px] font-bold leading-tight" style={{ color: cfg.text }}>
                      {cfg.label}
                    </span>
                    <span className="text-[9px] leading-tight font-mono" style={{ color: cfg.text }}>
                      {formatHour(shift.start)}–{formatHour(shift.end)}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Coverage summary strip */}
      <div className="grid grid-cols-7 gap-3 mt-6">
        {DAYS.map((day) => {
          const dayShifts = SHIFT_SCHEDULE.filter((s) => s.day === day);
          const floorCount = dayShifts.filter((s) => s.role === 'floor').length;
          const leadCount = dayShifts.filter((s) => s.role === 'lead').length;
          const closerCount = dayShifts.filter((s) => s.role === 'closer').length;
          const isPeak = day === peak;
          return (
            <div
              key={day}
              className="rounded-xl border p-3 text-center"
              style={{
                backgroundColor: isPeak ? '#FFFBEB' : '#FFFFFF',
                borderColor: isPeak ? '#FCD34D' : '#E2E8F0',
              }}
            >
              <p className="text-[11px] font-bold mb-2" style={{ color: isPeak ? '#92400E' : '#0F172A' }}>{day}</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span style={{ color: '#5B21B6' }}>Floor</span>
                  <span className="font-bold" style={{ color: '#5B21B6' }}>{floorCount}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span style={{ color: '#0E7490' }}>Lead</span>
                  <span className="font-bold" style={{ color: '#0E7490' }}>{leadCount}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span style={{ color: '#92400E' }}>Closer</span>
                  <span className="font-bold" style={{ color: '#92400E' }}>{closerCount}</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t" style={{ borderColor: '#F1F5F9' }}>
                <span className="text-[10px] font-bold" style={{ color: '#0F172A' }}>{dayShifts.length} total</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
