'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import {
  Building2, Store, DollarSign, MapPin, TrendingUp, TrendingDown,
  Users, Calendar, ShoppingBag, Sparkles, ArrowUpRight, ArrowDownRight,
  CheckCircle2, AlertTriangle, RefreshCw,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   Summit Sleep Co. — Store Portfolio
   Mattress Firm-grade portfolio view · 200 stores · 7 regions
   ────────────────────────────────────────────────────────── */

/* ── Formatters ─────────────────────────────────────────── */
const fmtInt = new Intl.NumberFormat('en-US');
const fmtMoneyM = (n: number) => `$${n.toFixed(1)}M`;
const fmtMoney0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/* ── Count-up hook (matches Overview pattern) ───────────── */
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

/* ── Hero tiles ────────────────────────────────────────── */
interface HeroStat {
  label: string;
  sub: string;
  icon: typeof Building2;
  colorVar: string;
  numVal: number;
  display: (n: number) => string;
  trendPct: number;
  spark: number[];
}

const HERO_STATS: HeroStat[] = [
  {
    label: 'Total Stores', sub: '4 formats · 38 states', icon: Building2,
    colorVar: 'var(--register-chart-1)', numVal: 200,
    display: (n) => fmtInt.format(Math.round(n)),
    trendPct: 6.4, spark: [186, 188, 189, 191, 192, 194, 196, 197, 198, 199, 200, 200],
  },
  {
    label: 'Revenue / Store', sub: 'FY25 trailing avg', icon: DollarSign,
    colorVar: 'var(--register-chart-3)', numVal: 1.7,
    display: (n) => `$${n.toFixed(1)}M`,
    trendPct: 4.8, spark: [1.52, 1.55, 1.58, 1.60, 1.62, 1.63, 1.64, 1.66, 1.67, 1.68, 1.69, 1.70],
  },
  {
    label: 'States Covered', sub: '6 added in FY26', icon: MapPin,
    colorVar: 'var(--register-chart-2)', numVal: 38,
    display: (n) => fmtInt.format(Math.round(n)),
    trendPct: 18.8, spark: [28, 30, 31, 32, 33, 34, 35, 36, 36, 37, 38, 38],
  },
  {
    label: 'New This Year', sub: '+12 opens · 3 closes', icon: Store,
    colorVar: 'var(--register-chart-6)', numVal: 12,
    display: (n) => `+${fmtInt.format(Math.round(n))}`,
    trendPct: 9.1, spark: [2, 3, 4, 5, 7, 8, 9, 10, 10, 11, 12, 12],
  },
  {
    label: 'Avg Foot Traffic', sub: 'Visits / store / day', icon: Users,
    colorVar: 'var(--register-chart-7)', numVal: 186,
    display: (n) => fmtInt.format(Math.round(n)),
    trendPct: 3.2, spark: [172, 174, 176, 178, 180, 181, 182, 183, 184, 185, 186, 186],
  },
];

/* ── Format deep-dive (consistent with Overview) ────────── */
interface FormatCard {
  name: string;
  tag: string;
  stores: number;
  avgRevM: number;
  avgSqFt: number;
  avgTraffic: number;
  avgTenureYrs: number;
  profile: string;
  colorVar: string;
}

const FORMATS: FormatCard[] = [
  {
    name: 'Flagship', tag: 'Premium Experience',
    stores: 12, avgRevM: 22.4, avgSqFt: 14_200, avgTraffic: 340, avgTenureYrs: 11.6,
    profile: 'Affluent urban · high adjustable-base attach',
    colorVar: 'var(--register-chart-1)',
  },
  {
    name: 'Standard', tag: 'Volume Driver',
    stores: 120, avgRevM: 1.76, avgSqFt: 5_400, avgTraffic: 212, avgTenureYrs: 7.2,
    profile: 'Suburban family · protector + pillow bundles',
    colorVar: 'var(--register-chart-2)',
  },
  {
    name: 'Outlet', tag: 'Clearance & Value',
    stores: 48, avgRevM: 0.98, avgSqFt: 3_800, avgTraffic: 148, avgTenureYrs: 4.8,
    profile: 'Price-led shopper · financing-heavy close',
    colorVar: 'var(--register-chart-6)',
  },
  {
    name: 'Shop-in-Shop', tag: 'Partner Locations',
    stores: 20, avgRevM: 0.62, avgSqFt: 1_200, avgTraffic: 96, avgTenureYrs: 2.4,
    profile: 'Inside partner retail · accessory-forward',
    colorVar: 'var(--register-chart-3)',
  },
];

