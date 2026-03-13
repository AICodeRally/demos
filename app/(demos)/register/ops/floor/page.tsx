'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { REPS, SHIFT_SALES, getRepStatus } from '@/data/register/coaching-data';
import { getInsight } from '@/data/register/ai-insights';

const STATUS_DOT: Record<string, string> = {
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
};

/* ── Floor Plan Data ─────────────────────────────────────── */

const ZONES = [
  { id: 'king-prem', label: 'King\nPremium', x: 4, y: 12, w: 22, h: 30 },
  { id: 'queen-val', label: 'Queen\nValue', x: 30, y: 12, w: 22, h: 30 },
  { id: 'adj-bases', label: 'Adjustable\nBases', x: 56, y: 12, w: 22, h: 30 },
  { id: 'accessories', label: 'Accessories', x: 82, y: 12, w: 14, h: 30 },
  { id: 'kids-twin', label: 'Kids &\nTwin', x: 4, y: 52, w: 22, h: 24 },
  { id: 'outlet', label: 'Outlet\nCorner', x: 30, y: 52, w: 22, h: 24 },
  { id: 'lounge', label: 'Sleep\nLounge', x: 56, y: 52, w: 22, h: 24 },
  { id: 'checkout', label: 'Checkout', x: 82, y: 52, w: 14, h: 24 },
];

const REP_DOTS = [
  { name: 'Sarah', color: '#10B981', x: 18, y: 25 },
  { name: 'Marcus', color: '#F59E0B', x: 62, y: 24 },
  { name: 'Casey', color: '#EF4444', x: 40, y: 60 },
];

const CUSTOMER_DOTS = [
  { x: 12, y: 20 },
  { x: 65, y: 30 },
  { x: 36, y: 56 },
];

const ARROWS = [
  { x: 50, y: 4, char: '\u2193', rotate: 0 },
  { x: 26, y: 44, char: '\u2192', rotate: 0 },
  { x: 52, y: 44, char: '\u2192', rotate: 0 },
  { x: 78, y: 44, char: '\u2193', rotate: 0 },
];

/* ── Floor Plan Component ───────────────────────────────── */

