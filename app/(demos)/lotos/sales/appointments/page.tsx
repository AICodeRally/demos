'use client';

type AppointmentType = 'test-drive' | 'follow-up' | 'delivery' | 'phone';

interface Appointment {
  day: string;
  time: string;
  duration: number;
  type: AppointmentType;
  customer: string;
  vehicle?: string;
  note?: string;
}

const APPOINTMENTS: Appointment[] = [
  { day: 'Mon', time: '10:00', duration: 1, type: 'test-drive', customer: 'Nicole Anderson', vehicle: 'Mazda CX-5' },
  { day: 'Mon', time: '14:00', duration: 0.5, type: 'follow-up', customer: 'James Wilson', note: 'Trade-in appraisal' },
  { day: 'Tue', time: '11:00', duration: 1, type: 'test-drive', customer: 'Ashley Brown', vehicle: 'Ford Fusion' },
  { day: 'Tue', time: '15:00', duration: 1, type: 'delivery', customer: 'Sarah Chen', vehicle: 'Toyota Corolla' },
  { day: 'Wed', time: '09:00', duration: 0.5, type: 'phone', customer: 'Tyler Jackson', note: 'Credit app follow-up' },
  { day: 'Wed', time: '13:00', duration: 1, type: 'test-drive', customer: 'Maria Gonzalez', vehicle: 'Nissan Altima' },
  { day: 'Thu', time: '10:00', duration: 1, type: 'test-drive', customer: 'David Thompson', vehicle: 'Corvette Stingray' },
  { day: 'Thu', time: '14:00', duration: 0.5, type: 'follow-up', customer: 'Marcus Rivera', note: 'Lender update' },
  { day: 'Fri', time: '11:00', duration: 1, type: 'delivery', customer: 'Jennifer Lee', vehicle: 'Honda Civic' },
  { day: 'Sat', time: '09:00', duration: 1, type: 'test-drive', customer: 'Robert Martinez', vehicle: 'Chevy Malibu' },
  { day: 'Sat', time: '11:00', duration: 1, type: 'test-drive', customer: 'Nicole Anderson', vehicle: 'Toyota RAV4' },
];

const TYPE_CONFIG: Record<AppointmentType, { label: string; color: string; bg: string; border: string }> = {
  'test-drive': { label: 'Test Drive', color: '#1E40AF', bg: '#DBEAFE', border: '#93C5FD' },
  'follow-up': { label: 'Follow-up', color: '#166534', bg: '#DCFCE7', border: '#86EFAC' },
  'delivery': { label: 'Delivery', color: '#5B21B6', bg: '#EDE9FE', border: '#C4B5FD' },
  'phone': { label: 'Phone Call', color: '#92400E', bg: '#FEF3C7', border: '#FCD34D' },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LABELS: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
};

// Hours 9am to 6pm = slots 9,10,11,12,13,14,15,16,17
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];

function timeToHour(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

function formatHour(h: number): string {
  if (h === 12) return '12 PM';
  if (h > 12) return `${h - 12} PM`;
  return `${h} AM`;
}

export default function AppointmentsPage() {
  const totalCount = APPOINTMENTS.length;
  const typeCounts = APPOINTMENTS.reduce<Record<AppointmentType, number>>(
    (acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; },
    { 'test-drive': 0, 'follow-up': 0, 'delivery': 0, 'phone': 0 }
  );

  // Pixel height per hour
  const HOUR_HEIGHT = 64; // px

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Appointments
        </h1>
        <p className="mt-1 text-base" style={{ color: '#57534E' }}>
          Week of March 30 – April 5, 2026 — {totalCount} appointments scheduled
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {(Object.entries(TYPE_CONFIG) as [AppointmentType, typeof TYPE_CONFIG[AppointmentType]][]).map(([type, cfg]) => (
          <div key={type} className="rounded-xl bg-white border p-4" style={{ borderColor: '#E7E5E4' }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
              {cfg.label}
            </p>
            <p className="text-3xl font-bold mt-1" style={{ color: cfg.color }}>
              {typeCounts[type]}
            </p>
          </div>
        ))}
      </div>

      {/* Week Calendar */}
      <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #E7E5E4' }}>
          <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>Week View</h2>
        </div>

        {/* Calendar grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            {/* Day headers */}
            <div className="grid" style={{ gridTemplateColumns: '56px repeat(6, 1fr)' }}>
              <div style={{ borderBottom: '1px solid #E7E5E4', borderRight: '1px solid #E7E5E4' }} />
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-sm font-bold"
                  style={{ color: '#1C1917', borderBottom: '1px solid #E7E5E4', borderRight: '1px solid #E7E5E4' }}
                >
                  {DAY_LABELS[day]}
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="grid relative" style={{ gridTemplateColumns: '56px repeat(6, 1fr)' }}>
              {/* Time labels column */}
              <div>
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="flex items-start justify-end pr-2 pt-1"
                    style={{ height: `${HOUR_HEIGHT}px`, borderBottom: '1px solid #F5F5F4' }}
                  >
                    <span className="text-xs font-medium" style={{ color: '#78716C' }}>
                      {formatHour(h)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAYS.map((day) => {
                const dayAppts = APPOINTMENTS.filter((a) => a.day === day);
                return (
                  <div
                    key={day}
                    className="relative"
                    style={{ borderRight: '1px solid #E7E5E4' }}
                  >
                    {/* Hour grid lines */}
                    {HOURS.map((h) => (
                      <div
                        key={h}
                        style={{ height: `${HOUR_HEIGHT}px`, borderBottom: '1px solid #F5F5F4' }}
                      />
                    ))}
                    {/* Appointment blocks */}
                    {dayAppts.map((appt, i) => {
                      const startH = timeToHour(appt.time);
                      const topOffset = (startH - 9) * HOUR_HEIGHT;
                      const blockHeight = appt.duration * HOUR_HEIGHT - 4;
                      const cfg = TYPE_CONFIG[appt.type];
                      return (
                        <div
                          key={i}
                          className="absolute left-1 right-1 rounded-lg px-2 py-1 overflow-hidden"
                          style={{
                            top: `${topOffset + 2}px`,
                            height: `${blockHeight}px`,
                            backgroundColor: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                          }}
                        >
                          <p className="text-xs font-bold leading-tight truncate" style={{ color: cfg.color }}>
                            {appt.customer}
                          </p>
                          {blockHeight > 28 && (
                            <p className="text-xs truncate" style={{ color: cfg.color, opacity: 0.8 }}>
                              {appt.vehicle || appt.note || cfg.label}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {(Object.entries(TYPE_CONFIG) as [AppointmentType, typeof TYPE_CONFIG[AppointmentType]][]).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
            />
            <span className="text-sm font-medium" style={{ color: '#57534E' }}>
              {cfg.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