/* ── 7-region map (aligned with Overview) ──────────────── */
interface Region {
  id: string;
  name: string;
  stores: number;
  revM: number;
  x: number; y: number; w: number; h: number;
}

const REGIONS: Region[] = [
  { id: 'west',      name: 'West',         stores: 38, revM: 78, x:  4, y: 30, w: 14, h: 34 },
  { id: 'mountain',  name: 'Mountain',     stores: 18, revM: 28, x: 20, y: 22, w: 12, h: 30 },
  { id: 'southwest', name: 'Southwest',    stores: 24, revM: 36, x: 20, y: 54, w: 14, h: 28 },
  { id: 'central',   name: 'Central',      stores: 32, revM: 54, x: 36, y: 18, w: 16, h: 36 },
  { id: 'southeast', name: 'Southeast',    stores: 42, revM: 66, x: 54, y: 44, w: 18, h: 34 },
  { id: 'midatl',    name: 'Mid-Atlantic', stores: 22, revM: 42, x: 72, y: 30, w: 12, h: 22 },
  { id: 'northeast', name: 'Northeast',    stores: 24, revM: 58, x: 84, y: 12, w: 14, h: 26 },
];

function regionColor(stores: number) {
  const max = Math.max(...REGIONS.map(r => r.stores));
  const t = stores / max;
  if (t > 0.75) return 'var(--register-chart-1)';
  if (t > 0.55) return 'var(--register-chart-2)';
  if (t > 0.35) return 'var(--register-chart-3)';
  return 'var(--register-chart-6)';
}

/* ── Top states by store count ─────────────────────────── */
interface StateRow {
  name: string;
  stores: number;
  primaryFormat: string;
  colorVar: string;
}
const TOP_STATES: StateRow[] = [
  { name: 'Texas',         stores: 24, primaryFormat: 'Standard',  colorVar: 'var(--register-chart-1)' },
  { name: 'California',    stores: 22, primaryFormat: 'Flagship',  colorVar: 'var(--register-chart-2)' },
  { name: 'Florida',       stores: 18, primaryFormat: 'Outlet',    colorVar: 'var(--register-chart-3)' },
  { name: 'New York',      stores: 14, primaryFormat: 'Flagship',  colorVar: 'var(--register-chart-6)' },
  { name: 'Georgia',       stores: 12, primaryFormat: 'Standard',  colorVar: 'var(--register-chart-7)' },
];

/* ── Store ranking tables ──────────────────────────────── */
interface StoreRow {
  rank: number;
  name: string;
  format: string;
  revPerMo: number; // in dollars
  attachPct: number;
  formatColor: string;
  tag?: string;
}

const TOP_STORES: StoreRow[] = [
  { rank: 1, name: 'Scottsdale — Flagship #03', format: 'Flagship', revPerMo: 568_000, attachPct: 42, formatColor: 'var(--register-chart-1)', tag: 'Top performer' },
  { rank: 2, name: 'Manhattan — Flagship #07',  format: 'Flagship', revPerMo: 516_000, attachPct: 39, formatColor: 'var(--register-chart-1)', tag: 'Top performer' },
  { rank: 3, name: 'Houston Galleria — Flagship #01', format: 'Flagship', revPerMo: 498_000, attachPct: 38, formatColor: 'var(--register-chart-1)', tag: 'Anchor flagship' },
  { rank: 4, name: 'Nashville — Standard #42', format: 'Standard', revPerMo: 258_000, attachPct: 34, formatColor: 'var(--register-chart-2)', tag: 'Breakout' },
  { rank: 5, name: 'Austin — Standard #58',    format: 'Standard', revPerMo: 244_000, attachPct: 32, formatColor: 'var(--register-chart-2)', tag: 'Breakout' },
  { rank: 6, name: 'Denver — Flagship #11',    format: 'Flagship', revPerMo: 236_000, attachPct: 36, formatColor: 'var(--register-chart-1)' },
];

