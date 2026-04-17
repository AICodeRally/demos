'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import {
  Building2, BarChart3, DollarSign, Users, Clock, Heart,
  TrendingUp, TrendingDown, MapPin, Award, Rocket, Landmark,
  Flame, AlertTriangle, Sparkles, ArrowUpRight, Calendar,
} from 'lucide-react';
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip,
} from 'recharts';

/* ─────────────────────────────────────────────────────────────
   Summit Sleep Co. — FY26 Enterprise Snapshot
   The opening page of the REGISTER prospect demo. Executive view.
   ───────────────────────────────────────────────────────────── */

/* ── Animated count-up hook ─────────────────────────────── */
function useCountUp(target: number, duration = 1400, decimals = 0) {
  const [value, setValue] = useState(0);
  const [mounted, setMounted] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted, target, duration, decimals]);

  return value;
}

/* ── Number formatting helpers ─────────────────────────── */
const fmtMoney0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const fmtInt = new Intl.NumberFormat('en-US');
const fmtPct1 = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });

/* ── Hero stat tiles ─────────────────────────────────────── */
interface StatTile {
  label: string;
  sub: string;
  icon: typeof Building2;
  colorVar: string;
  numVal: number;
  display: (n: number) => string;
  trendPct: number;
  spark: number[];
}

const HERO_STATS: StatTile[] = [
  {
    label: 'Total Stores', sub: 'Across 4 formats', icon: Building2,
    colorVar: 'var(--register-chart-1)', numVal: 200,
    display: (n) => fmtInt.format(Math.round(n)),
    trendPct: 3.1, spark: [186, 188, 189, 191, 192, 194, 195, 197, 198, 199, 200, 200],
  },
  {
    label: 'Store Formats', sub: 'Flagship · Std · Outlet · SiS', icon: BarChart3,
    colorVar: 'var(--register-chart-2)', numVal: 4,
    display: (n) => fmtInt.format(Math.round(n)),
    trendPct: 0, spark: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    label: 'Annual Revenue', sub: 'FY25 · $340M', icon: DollarSign,
    colorVar: 'var(--register-chart-3)', numVal: 340,
    display: (n) => `$${Math.round(n)}M`,
    trendPct: 8.2, spark: [298, 304, 308, 314, 318, 320, 325, 328, 332, 335, 338, 340],
  },
  {
    label: 'Sales Reps', sub: 'Active headcount', icon: Users,
    colorVar: 'var(--register-chart-6)', numVal: 850,
    display: (n) => fmtInt.format(Math.round(n)),
    trendPct: 4.5, spark: [790, 798, 804, 812, 818, 824, 829, 835, 840, 844, 848, 850],
  },
  {
    label: 'Avg Tenure', sub: 'Sales rep years', icon: Clock,
    colorVar: 'var(--register-chart-4)', numVal: 4.2,
    display: (n) => `${n.toFixed(1)} yrs`,
    trendPct: 1.8, spark: [3.8, 3.85, 3.9, 3.95, 3.98, 4.02, 4.05, 4.08, 4.12, 4.15, 4.18, 4.2],
  },
  {
    label: 'NPS Score', sub: 'Employee + customer', icon: Heart,
    colorVar: 'var(--register-chart-7)', numVal: 68,
    display: (n) => fmtInt.format(Math.round(n)),
    trendPct: 6.3, spark: [58, 60, 61, 62, 63, 64, 65, 66, 66, 67, 67, 68],
  },
];

/* ── Store formats ──────────────────────────────────────── */
const STORE_FORMATS = [
  { name: 'Flagship',     stores: 12,  tag: 'Premium Experience',  avgRev: 22_400_000, colorVar: 'var(--register-chart-1)' },
  { name: 'Standard',     stores: 120, tag: 'Volume Driver',       avgRev: 1_760_000,  colorVar: 'var(--register-chart-2)' },
  { name: 'Outlet',       stores: 48,  tag: 'Clearance & Value',   avgRev: 980_000,    colorVar: 'var(--register-chart-6)' },
  { name: 'Shop-in-Shop', stores: 20,  tag: 'Partner Locations',   avgRev: 620_000,    colorVar: 'var(--register-chart-3)' },
];

/* ── 7-region footprint (invented block map) ────────────── */
interface Region {
  id: string;
  name: string;
  stores: number;
  revM: number;
  aspK: number;
  growth: number;
  x: number; y: number; w: number; h: number; // SVG coords (0–100 grid)
}

