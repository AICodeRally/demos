'use client';

import { useState } from 'react';
import { CUSTOMERS } from '@/data/lotos';

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

const INITIAL_APPOINTMENTS: Appointment[] = [
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
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedAppt, setSelectedAppt] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState('');
  const [newType, setNewType] = useState<AppointmentType>('test-drive');
  const [newDay, setNewDay] = useState('Mon');
  const [newTime, setNewTime] = useState('10:00');

  const totalCount = appointments.length;
  const typeCounts = appointments.reduce<Record<AppointmentType, number>>(
    (acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; },
    { 'test-drive': 0, 'follow-up': 0, 'delivery': 0, 'phone': 0 }
  );

  const HOUR_HEIGHT = 64;

  function handleSaveNew() {
    if (!newCustomer) return;
    const customer = CUSTOMERS.find(c => c.id === newCustomer);
    if (!customer) return;
    const appt: Appointment = {
      day: newDay,
      time: newTime,
      duration: 1,
      type: newType,
      customer: `${customer.firstName} ${customer.lastName}`,
    };
    setAppointments(prev => [...prev, appt]);
    setShowNewForm(false);
    setNewCustomer('');
    setNewType('test-drive');
    setNewDay('Mon');
    setNewTime('10:00');
  }

  const selectedApptData = selectedAppt !== null ? appointments[selectedAppt] : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            Appointments
          </h1>
          <p className="mt-1 text-base" style={{ color: '#57534E' }}>
            Week of March 30 - April 5, 2026 - {totalCount} appointments scheduled
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: '#2563EB' }}
        >
          + New Appointment
        </button>
      </div>

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

      <div className="rounded-xl bg-white border overflow-hidden relative" style={{ borderColor: '#E7E5E4' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #E7E5E4' }}>
          <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>Week View</h2>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
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

            <div className="grid relative" style={{ gridTemplateColumns: '56px repeat(6, 1fr)' }}>
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

              {DAYS.map((day) => {
                const dayAppts = appointments
                  .map((a, idx) => ({ ...a, globalIdx: idx }))
                  .filter((a) => a.day === day);
                return (
                  <div
                    key={day}
                    className="relative"
                    style={{ borderRight: '1px solid #E7E5E4' }}
                  >
                    {HOURS.map((h) => (
                      <div
                        key={h}
                        style={{ height: `${HOUR_HEIGHT}px`, borderBottom: '1px solid #F5F5F4' }}
                      />
                    ))}
                    {dayAppts.map((appt) => {
                      const startH = timeToHour(appt.time);
                      const topOffset = (startH - 9) * HOUR_HEIGHT;
                      const blockHeight = appt.duration * HOUR_HEIGHT - 4;
                      const cfg = TYPE_CONFIG[appt.type];
                      const isSelected = selectedAppt === appt.globalIdx;
                      return (
                        <div
                          key={appt.globalIdx}
                          className="absolute left-1 right-1 rounded-lg px-2 py-1 overflow-hidden cursor-pointer"
                          style={{
                            top: `${topOffset + 2}px`,
                            height: `${blockHeight}px`,
                            backgroundColor: cfg.bg,
                            border: `1px solid ${isSelected ? cfg.color : cfg.border}`,
                            boxShadow: isSelected ? `0 0 0 2px ${cfg.color}40` : undefined,
                            zIndex: isSelected ? 10 : 1,
                          }}
                          onClick={() => setSelectedAppt(isSelected ? null : appt.globalIdx)}
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

      {selectedApptData && (
        <div
          className="fixed z-50 rounded-xl bg-white border shadow-xl p-5"
          style={{
            borderColor: '#E7E5E4',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '320px',
            maxWidth: '400px',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold" style={{ color: '#1C1917' }}>Appointment Details</h3>
            <button
              onClick={() => setSelectedAppt(null)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-lg"
              style={{ color: '#57534E' }}
            >
              x
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold" style={{ color: '#1C1917' }}>{selectedApptData.customer}</span>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                style={{
                  color: TYPE_CONFIG[selectedApptData.type].color,
                  backgroundColor: TYPE_CONFIG[selectedApptData.type].bg,
                  border: `1px solid ${TYPE_CONFIG[selectedApptData.type].border}`,
                }}
              >
                {TYPE_CONFIG[selectedApptData.type].label}
              </span>
            </div>
            <p className="text-sm" style={{ color: '#57534E' }}>
              {DAY_LABELS[selectedApptData.day]}, {selectedApptData.time} ({selectedApptData.duration}h)
            </p>
            {selectedApptData.vehicle && (
              <p className="text-sm" style={{ color: '#57534E' }}>
                Vehicle: <span className="font-semibold" style={{ color: '#1C1917' }}>{selectedApptData.vehicle}</span>
              </p>
            )}
            {selectedApptData.note && (
              <p className="text-sm" style={{ color: '#57534E' }}>
                Note: {selectedApptData.note}
              </p>
            )}
          </div>
          <button
            onClick={() => setSelectedAppt(null)}
            className="mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold border transition-colors hover:bg-gray-50"
            style={{ color: '#57534E', borderColor: '#E7E5E4' }}
          >
            Close
          </button>
        </div>
      )}
      {selectedApptData && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedAppt(null)} />
      )}

      {showNewForm && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowNewForm(false)} />
          <div
            className="fixed z-50 rounded-xl bg-white border shadow-xl p-6"
            style={{
              borderColor: '#E7E5E4',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '360px',
              maxWidth: '440px',
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: '#1C1917' }}>New Appointment</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Customer</label>
                <select
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                >
                  <option value="">Select customer...</option>
                  {CUSTOMERS.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as AppointmentType)}
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                >
                  {(Object.entries(TYPE_CONFIG) as [AppointmentType, typeof TYPE_CONFIG[AppointmentType]][]).map(([type, cfg]) => (
                    <option key={type} value={type}>{cfg.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Day</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                  >
                    {DAYS.map(d => (
                      <option key={d} value={d}>{DAY_LABELS[d]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="10:00"
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSaveNew}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: '#2563EB' }}
              >
                Save
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold border transition-colors hover:bg-gray-50"
                style={{ color: '#57534E', borderColor: '#E7E5E4' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