const BOTTOM_STORES: StoreRow[] = [
  { rank: 195, name: 'Fresno — Standard #47', format: 'Standard', revPerMo: 78_000, attachPct: 17, formatColor: 'var(--register-chart-2)', tag: 'Coaching' },
  { rank: 196, name: 'Toledo — Outlet #22',   format: 'Outlet',   revPerMo: 62_000, attachPct: 14, formatColor: 'var(--register-chart-6)', tag: 'Coaching' },
  { rank: 197, name: 'Albuquerque — Standard #112', format: 'Standard', revPerMo: 58_000, attachPct: 15, formatColor: 'var(--register-chart-2)', tag: 'At-risk' },
  { rank: 198, name: 'Tulsa — Outlet #31',    format: 'Outlet',   revPerMo: 35_000, attachPct: 12, formatColor: 'var(--register-chart-6)', tag: 'At-risk' },
  { rank: 199, name: 'Mall of GA — SiS #14',  format: 'Shop-in-Shop', revPerMo: 24_000, attachPct: 11, formatColor: 'var(--register-chart-3)', tag: 'At-risk' },
  { rank: 200, name: 'Bakersfield — Outlet #189', format: 'Outlet', revPerMo: 17_000, attachPct: 9, formatColor: 'var(--register-chart-6)', tag: 'Convert' },
];

/* ── Pipeline + consolidation ──────────────────────────── */
interface PipelineRow {
  name: string;
  format: string;
  opens: string;
  market: string;
  colorVar: string;
}
const PIPELINE: PipelineRow[] = [
  { name: 'San Antonio #61',   format: 'Standard', opens: 'May 18, 2026', market: 'TX · Underserved metro', colorVar: 'var(--register-chart-2)' },
  { name: 'Charlotte #24',     format: 'Outlet',   opens: 'Jun 09, 2026', market: 'NC · Southeast expansion', colorVar: 'var(--register-chart-6)' },
  { name: 'Jacksonville #28',  format: 'Outlet',   opens: 'Jul 21, 2026', market: 'FL · Coastal demand',     colorVar: 'var(--register-chart-6)' },
  { name: 'Sacramento #03',    format: 'Flagship', opens: 'Sep 14, 2026', market: 'CA · Flagship upgrade',   colorVar: 'var(--register-chart-1)' },
];

interface ConsolidationRow {
  store: string;
  format: string;
  issue: string;
  status: 'Review' | 'Approved' | 'Watchlist';
}
const CONSOLIDATION: ConsolidationRow[] = [
  { store: 'Store #47 — Fresno',     format: 'Standard', issue: '2-yr comp decline · Flagship within 4mi', status: 'Review' },
  { store: 'Store #112 — Albuquerque', format: 'Standard', issue: 'Traffic −22% YoY · format mismatch',   status: 'Review' },
  { store: 'Store #189 — Bakersfield', format: 'Outlet',   issue: 'Run-rate below break-even · convert to SiS', status: 'Approved' },
];

/* ──────────────────────────────────────────────────────────
   Helper components
   ────────────────────────────────────────────────────────── */

function Sparkline({ points, color, height = 26, width = 72 }: { points: number[]; color: string; height?: number; width?: number }) {
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
  const gradId = `sparkFill-portfolio-${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }} aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${lastX},${height} L0,${height} Z`} fill={`url(#${gradId})`} />
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
      }}>flat</span>
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
      background: up ? 'rgba(5,150,105,0.14)' : 'rgba(220,38,38,0.14)',
      fontVariantNumeric: 'tabular-nums',
    }}>
      <Icon size={12} />
      {up ? '+' : ''}{pct.toFixed(1)}%
    </span>
  );
}

function SectionHeader({ eyebrow, title, right }: { eyebrow: string; title: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
      <div>
        <div style={{
          fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--register-accent)',
        }}>{eyebrow}</div>
        <h2 style={{
          fontSize: '1.35rem', fontWeight: 800, color: 'var(--register-text)',
          margin: '4px 0 0', letterSpacing: '-0.01em',
        }}>{title}</h2>
      </div>
      {right}
    </div>
  );
}

