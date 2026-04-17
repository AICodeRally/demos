'use client';

import { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDown, ArrowUp, Circle,
  Coffee, Handshake, MapPin, Package, Radio, Target, TrendingUp, Users,
} from 'lucide-react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { ORG_HIERARCHY } from '@/data/register/comp-data';

/* ════════════════════════════════════════════════════════════
   FLOOR DASHBOARD — full-screen live ops console
   Galleria Flagship #12 · Summit Sleep Co · Store #247
   ═══════════════════════════════════════════════════════════ */

/* ── Rep roster (derived from ORG_HIERARCHY Galleria block) ── */
interface FloorRep {
  id: string;
  name: string;
  initials: string;
  zone: string;
  status: 'selling' | 'idle' | 'with-customer' | 'on-break';
  mtdRevenue: number;
  quotaMTD: number;
  x: number;
  y: number;
}

const FLOOR_REPS: FloorRep[] = (() => {
  const galleria = ORG_HIERARCHY.filter((n) => n.parentId === 'mgr-galleria');
  const layout = [
    { zone: 'CloudRest Bay', status: 'with-customer' as const, x: 28, y: 36 },
    { zone: 'Harmony Bay',   status: 'selling' as const,       x: 52, y: 36 },
    { zone: 'Essential Bay', status: 'selling' as const,       x: 74, y: 36 },
    { zone: 'Adj Base Theater', status: 'with-customer' as const, x: 52, y: 68 },
    { zone: 'Pillow Station', status: 'idle' as const,          x: 16, y: 72 },
    { zone: 'Checkout',      status: 'on-break' as const,       x: 88, y: 72 },
  ];
  return galleria.slice(0, 6).map((r, i) => {
    const L = layout[i];
    const initials = r.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
    return {
      id: r.id,
      name: r.name,
      initials,
      zone: L.zone,
      status: L.status,
      mtdRevenue: r.revenueMTD,
      quotaMTD: r.quotaMTD,
      x: L.x,
      y: L.y,
    };
  });
})();

const STATUS_META: Record<FloorRep['status'], { label: string; color: string; icon: typeof Circle }> = {
  'selling':        { label: 'Selling',        color: 'var(--register-success)', icon: Handshake },
  'idle':           { label: 'Idle',           color: 'var(--register-warning)', icon: Circle },
  'with-customer':  { label: 'With customer',  color: 'var(--register-accent)',  icon: Users },
  'on-break':       { label: 'On break',       color: 'var(--register-text-dim)', icon: Coffee },
};

/* ── Zones on the floorplan ───────────────────────────────── */
interface Zone {
  id: string;
  label: string;
  x: number; y: number; w: number; h: number;
  density: number; // 0–100 → heat overlay
  accentVar: string;
}

const ZONES: Zone[] = [
  { id: 'entry',        label: 'Entry',            x: 42, y: 2,  w: 16, h: 8,  density: 82, accentVar: '--register-chart-1' },
  { id: 'window',       label: 'Window',           x: 2,  y: 2,  w: 36, h: 10, density: 34, accentVar: '--register-chart-2' },
  { id: 'cloudrest',    label: 'CloudRest Bay',    x: 18, y: 22, w: 24, h: 26, density: 88, accentVar: '--register-chart-1' },
  { id: 'harmony',      label: 'Harmony Bay',      x: 42, y: 22, w: 22, h: 26, density: 61, accentVar: '--register-chart-6' },
  { id: 'essential',    label: 'Essential Bay',    x: 64, y: 22, w: 22, h: 26, density: 42, accentVar: '--register-chart-3' },
  { id: 'adj-base',     label: 'Adj Base Theater', x: 42, y: 54, w: 22, h: 22, density: 74, accentVar: '--register-chart-4' },
  { id: 'pillow',       label: 'Pillow Station',   x: 6,  y: 58, w: 22, h: 18, density: 28, accentVar: '--register-chart-2' },
  { id: 'accessories',  label: 'Accessories',      x: 66, y: 54, w: 20, h: 14, density: 38, accentVar: '--register-chart-7' },
  { id: 'checkout',     label: 'Checkout',         x: 78, y: 72, w: 16, h: 18, density: 55, accentVar: '--register-chart-5' },
];