const REGIONS: Region[] = [
  { id: 'west',      name: 'West',          stores: 38, revM: 78,  aspK: 2.05, growth: 9.4,  x:  4, y: 30, w: 14, h: 34 },
  { id: 'mountain',  name: 'Mountain',      stores: 18, revM: 28,  aspK: 1.72, growth: 12.1, x: 20, y: 22, w: 12, h: 30 },
  { id: 'southwest', name: 'Southwest',     stores: 24, revM: 36,  aspK: 1.64, growth: 7.8,  x: 20, y: 54, w: 14, h: 28 },
  { id: 'central',   name: 'Central',       stores: 32, revM: 54,  aspK: 1.78, growth: 5.2,  x: 36, y: 18, w: 16, h: 36 },
  { id: 'southeast', name: 'Southeast',     stores: 42, revM: 66,  aspK: 1.82, growth: 8.6,  x: 54, y: 44, w: 18, h: 34 },
  { id: 'midatl',    name: 'Mid-Atlantic',  stores: 22, revM: 42,  aspK: 2.01, growth: 6.1,  x: 72, y: 30, w: 12, h: 22 },
  { id: 'northeast', name: 'Northeast',     stores: 24, revM: 58,  aspK: 2.18, growth: 4.4,  x: 84, y: 12, w: 14, h: 26 },
];

const REGION_DENSITY_STOPS: [number, string][] = [
  [0, 'var(--register-chart-2)'],
  [1, 'var(--register-chart-1)'],
];

function regionColor(stores: number) {
  const max = Math.max(...REGIONS.map(r => r.stores));
  const t = stores / max;
  // Blend two chart tokens via RGBA-style trick — just pick one; density shown via opacity too.
  if (t > 0.75) return 'var(--register-chart-1)';
  if (t > 0.55) return 'var(--register-chart-2)';
  if (t > 0.35) return 'var(--register-chart-3)';
  return 'var(--register-chart-6)';
}

/* ── Panel cards (By-the-numbers sidebar) ───────────────── */
const SIDEBAR_CARDS = [
  { icon: Award,    label: 'Top-performing region', name: 'West',            metric: '$78M rev · 19.4% of total', bar: 92, color: 'var(--register-chart-3)' },
  { icon: Rocket,   label: 'Fastest-growing',       name: 'Mountain',        metric: '+12.1% YoY',                 bar: 81, color: 'var(--register-chart-2)' },
  { icon: TrendingUp, label: 'Highest ASP store',   name: 'Flagship #08 — SoMa', metric: '$2,640 avg sale price', bar: 88, color: 'var(--register-chart-1)' },
  { icon: Landmark, label: 'Longest-standing flagship', name: 'Galleria — Houston', metric: 'Est. 1998 · 28 yrs',   bar: 100, color: 'var(--register-chart-7)' },
];

/* ── Performance dashboard data ─────────────────────────── */
const REVENUE_TREND = [
  { label: 'Q1 25', rev: 76 },
  { label: 'Q2 25', rev: 80 },
  { label: 'Q3 25', rev: 88 },
  { label: 'Q4 25', rev: 96 },
  { label: 'Q1 26', rev: 82 },
  { label: 'Q2 26', rev: 92 },
];

const ATTACH_BY_FORMAT = [
  { format: 'Flagship',     pct: 31, color: 'var(--register-chart-1)' },
  { format: 'Standard',     pct: 26, color: 'var(--register-chart-2)' },
  { format: 'Outlet',       pct: 18, color: 'var(--register-chart-6)' },
  { format: 'Shop-in-Shop', pct: 35, color: 'var(--register-chart-3)' },
];

const FINANCING_SEGMENTS = [
  { label: 'Prime',     pct: 42, color: 'var(--register-chart-1)' },
  { label: 'Near-prime', pct: 18, color: 'var(--register-chart-2)' },
  { label: 'Subprime',  pct: 8,  color: 'var(--register-chart-4)' },
  { label: 'Cash',      pct: 32, color: 'var(--register-chart-8)' },
];

