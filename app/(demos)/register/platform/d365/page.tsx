'use client';

import { useState, useEffect } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { Database, Cpu, BarChart3, CheckCircle, Clock, Zap, RefreshCw, Send, AlertTriangle, TrendingUp } from 'lucide-react';

/* ── Pipeline Stage Data ─────────────────────────────────── */

const STAGES = [
  {
    icon: Database,
    label: 'D365 Commerce',
    subtitle: 'Point of Sale Transactions',
    event: 'RetailTransactionPostedBusinessEvent',
    metrics: ['~2,400 transactions/day', 'Real-time via Business Events API'],
    color: '#1E3A5F',
  },
  {
    icon: Cpu,
    label: 'REGISTER Engine',
    subtitle: 'Commission Calculation + AI Intelligence',
    event: 'SWIC Engine \u2022 Tier Tracking \u2022 SPIFF Detection \u2022 Bundle Recognition',
    metrics: ['<100ms processing', '5 comp components evaluated per sale'],
    color: '#06B6D4',
  },
  {
    icon: BarChart3,
    label: 'Varicent',
    subtitle: 'ICM Platform \u2014 Period-End Payroll',
    event: 'Commission Statements \u2022 Payout Processing \u2022 Compliance Audit',
    metrics: ['Daily batch sync', '47 reps across 12 stores'],
    color: '#10B981',
  },
];

/* ── Detail Grid Data ────────────────────────────────────── */

const DETAILS = [
  {
    title: 'D365 Capture',
    color: '#1E3A5F',
    items: [
      'Every Close Sale generates a RetailTransactionPostedBusinessEvent',
      'Sales lines, tender lines, staff ID, store context',
      '8.25% TX-HOUSTON tax auto-calculated',
    ],
    json: `{
  "BusinessEventId": "RetailTransactionPosted",
  "transactionId": "TXN-0847-20260313-001",
  "store": "STORE-0042",
  "staffId": "REP-1042",
  "grossAmount": 3247.00,
  "salesLines": [ ...4 items ],
  "tenderLines": [ ...VISA ****4821 ]
}`,
  },
  {
    title: 'REGISTER Processing',
    color: '#06B6D4',
    items: [
      'Real-time commission calculation via SWIC engine',
      'Tier threshold detection \u2014 is this rep about to tier up?',
      'Bundle recognition \u2014 Mattress + Base = $75 bonus',
      'AI coaching generation \u2014 upsell opportunities, pace alerts',
      'Manager notification \u2014 push coaching to floor',
    ],
    json: null,
  },
  {
    title: 'Varicent Delivery',
    color: '#10B981',
    items: [
      'Aggregated transactions synced daily at 11 PM CT',
      'Commission components mapped to Varicent plan rules',
      'Variance flagging \u2014 actual vs. projected payout',
      'Statement generation for rep self-service portal',
      'Compliance audit trail \u2014 every calculation traceable',
    ],
    json: null,
  },
];

/* ── Live Event Feed Data ────────────────────────────────── */

const MOCK_EVENTS = [
  { type: 'Sale Closed', desc: 'TXN-0847 \u2014 Summit Cloud Queen Hybrid + accessories \u2014 $3,247', icon: Database, color: '#1E3A5F', status: 'done' },
  { type: 'Commission Calc\u2019d', desc: 'REP-1042 earned $162.35 (5% base + bundle bonus $75)', icon: Cpu, color: '#06B6D4', status: 'done' },
  { type: 'AI Alert', desc: 'REP-1042 is $412 from Gold Tier \u2014 coaching nudge sent', icon: Zap, color: '#8B5CF6', status: 'done' },
  { type: 'Manager Push', desc: 'Floor alert: "Sarah is 1 sale from Gold \u2014 route next walk-in"', icon: Send, color: '#F59E0B', status: 'done' },
  { type: 'Varicent Synced', desc: 'Daily batch 2,847 transactions \u2192 Varicent staging table', icon: BarChart3, color: '#10B981', status: 'done' },
  { type: 'Sale Closed', desc: 'TXN-0848 \u2014 Arctic Cool King Firm \u2014 $1,899', icon: Database, color: '#1E3A5F', status: 'done' },
  { type: 'Commission Calc\u2019d', desc: 'REP-1038 earned $94.95 (5% base rate)', icon: Cpu, color: '#06B6D4', status: 'done' },
  { type: 'AI Alert', desc: 'Split credit flagged on TXN-0849 \u2014 manual review queued', icon: AlertTriangle, color: '#F59E0B', status: 'pending' },
  { type: 'Sale Closed', desc: 'TXN-0850 \u2014 Adjustable Base + Pillow Pack \u2014 $549', icon: Database, color: '#1E3A5F', status: 'done' },
  { type: 'Manager Push', desc: 'Evening shift: 3 reps within striking distance of tier-up', icon: TrendingUp, color: '#F59E0B', status: 'done' },
];