/* ── Customer dots ─────────────────────────────────────────── */
const CUSTOMER_DOTS = [
  { x: 22, y: 30, zone: 'CloudRest Bay' },
  { x: 32, y: 42, zone: 'CloudRest Bay' },
  { x: 50, y: 34, zone: 'Harmony Bay' },
  { x: 76, y: 30, zone: 'Essential Bay' },
  { x: 52, y: 64, zone: 'Adj Base Theater' },
  { x: 60, y: 72, zone: 'Adj Base Theater' },
  { x: 84, y: 80, zone: 'Checkout' },
  { x: 50, y: 6,  zone: 'Entry' },
];

/* ── Active conversations ─────────────────────────────────── */
const ACTIVE_CONVOS = [
  { rep: 'Sarah L.', zone: 'CloudRest Bay',     durationMin: 14, persona: 'Couple · King shopper' },
  { rep: 'Raj P.',    zone: 'Harmony Bay',       durationMin: 6,  persona: 'Solo · Back pain' },
  { rep: 'Mike T.',   zone: 'Essential Bay',     durationMin: 3,  persona: 'Student · Budget' },
  { rep: 'Casey M.',  zone: 'Adj Base Theater',  durationMin: 18, persona: 'Retiree · Recovery' },
];

/* ── Hero KPI data ─────────────────────────────────────────── */
interface Kpi {
  label: string;
  value: string;
  deltaPct: number; // + up / - down vs yesterday
  spark: number[];
  accentVar: string;
}

const KPIS: Kpi[] = [
  { label: 'Traffic today',    value: '142',      deltaPct: 12.4, spark: [8, 14, 22, 18, 26, 31, 24, 29, 35, 33, 38, 42], accentVar: '--register-chart-1' },
  { label: 'Active shoppers',  value: '8',        deltaPct: 33.0, spark: [2, 3, 4, 3, 5, 6, 5, 7, 6, 7, 8, 8],            accentVar: '--register-chart-2' },
  { label: 'Avg wait',         value: '4m 12s',   deltaPct: -18.2, spark: [7, 6, 6, 5, 6, 5, 4, 5, 4, 4, 4, 4],           accentVar: '--register-chart-3' },
  { label: 'Conversion rate',  value: '34.2%',    deltaPct: 6.1,  spark: [22, 24, 26, 28, 31, 29, 32, 33, 31, 34, 35, 34], accentVar: '--register-chart-4' },
  { label: 'Revenue today',    value: '$48,210',  deltaPct: 18.9, spark: [4, 8, 12, 18, 22, 26, 30, 34, 38, 42, 46, 48],    accentVar: '--register-chart-5' },
  { label: 'Avg ticket',       value: '$1,892',   deltaPct: 4.3,  spark: [1600, 1700, 1780, 1820, 1840, 1870, 1880, 1890, 1888, 1892, 1895, 1892], accentVar: '--register-chart-6' },
];

/* ── Low inventory + walk-in forecast + interactions ─────── */
const LOW_INVENTORY = [
  { sku: 'CR-HYB-K-01', name: 'CloudRest Hybrid 13.5" King',     stock: 2,  dos: 1.2, tone: 'danger' as const },
  { sku: 'EM-ADJ-PRO',  name: 'ErgoMotion Adj Base Pro',          stock: 4,  dos: 2.1, tone: 'warning' as const },
  { sku: 'HM-MEM-Q-03', name: 'Harmony 11" Memory Foam Queen',    stock: 5,  dos: 2.8, tone: 'warning' as const },
  { sku: 'CG-PROT-Q',   name: 'CoolGuard Mattress Protector Q',   stock: 7,  dos: 3.4, tone: 'warning' as const },
];

const WALKIN_FORECAST = [
  { hour: '2 PM', expected: 18, actual: 21, staffed: 6 },
  { hour: '3 PM', expected: 28, actual: null, staffed: 6 },
  { hour: '4 PM', expected: 34, actual: null, staffed: 6 },
  { hour: '5 PM', expected: 29, actual: null, staffed: 7 },
];