function HeroTile({ s, i, value, mounted }: { s: HeroStat; i: number; value: number; mounted: boolean }) {
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
        position: 'relative', overflow: 'hidden',
        minHeight: 160, display: 'flex', flexDirection: 'column', gap: 10,
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
        <div className="register-kpi-value" style={{ fontSize: '2rem', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>
          {s.display(value)}
        </div>
        <Sparkline points={s.spark} color={s.colorVar} />
      </div>
      <div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>{s.label}</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', marginTop: 2 }}>{s.sub}</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Main page
   ────────────────────────────────────────────────────────── */

export default function StorePortfolio() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Hero count-ups — one call per tile (matches Overview pattern)
  const v0 = useCountUp(HERO_STATS[0].numVal);
  const v1 = useCountUp(HERO_STATS[1].numVal, 1400, 1);
  const v2 = useCountUp(HERO_STATS[2].numVal);
  const v3 = useCountUp(HERO_STATS[3].numVal);
  const v4 = useCountUp(HERO_STATS[4].numVal);
  const heroValues = [v0, v1, v2, v3, v4];

  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const totalStores = useMemo(() => REGIONS.reduce((a, b) => a + b.stores, 0), []);
  const totalFormats = useMemo(() => FORMATS.reduce((a, b) => a + b.stores, 0), []);
  const maxStateStores = TOP_STATES[0].stores;

  return (
    <RegisterPage
      title="Store Portfolio"
      subtitle="200 locations · 4 formats · 38 states · Summit Sleep Co."
      accentColor="#1E3A5F"
    >
      {/* ── Meta pills row ───────────────────────────────── */}
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18,
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
          color: 'var(--register-text)', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.04em',
        }}>
          <Sparkles size={13} style={{ color: 'var(--register-ai)' }} />
          FY26 portfolio snapshot
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: 'var(--register-bg-surface)',
          border: '1px solid var(--register-border)',
          color: 'var(--register-text-muted)', fontSize: '0.82rem', fontWeight: 600,
        }}>
          <RefreshCw size={12} style={{ color: 'var(--register-accent)' }} />
          D365 synced · 3:14 PM
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: 'var(--register-bg-surface)',
          border: '1px solid var(--register-border)',
          color: 'var(--register-text-muted)', fontSize: '0.82rem', fontWeight: 600,
        }}>
          <Building2 size={12} style={{ color: 'var(--register-accent)' }} />
          {fmtInt.format(totalStores)} stores · {FORMATS.length} formats
        </span>
      </div>

      {/* ── Section 1 · Hero tiles ───────────────────────── */}
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

      {/* ── Section 2 · Format deep-dive ─────────────────── */}
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
          eyebrow="Store Formats"
          title="Format deep-dive — economics across the portfolio"
          right={
            <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              {totalFormats} stores across {FORMATS.length} formats
            </span>
          }
        />

        {/* Stacked proportion bar */}
        <div style={{
          display: 'flex', borderRadius: 10, overflow: 'hidden', height: 30,
          marginBottom: 18, border: '1px solid var(--register-border)',
        }}>
          {FORMATS.map((f) => (
            <div
              key={f.name}
              style={{
                width: mounted ? `${(f.stores / totalFormats) * 100}%` : '0%',
                background: f.colorVar,
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 16,
        }}>
          {FORMATS.map((f, i) => {
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
                  transitionDelay: `${0.4 + i * 0.08}s`,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{
                  fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: f.colorVar,
                }}>
                  {f.tag}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--register-text)' }}>
                  {f.name}
                </div>
                <div className="register-kpi-value" style={{ fontSize: '1.9rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {f.stores}
                  <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--register-text-muted)', marginLeft: 6 }}>
                    stores
                  </span>
                </div>

                <div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.82rem', color: 'var(--register-text-muted)',
                    marginBottom: 4, fontVariantNumeric: 'tabular-nums',
                  }}>
                    <span>{share.toFixed(0)}% of portfolio</span>
                    <span>avg {fmtMoneyM(f.avgRevM)}/yr</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--register-bg-surface)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: mounted ? `${share}%` : '0%',
                      background: f.colorVar, borderRadius: 3,
                      transition: `width 1.1s cubic-bezier(0.16,1,0.3,1) ${0.65 + i * 0.08}s`,
                    }} />
                  </div>
                </div>

                {/* Mini stat grid */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
                  marginTop: 4, paddingTop: 10,
                  borderTop: '1px solid var(--register-border)',
                  fontSize: '0.82rem', fontVariantNumeric: 'tabular-nums',
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--register-text-dim)' }}>
                      Sq Ft
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--register-text)' }}>{fmtInt.format(f.avgSqFt)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--register-text-dim)' }}>
                      Traffic/day
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--register-text)' }}>{fmtInt.format(f.avgTraffic)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--register-text-dim)' }}>
                      Tenure
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--register-text)' }}>{f.avgTenureYrs.toFixed(1)} yrs</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--register-text-dim)' }}>
                      Per-store
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--register-text)' }}>{fmtMoneyM(f.avgRevM)}</div>
                  </div>
                </div>

                <div style={{
                  fontSize: '0.82rem', color: 'var(--register-text-muted)', lineHeight: 1.5,
                  paddingTop: 6,
                }}>
                  {f.profile}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 3 · Regional view ────────────────────── */}
      <div
        className="register-section"
        style={{
          padding: 24, marginBottom: 24,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '0.38s',
        }}
      >
        <SectionHeader
          eyebrow="National Footprint"
          title="Region density & state concentration"
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
              <MapPin size={14} style={{ color: 'var(--register-accent)' }} />
              {fmtInt.format(totalStores)} stores · 7 regions · 38 states
            </div>
          }
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 60fr) minmax(0, 40fr)',
          gap: 20,
        }}>
          {/* Heatmap */}
          <div
            style={{
              background: 'var(--register-bg-surface)',
              borderRadius: 14,
              border: '1px solid var(--register-border)',
              padding: 20,
              position: 'relative',
              minHeight: 340,
            }}
          >
            <div style={{
              position: 'absolute', top: 14, left: 18,
              fontSize: '0.72rem', fontWeight: 700, color: 'var(--register-text-muted)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              US Region Density
            </div>

            <svg viewBox="0 0 100 80" preserveAspectRatio="none" style={{ width: '100%', height: 320 }}>
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
                    <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 1}
                      textAnchor="middle" fontSize="2.4" fontWeight={700}
                      fill="#FFFFFF" style={{ pointerEvents: 'none' }}>
                      {r.name}
                    </text>
                    <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 2.6}
                      textAnchor="middle" fontSize="2" fontWeight={600}
                      fill="#FFFFFF" opacity={0.9} style={{ pointerEvents: 'none' }}>
                      {r.stores} stores
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover detail */}
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
                const revPerStore = r.revM / r.stores;
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: regionColor(r.stores) }} />
                      <span style={{ fontWeight: 700, color: 'var(--register-text)' }}>{r.name} Region</span>
                    </div>
                    <div style={{ display: 'flex', gap: 18, color: 'var(--register-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                      <span>{r.stores} stores</span>
                      <span>${r.revM}M rev</span>
                      <span>${revPerStore.toFixed(2)}M / store</span>
                    </div>
                  </>
                );
              })() : (
                <div style={{ color: 'var(--register-text-muted)', fontWeight: 600 }}>
                  Hover a region for store count, revenue, and per-store averages.
                </div>
              )}
            </div>
          </div>

          {/* Top states */}
          <div
            style={{
              background: 'var(--register-bg-surface)',
              borderRadius: 14,
              border: '1px solid var(--register-border)',
              padding: '18px 20px',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}
          >
            <div style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--register-text-muted)',
            }}>
              Top 5 states by store count
            </div>
            {TOP_STATES.map((s, i) => {
              const pct = (s.stores / maxStateStores) * 100;
              return (
                <div
                  key={s.name}
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                    transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                    transitionDelay: `${0.55 + i * 0.07}s`,
                  }}
                >
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    marginBottom: 4, gap: 8,
                  }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>
                      {s.name}
                    </span>
                    <span style={{
                      fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-text-muted)',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {s.stores} stores · {s.primaryFormat}
                    </span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: 'var(--register-bg-elevated)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: mounted ? `${pct}%` : '0%',
                      borderRadius: 5,
                      background: `linear-gradient(90deg, ${s.colorVar}, color-mix(in srgb, ${s.colorVar} 72%, transparent))`,
                      transition: `width 1.1s cubic-bezier(0.16,1,0.3,1) ${0.7 + i * 0.07}s`,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 4 · Top / Bottom store tables ─────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20, marginBottom: 24,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '0.5s',
        }}
      >
        {/* Top 6 */}
        <div className="register-section" style={{ padding: 22, margin: 0 }}>
          <SectionHeader
            eyebrow="Top performers"
            title="Top 6 stores"
            right={
              <span style={{
                fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-success)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '2px 10px', borderRadius: 999,
                background: 'color-mix(in srgb, var(--register-success) 14%, transparent)',
              }}>
                <TrendingUp size={12} />
                by revenue/mo
              </span>
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOP_STORES.map((s, i) => (
              <div
                key={s.rank}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px minmax(0, 1fr) auto auto',
                  alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 10,
                  background: 'var(--register-bg-surface)',
                  border: '1px solid var(--register-border)',
                  borderLeft: `3px solid ${s.formatColor}`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                  transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: `${0.6 + i * 0.05}s`,
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: `color-mix(in srgb, ${s.formatColor} 20%, transparent)`,
                  color: 'var(--register-text)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.82rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums',
                  border: `1px solid color-mix(in srgb, ${s.formatColor} 45%, transparent)`,
                }}>
                  {s.rank}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.9rem', fontWeight: 700, color: 'var(--register-text)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
                    {s.format}{s.tag ? ` · ${s.tag}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--register-text)', fontVariantNumeric: 'tabular-nums' }}>
                    {fmtMoney0.format(s.revPerMo)}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                    /mo
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 56 }}>
                  <div style={{
                    fontSize: '0.95rem', fontWeight: 800, color: 'var(--register-success)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {s.attachPct}%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    attach
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 6 */}
        <div className="register-section" style={{ padding: 22, margin: 0 }}>
          <SectionHeader
            eyebrow="Underperformers"
            title="Bottom 6 stores"
            right={
              <span style={{
                fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-danger)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '2px 10px', borderRadius: 999,
                background: 'color-mix(in srgb, var(--register-danger) 14%, transparent)',
              }}>
                <TrendingDown size={12} />
                coaching / at-risk
              </span>
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {BOTTOM_STORES.map((s, i) => {
              const tagColor =
                s.tag === 'At-risk' ? 'var(--register-danger)' :
                s.tag === 'Convert' ? 'var(--register-warning)' :
                'var(--register-accent)';
              return (
                <div
                  key={s.rank}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '36px minmax(0, 1fr) auto auto',
                    alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 10,
                    background: 'color-mix(in srgb, var(--register-danger) 5%, var(--register-bg-surface))',
                    border: '1px solid var(--register-border)',
                    borderLeft: '3px solid var(--register-danger)',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                    transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                    transitionDelay: `${0.65 + i * 0.05}s`,
                  }}
                >
                  <span style={{
                    width: 32, height: 24, borderRadius: 8,
                    background: 'color-mix(in srgb, var(--register-danger) 16%, transparent)',
                    color: 'var(--register-danger)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.82rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums',
                  }}>
                    {s.rank}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.9rem', fontWeight: 700, color: 'var(--register-text)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {s.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
                        {s.format}
                      </span>
                      {s.tag && (
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 700, padding: '1px 8px', borderRadius: 999,
                          background: `color-mix(in srgb, ${tagColor} 16%, transparent)`,
                          color: tagColor, letterSpacing: '0.05em', textTransform: 'uppercase',
                        }}>
                          {s.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--register-text)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtMoney0.format(s.revPerMo)}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                      /mo
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 56 }}>
                    <div style={{
                      fontSize: '0.95rem', fontWeight: 800, color: 'var(--register-danger)',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {s.attachPct}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      attach
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 5 · Pipeline + consolidation ──────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20, marginBottom: 24,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '0.62s',
        }}
      >
        {/* Expansion pipeline */}
        <div className="register-section" style={{ padding: 22, margin: 0 }}>
          <SectionHeader
            eyebrow="Growth"
            title="Expansion pipeline"
            right={
              <span style={{
                fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-success)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '2px 10px', borderRadius: 999,
                background: 'color-mix(in srgb, var(--register-success) 14%, transparent)',
              }}>
                <ArrowUpRight size={12} />
                4 of 12 FY26 opens
              </span>
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PIPELINE.map((p, i) => (
              <div
                key={p.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 12, alignItems: 'center',
                  padding: '12px 14px', borderRadius: 10,
                  background: 'var(--register-bg-surface)',
                  border: '1px solid var(--register-border)',
                  borderLeft: `3px solid ${p.colorVar}`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                  transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: `${0.72 + i * 0.06}s`,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <ShoppingBag size={13} style={{ color: p.colorVar }} />
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>
                      {p.name}
                    </span>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, padding: '1px 8px', borderRadius: 999,
                      background: `color-mix(in srgb, ${p.colorVar} 16%, transparent)`,
                      color: p.colorVar, letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>
                      {p.format}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
                    {p.market}
                  </div>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: '0.82rem', color: 'var(--register-text)',
                  fontVariantNumeric: 'tabular-nums', fontWeight: 700,
                  padding: '4px 10px', borderRadius: 8,
                  background: 'var(--register-bg-elevated)',
                  border: '1px solid var(--register-border)',
                }}>
                  <Calendar size={12} style={{ color: 'var(--register-accent)' }} />
                  {p.opens}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consolidation candidates */}
        <div className="register-section" style={{ padding: 22, margin: 0 }}>
          <SectionHeader
            eyebrow="Portfolio hygiene"
            title="Consolidation candidates"
            right={
              <span style={{
                fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-warning)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '2px 10px', borderRadius: 999,
                background: 'color-mix(in srgb, var(--register-warning) 16%, transparent)',
              }}>
                <AlertTriangle size={12} />
                {CONSOLIDATION.length} flagged
              </span>
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CONSOLIDATION.map((c, i) => {
              const statusColor =
                c.status === 'Approved' ? 'var(--register-success)' :
                c.status === 'Review'   ? 'var(--register-warning)' :
                'var(--register-accent)';
              const StatusIcon = c.status === 'Approved' ? CheckCircle2 : AlertTriangle;
              return (
                <div
                  key={c.store}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '12px 14px', borderRadius: 10,
                    background: 'var(--register-bg-surface)',
                    border: '1px solid var(--register-border)',
                    borderLeft: `3px solid ${statusColor}`,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                    transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                    transitionDelay: `${0.78 + i * 0.06}s`,
                  }}
                >
                  <StatusIcon size={16} style={{ color: statusColor, flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>
                        {c.store}
                      </span>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 700, padding: '1px 8px', borderRadius: 999,
                        background: 'var(--register-bg-elevated)',
                        color: 'var(--register-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase',
                      }}>
                        {c.format}
                      </span>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 700, padding: '1px 8px', borderRadius: 999,
                        background: `color-mix(in srgb, ${statusColor} 16%, transparent)`,
                        color: statusColor, letterSpacing: '0.05em', textTransform: 'uppercase',
                      }}>
                        {c.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--register-text-muted)', lineHeight: 1.5 }}>
                      {c.issue}
                    </div>
                  </div>
                  <ArrowDownRight size={14} style={{ color: 'var(--register-text-dim)', flexShrink: 0, marginTop: 3 }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 6 · AI insight ───────────────────────── */}
      <div
        style={{
          marginBottom: 18,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '0.82s',
        }}
      >
        <AIInsightCard label="AI Portfolio Opportunity">
          <strong style={{ color: 'var(--register-text)' }}>3 Outlet locations overindex on accessory attach</strong>
          {' '}— Scottsdale Outlet, Jacksonville Outlet, and Austin Outlet run attach rates at 28-32% (vs. 18% Outlet avg), closer to Flagship levels. Modeled uplift from format upgrade to Standard: <strong style={{ color: 'var(--register-success)', fontVariantNumeric: 'tabular-nums' }}>+$2.8M annual revenue</strong>, 11-month payback on conversion capex.
        </AIInsightCard>
      </div>

      {/* ── Footer pill ──────────────────────────────────── */}
      <div
        style={{
          display: 'flex', justifyContent: 'center',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 0.95s',
        }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 16px', borderRadius: 999,
          background: 'var(--register-bg-surface)',
          border: '1px solid var(--register-border)',
          color: 'var(--register-text-muted)', fontSize: '0.82rem', fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
        }}>
          <RefreshCw size={12} style={{ color: 'var(--register-accent)' }} />
          Portfolio data synced from D365 · last refresh 3:14 PM · next refresh in 15 min
        </div>
      </div>
    </RegisterPage>
  );
}
