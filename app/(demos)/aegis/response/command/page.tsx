'use client';

import { StatCard, SeverityGauge, AreaChart, BarChart, CountdownTimer } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const BURNDOWN_DATA = [
  { label: 'Hour 1', value: 52 },
  { label: 'Hour 2', value: 50 },
  { label: 'Hour 3', value: 47 },
  { label: 'Hour 4', value: 44 },
  { label: 'Hour 5', value: 40 },
  { label: 'Hour 6', value: 36 },
  { label: 'Hour 7', value: 32 },
  { label: 'Hour 8', value: 28 },
  { label: 'Hour 9', value: 25 },
  { label: 'Hour 10', value: 22 },
  { label: 'Hour 11', value: 20 },
  { label: 'Hour 12', value: 18 },
];

const SENTIMENT_DATA = [
  { label: 'T+0', value: -40 },
  { label: 'T+2h', value: -45 },
  { label: 'T+4h', value: -38 },
  { label: 'T+6h', value: -30 },
  { label: 'T+8h', value: -25 },
  { label: 'T+10h', value: -22 },
  { label: 'T+12h', value: -18 },
  { label: 'T+14h', value: -15 },
  { label: 'T+15h', value: -14 },
  { label: 'T+16h', value: -10 },
  { label: 'T+17h', value: -8 },
  { label: 'T+18h', value: -5 },
];

// Normalize sentiment to positive for AreaChart (since AreaChart expects positive values)
const SENTIMENT_NORMALIZED = SENTIMENT_DATA.map((d) => ({
  label: d.label,
  value: d.value + 50, // shift up so -40 becomes 10, -5 becomes 45
}));

const WORKLOAD_DATA = [
  { label: 'Sarah', value: 12 },
  { label: 'Marcus', value: 10 },
  { label: 'Diana', value: 8 },
  { label: 'James', value: 9 },
  { label: 'Raj', value: 11 },
  { label: 'Emily', value: 7 },
];

type FeedType = 'legal' | 'forensic' | 'regulatory' | 'media' | 'internal' | 'comms';

const FEED_COLORS: Record<FeedType, string> = {
  legal: '#7C3AED',
  forensic: '#2563EB',
  regulatory: '#DC2626',
  media: '#EA580C',
  internal: '#78716C',
  comms: '#059669',
};

const ACTIVITY_FEED: { time: string; type: FeedType; text: string }[] = [
  { time: '04:15', type: 'legal', text: 'Privilege notice posted to all channels' },
  { time: '04:22', type: 'forensic', text: 'Forensic image of email server completed' },
  { time: '04:45', type: 'regulatory', text: 'SEC preservation notice acknowledged' },
  { time: '05:10', type: 'media', text: 'First holding statement drafted' },
  { time: '05:30', type: 'internal', text: 'Board briefing deck v1 circulated' },
  { time: '06:00', type: 'comms', text: 'CEO video statement recorded and approved' },
  { time: '06:15', type: 'forensic', text: 'Breach vector identified — compromised API key' },
  { time: '06:45', type: 'regulatory', text: 'CCPA notification template completed' },
  { time: '07:00', type: 'legal', text: 'Evidence preservation orders sent to 8 custodians' },
  { time: '07:30', type: 'internal', text: 'Team utilization report generated — 87% capacity' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function CommandCenter() {
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Command Center</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Active crisis response &mdash; Meridian Dynamics &mdash; T+18 hours
        </p>
      </div>

      {/* Top row: SeverityGauge + 6 StatCards */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '200px 1fr' }}>
        {/* Left: Large Gauge */}
        <div
          className="rounded-xl bg-white border p-4 flex flex-col items-center justify-center"
          style={{ borderColor: '#E7E5E4' }}
        >
          <SeverityGauge value={88} max={100} label="CRITICAL" size={180} />
          <span
            className="mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: '#DC262615', color: '#DC2626' }}
          >
            Severity: Critical
          </span>
        </div>

        {/* Right: 2x3 StatCard grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Hours Active"
            value="18"
            trend="up"
            color="#DC2626"
            sparkline={[2, 4, 6, 8, 10, 12, 14, 16, 18]}
          />
          <StatCard
            label="Tasks"
            value="34/52"
            trend="up"
            trendValue="65%"
            color="#8B7355"
          />
          <StatCard
            label="Evidence Items"
            value="127"
            trend="up"
            trendValue="+23"
            color="#7C3AED"
          />
          <StatCard
            label="Comms Sent"
            value="12"
            color="#059669"
          />
          <StatCard
            label="Reg. Filings"
            value="2/5"
            trendValue="40%"
            color="#EA580C"
          />
          <StatCard
            label="Team Utilization"
            value="87%"
            trend="up"
            color="#8B7355"
          />
        </div>
      </div>

      {/* Middle row: 3 charts */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>Task Burndown</h2>
          <AreaChart data={BURNDOWN_DATA} color="#7C3AED" height={160} />
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Media Sentiment</h2>
          <p className="text-[10px] mb-2" style={{ color: '#A8A29E' }}>Normalized: 0 = neutral, lower = negative</p>
          <AreaChart data={SENTIMENT_NORMALIZED} color="#DC2626" height={148} />
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>Team Workload</h2>
          <BarChart data={WORKLOAD_DATA} color="#7C3AED" />
        </div>
      </div>

      {/* Bottom row: Countdown Timers + Live Activity Feed */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '280px 1fr' }}>
        {/* Left: 3 countdown timers stacked */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold" style={{ color: '#1C1917' }}>Regulatory Deadlines</h2>
          <CountdownTimer deadline="2026-03-05T02:47:00Z" label="SEC Form 8-K" />
          <CountdownTimer deadline="2026-03-04T02:47:00Z" label="CCPA Notice (California)" />
          <CountdownTimer deadline="2026-04-30T02:47:00Z" label="SHIELD Act (New York)" />
        </div>

        {/* Right: Live Activity Feed */}
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>Live Activity Feed</h2>
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {ACTIVITY_FEED.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg px-3 py-2"
                style={{ backgroundColor: i % 2 === 0 ? '#F5F5F4' : 'transparent' }}
              >
                <span
                  className="text-[11px] font-mono shrink-0 pt-0.5"
                  style={{ color: '#A8A29E', width: 40 }}
                >
                  {item.time}
                </span>
                <span
                  className="mt-1.5 shrink-0 rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: FEED_COLORS[item.type],
                  }}
                />
                <span className="text-[12px] leading-relaxed" style={{ color: '#57534E' }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Containment Progress — full width bar */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold" style={{ color: '#1C1917' }}>Technical Containment</h2>
          <span className="text-sm font-bold font-mono" style={{ color: '#7C3AED' }}>94%</span>
        </div>
        <div className="h-4 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#F5F5F4' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: '94%', backgroundColor: '#7C3AED' }}
          />
        </div>
        <p className="text-[11px] mt-2" style={{ color: '#57534E' }}>
          Breach vector sealed. Remaining 6% covers secondary endpoint hardening.
        </p>
      </div>
    </>
  );
}