type Outcome = 'Close' | 'Browse' | 'Hand-off' | 'Lost';
const OUTCOME_COLOR: Record<Outcome, string> = {
  'Close':    'var(--register-success)',
  'Browse':   'var(--register-text-dim)',
  'Hand-off': 'var(--register-accent)',
  'Lost':     'var(--register-danger)',
};

interface Interaction {
  time: string;
  rep: string;
  persona: string;
  zone: string;
  duration: string;
  outcome: Outcome;
  saleValue: number;
}

const INTERACTIONS: Interaction[] = [
  { time: '2:48 PM', rep: 'Sarah L.',  persona: 'Couple · King shopper',     zone: 'CloudRest Bay',    duration: '32m', outcome: 'Close',    saleValue: 4280 },
  { time: '2:41 PM', rep: 'Raj P.',    persona: 'Retiree · Recovery',        zone: 'Adj Base Theater', duration: '26m', outcome: 'Close',    saleValue: 3799 },
  { time: '2:22 PM', rep: 'Mike T.',   persona: 'Student · Budget',          zone: 'Essential Bay',    duration: '14m', outcome: 'Browse',   saleValue: 0 },
  { time: '2:10 PM', rep: 'Casey M.',  persona: 'Couple · Queen shopper',    zone: 'Harmony Bay',      duration: '22m', outcome: 'Hand-off', saleValue: 0 },
  { time: '1:54 PM', rep: 'James W.',  persona: 'Solo · Back pain',          zone: 'Harmony Bay',      duration: '19m', outcome: 'Close',    saleValue: 2499 },
  { time: '1:38 PM', rep: 'Anna K.',   persona: 'Young couple · Firm',       zone: 'CloudRest Bay',    duration: '28m', outcome: 'Close',    saleValue: 3199 },
  { time: '1:12 PM', rep: 'Sarah L.',  persona: 'Comparison shopper',        zone: 'Pillow Station',   duration: '11m', outcome: 'Lost',     saleValue: 0 },
  { time: '12:50 PM', rep: 'Raj P.',   persona: 'Second home buyer',         zone: 'CloudRest Bay',    duration: '41m', outcome: 'Close',    saleValue: 5499 },
];