/* ── Quarterly highlights ───────────────────────────────── */
const HIGHLIGHTS = [
  {
    tag: 'MARKETING', date: 'March 2026',
    headline: 'Spring Sleep Campaign launched',
    body: '$4.8M incremental revenue in first 14 days. Attach rate on adjustable bases hit 28% — the highest run-rate of any national promo in the last 18 months.',
    color: 'var(--register-chart-2)',
  },
  {
    tag: 'EXPANSION', date: 'FY26 Plan',
    headline: 'Outlet format expansion approved',
    body: '12 new locations greenlit for FY26 in underserved Texas and Southeast metros. Capex $18M, targeted break-even by month 9 per finance model.',
    color: 'var(--register-chart-3)',
  },
  {
    tag: 'PRODUCT', date: 'LTM through Mar',
    headline: 'CloudRest Hybrid hit $98M run-rate',
    body: '22% of total mattress revenue, up from 14% a year ago. Margin accretive at 39.8% GM — now the anchor of the premium-tier floor set.',
    color: 'var(--register-chart-6)',
  },
];

/* ── Risks ─────────────────────────────────────────────── */
const RISKS = [
  { severity: 'high',   label: 'West region staffing gap', detail: '12 open requisitions · turnover +18% QoQ' },
  { severity: 'high',   label: 'Casper competitive DTC surge', detail: 'Southeast ASP compression observed in March' },
  { severity: 'med',    label: 'Outlet inventory aging',   detail: '$4.2M in 180+ day SKUs across 14 stores' },
  { severity: 'low',    label: 'Comp plan drift',          detail: '3 draft rules pending CFO approval in REGISTER' },
];

/* ── Opportunities ────────────────────────────────────── */
const OPPORTUNITIES = [
  { label: 'Bundle attach push — Flagship', impact: 3_800_000, detail: 'Move attach rate 31 -> 36% on premium tier drives $3.8M.' },
  { label: 'Financing penetration lift',    impact: 2_100_000, detail: 'Raise to 70% across Standard network — +$2.1M GP.' },
  { label: 'Shop-in-Shop partner expansion', impact: 5_400_000, detail: '8 incremental partner footprints in Central + Mountain.' },
];

/* ──────────────────────────────────────────────────────────
   Inline helper components
   ────────────────────────────────────────────────────────── */

function Sparkline({ points, color, height = 28, width = 120 }: { points: number[]; color: string; height?: number; width?: number }) {
  if (!points.length) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1 || 1);
  const path = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p - min) / range) * height;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const lastX = (points.length - 1) * step;
  const lastY = height - ((points[points.length - 1] - min) / range) * height;
  return (
    <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }} aria-hidden>
      <defs>
        <linearGradient id={`sparkFill-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${lastX},${height} L0,${height} Z`} fill={`url(#sparkFill-${color.replace(/[^a-z0-9]/gi, '')})`} />
      <path d={path} stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={2.6} fill={color} />
    </svg>
  );
}

function TrendBadge({ pct }: { pct: number }) {
  if (pct === 0) {
    return (
      <span style={{
        fontSize: '0.82rem', fontWeight: 600, color: 'var(--register-text-dim)',
        padding: '2px 8px', borderRadius: 999, background: 'var(--register-bg-surface)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        flat
      </span>
    );
  }
  const up = pct > 0;
  const color = up ? 'var(--register-success)' : 'var(--register-danger)';
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: '0.82rem', fontWeight: 700, color,
      padding: '2px 8px', borderRadius: 999,
      background: up ? 'rgba(5,150,105,0.12)' : 'rgba(220,38,38,0.12)',
      fontVariantNumeric: 'tabular-nums',
    }}>
      <Icon size={12} />
      {up ? '+' : ''}{pct.toFixed(1)}%
    </span>
  );
}

