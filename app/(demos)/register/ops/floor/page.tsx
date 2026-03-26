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
  { id: 'king-prem', label: 'King Premium', x: 4, y: 14, w: 22, h: 28, accent: '#8B5CF6' },
  { id: 'queen-val', label: 'Queen Value', x: 30, y: 14, w: 22, h: 28, accent: '#8B5CF6' },
  { id: 'adj-bases', label: 'Adjustable Bases', x: 56, y: 14, w: 22, h: 28, accent: '#8B5CF6' },
  { id: 'accessories', label: 'Accessories', x: 82, y: 14, w: 14, h: 28, accent: '#F59E0B' },
  { id: 'kids-twin', label: 'Kids & Twin', x: 4, y: 50, w: 22, h: 24, accent: '#8B5CF6' },
  { id: 'outlet', label: 'Outlet Corner', x: 30, y: 50, w: 22, h: 24, accent: '#8B5CF6' },
  { id: 'lounge', label: 'Sleep Lounge', x: 56, y: 50, w: 22, h: 24, accent: '#06B6D4' },
  { id: 'checkout', label: 'Checkout', x: 82, y: 50, w: 14, h: 24, accent: '#06B6D4' },
];

const REP_DOTS = [
  { name: 'Sarah K.', color: '#10B981', x: 15, y: 26 },
  { name: 'Marcus T.', color: '#F59E0B', x: 64, y: 26 },
  { name: 'Casey M.', color: '#EF4444', x: 40, y: 60 },
];

const CUSTOMER_DOTS = [
  { x: 10, y: 22, zone: 'King Premium' },
  { x: 68, y: 32, zone: 'Adj. Bases' },
  { x: 34, y: 56, zone: 'Outlet' },
  { x: 88, y: 56, zone: 'Checkout' },
];

/* ── Floor Plan Component ───────────────────────────────── */

function StoreFloorPlan() {
  return (
    <div className="register-section" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Title bar */}
      <div
        style={{
          padding: '10px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--register-border)',
          background: 'var(--register-bg-surface)',
        }}
      >
        <span className="register-meta-label" style={{ margin: 0 }}>
          Store Floor Plan — Flagship #12
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="reg-live-dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>
            Live — 3 reps, 4 customers
          </span>
        </div>
      </div>

      {/* Floor area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 380,
          background: 'var(--register-bg-surface)',
          backgroundImage:
            'linear-gradient(var(--register-border) 1px, transparent 1px), linear-gradient(90deg, var(--register-border) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '12px 12px',
        }}
      >
        {/* Entrance indicator */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: '40%', width: '20%', height: 6,
            background: 'linear-gradient(90deg, transparent, var(--register-accent), transparent)',
            borderRadius: '0 0 6px 6px',
            zIndex: 5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 8, left: '50%', transform: 'translateX(-50%)',
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
            color: 'var(--register-accent)',
            zIndex: 5,
          }}
        >
          ENTRANCE
        </div>

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
              background: `${zone.accent}08`,
              border: `1px dashed ${zone.accent}30`,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--register-text-dim)',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              {zone.label}
            </span>
          </div>
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
              gap: 4,
              zIndex: 8,
            }}
          >
            <div
              className="floor-rep-pulse"
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: rep.color,
                boxShadow: `0 0 12px ${rep.color}60`,
                border: '2px solid var(--register-bg-elevated)',
              }}
            />
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: rep.color,
                background: 'var(--register-bg-elevated)',
                padding: '1px 6px',
                borderRadius: 4,
                whiteSpace: 'nowrap',
              }}
            >
              {rep.name}
            </span>
          </div>
        ))}

        {/* Customer dots — larger with subtle ring */}
        {CUSTOMER_DOTS.map((cust, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${cust.x}%`,
              top: `${cust.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'var(--register-text-dim)',
              border: '2px solid var(--register-bg-elevated)',
              opacity: 0.6,
              zIndex: 7,
            }}
          />
        ))}
      </div>

      {/* Legend bar */}
      <div
        style={{
          padding: '10px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid var(--register-border)',
          background: 'var(--register-bg-surface)',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {REP_DOTS.map((r) => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, display: 'inline-block', boxShadow: `0 0 4px ${r.color}40` }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>{r.name}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--register-text-dim)', display: 'inline-block', opacity: 0.6 }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>Customer</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 16, height: 1, background: '#8B5CF620', borderTop: '1px dashed #8B5CF640', display: 'inline-block' }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--register-text-dim)' }}>Bed zone</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 16, height: 1, background: '#06B6D420', borderTop: '1px dashed #06B6D440', display: 'inline-block' }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--register-text-dim)' }}>Service</span>
          </div>
        </div>
      </div>

      {/* Pulsing animation */}
      <style>{`
        @keyframes repPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        .floor-rep-pulse {
          animation: repPulse 2.5s ease-in-out infinite;
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
      <div className="register-kpi-strip">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="register-card reg-fade-up"
            style={{ padding: '16px 18px', animationDelay: `${i * 0.1}s` }}
          >
            <p className="register-meta-label" style={{ margin: 0 }}>
              {stat.label}
            </p>
            <p className="register-kpi-value" style={{ color: stat.color, margin: '4px 0 0' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Store Floor Plan */}
      <StoreFloorPlan />

      {/* Shift Sales Table */}
      <div className="register-section reg-fade-up reg-stagger-3">
        <p className="register-section-header">
          Shift Sales
        </p>
        <div className="overflow-x-auto -mx-1">
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr>
              {['ID', 'Time', 'Items', 'Total', 'Attach %', 'Financing'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: h === 'Total' || h === 'Attach %' ? 'right' : 'left',
                    padding: '8px 10px',
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
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
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--register-accent)' }}>
                  {sale.id}
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', color: 'var(--register-text-muted)' }}>
                  {sale.time}
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', color: 'var(--register-text)' }}>
                  {sale.items.map((it) => it.name).join(', ')}
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--register-text)', textAlign: 'right' }}>
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
      </div>

      {/* Rep Status Cards */}
      <div>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 12 }}>
          Rep Status
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {REPS.map((rep, i) => {
            const status = getRepStatus(rep.id);
            const dotColor = status ? STATUS_DOT[status.statusColor] : '#10B981';
            return (
              <div
                key={rep.id}
                className="register-card register-card-hover reg-fade-up"
                style={{
                  padding: 14,
                  display: 'flex', alignItems: 'center', gap: 12,
                  animationDelay: `${0.4 + i * 0.1}s`,
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
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>
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
