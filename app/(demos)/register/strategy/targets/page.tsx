'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import {
  Target, Send, CheckCircle2, Clock, RefreshCw, Sparkles, TrendingUp,
  TrendingDown, Building2, Users, DollarSign, Layers, ArrowUpRight,
  AlertTriangle, Zap,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   Summit Sleep Co. — Store Targets
   FY26 target allocation · 200 stores · 8 districts · 4 formats
   ────────────────────────────────────────────────────────── */

const STRATEGY_CYAN = '#06B6D4';

const fmtInt = new Intl.NumberFormat('en-US');
const fmtMoneyM = (n: number) => `$${n.toFixed(1)}M`;
const fmtMoneyK = (n: number) => `$${Math.round(n)}K`;
const fmtMoney0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const fmtMoneyShort = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
};

/* ── Count-up hook ──────────────────────────────────────── */
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

/* ── Hero tiles ─────────────────────────────────────────── */
interface HeroStat {
  label: string;
  sub: string;
  icon: typeof Target;
  colorVar: string;
  numVal: number;
  display: (n: number) => string;
  trendPct: number;
  trendLabel: string;
  spark: number[];
}

const HERO_STATS: HeroStat[] = [
  {
    label: 'FY26 Target Pool', sub: 'Total quota across 200 stores', icon: DollarSign,
    colorVar: STRATEGY_CYAN, numVal: 362,
    display: (n) => `$${n.toFixed(0)}M`,
    trendPct: 7.2, trendLabel: 'vs FY25 $337M',
    spark: [310, 318, 325, 331, 336, 340, 345, 350, 354, 358, 361, 362],
  },
  {
    label: 'Avg Target / Store', sub: 'FY26 annual quota', icon: Target,
    colorVar: 'var(--register-chart-3)', numVal: 1.81,
    display: (n) => `$${n.toFixed(2)}M`,
    trendPct: 6.5, trendLabel: 'vs $1.70M FY25 actual',
    spark: [1.62, 1.65, 1.68, 1.70, 1.72, 1.74, 1.76, 1.78, 1.79, 1.80, 1.81, 1.81],
  },
  {
    label: 'Districts', sub: '8 DMs · 200 stores total', icon: Layers,
    colorVar: 'var(--register-chart-6)', numVal: 8,
    display: (n) => fmtInt.format(Math.round(n)),
    trendPct: 0, trendLabel: 'Structure unchanged',
    spark: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
  },
  {
    label: 'Targets Published', sub: 'Stores with FY26 quota locked', icon: CheckCircle2,
    colorVar: 'var(--register-success)', numVal: 186,
    display: (n) => `${fmtInt.format(Math.round(n))} / 200`,
    trendPct: 93, trendLabel: '93% complete',
    spark: [42, 78, 108, 132, 148, 160, 168, 174, 180, 183, 185, 186],
  },
  {
    label: 'Stretch Lift', sub: 'Above-plan allocation reserve', icon: Zap,
    colorVar: 'var(--register-chart-7)', numVal: 14.2,
    display: (n) => `$${n.toFixed(1)}M`,
    trendPct: 4.2, trendLabel: 'Top 20 stores',
    spark: [8, 9.2, 10.4, 11.2, 11.8, 12.4, 12.9, 13.3, 13.6, 13.9, 14.1, 14.2],
  },
];

/* ── District allocation ────────────────────────────────── */
interface District {
  id: string;
  name: string;
  manager: string;
  stores: number;
  fy26TargetM: number;
  fy25ActualM: number;
  avgStoreK: number;
  stretchPct: number;
  status: 'Locked' | 'In Review' | 'Draft';
  colorVar: string;
}

