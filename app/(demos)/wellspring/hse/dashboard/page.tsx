'use client';

import { StatCard, AreaChart } from '@/components/demos/wellspring';
import { TRIR_HISTORY, INCIDENTS, NEAR_MISSES } from '@/data/wellspring';

/* ── TRIR trend for AreaChart ─────────────────────────── */

const trirTrend = TRIR_HISTORY.map((m) => ({
  label: m.month.slice(2), // '25-04' etc.
  value: m.trir * 100, // scale to show better in area chart
}));

/* ── Incident + near-miss timeline ────────────────────── */

const allEvents = [...INCIDENTS, ...NEAR_MISSES]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 8);

const EVENT_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  recordable: { bg: 'rgba(220, 38, 38, 0.15)', text: '#DC2626', label: 'RECORDABLE' },
  'first-aid': { bg: 'rgba(234, 88, 12, 0.15)', text: '#EA580C', label: 'FIRST AID' },
  'near-miss': { bg: 'rgba(234, 179, 8, 0.15)', text: '#EAB308', label: 'NEAR MISS' },
  environmental: { bg: 'rgba(37, 99, 235, 0.15)', text: '#2563EB', label: 'ENVIRONMENTAL' },
};

export default function HseDashboardPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase mb-1"
          style={{ color: '#DC2626' }}
        >
          Act 5 &middot; HSE Officer
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: '#F1F5F9' }}>
          Safety Dashboard
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Total Recordable Incident Rate, incident history &amp; compliance metrics
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="TRIR"
          value="0.42"
          trend="down"
          trendValue="Target < 1.0"
          color="#059669"
          sparkline={[0.58, 0.55, 0.52, 0.48, 0.44, 0.42]}
        />
        <StatCard
          label="Days Without Incident"
          value="127"
          trend="up"
          trendValue="record streak"
          color="#059669"
          sparkline={[80, 90, 100, 110, 120, 127]}
        />
        <StatCard
          label="Training Completion"
          value="94%"
          trend="up"
          trendValue="+4%"
          color="#DC2626"
          sparkline={[85, 88, 90, 91, 93, 94]}
        />
        <StatCard
          label="Near Misses (YTD)"
          value="3"
          trend="flat"
          trendValue="Q1 2026"
          color="#EAB308"
          sparkline={[1, 1, 2, 2, 3, 3]}
        />
      </div>

      {/* TRIR Compliance Meter + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Compliance Gauge */}
        <div
          className="rounded-xl border p-5 flex flex-col items-center"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3 className="text-sm font-semibold mb-1 self-start" style={{ color: '#F1F5F9' }}>
            TRIR Compliance Meter
          </h3>
          <p className="text-[11px] mb-4 self-start" style={{ color: '#64748B' }}>
            Current: 0.42 &middot; Threshold: &lt; 1.0
          </p>
          <svg width="260" height="160" viewBox="0 0 260 160" className="block">
            {/* Background arc */}
            <path
              d="M 30 140 A 100 100 0 0 1 230 140"
              fill="none"
              stroke="#334155"
              strokeWidth={20}
              strokeLinecap="round"
            />
            {/* Green zone (0-0.5) */}
            <path
              d="M 30 140 A 100 100 0 0 1 78 52"
              fill="none"
              stroke="#059669"
              strokeWidth={20}
              strokeLinecap="round"
            />
            {/* Yellow zone (0.5-1.0) */}
            <path
              d="M 78 52 A 100 100 0 0 1 130 40"
              fill="none"
              stroke="#EAB308"
              strokeWidth={20}
              strokeLinecap="round"
            />
            {/* Red zone (1.0+) */}
            <path
              d="M 130 40 A 100 100 0 0 1 230 140"
              fill="none"
              stroke="#DC2626"
              strokeWidth={20}
              strokeLinecap="round"
            />
            {/* Needle — 0.42 maps to about 38% of the arc */}
            {(() => {
              const frac = 0.42 / 2.0; // 0-2.0 range
              const angle = Math.PI + frac * Math.PI; // 180deg to 360deg
              const nx = 130 + 75 * Math.cos(angle);
              const ny = 140 + 75 * Math.sin(angle);
              return (
                <line
                  x1={130} y1={140} x2={nx} y2={ny}
                  stroke="#F1F5F9" strokeWidth={3} strokeLinecap="round"
                />
              );
            })()}
            <circle cx={130} cy={140} r={6} fill="#F1F5F9" />
            {/* Value */}
            <text x={130} y={120} textAnchor="middle" fill="#F1F5F9" fontSize={28} fontWeight="bold">
              0.42
            </text>
            {/* Labels */}
            <text x={30} y={156} textAnchor="middle" fill="#94A3B8" fontSize={9}>0</text>
            <text x={130} y={32} textAnchor="middle" fill="#94A3B8" fontSize={9}>1.0</text>
            <text x={230} y={156} textAnchor="middle" fill="#94A3B8" fontSize={9}>2.0</text>
          </svg>
        </div>

        {/* TRIR 12-Month Trend */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
            12-Month TRIR Trend
          </h3>
          <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
            Continuous improvement — down from 0.58 to 0.42
          </p>
          <AreaChart data={trirTrend} color="#DC2626" height={200} showDots showLabels={false} />
        </div>
      </div>

      {/* Incident Timeline */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#F1F5F9' }}>
          Incident Timeline
        </h3>
        <div className="space-y-2">
          {allEvents.map((event) => {
            const style = EVENT_COLORS[event.type] || EVENT_COLORS.recordable;
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5"
                style={{ backgroundColor: '#2A3241' }}
              >
                <span
                  className="inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider shrink-0 mt-0.5"
                  style={{ backgroundColor: style.bg, color: style.text }}
                >
                  {style.label}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium" style={{ color: '#F1F5F9' }}>
                    {event.description}
                  </div>
                  <div className="text-[10px] mt-1 flex items-center gap-3" style={{ color: '#64748B' }}>
                    <span>{event.date}</span>
                    <span>{event.location}</span>
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase"
                      style={{
                        backgroundColor: event.status === 'closed' ? 'rgba(5,150,105,0.15)' : 'rgba(234,179,8,0.15)',
                        color: event.status === 'closed' ? '#059669' : '#EAB308',
                      }}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
