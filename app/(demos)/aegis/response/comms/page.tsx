'use client';

import { StatCard, AreaChart, BarChart, SeverityGauge } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const SENTIMENT_72HR = [
  { label: '0h', value: 8 }, { label: '3h', value: 6 }, { label: '6h', value: 5 },
  { label: '9h', value: 12 }, { label: '12h', value: 15 }, { label: '15h', value: 18 },
  { label: '18h', value: 22 }, { label: '21h', value: 25 }, { label: '24h', value: 27 },
  { label: '27h', value: 30 }, { label: '30h', value: 32 }, { label: '33h', value: 34 },
  { label: '36h', value: 35 }, { label: '39h', value: 36 }, { label: '42h', value: 37 },
  { label: '45h', value: 38 }, { label: '48h', value: 40 }, { label: '51h', value: 42 },
  { label: '54h', value: 44 }, { label: '57h', value: 45 }, { label: '60h', value: 48 },
  { label: '63h', value: 50 }, { label: '66h', value: 55 }, { label: '72h', value: 60 },
];

const PRESS_DATA = [
  { label: 'TV', value: 12 },
  { label: 'Print', value: 8 },
  { label: 'Online', value: 45 },
  { label: 'Social', value: 82 },
];

const SOCIAL_VOLUME = [
  { label: '0h', value: 5 }, { label: '1h', value: 8 }, { label: '2h', value: 12 },
  { label: '3h', value: 18 }, { label: '4h', value: 22 }, { label: '5h', value: 30 },
  { label: '6h', value: 85 }, { label: '7h', value: 65 }, { label: '8h', value: 42 },
  { label: '9h', value: 38 }, { label: '10h', value: 35 }, { label: '11h', value: 32 },
  { label: '12h', value: 30 }, { label: '13h', value: 28 }, { label: '14h', value: 25 },
  { label: '15h', value: 23 }, { label: '16h', value: 22 }, { label: '17h', value: 20 },
  { label: '18h', value: 18 }, { label: '19h', value: 16 }, { label: '20h', value: 15 },
  { label: '21h', value: 14 }, { label: '22h', value: 13 }, { label: '24h', value: 12 },
];

const STAKEHOLDERS = [
  { name: 'SEC', channel: 'Formal Filing', status: 'Sent', statusColor: '#059669', lastContact: 'Mar 3, 04:15', next: 'Await response' },
  { name: 'CA Attorney General', channel: 'Legal Notification', status: 'Sent', statusColor: '#059669', lastContact: 'Mar 3, 05:30', next: 'Confirmation pending' },
  { name: 'NY Attorney General', channel: 'Legal Notification', status: 'Drafted', statusColor: '#EAB308', lastContact: '---', next: 'File within 60 days' },
  { name: 'Board of Directors', channel: 'Secure Portal', status: 'Sent', statusColor: '#059669', lastContact: 'Mar 3, 06:00', next: 'Full briefing Mar 4' },
  { name: 'Customers (2.3M)', channel: 'Email + Portal', status: 'Sent', statusColor: '#059669', lastContact: 'Mar 3, 07:00', next: 'FAQ publication' },
  { name: 'Insurance Carrier', channel: 'Claims Portal', status: 'Drafted', statusColor: '#EAB308', lastContact: '---', next: 'Submit claim' },
  { name: 'Media Pool', channel: 'Press Release', status: 'Pending', statusColor: '#A8A29E', lastContact: '---', next: 'Press conference Mar 4' },
  { name: 'Employees', channel: 'Internal Memo', status: 'Escalated', statusColor: '#DC2626', lastContact: 'Mar 3, 03:00', next: 'Town hall meeting' },
];