const DISTRICTS: District[] = [
  { id: 'd1', name: 'District 1 — Pacific',    manager: 'M. Alvarez',  stores: 28, fy26TargetM: 56.4, fy25ActualM: 52.1, avgStoreK: 2014, stretchPct: 8.2, status: 'Locked',    colorVar: 'var(--register-chart-1)' },
  { id: 'd2', name: 'District 2 — Mountain',   manager: 'J. Park',     stores: 22, fy26TargetM: 38.8, fy25ActualM: 36.0, avgStoreK: 1764, stretchPct: 7.8, status: 'Locked',    colorVar: 'var(--register-chart-2)' },
  { id: 'd3', name: 'District 3 — Southwest',  manager: 'R. Patel',    stores: 24, fy26TargetM: 42.6, fy25ActualM: 39.4, avgStoreK: 1775, stretchPct: 8.1, status: 'Locked',    colorVar: 'var(--register-chart-3)' },
  { id: 'd4', name: 'District 4 — Central',    manager: 'S. Nguyen',   stores: 32, fy26TargetM: 58.2, fy25ActualM: 54.6, avgStoreK: 1819, stretchPct: 6.6, status: 'Locked',    colorVar: 'var(--register-chart-6)' },
  { id: 'd5', name: 'District 5 — Southeast',  manager: 'T. Washington', stores: 30, fy26TargetM: 54.9, fy25ActualM: 50.8, avgStoreK: 1830, stretchPct: 8.1, status: 'Locked',    colorVar: 'var(--register-chart-7)' },
  { id: 'd6', name: 'District 6 — Gulf',       manager: 'K. Ortiz',    stores: 20, fy26TargetM: 34.2, fy25ActualM: 31.5, avgStoreK: 1710, stretchPct: 8.6, status: 'In Review', colorVar: 'var(--register-chart-1)' },
  { id: 'd7', name: 'District 7 — Mid-Atlantic', manager: 'B. Chen',   stores: 22, fy26TargetM: 41.8, fy25ActualM: 38.6, avgStoreK: 1900, stretchPct: 8.3, status: 'In Review', colorVar: 'var(--register-chart-2)' },
  { id: 'd8', name: 'District 8 — Northeast',  manager: 'E. Rossi',    stores: 22, fy26TargetM: 35.1, fy25ActualM: 34.0, avgStoreK: 1595, stretchPct: 3.2, status: 'Draft',     colorVar: 'var(--register-chart-3)' },
];

/* ── Format allocation ──────────────────────────────────── */
interface FormatAlloc {
  name: string;
  tag: string;
  stores: number;
  fy26PerStoreM: number;
  fy25PerStoreM: number;
  totalM: number;
  colorVar: string;
}

const FORMAT_ALLOC: FormatAlloc[] = [
  { name: 'Flagship',     tag: 'Premium Experience', stores: 12,  fy26PerStoreM: 2.65, fy25PerStoreM: 2.42, totalM: 31.8,  colorVar: 'var(--register-chart-1)' },
  { name: 'Standard',     tag: 'Volume Driver',      stores: 120, fy26PerStoreM: 1.88, fy25PerStoreM: 1.76, totalM: 225.6, colorVar: 'var(--register-chart-2)' },
  { name: 'Outlet',       tag: 'Clearance & Value',  stores: 48,  fy26PerStoreM: 1.08, fy25PerStoreM: 0.98, totalM: 51.8,  colorVar: 'var(--register-chart-6)' },
  { name: 'Shop-in-Shop', tag: 'Partner Locations',  stores: 20,  fy26PerStoreM: 0.71, fy25PerStoreM: 0.62, totalM: 14.2,  colorVar: 'var(--register-chart-3)' },
];