function StoreFloorPlan() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 300,
        borderRadius: 12,
        background: 'var(--register-bg-surface)',
        border: '1px solid var(--register-border)',
        overflow: 'hidden',
        marginBottom: 24,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '6px 14px',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--register-text-muted)' }}>
          Store Floor Plan — Flagship #12
        </span>
        <span style={{ fontSize: '0.55rem', color: 'var(--register-text-dim)' }}>
          Live &bull; 3 reps on floor
        </span>
      </div>

      {/* Entrance door */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: '44%', width: '12%', height: 8,
          background: 'linear-gradient(180deg, #06B6D4, #06B6D480)',
          borderRadius: '0 0 4px 4px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 5,
        }}
      >
        <span style={{ fontSize: '0.5rem', fontWeight: 700, color: '#0F0E1A', letterSpacing: '0.08em' }}>ENTRANCE</span>
      </div>

      {/* Store boundary walls */}
      <div
        style={{
          position: 'absolute',
          top: '3%', left: '2%', right: '2%', bottom: '3%',
          border: '2px solid var(--register-border)',
          borderRadius: 8,
          pointerEvents: 'none',
        }}
      />

      {/* Bed zones */}
      {ZONES.map((zone) => (
        <div
          key={zone.id}
          style={{
            position: 'absolute',
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            width: `${zone.w}%`,
            height: `${zone.h}%`,
            background: zone.id === 'checkout'
              ? 'rgba(6,182,212,0.08)'
              : 'rgba(139,92,246,0.06)',
            border: zone.id === 'checkout'
              ? '1px dashed rgba(6,182,212,0.3)'
              : '1px dashed rgba(139,92,246,0.2)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
          }}
        >
          <span
            style={{
              fontSize: '0.6rem',
              fontWeight: 600,
              color: 'var(--register-text-dim)',
              textAlign: 'center',
              whiteSpace: 'pre-line',
              lineHeight: 1.3,
            }}
          >
            {zone.label}
          </span>
        </div>
      ))}

      {/* Traffic flow arrows */}
      {ARROWS.map((arrow, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${arrow.x}%`,
            top: `${arrow.y}%`,
            fontSize: '1rem',
            color: 'rgba(6,182,212,0.25)',
            transform: `translate(-50%, -50%)`,
            pointerEvents: 'none',
          }}
        >
          {arrow.char}
        </span>
      ))}

      {/* Rep dots with pulsing animation */}
      {REP_DOTS.map((rep) => (
        <div
          key={rep.name}
          style={{
            position: 'absolute',
            left: `${rep.x}%`,
            top: `${rep.y}%`,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            zIndex: 8,
          }}
        >
          <div
            className="floor-rep-pulse"
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: rep.color,
              boxShadow: `0 0 8px ${rep.color}80`,
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          />
          <span
            style={{
              fontSize: '0.55rem',
              fontWeight: 700,
              color: rep.color,
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            {rep.name}
          </span>
        </div>
      ))}

      {/* Customer dots */}
      {CUSTOMER_DOTS.map((cust, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${cust.x}%`,
            top: `${cust.y}%`,
            transform: 'translate(-50%, -50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(148,163,184,0.5)',
            border: '1px solid rgba(148,163,184,0.3)',
            zIndex: 7,
          }}
        />
      ))}

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: 6, right: 10,
          display: 'flex', gap: 12, alignItems: 'center',
          zIndex: 10,
        }}
      >
        {REP_DOTS.map((r) => (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.color, display: 'inline-block' }} />
            <span style={{ fontSize: '0.5rem', color: 'var(--register-text-dim)' }}>{r.name}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(148,163,184,0.5)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.5rem', color: 'var(--register-text-dim)' }}>Customer</span>
        </div>
      </div>

      {/* Pulsing animation style */}
      <style>{`
        @keyframes repPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        .floor-rep-pulse {
          animation: repPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function FloorDashboard() {
  const insight = getInsight('ops/floor');

  const stats = [
    { label: 'Traffic Today', value: '142', color: 'var(--register-accent)' },
    { label: 'Active Shoppers', value: '8', color: '#10B981' },
    { label: 'Avg Wait', value: '4 min', color: 'var(--register-warning)' },
    { label: 'Conversion Rate', value: '34%', color: 'var(--register-ai)' },
  ];

  return (
    <RegisterPage title="Floor Dashboard" accentColor="#8B5CF6">
      {/* AI Insight */}
      {insight && (
        <div style={{ marginBottom: 20 }}>
          <AIInsightCard>{insight.text}</AIInsightCard>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: '16px 18px', borderRadius: 12,
              background: 'var(--register-bg-elevated)',
              border: '1px solid var(--register-border)',
            }}
          >
            <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--register-text-dim)', margin: 0 }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'monospace', color: stat.color, margin: '4px 0 0' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Store Floor Plan */}
      <StoreFloorPlan />

      {/* Shift Sales Table */}
      <div
        style={{
          padding: 18, borderRadius: 12,
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
          marginBottom: 24,
        }}
      >
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 12 }}>
          Shift Sales
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID', 'Time', 'Items', 'Total', 'Attach %', 'Financing'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: h === 'Total' || h === 'Attach %' ? 'right' : 'left',
                    padding: '8px 10px',
                    fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: 'var(--register-text-dim)',
                    borderBottom: '1px solid var(--register-border)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHIFT_SALES.map((sale, i) => (
              <tr key={sale.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--register-bg-surface)' }}>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--register-accent)' }}>
                  {sale.id}
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', color: 'var(--register-text-muted)' }}>
                  {sale.time}
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', color: 'var(--register-text)' }}>
                  {sale.items.map((it) => it.name).join(', ')}
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--register-text)', textAlign: 'right' }}>
                  ${sale.total.toLocaleString()}
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', fontWeight: 600, textAlign: 'right', color: sale.attachRate >= 50 ? '#10B981' : '#EF4444' }}>
                  {sale.attachRate}%
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', color: sale.financingUsed ? '#10B981' : 'var(--register-text-dim)' }}>
                  {sale.financingUsed ? 'Yes' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rep Status Cards */}
      <div>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 12 }}>
          Rep Status
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {REPS.map((rep) => {
            const status = getRepStatus(rep.id);
            const dotColor = status ? STATUS_DOT[status.statusColor] : '#10B981';
            return (
              <div
                key={rep.id}
                style={{
                  padding: 14, borderRadius: 12,
                  background: 'var(--register-bg-elevated)',
                  border: '1px solid var(--register-border)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: 5, background: dotColor, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>{rep.name}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>
                    {rep.shift} &middot; {status?.statusLabel ?? 'On Target'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--register-text)', margin: 0 }}>
                    ${rep.metrics.shiftRevenue.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '0.6rem', color: 'var(--register-text-dim)', margin: '2px 0 0' }}>shift revenue</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RegisterPage>
  );
}