/* ── CSS Keyframe Styles ─────────────────────────────────── */

const KEYFRAMES = `
@keyframes flowDot {
  0% { transform: translateX(-8px); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateX(56px); opacity: 0; }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.15); }
  50% { box-shadow: 0 0 35px rgba(6, 182, 212, 0.35); }
}
@keyframes slideInEvent {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes fadeInUp {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

/* ── Flowing Dots Component ──────────────────────────────── */

function FlowingDots({ color }: { color: string }) {
  return (
    <div style={{ width: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 20, flexShrink: 0 }}>
      {[0, 0.4, 0.8].map((delay, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: color,
            animation: `flowDot 1.8s ${delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function D365IntegrationPage() {
  const [events, setEvents] = useState<typeof MOCK_EVENTS>([]);
  const [eventIndex, setEventIndex] = useState(0);

  // Seed initial events then add one every 4 seconds
  useEffect(() => {
    setEvents(MOCK_EVENTS.slice(0, 3));
    setEventIndex(3);
  }, []);

  useEffect(() => {
    if (eventIndex >= MOCK_EVENTS.length && eventIndex >= 3) return;
    const timer = setInterval(() => {
      setEventIndex((prev) => {
        const next = prev + 1;
        const idx = next % MOCK_EVENTS.length;
        setEvents((curr) => {
          const nextEvents = [MOCK_EVENTS[idx], ...curr];
          return nextEvents.slice(0, 5);
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [eventIndex]);

  return (
    <RegisterPage
      title="The Data Pipeline"
      subtitle="D365 \u2192 REGISTER \u2192 Varicent"
      accentColor="#F59E0B"
    >
      <style>{KEYFRAMES}</style>

      {/* ── Hero: Animated Pipeline Visualization ──────────── */}
      <section style={{ marginBottom: 40 }}>
        <div className="flex items-center justify-center gap-0" style={{ overflowX: 'auto', paddingBottom: 8 }}>
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const isCenter = i === 1;
            return (
              <div key={stage.label} className="flex items-center" style={{ flexShrink: 0 }}>
                <div
                  style={{
                    borderRadius: 16,
                    padding: '24px 20px 20px',
                    minWidth: 220,
                    maxWidth: 260,
                    backgroundColor: `${stage.color}0D`,
                    borderTop: `3px solid ${stage.color}`,
                    border: `1px solid ${stage.color}30`,
                    borderTopWidth: 3,
                    borderTopColor: stage.color,
                    textAlign: 'center',
                    position: 'relative',
                    animation: isCenter ? 'pulseGlow 3s ease-in-out infinite' : undefined,
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0,
                    animationName: 'fadeInUp',
                    animationDuration: '0.6s',
                    animationFillMode: 'forwards',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: `${stage.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={22} color={stage.color} />
                    </div>
                  </div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 800, color: stage.color, margin: 0 }}>
                    {stage.label}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--register-text)', margin: '6px 0 0', fontWeight: 600 }}>
                    {stage.subtitle}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
                    {stage.event}
                  </p>
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {stage.metrics.map((m) => (
                      <div
                        key={m}
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: stage.color,
                          backgroundColor: `${stage.color}15`,
                          borderRadius: 6,
                          padding: '3px 8px',
                          display: 'inline-block',
                        }}
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flowing dots between stages */}
                {i < STAGES.length - 1 && (
                  <FlowingDots color={STAGES[i + 1].color} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Middle: What Happens at Each Stage ────────────── */}
      <section style={{ marginBottom: 40 }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 4 }}>
          What Happens at Each Stage
        </p>
        <p style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', marginBottom: 16 }}>
          From POS close to payroll — every step of the data journey
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DETAILS.map((col, colIdx) => (
            <div
              key={col.title}
              style={{
                borderRadius: 14,
                border: '1px solid var(--register-border)',
                backgroundColor: 'var(--register-bg-surface)',
                overflow: 'hidden',
                opacity: 0,
                animation: `fadeInUp 0.5s ${0.1 + colIdx * 0.15}s forwards`,
              }}
            >
              {/* Header bar */}
              <div
                style={{
                  padding: '10px 16px',
                  borderBottom: '1px solid var(--register-border)',
                  backgroundColor: `${col.color}0A`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: col.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: col.color }}>{col.title}</span>
              </div>

              {/* Items */}
              <div style={{ padding: '14px 16px' }}>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.items.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <CheckCircle size={13} color={col.color} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--register-text)', lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* JSON snippet for D365 column */}
                {col.json && (
                  <pre
                    style={{
                      marginTop: 12,
                      padding: '10px 12px',
                      borderRadius: 8,
                      backgroundColor: 'var(--register-bg-elevated)',
                      fontSize: '0.6rem',
                      fontFamily: 'monospace',
                      color: 'var(--register-text-muted)',
                      lineHeight: 1.5,
                      overflowX: 'auto',
                      whiteSpace: 'pre',
                      margin: '12px 0 0',
                    }}
                  >
                    {col.json}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom: Live Event Feed ──────────────────────── */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>
            Live Event Feed
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulseGlow 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live</span>
          </div>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', marginBottom: 12 }}>
          Real-time events flowing through the pipeline
        </p>

        <div
          style={{
            borderRadius: 14,
            border: '1px solid var(--register-border)',
            backgroundColor: 'var(--register-bg-surface)',
            overflow: 'hidden',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 140px 1fr 60px',
              gap: 8,
              padding: '8px 16px',
              backgroundColor: 'var(--register-bg-elevated)',
              borderBottom: '1px solid var(--register-border)',
            }}
          >
            {['Time', 'Event', 'Description', 'Status'].map((h) => (
              <span key={h} style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--register-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Event rows */}
          <div style={{ maxHeight: 240, overflow: 'hidden' }}>
            {events.map((evt, i) => {
              const Icon = evt.icon;
              const now = new Date();
              const ts = new Date(now.getTime() - i * 4000);
              const timeStr = ts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

              return (
                <div
                  key={`${evt.type}-${i}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 140px 1fr 60px',
                    gap: 8,
                    padding: '10px 16px',
                    borderBottom: '1px solid var(--register-border)',
                    animation: i === 0 ? 'slideInEvent 0.4s ease-out' : undefined,
                    backgroundColor: i === 0 ? `${evt.color}08` : 'transparent',
                    transition: 'background-color 0.3s',
                  }}
                >
                  {/* Time */}
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--register-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} color="var(--register-text-dim)" />
                    {timeStr}
                  </span>

                  {/* Event type */}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon size={13} color={evt.color} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: evt.color }}>{evt.type}</span>
                  </span>

                  {/* Description */}
                  <span style={{ fontSize: '0.7rem', color: 'var(--register-text)', display: 'flex', alignItems: 'center' }}>
                    {evt.desc}
                  </span>

                  {/* Status */}
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {evt.status === 'done' ? (
                      <CheckCircle size={14} color="#10B981" />
                    ) : (
                      <RefreshCw size={14} color="#F59E0B" style={{ animation: 'spin 1.5s linear infinite' }} />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI Insight ───────────────────────────────────── */}
      <AIInsightCard>
        Pipeline processed 2,847 transactions this month with 99.7% uptime.
        3 transactions flagged for manual review (split credit edge cases).
        Average D365-to-Varicent latency: 14 hours &mdash; recommend enabling real-time
        sync for Flagship stores.
      </AIInsightCard>
    </RegisterPage>
  );
}