/* ── Stretch / sandbag split ────────────────────────────── */
interface FlagRow {
  store: string;
  district: string;
  format: string;
  fy26K: number;
  deltaPct: number;
  note: string;
}
const STRETCH_STORES: FlagRow[] = [
  { store: 'Scottsdale — Flagship #03', district: 'D3', format: 'Flagship', fy26K: 3120, deltaPct: 12.4, note: 'Top-10 comp · raised stretch target' },
  { store: 'Manhattan — Flagship #07',  district: 'D8', format: 'Flagship', fy26K: 2980, deltaPct: 11.8, note: 'FY25 actual beat plan by 14%' },
  { store: 'Houston Galleria #01',      district: 'D4', format: 'Flagship', fy26K: 2870, deltaPct: 10.6, note: 'New adjustable-base line uplift' },
  { store: 'Austin — Standard #58',     district: 'D4', format: 'Standard', fy26K: 2180, deltaPct: 14.2, note: 'Breakout market · expansion zone' },
];

const SANDBAG_STORES: FlagRow[] = [
  { store: 'Fresno — Standard #47',         district: 'D1', format: 'Standard', fy26K: 980,   deltaPct: -3.2, note: 'Coaching plan · soft target ceiling' },
  { store: 'Albuquerque — Standard #112',   district: 'D3', format: 'Standard', fy26K: 890,   deltaPct: -4.8, note: 'Under format review · flat target' },
  { store: 'Bakersfield — Outlet #189',     district: 'D1', format: 'Outlet',   fy26K: 560,   deltaPct: -6.1, note: 'Consolidation candidate · minimum viable' },
  { store: 'Mall of GA — SiS #14',          district: 'D5', format: 'Shop-in-Shop', fy26K: 440, deltaPct: -5.4, note: 'Partnership renegotiation pending' },
];