function HeroTile({ s, i, value, mounted }: { s: StatTile; i: number; value: number; mounted: boolean }) {
  const Icon = s.icon;
  return (
    <div
      className="register-card register-card-hover"
      style={{
        padding: '18px 20px 14px',
        borderTop: `3px solid ${s.colorVar}`,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${i * 0.07}s`,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 160,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 120, height: 120,
        background: `radial-gradient(circle at top right, ${s.colorVar}26, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: `color-mix(in srgb, ${s.colorVar} 18%, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid color-mix(in srgb, ${s.colorVar} 40%, transparent)`,
        }}>
          <Icon size={17} style={{ color: s.colorVar }} />
        </div>
        <TrendBadge pct={s.trendPct} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div className="register-kpi-value" style={{ fontSize: '2rem', lineHeight: 1.05 }}>
          {s.display(value)}
        </div>
        <Sparkline points={s.spark} color={s.colorVar as string} width={72} height={26} />
      </div>
      <div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>
          {s.label}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
          {s.sub}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, right }: { eyebrow: string; title: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
      <div>
        <div style={{
          fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--register-accent)',
        }}>
          {eyebrow}
        </div>
        <h2 style={{
          fontSize: '1.35rem', fontWeight: 800, color: 'var(--register-text)',
          margin: '4px 0 0', letterSpacing: '-0.01em',
        }}>
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}

function RadialGauge({ value, target, label }: { value: number; target: number; label: string }) {
  const size = 140;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const scaleMax = 12;
  const pct = Math.min(value / scaleMax, 1);
  const targetPct = Math.min(target / scaleMax, 1);
  const dash = pct * circ;

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '4px auto 0' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius}
          stroke="var(--register-bg-surface)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius}
          stroke="var(--register-chart-3)" strokeWidth={stroke} fill="none"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
        {/* Target tick */}
        <circle cx={size / 2} cy={size / 2} r={radius}
          stroke="var(--register-warning)" strokeWidth={stroke} fill="none"
          strokeDasharray={`2 ${circ}`}
          strokeDashoffset={-(targetPct * circ) + 1}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--register-text)', fontVariantNumeric: 'tabular-nums' }}>
          {value.toFixed(1)}%
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)', fontVariantNumeric: 'tabular-nums' }}>
          target {target.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

function Donut({ segments }: { segments: { label: string; pct: number; color: string }[] }) {
  const size = 140;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  const primary = segments[0];
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius}
          stroke="var(--register-bg-surface)" strokeWidth={stroke} fill="none" />
        {segments.map((seg) => {
          const len = (seg.pct / 100) * circ;
          const dash = `${len} ${circ - len}`;
          const el = (
            <circle
              key={seg.label}
              cx={size / 2} cy={size / 2} r={radius}
              stroke={seg.color} strokeWidth={stroke} fill="none"
              strokeDasharray={dash} strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--register-text)', fontVariantNumeric: 'tabular-nums' }}>
          {primary.pct}%
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', fontWeight: 600 }}>
          financed
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Main page
   ────────────────────────────────────────────────────────── */

export default function CorpOverview() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Animated hero values — call hooks deterministically, once per tile
  const v0 = useCountUp(HERO_STATS[0].numVal);
  const v1 = useCountUp(HERO_STATS[1].numVal);
  const v2 = useCountUp(HERO_STATS[2].numVal);
  const v3 = useCountUp(HERO_STATS[3].numVal);
  const v4 = useCountUp(HERO_STATS[4].numVal, 1400, 1);
  const v5 = useCountUp(HERO_STATS[5].numVal);
  const heroValues = [v0, v1, v2, v3, v4, v5];

  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const totalStores = useMemo(() => REGIONS.reduce((a, b) => a + b.stores, 0), []);
  const totalFormats = STORE_FORMATS.reduce((a, b) => a + b.stores, 0);

  return (
    <RegisterPage
      title="FY26 Enterprise Snapshot"
      subtitle="Summit Sleep Co. — 200 stores · $340M revenue · 850 sales reps"
      accentColor="#1E3A5F"
    >
      {/* ── Meta pills row ─────────────────────────────── */}
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 10,
          marginBottom: 18,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(6px)',
          transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: 'color-mix(in srgb, var(--register-primary) 14%, transparent)',
          border: '1px solid color-mix(in srgb, var(--register-primary) 40%, transparent)',
          color: 'var(--register-text)', fontSize: '0.82rem', fontWeight: 600,
        }}>
          <span className="reg-live-dot" />
          auto-refreshed every 15 min
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: 'var(--register-bg-surface)',
          border: '1px solid var(--register-border)',
          color: 'var(--register-text-muted)', fontSize: '0.82rem', fontWeight: 600,
        }}>
          <Users size={13} style={{ color: 'var(--register-accent)' }} />
          Linda Park · CEO view
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: 'var(--register-bg-surface)',
          border: '1px solid var(--register-border)',
          color: 'var(--register-text-muted)', fontSize: '0.82rem', fontWeight: 600,
        }}>
          <Clock size={13} style={{ color: 'var(--register-accent)' }} />
          Last updated 3:14 PM · Apr 17
        </span>
      </div>

      {/* ── Section 1 · Hero stat row ─────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16, marginBottom: 28,
        }}
      >
        {HERO_STATS.map((s, i) => (
          <HeroTile key={s.label} s={s} i={i} value={heroValues[i]} mounted={mounted} />
        ))}
      </div>

      {/* ── Section 2 · Portfolio map ─────────────────── */}
      <div
        className="register-section"
        style={{
          padding: 24, marginBottom: 24,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '0.28s',
        }}
      >
        <SectionHeader
          eyebrow="National Footprint"
          title="Store Portfolio — where Summit Sleep runs today"
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
              <MapPin size={14} style={{ color: 'var(--register-accent)' }} />
              {fmtInt.format(totalStores)} stores across 7 regions
            </div>
          }
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 65fr) minmax(0, 35fr)',
            gap: 20,
          }}
        >
          {/* Map */}
          <div
            style={{
              background: 'var(--register-bg-surface)',
              borderRadius: 14,
              border: '1px solid var(--register-border)',
              padding: 20,
              position: 'relative',
              minHeight: 320,
            }}
          >
            <div style={{
              position: 'absolute', top: 14, left: 18,
              fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-text-muted)',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              US Region Density
            </div>

            <svg viewBox="0 0 100 80" preserveAspectRatio="none" style={{ width: '100%', height: 340 }}>
              {REGIONS.map((r) => {
                const hovered = hoveredRegion === r.id;
                const fill = regionColor(r.stores);
                const opacity = hoveredRegion && !hovered ? 0.35 : 1;
                return (
                  <g
                    key={r.id}
                    onMouseEnter={() => setHoveredRegion(r.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  >
                    <rect
                      x={r.x} y={r.y} width={r.w} height={r.h}
                      rx={2.4} ry={2.4}
                      fill={fill}
                      opacity={opacity}
                      stroke={hovered ? 'var(--register-text)' : 'transparent'}
                      strokeWidth={hovered ? 0.4 : 0}
                      style={{ transition: 'opacity 0.25s, stroke 0.2s' }}
                    />
                    <text
                      x={r.x + r.w / 2} y={r.y + r.h / 2 - 1}
                      textAnchor="middle"
                      fontSize="2.4"
                      fontWeight={700}
                      fill="#FFFFFF"
                      style={{ pointerEvents: 'none' }}
                    >
                      {r.name}
                    </text>
                    <text
                      x={r.x + r.w / 2} y={r.y + r.h / 2 + 2.6}
                      textAnchor="middle"
                      fontSize="2"
                      fontWeight={600}
                      fill="#FFFFFF"
                      opacity={0.9}
                      style={{ pointerEvents: 'none' }}
                    >
                      {r.stores} stores
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover detail strip */}
            <div style={{
              marginTop: 8, padding: '10px 14px', borderRadius: 10,
              background: 'var(--register-bg-elevated)',
              border: '1px solid var(--register-border)',
              minHeight: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              fontSize: '0.9rem',
            }}>
              {hoveredRegion ? (() => {
                const r = REGIONS.find(x => x.id === hoveredRegion)!;
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: regionColor(r.stores) }} />
                      <span style={{ fontWeight: 700, color: 'var(--register-text)' }}>{r.name} Region</span>
                    </div>
                    <div style={{ display: 'flex', gap: 18, color: 'var(--register-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                      <span>{r.stores} stores</span>
                      <span>${r.revM}M rev</span>
                      <span>${r.aspK.toFixed(2)}K ASP</span>
                      <span style={{ color: r.growth > 0 ? 'var(--register-success)' : 'var(--register-danger)', fontWeight: 700 }}>
                        {r.growth > 0 ? '+' : ''}{r.growth.toFixed(1)}% YoY
                      </span>
                    </div>
                  </>
                );
              })() : (
                <div style={{ color: 'var(--register-text-muted)', fontWeight: 600 }}>
                  Hover a region for store count, revenue, ASP, and YoY growth.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar — by the numbers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SIDEBAR_CARDS.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.label}
                  className="register-card register-card-hover"
                  style={{
                    padding: '14px 16px',
                    borderLeft: `3px solid ${c.color}`,
                    display: 'flex', flexDirection: 'column', gap: 8,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(12px)',
                    transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                    transitionDelay: `${0.42 + i * 0.08}s`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: `color-mix(in srgb, ${c.color} 18%, transparent)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={14} style={{ color: c.color }} />
                    </div>
                    <div style={{
                      fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.05em',
                      textTransform: 'uppercase', color: 'var(--register-text-dim)',
                    }}>
                      {c.label}
                    </div>
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--register-text)' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--register-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                    {c.metric}
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: 'var(--register-bg-surface)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: mounted ? `${c.bar}%` : '0%',
                      background: c.color,
                      transition: `width 1.1s cubic-bezier(0.16,1,0.3,1) ${0.7 + i * 0.08}s`,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 3 · Store format distribution ─────── */}
      <div
        className="register-section"
        style={{
          padding: 24, marginBottom: 24,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '0.4s',
        }}
      >
        <SectionHeader
          eyebrow="Store Mix"
          title="Format distribution & revenue per store"
        />

        {/* Stacked proportion bar */}
        <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', height: 30, marginBottom: 18, border: '1px solid var(--register-border)' }}>
          {STORE_FORMATS.map((f) => (
            <div
              key={f.name}
              style={{
                width: mounted ? `${(f.stores / totalFormats) * 100}%` : '0%',
                background: f.colorVar as string,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
                transitionDelay: '0.6s',
              }}
            >
              {(f.stores / totalFormats) >= 0.08 && (
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {f.name} · {Math.round((f.stores / totalFormats) * 100)}%
                </span>
              )}
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {STORE_FORMATS.map((f, i) => {
            const share = (f.stores / totalFormats) * 100;
            return (
              <div
                key={f.name}
                className="register-card register-card-hover"
                style={{
                  padding: 18,
                  borderTop: `3px solid ${f.colorVar}`,
                  display: 'flex', flexDirection: 'column', gap: 10,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: `${0.55 + i * 0.08}s`,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{
                  fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: f.colorVar as string,
                }}>
                  {f.tag}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--register-text)' }}>
                  {f.name}
                </div>
                <div className="register-kpi-value" style={{ fontSize: '2rem', lineHeight: 1 }}>
                  {f.stores}
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--register-text-muted)', marginLeft: 6 }}>
                    stores
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--register-text-muted)', marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>
                    <span>{share.toFixed(0)}% of portfolio</span>
                    <span>avg {fmtMoney0.format(f.avgRev)}/yr</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--register-bg-surface)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: mounted ? `${share}%` : '0%',
                      background: f.colorVar as string, borderRadius: 3,
                      transition: `width 1.1s cubic-bezier(0.16,1,0.3,1) ${0.8 + i * 0.08}s`,
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 4 · Performance dashboard ─────────── */}
      <div
        className="register-section"
        style={{
          padding: 24, marginBottom: 24,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '0.52s',
        }}
      >
        <SectionHeader
          eyebrow="Performance"
          title="Operating health at a glance"
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {/* YoY Revenue */}
          <div className="register-card" style={{ padding: 18, minHeight: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>YoY Revenue</div>
              <TrendBadge pct={8.2} />
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>
              6 quarters · {fmtMoney0.format(340_000_000)} LTM
            </div>
            <div style={{ width: '100%', height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_TREND} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--register-chart-1)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--register-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis hide domain={[60, 'auto']} />
                  <Tooltip formatter={(v) => [`$${v}M`, 'Revenue']} labelStyle={{ fontWeight: 700 }} />
                  <Line
                    type="monotone" dataKey="rev"
                    stroke="var(--register-chart-1)" strokeWidth={2.5}
                    dot={{ r: 3, stroke: 'var(--register-chart-1)', fill: 'var(--register-bg-elevated)', strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comp % of Revenue — radial gauge */}
          <div className="register-card" style={{ padding: 18, minHeight: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>Comp % of Revenue</div>
              <span style={{
                fontSize: '0.82rem', fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                background: 'color-mix(in srgb, var(--register-success) 14%, transparent)',
                color: 'var(--register-success)',
              }}>
                under plan
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', marginBottom: 4 }}>
              MTD · target 8.0%
            </div>
            <RadialGauge value={7.8} target={8.0} label="MTD" />
          </div>

          {/* Attach rate by format */}
          <div className="register-card" style={{ padding: 18, minHeight: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>Attach Rate by Format</div>
              <TrendBadge pct={2.4} />
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', marginBottom: 14 }}>
              Protector, pillow, or financing
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ATTACH_BY_FORMAT.map((a, i) => (
                <div key={a.format}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 3 }}>
                    <span style={{ color: 'var(--register-text)', fontWeight: 600 }}>{a.format}</span>
                    <span style={{ color: 'var(--register-text-muted)', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{a.pct}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--register-bg-surface)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: mounted ? `${a.pct * 2.5}%` : '0%',
                      background: a.color, borderRadius: 4,
                      transition: `width 1.1s cubic-bezier(0.16,1,0.3,1) ${0.75 + i * 0.08}s`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financing penetration — donut */}
          <div className="register-card" style={{ padding: 18, minHeight: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>Financing Mix</div>
              <TrendBadge pct={1.6} />
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', marginBottom: 8 }}>
              Transactions this quarter
            </div>
            <Donut segments={FINANCING_SEGMENTS} />
            <div style={{
              marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
              fontSize: '0.82rem', color: 'var(--register-text-muted)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {FINANCING_SEGMENTS.map((seg) => (
                <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: seg.color }} />
                  <span>{seg.label}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--register-text)', fontWeight: 600 }}>{seg.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 5 · Quarterly highlights ─────────── */}
      <div
        style={{
          marginBottom: 24,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '0.62s',
        }}
      >
        <SectionHeader
          eyebrow="What's moving"
          title="Quarterly highlights"
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.headline}
              className="register-card register-card-hover"
              style={{
                padding: 20,
                display: 'flex', flexDirection: 'column', gap: 10,
                borderTop: `3px solid ${h.color}`,
                position: 'relative', overflow: 'hidden',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                transitionDelay: `${0.7 + i * 0.08}s`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: h.color,
                }}>
                  {h.tag}
                </span>
                <span style={{
                  fontSize: '0.82rem', color: 'var(--register-text-dim)',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  <Calendar size={12} /> {h.date}
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--register-text)', lineHeight: 1.3 }}>
                {h.headline}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--register-text-muted)', lineHeight: 1.5 }}>
                {h.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 6 · Risks & opportunities ─────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20, marginBottom: 12,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '0.75s',
        }}
      >
        {/* Risks */}
        <div className="register-section" style={{ padding: 22, margin: 0 }}>
          <SectionHeader
            eyebrow="Exec risk ledger"
            title="Risks on the radar"
            right={
              <span style={{
                fontSize: '0.82rem', fontWeight: 600, color: 'var(--register-text-muted)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <AlertTriangle size={13} style={{ color: 'var(--register-warning)' }} />
                {RISKS.filter(r => r.severity === 'high').length} high severity
              </span>
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RISKS.map((r) => {
              const sevColor =
                r.severity === 'high' ? 'var(--register-danger)' :
                r.severity === 'med' ? 'var(--register-warning)' :
                'var(--register-accent)';
              const sevLabel = r.severity.toUpperCase();
              return (
                <div
                  key={r.label}
                  style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    padding: '12px 14px', borderRadius: 10,
                    background: 'var(--register-bg-surface)',
                    border: '1px solid var(--register-border)',
                    borderLeft: `3px solid ${sevColor}`,
                  }}
                >
                  <Flame size={16} style={{ color: sevColor, flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>
                        {r.label}
                      </span>
                      <span style={{
                        fontSize: '0.82rem', fontWeight: 700, padding: '1px 8px', borderRadius: 999,
                        background: `color-mix(in srgb, ${sevColor} 16%, transparent)`,
                        color: sevColor, letterSpacing: '0.06em',
                      }}>
                        {sevLabel}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--register-text-muted)' }}>
                      {r.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Opportunities */}
        <div className="register-section" style={{ padding: 22, margin: 0 }}>
          <SectionHeader
            eyebrow="AI-flagged upside"
            title="Opportunities flagged by AI"
            right={
              <span style={{
                fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-success)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '2px 10px', borderRadius: 999,
                background: 'color-mix(in srgb, var(--register-success) 14%, transparent)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                <Sparkles size={12} />
                {fmtMoney0.format(OPPORTUNITIES.reduce((a, b) => a + b.impact, 0))} potential
              </span>
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {OPPORTUNITIES.map((o) => (
              <AIInsightCard key={o.label} compact label="AI Opportunity">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 2 }}>
                      {o.label}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--register-text-muted)' }}>
                      {o.detail}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--register-success)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtMoney0.format(o.impact)}
                    </div>
                    <div style={{
                      fontSize: '0.82rem', color: 'var(--register-text-dim)',
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                    }}>
                      impact <ArrowUpRight size={11} />
                    </div>
                  </div>
                </div>
              </AIInsightCard>
            ))}
          </div>
        </div>
      </div>
    </RegisterPage>
  );
}