/* ════════════════════════════════════════════════════════════
   INLINE SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function Sparkline({ data, color, width = 72, height = 20 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = data.length > 1 ? width / (data.length - 1) : width;
  const points = data.map((d, i) => {
    const x = i * step;
    const y = height - ((d - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }} aria-hidden>
      <polyline points={areaPoints} fill={color} fillOpacity={0.12} stroke="none" />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Delta({ pct }: { pct: number }) {
  const up = pct >= 0;
  // For "Avg wait" a negative value is GOOD, but we colour strictly on sign.
  // Caller can pass negated pct if they prefer — keep simple here.
  const color = up ? 'var(--register-success)' : 'var(--register-danger)';
  const Arrow = up ? ArrowUp : ArrowDown;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color, fontSize: '0.82rem', fontWeight: 700 }}>
      <Arrow size={12} strokeWidth={3} />
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

/* ── Store floor plan (inline SVG/DOM hybrid) ─────────────── */
function FloorPlan({ selectedZone, onSelectZone }: { selectedZone: string | null; onSelectZone: (id: string | null) => void }) {
  return (
    <div
      style={{
        position: 'relative',
        flex: '1 1 66%',
        minWidth: 420,
        minHeight: 520,
        borderRadius: 14,
        background: 'var(--register-bg-surface)',
        border: '1px solid var(--register-border)',
        overflow: 'hidden',
      }}
    >
      {/* Grid lines */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage:
            'linear-gradient(var(--register-border) 1px, transparent 1px), linear-gradient(90deg, var(--register-border) 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.35,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'absolute', top: 12, left: 16, right: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={16} color="var(--register-accent)" />
          <span className="register-meta-label" style={{ margin: 0 }}>Galleria Flagship #12 — Top-down view</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {(['selling', 'with-customer', 'idle', 'on-break'] as const).map((s) => {
            const m = STATUS_META[s];
            return (
              <div key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zones */}
      {ZONES.map((z) => {
        const isSel = selectedZone === z.id;
        const accent = `var(${z.accentVar})`;
        // density → alpha on fill
        const heat = Math.min(1, z.density / 110);
        return (
          <button
            key={z.id}
            onClick={() => onSelectZone(isSel ? null : z.id)}
            style={{
              position: 'absolute',
              left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%`,
              border: `1.5px ${isSel ? 'solid' : 'dashed'} ${accent}`,
              borderRadius: 10,
              background:
                `linear-gradient(180deg, color-mix(in srgb, ${accent} ${Math.round(heat * 28)}%, transparent), color-mix(in srgb, ${accent} ${Math.round(heat * 12)}%, transparent))`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'flex-start', justifyContent: 'flex-end',
              padding: 8, gap: 2,
              color: 'inherit',
              cursor: 'pointer',
              transition: 'transform 160ms ease, box-shadow 160ms ease',
              transform: isSel ? 'translateY(-1px)' : 'none',
              boxShadow: isSel ? `0 6px 18px color-mix(in srgb, ${accent} 35%, transparent)` : 'none',
              zIndex: 2,
            }}
            aria-pressed={isSel}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--register-text)', textShadow: '0 1px 0 rgba(0,0,0,0.15)' }}>
              {z.label}
            </span>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>
              Density {z.density}
            </span>
          </button>
        );
      })}

      {/* Customer dots */}
      {CUSTOMER_DOTS.map((c, i) => (
        <span
          key={i}
          className="floor-cust-drift"
          style={{
            position: 'absolute',
            left: `${c.x}%`, top: `${c.y}%`,
            width: 10, height: 10, borderRadius: '50%',
            background: 'var(--register-text-muted)',
            border: '2px solid var(--register-bg-elevated)',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
            animationDelay: `${(i % 4) * 0.4}s`,
          }}
        />
      ))}

      {/* Rep dots */}
      {FLOOR_REPS.map((rep) => {
        const meta = STATUS_META[rep.status];
        return (
          <div
            key={rep.id}
            style={{
              position: 'absolute',
              left: `${rep.x}%`, top: `${rep.y}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              zIndex: 7,
            }}
          >
            <span
              className="floor-rep-pulse"
              style={{
                width: 22, height: 22, borderRadius: '50%',
                background: meta.color,
                color: 'var(--register-bg-elevated)',
                fontSize: '0.72rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--register-bg-elevated)',
                boxShadow: `0 0 14px ${meta.color}`,
              }}
            >
              {rep.initials}
            </span>
            <span
              style={{
                fontSize: '0.72rem', fontWeight: 700,
                color: 'var(--register-text)',
                background: 'var(--register-bg-elevated)',
                border: '1px solid var(--register-border)',
                padding: '1px 6px', borderRadius: 4,
                whiteSpace: 'nowrap',
              }}
            >
              {rep.name.split(' ')[0]}
            </span>
          </div>
        );
      })}

      {/* Entrance beacon */}
      <div
        style={{
          position: 'absolute', top: 0, left: '46%', width: '8%', height: 4,
          background: 'var(--register-accent)',
          boxShadow: '0 0 10px var(--register-accent)',
          borderRadius: '0 0 4px 4px',
          zIndex: 6,
        }}
      />

      <style>{`
        @keyframes floorRepPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 12px currentColor; }
          50%      { transform: scale(1.08); box-shadow: 0 0 22px currentColor; }
        }
        .floor-rep-pulse { animation: floorRepPulse 2.4s ease-in-out infinite; }
        @keyframes floorCustDrift {
          0%, 100% { transform: translate(-50%, -50%); }
          50%      { transform: translate(-40%, -60%); }
        }
        .floor-cust-drift { animation: floorCustDrift 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .floor-rep-pulse, .floor-cust-drift { animation: none; }
        }
      `}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function FloorDashboard() {
  const insight = getInsight('ops/floor');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [sortByValue, setSortByValue] = useState(false);

  const sortedInteractions = useMemo(() => {
    const copy = [...INTERACTIONS];
    if (sortByValue) copy.sort((a, b) => b.saleValue - a.saleValue);
    return copy;
  }, [sortByValue]);

  const zone = selectedZone ? ZONES.find((z) => z.id === selectedZone) : null;
  const zoneReps = zone ? FLOOR_REPS.filter((r) => r.zone === zone.label) : FLOOR_REPS;
  const zoneInteractions = zone ? INTERACTIONS.filter((i) => i.zone === zone.label) : INTERACTIONS;

  return (
    <RegisterPage title="Floor Dashboard" accentColor="#8B5CF6">
      {/* ── Manager pill header ──────────────────────────── */}
      <div
        className="reg-fade-up"
        style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 999,
            background: 'var(--register-bg-surface)',
            border: '1px solid var(--register-border)',
            fontSize: '0.85rem', fontWeight: 600, color: 'var(--register-text)',
          }}
        >
          <Users size={14} color="var(--register-accent)" />
          Manager: <strong style={{ color: 'var(--register-text)' }}>Alex Rivera</strong>
          <span style={{ color: 'var(--register-text-dim)' }}>·</span>
          Galleria Flagship #12
          <span style={{ color: 'var(--register-text-dim)' }}>·</span>
          Store #247
        </span>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 999,
            background: 'color-mix(in srgb, var(--register-success) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--register-success) 40%, transparent)',
            fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)',
          }}
        >
          <span className="reg-live-dot" />
          LIVE · 3:14 PM
        </span>
      </div>

      {/* ── AI Insight ───────────────────────────────────── */}
      {insight && (
        <div className="reg-fade-up reg-stagger-1" style={{ marginBottom: 18 }}>
          <AIInsightCard>{insight.text}</AIInsightCard>
        </div>
      )}

      {/* ═══ SECTION 1 — Hero KPI strip (6 tiles) ═══ */}
      <div
        className="reg-fade-up reg-stagger-2"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 18,
        }}
      >
        {KPIS.map((k, i) => (
          <div
            key={k.label}
            className="register-card"
            style={{
              padding: '14px 16px',
              borderTop: `3px solid var(${k.accentVar})`,
              display: 'flex', flexDirection: 'column', gap: 6,
              animationDelay: `${0.05 * i}s`,
            }}
          >
            <p className="register-meta-label" style={{ margin: 0 }}>{k.label}</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
              <span className="register-kpi-value" style={{ color: `var(${k.accentVar})` }}>{k.value}</span>
              <Sparkline data={k.spark} color={`var(${k.accentVar})`} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--register-text-dim)', fontWeight: 600 }}>vs yesterday</span>
              <Delta pct={k.deltaPct} />
            </div>
          </div>
        ))}
      </div>

      {/* ═══ SECTION 2 — Map + Rep panel ═══ */}
      <section
        className="reg-fade-up reg-stagger-3"
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 14,
          marginBottom: 18,
          minHeight: 520,
        }}
      >
        <FloorPlan selectedZone={selectedZone} onSelectZone={setSelectedZone} />

        {/* Right panel */}
        <div
          className="register-card"
          style={{
            flex: '1 1 32%', minWidth: 320,
            display: 'flex', flexDirection: 'column',
            padding: 0, overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--register-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--register-bg-surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio size={14} color="var(--register-success)" />
              <span className="register-meta-label" style={{ margin: 0 }}>
                {zone ? `${zone.label} — detail` : 'Now on the Floor'}
              </span>
            </div>
            {zone && (
              <button
                onClick={() => setSelectedZone(null)}
                style={{
                  fontSize: '0.78rem', fontWeight: 700, color: 'var(--register-accent)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                }}
              >
                Clear filter
              </button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Rep cards */}
            {zoneReps.length === 0 && (
              <div style={{ fontSize: '0.88rem', color: 'var(--register-text-muted)', padding: 12 }}>
                No reps currently in this zone.
              </div>
            )}
            {zoneReps.map((rep) => {
              const meta = STATUS_META[rep.status];
              const pct = Math.min(100, Math.round((rep.mtdRevenue / rep.quotaMTD) * 100));
              return (
                <div
                  key={rep.id}
                  className="register-card-hover"
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid var(--register-border)',
                    background: 'var(--register-bg-surface)',
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: meta.color,
                        color: 'var(--register-bg-elevated)',
                        fontSize: '0.82rem', fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 0 2px var(--register-bg-elevated), 0 0 0 3px ${meta.color}`,
                        flexShrink: 0,
                      }}
                    >
                      {rep.initials}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--register-text)' }}>{rep.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--register-text-muted)' }}>
                        <span style={{ color: meta.color, fontWeight: 700 }}>{meta.label}</span>
                        {' · '}{rep.zone}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--register-text)' }}>
                        ${(rep.mtdRevenue / 1000).toFixed(1)}k
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--register-text-dim)' }}>MTD</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--register-text-dim)', fontWeight: 600 }}>vs quota</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: pct >= 100 ? 'var(--register-success)' : 'var(--register-text)' }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: 'var(--register-border)', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`, height: '100%',
                          background: pct >= 100 ? 'var(--register-success)' : 'var(--register-accent)',
                          transition: 'width 600ms ease',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Active conversations */}
            <div style={{ marginTop: 6 }}>
              <div className="register-meta-label" style={{ margin: '0 0 8px' }}>Active conversations</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(zone ? zoneInteractions : ACTIVE_CONVOS).slice(0, 5).map((c, i) => {
                  const isActive = 'durationMin' in c;
                  const durationLabel = isActive
                    ? `${(c as typeof ACTIVE_CONVOS[number]).durationMin}m`
                    : (c as Interaction).duration;
                  const rep = isActive ? (c as typeof ACTIVE_CONVOS[number]).rep : (c as Interaction).rep;
                  const persona = isActive ? (c as typeof ACTIVE_CONVOS[number]).persona : (c as Interaction).persona;
                  const zoneLabel = isActive ? (c as typeof ACTIVE_CONVOS[number]).zone : (c as Interaction).zone;
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 10px', borderRadius: 8,
                        background: 'var(--register-bg-elevated)',
                        border: '1px solid var(--register-border)',
                      }}
                    >
                      <Activity size={14} color="var(--register-accent)" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-text)' }}>{rep} · {zoneLabel}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--register-text-muted)' }}>{persona}</div>
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-text-dim)' }}>{durationLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3 — Shift performance (3 columns) ═══ */}
      <section
        className="reg-fade-up reg-stagger-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 14,
          marginBottom: 18,
        }}
      >
        {/* This hour vs last hour */}
        <div className="register-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <TrendingUp size={16} color="var(--register-chart-1)" />
            <p className="register-section-header" style={{ margin: 0 }}>This hour vs last hour</p>
          </div>
          {[
            { label: 'Revenue',    last: 5200,  now: 7480, fmt: (v: number) => `$${v.toLocaleString()}` },
            { label: 'Units',      last: 3,     now: 5,    fmt: (v: number) => String(v) },
            { label: 'Conversion', last: 28,    now: 36,   fmt: (v: number) => `${v}%` },
          ].map((row) => {
            const max = Math.max(row.last, row.now);
            return (
              <div key={row.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>{row.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-text)' }}>
                    {row.fmt(row.now)}
                    <span style={{ color: 'var(--register-text-dim)', fontWeight: 500 }}> · prev {row.fmt(row.last)}</span>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ flex: 1, height: 10, borderRadius: 4, background: 'var(--register-border)', overflow: 'hidden' }}>
                    <div style={{ width: `${(row.last / max) * 100}%`, height: '100%', background: 'var(--register-chart-8)' }} />
                  </div>
                  <div style={{ flex: 1, height: 10, borderRadius: 4, background: 'var(--register-border)', overflow: 'hidden' }}>
                    <div style={{ width: `${(row.now / max) * 100}%`, height: '100%', background: 'var(--register-chart-1)' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Today vs same day last week */}
        <div className="register-card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Activity size={16} color="var(--register-chart-2)" />
            <p className="register-section-header" style={{ margin: 0 }}>Today vs last week</p>
          </div>
          {[
            { label: 'Traffic',  today: [12, 18, 26, 34, 42, 48, 54, 66, 78, 92, 108, 142], last: [14, 20, 28, 36, 40, 46, 52, 62, 70, 82, 96, 124] },
            { label: 'Revenue',  today: [2, 5, 9, 14, 19, 23, 28, 33, 36, 40, 44, 48],       last: [3, 6, 10, 14, 18, 22, 26, 30, 33, 36, 40, 42] },
            { label: 'Attach',   today: [28, 30, 32, 33, 31, 34, 36, 37, 38, 37, 39, 40],    last: [25, 27, 29, 30, 31, 32, 32, 33, 34, 33, 34, 35] },
          ].map((row) => (
            <div key={row.label} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ flex: '0 0 68px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>{row.label}</span>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Sparkline data={row.last} color="var(--register-chart-8)" width={160} height={14} />
                <Sparkline data={row.today} color="var(--register-chart-2)" width={160} height={14} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-success)' }}>
                +{Math.round(((row.today[row.today.length - 1] - row.last[row.last.length - 1]) / row.last[row.last.length - 1]) * 100)}%
              </span>
            </div>
          ))}
          <div style={{ fontSize: '0.74rem', color: 'var(--register-text-dim)', marginTop: 8 }}>
            Top line: last week · bottom line: today
          </div>
        </div>

        {/* Week progress */}
        <div className="register-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Target size={16} color="var(--register-chart-4)" />
            <p className="register-section-header" style={{ margin: 0 }}>Week progress vs plan</p>
          </div>
          {(() => {
            const pct = 68;
            const r = 54;
            const c = 2 * Math.PI * r;
            const dash = c * (pct / 100);
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <svg width={140} height={140} viewBox="0 0 140 140">
                  <circle cx={70} cy={70} r={r} stroke="var(--register-border)" strokeWidth={12} fill="none" />
                  <circle
                    cx={70} cy={70} r={r}
                    stroke="var(--register-chart-4)"
                    strokeWidth={12}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${c}`}
                    transform="rotate(-90 70 70)"
                  />
                  <text x={70} y={68} textAnchor="middle" fontSize="28" fontWeight="800" fill="var(--register-text)">{pct}%</text>
                  <text x={70} y={90} textAnchor="middle" fontSize="11" fill="var(--register-text-muted)" letterSpacing="1">OF PLAN</text>
                </svg>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--register-text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booked</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--register-text)' }}>$184,760</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--register-text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--register-text-muted)' }}>$272,000</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--register-text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pace</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-success)' }}>+2.4 days ahead</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ═══ SECTION 4 — Low inventory + walk-in forecast ═══ */}
      <section
        className="reg-fade-up reg-stagger-5"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 14,
          marginBottom: 18,
        }}
      >
        {/* Low inventory */}
        <div className="register-section" style={{ margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Package size={16} color="var(--register-danger)" />
            <p className="register-section-header" style={{ margin: 0 }}>Low inventory alerts</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOW_INVENTORY.map((it) => {
              const tone = it.tone === 'danger' ? 'var(--register-danger)' : 'var(--register-warning)';
              return (
                <div
                  key={it.sku}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    gap: 12, alignItems: 'center',
                    padding: '10px 12px', borderRadius: 10,
                    border: `1px solid color-mix(in srgb, ${tone} 40%, transparent)`,
                    background: `color-mix(in srgb, ${tone} 8%, transparent)`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--register-text)' }}>{it.name}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--register-text-muted)' }}>{it.sku}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)', fontWeight: 600 }}>On hand</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--register-text)' }}>{it.stock}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)', fontWeight: 600 }}>Days left</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: tone }}>{it.dos.toFixed(1)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Walk-in forecast */}
        <div className="register-section" style={{ margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Users size={16} color="var(--register-accent)" />
            <p className="register-section-header" style={{ margin: 0 }}>Walk-in forecast · next 4 hours</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 160, padding: '0 4px' }}>
            {WALKIN_FORECAST.map((f) => {
              const max = 40;
              const expectedPct = (f.expected / max) * 100;
              const actualPct = f.actual != null ? (f.actual / max) * 100 : 0;
              return (
                <div key={f.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', gap: 4, alignItems: 'flex-end' }}>
                    <div
                      style={{
                        flex: 1,
                        height: `${expectedPct}%`,
                        background: 'var(--register-chart-2)',
                        borderRadius: '6px 6px 0 0',
                        opacity: 0.55,
                      }}
                      title={`Expected ${f.expected}`}
                    />
                    {f.actual != null && (
                      <div
                        style={{
                          flex: 1,
                          height: `${actualPct}%`,
                          background: 'var(--register-chart-1)',
                          borderRadius: '6px 6px 0 0',
                        }}
                        title={`Actual ${f.actual}`}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--register-text)' }}>{f.hour}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--register-text-muted)' }}>
                    {f.actual != null ? `${f.actual} / ${f.expected}` : f.expected} · {f.staffed} reps
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: '10px 12px', borderRadius: 10,
              background: 'color-mix(in srgb, var(--register-warning) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--register-warning) 40%, transparent)',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={16} color="var(--register-warning)" style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: '0.88rem', color: 'var(--register-text)', lineHeight: 1.45 }}>
              <strong>Staffing gap — 3 PM.</strong> Forecast 28 walk-ins with 6 reps on floor; CloudRest Bay pacing at 88% density. Recommend pulling Anna K. from Pillow Station or calling in +1 rep to keep avg wait under 5 minutes.
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5 — Top interactions table ═══ */}
      <section className="register-section reg-fade-up reg-stagger-6" style={{ margin: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Handshake size={16} color="var(--register-primary)" />
            <p className="register-section-header" style={{ margin: 0 }}>Today&rsquo;s top interactions</p>
          </div>
          <button
            onClick={() => setSortByValue((v) => !v)}
            style={{
              fontSize: '0.82rem', fontWeight: 700,
              padding: '6px 12px', borderRadius: 8,
              background: sortByValue ? 'var(--register-primary)' : 'var(--register-bg-surface)',
              color: sortByValue ? '#FFFFFF' : 'var(--register-text)',
              border: '1px solid var(--register-border)',
              cursor: 'pointer',
            }}
          >
            {sortByValue ? 'Sorted: sale value ↓' : 'Sort by sale value'}
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 860, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Time', 'Rep', 'Customer persona', 'Zone', 'Duration', 'Outcome', 'Sale value'].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: i === 6 || i === 4 ? 'right' : 'left',
                      padding: '10px 12px',
                      fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
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
              {sortedInteractions.map((row, i) => (
                <tr key={`${row.time}-${row.rep}`} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--register-bg-surface)' }}>
                  <td style={{ padding: '10px 12px', fontSize: '0.85rem', color: 'var(--register-text-muted)', fontVariantNumeric: 'tabular-nums' }}>{row.time}</td>
                  <td style={{ padding: '10px 12px', fontSize: '0.85rem', color: 'var(--register-text)', fontWeight: 700 }}>{row.rep}</td>
                  <td style={{ padding: '10px 12px', fontSize: '0.85rem', color: 'var(--register-text-muted)' }}>{row.persona}</td>
                  <td style={{ padding: '10px 12px', fontSize: '0.85rem', color: 'var(--register-text)' }}>{row.zone}</td>
                  <td style={{ padding: '10px 12px', fontSize: '0.85rem', color: 'var(--register-text)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.duration}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 10px', borderRadius: 999,
                        fontSize: '0.78rem', fontWeight: 700,
                        color: '#FFFFFF',
                        background: OUTCOME_COLOR[row.outcome],
                      }}
                    >
                      {row.outcome}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--register-text)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {row.saleValue > 0 ? `$${row.saleValue.toLocaleString()}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </RegisterPage>
  );
}