/* ── Publish / fan-out destinations ─────────────────────── */
interface FanoutRow {
  system: string;
  role: string;
  lastSync: string;
  recordCount: string;
  status: 'Synced' | 'Pending' | 'Queued';
}
const FANOUT: FanoutRow[] = [
  { system: 'Varicent ICM',       role: 'Comp calc · DM + rep plans',   lastSync: '2 min ago',       recordCount: '186 stores · 1,420 reps', status: 'Synced' },
  { system: 'CaptivateIQ',        role: 'Rep quota + accelerator curves', lastSync: '2 min ago',     recordCount: '1,420 quota objects',     status: 'Synced' },
  { system: 'Xactly Incent',      role: 'Corporate roll-up + reporting', lastSync: '14 min ago',     recordCount: '200 targets · 8 DMs',     status: 'Synced' },
  { system: 'Rep Tablet Fleet',   role: 'Live target display + leaderboard', lastSync: 'Queued',    recordCount: '1,420 devices · 200 stores', status: 'Queued' },
  { system: 'D365 Finance',       role: 'FY26 revenue plan reconciliation', lastSync: '14 min ago', recordCount: '200 stores · 12 periods', status: 'Synced' },
  { system: 'Workday HCM',        role: 'Plan assignment + effective dating', lastSync: 'Pending DM approval', recordCount: '14 pending (D6, D7, D8)', status: 'Pending' },
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
  const gradId = `sparkFill-targets-${color.replace(/[^a-z0-9]/gi, '')}`;
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

function TrendBadge({ pct, label }: { pct: number; label?: string }) {
  if (pct === 0) {
    return (
      <span style={{
        fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-text-dim)',
        padding: '2px 8px', borderRadius: 999, background: 'var(--register-bg-surface)',
        fontVariantNumeric: 'tabular-nums',
      }}>{label ?? 'flat'}</span>
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
          fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: STRATEGY_CYAN,
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
        minHeight: 170, display: 'flex', flexDirection: 'column', gap: 10,
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
        {s.label === 'Districts' ? (
          <span style={{
            fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-text-dim)',
            padding: '2px 8px', borderRadius: 999, background: 'var(--register-bg-surface)',
            fontVariantNumeric: 'tabular-nums',
          }}>stable</span>
        ) : (
          <TrendBadge pct={s.trendPct} />
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div className="register-kpi-value" style={{ fontSize: '1.9rem', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>
          {s.display(value)}
        </div>
        <Sparkline points={s.spark} color={s.colorVar.startsWith('var(') ? STRATEGY_CYAN : s.colorVar} />
      </div>
      <div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>{s.label}</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', marginTop: 2 }}>{s.sub}</div>
      </div>
      <div style={{
        marginTop: 'auto', paddingTop: 8,
        borderTop: '1px solid var(--register-border)',
        fontSize: '0.82rem', color: 'var(--register-text-muted)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {s.trendLabel}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Main page
   ────────────────────────────────────────────────────────── */

export default function StoreTargets() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const v0 = useCountUp(HERO_STATS[0].numVal);
  const v1 = useCountUp(HERO_STATS[1].numVal, 1400, 2);
  const v2 = useCountUp(HERO_STATS[2].numVal);
  const v3 = useCountUp(HERO_STATS[3].numVal);
  const v4 = useCountUp(HERO_STATS[4].numVal, 1400, 1);
  const heroValues = [v0, v1, v2, v3, v4];

  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const totalTargetM = useMemo(() => DISTRICTS.reduce((a, b) => a + b.fy26TargetM, 0), []);
  const totalFY25M = useMemo(() => DISTRICTS.reduce((a, b) => a + b.fy25ActualM, 0), []);
  const portfolioLiftPct = ((totalTargetM - totalFY25M) / totalFY25M) * 100;
  const maxDistrictTarget = useMemo(() => Math.max(...DISTRICTS.map(d => d.fy26TargetM)), []);
  const totalFormatStores = useMemo(() => FORMAT_ALLOC.reduce((a, b) => a + b.stores, 0), []);
  const totalFormatM = useMemo(() => FORMAT_ALLOC.reduce((a, b) => a + b.totalM, 0), []);

  const lockedCount = DISTRICTS.filter(d => d.status === 'Locked').length;
  const reviewCount = DISTRICTS.filter(d => d.status === 'In Review').length;
  const draftCount = DISTRICTS.filter(d => d.status === 'Draft').length;

  const handlePublish = () => {
    if (publishing || published) return;
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublished(true);
    }, 2200);
  };

  return (
    <RegisterPage
      title="Store Targets"
      subtitle="FY26 Target Allocation · 200 stores · 8 districts · $362M quota pool"
      accentColor={STRATEGY_CYAN}
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
          background: `color-mix(in srgb, ${STRATEGY_CYAN} 14%, transparent)`,
          border: `1px solid color-mix(in srgb, ${STRATEGY_CYAN} 40%, transparent)`,
          color: 'var(--register-text)', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.04em',
        }}>
          <Sparkles size={13} style={{ color: 'var(--register-ai)' }} />
          FY26 planning cycle
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: 'color-mix(in srgb, var(--register-success) 14%, transparent)',
          border: '1px solid color-mix(in srgb, var(--register-success) 40%, transparent)',
          color: 'var(--register-success)', fontSize: '0.82rem', fontWeight: 700,
        }}>
          <CheckCircle2 size={13} />
          {lockedCount} districts locked
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: 'color-mix(in srgb, var(--register-warning) 14%, transparent)',
          border: '1px solid color-mix(in srgb, var(--register-warning) 40%, transparent)',
          color: 'var(--register-warning)', fontSize: '0.82rem', fontWeight: 700,
        }}>
          <Clock size={13} />
          {reviewCount + draftCount} pending review
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: 'var(--register-bg-surface)',
          border: '1px solid var(--register-border)',
          color: 'var(--register-text-muted)', fontSize: '0.82rem', fontWeight: 600,
        }}>
          <RefreshCw size={12} style={{ color: STRATEGY_CYAN }} />
          Sync hub · 3:14 PM
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

      {/* ── Section 2 · District allocation ──────────────── */}
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
          eyebrow="District Allocation"
          title="FY26 target pool by district — 8 district managers, 200 stores"
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.82rem', color: 'var(--register-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              <Building2 size={14} style={{ color: STRATEGY_CYAN }} />
              ${totalTargetM.toFixed(1)}M allocated · +{portfolioLiftPct.toFixed(1)}% vs FY25
            </div>
          }
        />

        {/* Horizontal bar chart — targets by district */}
        <div style={{
          background: 'var(--register-bg-surface)',
          border: '1px solid var(--register-border)',
          borderRadius: 14,
          padding: '18px 20px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            fontSize: '0.82rem', color: 'var(--register-text-muted)',
            letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 700,
          }}>
            <span>District · DM · Stores</span>
            <span>FY26 Target · per-store avg · lift</span>
          </div>

          {DISTRICTS.map((d, i) => {
            const pct = (d.fy26TargetM / maxDistrictTarget) * 100;
            const lift = ((d.fy26TargetM - d.fy25ActualM) / d.fy25ActualM) * 100;
            const hovered = hoveredDistrict === d.id;
            const dim = hoveredDistrict && !hovered;
            const statusColor =
              d.status === 'Locked' ? 'var(--register-success)' :
              d.status === 'In Review' ? 'var(--register-warning)' :
              'var(--register-text-dim)';
            return (
              <div
                key={d.id}
                onMouseEnter={() => setHoveredDistrict(d.id)}
                onMouseLeave={() => setHoveredDistrict(null)}
                style={{
                  opacity: mounted ? (dim ? 0.55 : 1) : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                  transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: mounted ? '0s' : `${0.4 + i * 0.06}s`,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) auto',
                  gap: 14, alignItems: 'baseline', marginBottom: 6,
                }}>
                  <div style={{ minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: 3,
                      background: d.colorVar, display: 'inline-block',
                    }} />
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)' }}>
                      {d.name}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
                      · {d.manager}
                    </span>
                    <span style={{
                      fontSize: '0.82rem', fontWeight: 600, color: 'var(--register-text-muted)',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      · {d.stores} stores
                    </span>
                    <span style={{
                      fontSize: '0.82rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                      background: `color-mix(in srgb, ${statusColor} 14%, transparent)`,
                      color: statusColor, letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>
                      {d.status}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'baseline', gap: 14,
                    fontVariantNumeric: 'tabular-nums', justifySelf: 'end',
                  }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--register-text)' }}>
                      {fmtMoneyM(d.fy26TargetM)}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
                      {fmtMoneyK(d.avgStoreK)} / store
                    </span>
                    <span style={{
                      fontSize: '0.82rem', fontWeight: 700,
                      color: lift >= 0 ? 'var(--register-success)' : 'var(--register-danger)',
                    }}>
                      {lift >= 0 ? '+' : ''}{lift.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div style={{
                  height: 12, borderRadius: 6,
                  background: 'var(--register-bg-elevated)',
                  border: '1px solid var(--register-border)',
                  overflow: 'hidden', position: 'relative',
                }}>
                  <div style={{
                    height: '100%',
                    width: mounted ? `${pct}%` : '0%',
                    borderRadius: 6,
                    background: `linear-gradient(90deg, ${d.colorVar}, color-mix(in srgb, ${d.colorVar} 72%, transparent))`,
                    transition: `width 1.1s cubic-bezier(0.16,1,0.3,1) ${0.55 + i * 0.06}s`,
                  }} />
                  {/* Stretch bump overlay */}
                  <div style={{
                    position: 'absolute', top: 0, bottom: 0,
                    left: mounted ? `${pct * (1 - d.stretchPct / (d.stretchPct + 100))}%` : '0%',
                    width: mounted ? `${pct * (d.stretchPct / (d.stretchPct + 100))}%` : '0%',
                    background: `repeating-linear-gradient(45deg, ${STRATEGY_CYAN}66, ${STRATEGY_CYAN}66 3px, transparent 3px, transparent 6px)`,
                    transition: `all 1.1s cubic-bezier(0.16,1,0.3,1) ${0.75 + i * 0.06}s`,
                  }} />
                </div>
              </div>
            );
          })}

          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            paddingTop: 10, marginTop: 4,
            borderTop: '1px solid var(--register-border)',
            fontSize: '0.82rem', color: 'var(--register-text-muted)',
            flexWrap: 'wrap',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 10, borderRadius: 3, background: 'var(--register-chart-1)' }} />
              Base quota
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 14, height: 10, borderRadius: 3,
                background: `repeating-linear-gradient(45deg, ${STRATEGY_CYAN}66, ${STRATEGY_CYAN}66 3px, transparent 3px, transparent 6px)`,
                border: '1px solid var(--register-border)',
              }} />
              Stretch allocation
            </span>
            <span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>
              {hoveredDistrict
                ? (() => {
                    const d = DISTRICTS.find(x => x.id === hoveredDistrict)!;
                    return `${d.name} · ${d.stores} stores · stretch ${d.stretchPct.toFixed(1)}% · ${d.status.toLowerCase()}`;
                  })()
                : 'Hover a district for stretch % and status'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Section 3 · Format allocation + Stretch/Sandbag ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: 20, marginBottom: 24,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '0.42s',
        }}
      >
        {/* Format allocation */}
        <div className="register-section" style={{ padding: 22, margin: 0 }}>
          <SectionHeader
            eyebrow="By Format"
            title="Format-level quota per store"
            right={
              <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                ${totalFormatM.toFixed(1)}M · {totalFormatStores} stores
              </span>
            }
          />

          <div style={{
            display: 'flex', borderRadius: 10, overflow: 'hidden', height: 28,
            marginBottom: 16, border: '1px solid var(--register-border)',
          }}>
            {FORMAT_ALLOC.map((f) => (
              <div
                key={f.name}
                style={{
                  width: mounted ? `${(f.totalM / totalFormatM) * 100}%` : '0%',
                  background: f.colorVar,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: '0.6s',
                }}
              >
                {(f.totalM / totalFormatM) >= 0.1 && (
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {f.name} · {Math.round((f.totalM / totalFormatM) * 100)}%
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FORMAT_ALLOC.map((f, i) => {
              const lift = ((f.fy26PerStoreM - f.fy25PerStoreM) / f.fy25PerStoreM) * 100;
              return (
                <div
                  key={f.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '14px minmax(0, 1fr) auto auto',
                    alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 10,
                    background: 'var(--register-bg-surface)',
                    border: '1px solid var(--register-border)',
                    borderLeft: `3px solid ${f.colorVar}`,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                    transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                    transitionDelay: `${0.52 + i * 0.06}s`,
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: f.colorVar }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)' }}>
                      {f.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
                      {f.tag} · {f.stores} stores
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--register-text)' }}>
                      {fmtMoneyM(f.fy26PerStoreM)}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
                      per store / yr
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 72, fontVariantNumeric: 'tabular-nums' }}>
                    <div style={{
                      fontSize: '0.95rem', fontWeight: 800, color: 'var(--register-success)',
                    }}>
                      +{lift.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
                      {fmtMoneyM(f.totalM)} total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stretch vs sandbag */}
        <div className="register-section" style={{ padding: 22, margin: 0 }}>
          <SectionHeader
            eyebrow="Calibration"
            title="Stretch vs. soft-target outliers"
            right={
              <span style={{
                fontSize: '0.82rem', fontWeight: 700, color: STRATEGY_CYAN,
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '2px 10px', borderRadius: 999,
                background: `color-mix(in srgb, ${STRATEGY_CYAN} 14%, transparent)`,
              }}>
                <Target size={12} />
                top / bottom 4
              </span>
            }
          />

          <div style={{
            fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-success)',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
          }}>
            Stretch — targets raised above plan
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {STRETCH_STORES.map((s, i) => (
              <div
                key={s.store}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) auto auto',
                  gap: 12, alignItems: 'center',
                  padding: '10px 14px', borderRadius: 10,
                  background: 'color-mix(in srgb, var(--register-success) 6%, var(--register-bg-surface))',
                  border: '1px solid var(--register-border)',
                  borderLeft: '3px solid var(--register-success)',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                  transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: `${0.6 + i * 0.05}s`,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {s.store}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
                    {s.district} · {s.format} · {s.note}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.95rem', fontWeight: 800, color: 'var(--register-text)',
                  fontVariantNumeric: 'tabular-nums', textAlign: 'right', minWidth: 80,
                }}>
                  {fmtMoney0.format(s.fy26K * 1000)}
                </div>
                <div style={{
                  fontSize: '0.9rem', fontWeight: 800, color: 'var(--register-success)',
                  fontVariantNumeric: 'tabular-nums', minWidth: 56, textAlign: 'right',
                }}>
                  +{s.deltaPct.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>

          <div style={{
            fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-warning)',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
          }}>
            Soft targets — held flat or below
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SANDBAG_STORES.map((s, i) => (
              <div
                key={s.store}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) auto auto',
                  gap: 12, alignItems: 'center',
                  padding: '10px 14px', borderRadius: 10,
                  background: 'color-mix(in srgb, var(--register-warning) 6%, var(--register-bg-surface))',
                  border: '1px solid var(--register-border)',
                  borderLeft: '3px solid var(--register-warning)',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                  transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: `${0.75 + i * 0.05}s`,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {s.store}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
                    {s.district} · {s.format} · {s.note}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.95rem', fontWeight: 800, color: 'var(--register-text)',
                  fontVariantNumeric: 'tabular-nums', textAlign: 'right', minWidth: 80,
                }}>
                  {fmtMoney0.format(s.fy26K * 1000)}
                </div>
                <div style={{
                  fontSize: '0.9rem', fontWeight: 800, color: 'var(--register-warning)',
                  fontVariantNumeric: 'tabular-nums', minWidth: 56, textAlign: 'right',
                }}>
                  {s.deltaPct.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 4 · Publish fan-out ──────────────────── */}
      <div
        className="register-section"
        style={{
          padding: 24, marginBottom: 24,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(14px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '0.6s',
          background: `linear-gradient(135deg, color-mix(in srgb, ${STRATEGY_CYAN} 8%, var(--register-bg-elevated)) 0%, var(--register-bg-elevated) 60%)`,
          border: `1px solid color-mix(in srgb, ${STRATEGY_CYAN} 40%, var(--register-border))`,
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          gap: 20, flexWrap: 'wrap', marginBottom: 18,
        }}>
          <div>
            <div style={{
              fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: STRATEGY_CYAN,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <Zap size={14} />
              Publish · ICM Fan-out
            </div>
            <h2 style={{
              fontSize: '1.35rem', fontWeight: 800, color: 'var(--register-text)',
              margin: '4px 0 0', letterSpacing: '-0.01em',
            }}>
              Push FY26 targets to comp + rep systems
            </h2>
            <p style={{
              fontSize: '0.95rem', color: 'var(--register-text-muted)',
              margin: '6px 0 0', maxWidth: 560,
            }}>
              One click syncs locked quotas to Varicent, CaptivateIQ, Xactly, Workday,
              D365, and the 1,420 rep tablets — every destination, one transaction.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing || published}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 22px', borderRadius: 12,
              background: published
                ? 'var(--register-success)'
                : `linear-gradient(135deg, ${STRATEGY_CYAN}, #0891B2)`,
              color: '#FFFFFF',
              border: 'none', cursor: publishing || published ? 'default' : 'pointer',
              fontSize: '1rem', fontWeight: 800, letterSpacing: '0.02em',
              boxShadow: published
                ? '0 8px 24px rgba(5,150,105,0.35)'
                : `0 8px 24px ${STRATEGY_CYAN}55`,
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              opacity: publishing ? 0.85 : 1,
              minWidth: 240, justifyContent: 'center',
            }}
          >
            {published ? (
              <>
                <CheckCircle2 size={18} />
                Published · {lockedCount}/{DISTRICTS.length} districts
              </>
            ) : publishing ? (
              <>
                <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Publishing to 6 systems…
              </>
            ) : (
              <>
                <Send size={18} />
                Publish Targets · {lockedCount} districts
              </>
            )}
          </button>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 12,
        }}>
          {FANOUT.map((f, i) => {
            const effectiveStatus: FanoutRow['status'] =
              published && f.status !== 'Pending' ? 'Synced' : f.status;
            const statusColor =
              effectiveStatus === 'Synced' ? 'var(--register-success)' :
              effectiveStatus === 'Queued' ? STRATEGY_CYAN :
              'var(--register-warning)';
            const StatusIcon =
              effectiveStatus === 'Synced' ? CheckCircle2 :
              effectiveStatus === 'Queued' ? Clock :
              AlertTriangle;
            const syncLabel = published && f.status === 'Queued' ? 'Just now' : f.lastSync;
            return (
              <div
                key={f.system}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '34px minmax(0, 1fr) auto',
                  gap: 12, alignItems: 'center',
                  padding: '14px 16px', borderRadius: 12,
                  background: 'var(--register-bg-surface)',
                  border: '1px solid var(--register-border)',
                  borderLeft: `3px solid ${statusColor}`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: `${0.72 + i * 0.05}s`,
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: `color-mix(in srgb, ${statusColor} 18%, transparent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid color-mix(in srgb, ${statusColor} 40%, transparent)`,
                }}>
                  <StatusIcon size={17} style={{ color: statusColor }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)' }}>
                      {f.system}
                    </span>
                    <span style={{
                      fontSize: '0.82rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                      background: `color-mix(in srgb, ${statusColor} 16%, transparent)`,
                      color: statusColor, letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>
                      {effectiveStatus}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
                    {f.role}
                  </div>
                  <div style={{
                    fontSize: '0.82rem', color: 'var(--register-text-dim)', marginTop: 2,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {f.recordCount}
                  </div>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: '0.82rem', color: 'var(--register-text-muted)',
                  fontVariantNumeric: 'tabular-nums', fontWeight: 600,
                  padding: '4px 10px', borderRadius: 8,
                  background: 'var(--register-bg-elevated)',
                  border: '1px solid var(--register-border)',
                  whiteSpace: 'nowrap',
                }}>
                  <Clock size={12} style={{ color: statusColor }} />
                  {syncLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 5 · AI insight ───────────────────────── */}
      <div
        style={{
          marginBottom: 18,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: '0.82s',
        }}
      >
        <AIInsightCard label="AI Target Recommendation">
          <strong style={{ color: 'var(--register-text)' }}>District 8 (Northeast) quota is 8.2% below peer-benchmark</strong>
          {' '}— FY25 actuals beat plan by 11%, but draft FY26 targets lift only 3.2% vs. 7.8% district avg.
          Recommended raise: <strong style={{ color: 'var(--register-success)', fontVariantNumeric: 'tabular-nums' }}>+$2.1M ($35.1M → $37.2M)</strong>,
          keeps per-rep attainment in the 62–68% healthy band. 3 DMs flagged for review before final publish.
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
          <ArrowUpRight size={12} style={{ color: STRATEGY_CYAN }} />
          FY26 planning workspace · locks Friday 5 PM ET · {fmtMoneyShort(totalTargetM * 1_000_000)} across {DISTRICTS.reduce((a,b)=>a+b.stores,0)} stores
          <Users size={12} style={{ color: STRATEGY_CYAN, marginLeft: 6 }} />
          8 DMs · 1,420 reps downstream
        </div>
      </div>
    </RegisterPage>
  );
}