const STATEMENTS = [
  { title: 'Initial Holding Statement', audience: 'Board + Media', status: 'Approved', before: '-72', after: '-45', color: '#059669' },
  { title: 'CEO Video Statement', audience: 'Public', status: 'Approved', before: '-45', after: '-28', color: '#059669' },
  { title: 'Customer Notification', audience: '2.3M Customers', status: 'Sent', before: '-28', after: '-18', color: '#059669' },
  { title: 'Regulatory Disclosure', audience: 'SEC, State AGs', status: 'Filed', before: '-18', after: '-12', color: '#059669' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function CommunicationsCenter() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Communications Center</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Media management and stakeholder messaging
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Statements Issued" value="4" color="#8B7355" />
        <StatCard label="Media Mentions" value="147" color="#EA580C" />
        <StatCard label="Sentiment Score" value="-12" color="#DC2626" />
        <StatCard label="Narrative Control" value="87%" color="#059669" />
      </div>

      {/* Sentiment 72hr chart */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Media Sentiment (72hr)</h2>
        <p className="text-[10px] mb-3" style={{ color: '#A8A29E' }}>
          Sentiment recovery trajectory: -72 at detection to -12 at current
        </p>
        <AreaChart data={SENTIMENT_72HR} color="#DC2626" height={180} />
      </div>

      {/* Two-column: Press Coverage + Narrative Gauge */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Press Coverage by Type</h2>
          <BarChart data={PRESS_DATA} color="#EA580C" />
        </div>
        <div className="rounded-xl bg-white border p-5 flex flex-col items-center justify-center" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4 self-start" style={{ color: '#1C1917' }}>Narrative Control</h2>
          <SeverityGauge
            value={87}
            max={100}
            label="Narrative Score"
            size={160}
            zones={[
              { threshold: 30, color: '#DC2626' },
              { threshold: 60, color: '#F97316' },
              { threshold: 80, color: '#EAB308' },
              { threshold: 100, color: '#059669' },
            ]}
          />
        </div>
      </div>

      {/* Stakeholder Communication Table */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Stakeholder Communications</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-[11px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #E7E5E4' }}>
                {['Stakeholder', 'Channel', 'Status', 'Last Contact', 'Next Action'].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold uppercase tracking-wider" style={{ color: '#A8A29E' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STAKEHOLDERS.map((row) => (
                <tr key={row.name} style={{ borderBottom: '1px solid #F5F5F4' }}>
                  <td className="py-2 px-2 font-semibold" style={{ color: '#1C1917' }}>{row.name}</td>
                  <td className="py-2 px-2" style={{ color: '#57534E' }}>{row.channel}</td>
                  <td className="py-2 px-2">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${row.statusColor}15`, color: row.statusColor }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2 px-2" style={{ color: '#A8A29E' }}>{row.lastContact}</td>
                  <td className="py-2 px-2" style={{ color: '#57534E' }}>{row.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Social Mention Volume */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>Social Mention Volume</h2>
        <AreaChart data={SOCIAL_VOLUME} color="#7C3AED" height={160} />
        <p className="text-[10px] mt-2 italic" style={{ color: '#A8A29E' }}>
          * Spike at T+6h: CEO statement released
        </p>
      </div>

      {/* Statement Log */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Statement Impact Log</h2>
        <div className="grid grid-cols-2 gap-4">
          {STATEMENTS.map((s) => (
            <div
              key={s.title}
              className="rounded-xl p-4"
              style={{ backgroundColor: '#F5F5F4', border: '1px solid #E7E5E4' }}
            >
              <p className="text-[14px] font-semibold" style={{ color: '#1C1917' }}>{s.title}</p>
              <p className="text-[11px] mt-1" style={{ color: '#57534E' }}>{s.audience}</p>
              <div className="flex items-center justify-between mt-3">
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: '#05966915', color: '#059669' }}
                >
                  {s.status}
                </span>
                <span className="text-[11px] tabular-nums" style={{ color: s.color }}>
                  Sentiment: {s.before} &rarr; {s.after}{' '}
                  <span style={{ color: '#059669' }}>&uarr;</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
