'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';
import {
  ChevronRight,
  TrendingUp,
  DollarSign,
  Target,
  Percent,
  CheckCircle2,
  Radio,
  Info,
} from 'lucide-react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { useIcm } from '@/components/demos/register/IcmContext';
import {
  ORG_HIERARCHY,
  type OrgNode,
  COMP_AS_PCT_REVENUE,
  PUBLISH_TARGETS,
  VARICENT_SYNC,
} from '@/data/register/comp-data';

/* ── Helpers ─────────────────────────────────────────────── */

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

function attainmentBand(pct: number): 'success' | 'accent' | 'warning' {
  if (pct >= 95) return 'success';
  if (pct >= 80) return 'accent';
  return 'warning';
}

function bandToken(band: 'success' | 'accent' | 'warning'): string {
  return `var(--register-${band})`;
}

/* ── Tiny SVG Sparkline ──────────────────────────────────── */

function Sparkline({
  data,
  color,
  width = 120,
  height = 36,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : width;
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / span) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const last = data[data.length - 1];
  const lastX = (data.length - 1) * stepX;
  const lastY = height - ((last - min) / span) * (height - 4) - 2;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle cx={lastX} cy={lastY} r={3} fill={color} />
    </svg>
  );
}

/* ── Progress Bar ────────────────────────────────────────── */

function ProgressBar({ pct, color, mounted }: { pct: number; color: string; mounted: boolean }) {
  const capped = Math.min(pct, 120);
  return (
    <div
      style={{
        width: '100%',
        height: 8,
        borderRadius: 4,
        background: 'var(--register-bg-surface)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: mounted ? `${Math.min((capped / 120) * 100, 100)}%` : '0%',
          height: '100%',
          background: color,
          borderRadius: 4,
          transition: 'width 600ms cubic-bezier(0.33,1,0.68,1)',
        }}
      />
    </div>
  );
}

/* ── KPI Stat Card ───────────────────────────────────────── */

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  spark,
  sparkColor,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof DollarSign;
  spark: number[];
  sparkColor: string;
  valueColor?: string;
}) {
  return (
    <div
      className="register-card register-card-hover reg-fade-up"
      style={{
        padding: '22px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--register-text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
        <Icon size={18} color="var(--register-text-dim)" />
      </div>
      <div
        className="register-kpi-value"
        style={{ color: valueColor ?? 'var(--register-text)', marginBottom: 4 }}
      >
        {value}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginTop: 8,
        }}
      >
        <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>{sub}</span>
        <Sparkline data={spark} color={sparkColor} />
      </div>
    </div>
  );
}

/* ── Entity Card (Region/District/Store) ─────────────────── */

function EntityCard({
  node,
  onClick,
  disabled,
  disabledReason,
  staggerIdx,
}: {
  node: OrgNode;
  onClick?: () => void;
  disabled?: boolean;
  disabledReason?: string;
  staggerIdx: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80 + staggerIdx * 60);
    return () => clearTimeout(t);
  }, [staggerIdx]);

  const attainment = (node.revenueMTD / node.quotaMTD) * 100;
  const compPct = (node.commissionMTD / node.revenueMTD) * 100;
  const band = attainmentBand(attainment);
  const accent = bandToken(band);
  const bandLabel =
    band === 'success' ? 'On pace' : band === 'accent' ? 'Tracking' : 'Below pace';

  return (
    <div
      className={onClick ? 'register-card register-card-hover' : 'register-card'}
      style={{
        padding: '20px 22px',
        borderLeft: `4px solid ${accent}`,
        cursor: onClick && !disabled ? 'pointer' : 'default',
        position: 'relative',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 320ms ease, transform 320ms cubic-bezier(0.33,1,0.68,1)',
      }}
      onClick={onClick && !disabled ? onClick : undefined}
      role={onClick && !disabled ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {disabled && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15,23,42,0.55)',
            borderRadius: 'var(--register-radius-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            backdropFilter: 'blur(1px)',
          }}
        >
          <span
            style={{
              background: 'var(--register-bg-elevated)',
              color: 'var(--register-text)',
              padding: '8px 16px',
              borderRadius: 999,
              fontSize: '0.82rem',
              fontWeight: 700,
              border: '1px solid var(--register-border)',
              boxShadow: 'var(--register-shadow-card)',
            }}
          >
            {disabledReason ?? 'Drill not available in demo'}
          </span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--register-text)',
              lineHeight: 1.25,
            }}
          >
            {node.name}
          </div>
          {node.store && (
            <div
              style={{
                fontSize: '0.82rem',
                color: 'var(--register-text-muted)',
                marginTop: 2,
              }}
            >
              {node.store}
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: accent,
            background: `color-mix(in srgb, ${accent} 14%, transparent)`,
            padding: '4px 10px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
          }}
        >
          {bandLabel}
        </div>
      </div>

      {/* Revenue vs Quota */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 6,
          }}
        >
          <span
            className="tabular"
            style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}
          >
            {fmtCurrency(node.revenueMTD)}
          </span>
          <span
            className="tabular"
            style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}
          >
            of {fmtCurrency(node.quotaMTD)} quota
          </span>
        </div>
        <ProgressBar pct={attainment} color={accent} mounted={mounted} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 6,
            fontSize: '0.82rem',
            color: 'var(--register-text-muted)',
          }}
        >
          <span className="tabular" style={{ fontWeight: 700, color: accent }}>
            {fmtPct(attainment)} attainment
          </span>
          <span className="tabular">Comp {fmtPct(compPct)}</span>
        </div>
      </div>

      {/* Meta row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 10,
          borderTop: '1px solid var(--register-border)',
          fontSize: '0.82rem',
          color: 'var(--register-text-dim)',
        }}
      >
        <span>
          Commission{' '}
          <span className="tabular" style={{ color: 'var(--register-text)', fontWeight: 700 }}>
            {fmtCurrency(node.commissionMTD)}
          </span>
        </span>
        <span>
          <span className="tabular" style={{ color: 'var(--register-text)', fontWeight: 700 }}>
            {node.headcount}
          </span>{' '}
          headcount
        </span>
        {onClick && !disabled && (
          <ChevronRight size={16} color="var(--register-text-dim)" />
        )}
      </div>
    </div>
  );
}

/* ── Breadcrumb ──────────────────────────────────────────── */

interface CrumbStep {
  label: string;
  onClick: () => void;
  active: boolean;
}

function Breadcrumb({ steps }: { steps: CrumbStep[] }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
        padding: '12px 16px',
        background: 'var(--register-bg-elevated)',
        borderBottom: '1px solid var(--register-border)',
        borderTopLeftRadius: 'var(--register-radius-section)',
        borderTopRightRadius: 'var(--register-radius-section)',
        marginBottom: 0,
      }}
    >
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <ChevronRight size={14} color="var(--register-text-dim)" />}
          <button
            onClick={s.onClick}
            disabled={s.active}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: '0.95rem',
              fontWeight: s.active ? 700 : 600,
              color: s.active ? 'var(--register-text)' : 'var(--register-primary)',
              cursor: s.active ? 'default' : 'pointer',
              textDecoration: s.active ? 'none' : 'underline',
              textUnderlineOffset: 3,
            }}
          >
            {s.label}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ── Cascade Level ───────────────────────────────────────── */

type Level = 'enterprise' | 'region' | 'district' | 'store';

interface CascadeState {
  level: Level;
  regionId?: string;
  districtId?: string;
}

function SideBreakdownChart({
  entries,
  title,
}: {
  entries: Array<{ name: string; revenue: number; quota: number; attainment: number; band: 'success' | 'accent' | 'warning' }>;
  title: string;
}) {
  const data = entries.map((e) => ({
    name: e.name.length > 18 ? e.name.slice(0, 16) + '…' : e.name,
    attainment: Number(e.attainment.toFixed(1)),
    revenue: e.revenue,
    band: e.band,
  }));

  return (
    <div
      className="register-section"
      style={{
        padding: '20px 20px',
        marginBottom: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3
        style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: 'var(--register-text)',
          margin: 0,
          marginBottom: 4,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.82rem',
          color: 'var(--register-text-muted)',
          margin: 0,
          marginBottom: 12,
        }}
      >
        Quota attainment %
      </p>
      <div style={{ flex: 1, minHeight: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 120]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" width={110} />
            <Tooltip
              formatter={(v) => [`${Number(v ?? 0)}%`, 'Attainment']}
              cursor={{ fill: 'var(--register-bg-surface)' }}
            />
            <ReferenceLine x={100} stroke="var(--register-text-dim)" strokeDasharray="4 3" />
            <Bar dataKey="attainment" radius={[0, 6, 6, 0]}>
              {data.map((d, i) => (
                <rect
                  key={i}
                  fill={
                    d.band === 'success'
                      ? 'var(--register-success)'
                      : d.band === 'accent'
                        ? 'var(--register-accent)'
                        : 'var(--register-warning)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function ExecutiveViewPage() {
  const router = useRouter();
  const { provider: icm } = useIcm();
  const [cascade, setCascade] = useState<CascadeState>({ level: 'region' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Index
  const byId = useMemo(() => {
    const map = new Map<string, OrgNode>();
    ORG_HIERARCHY.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  const childrenOf = useMemo(() => {
    const map = new Map<string, OrgNode[]>();
    ORG_HIERARCHY.forEach((n) => {
      if (n.parentId) {
        const arr = map.get(n.parentId) ?? [];
        arr.push(n);
        map.set(n.parentId, arr);
      }
    });
    return map;
  }, []);

  const exec = ORG_HIERARCHY.find((n) => n.role === 'exec')!;
  const regions = childrenOf.get(exec.id) ?? [];

  // Enterprise totals
  const totals = useMemo(() => {
    const rev = regions.reduce((s, r) => s + r.revenueMTD, 0);
    const quota = regions.reduce((s, r) => s + r.quotaMTD, 0);
    const comm = regions.reduce((s, r) => s + r.commissionMTD, 0);
    return {
      revenue: rev,
      quota,
      commission: comm,
      attainment: (rev / quota) * 100,
      compPct: (comm / rev) * 100,
    };
  }, [regions]);

  // Current level entries
  const activeRegion = cascade.regionId ? byId.get(cascade.regionId) : null;
  const activeDistrict = cascade.districtId ? byId.get(cascade.districtId) : null;

  const currentEntries: OrgNode[] = useMemo(() => {
    if (cascade.level === 'region') return regions;
    if (cascade.level === 'district' && activeRegion) return childrenOf.get(activeRegion.id) ?? [];
    if (cascade.level === 'store' && activeDistrict) return childrenOf.get(activeDistrict.id) ?? [];
    return regions;
  }, [cascade, regions, activeRegion, activeDistrict, childrenOf]);

  const currentHeading = useMemo(() => {
    if (cascade.level === 'region') return 'Regional Breakdown';
    if (cascade.level === 'district' && activeRegion) return `${activeRegion.name} · Districts`;
    if (cascade.level === 'store' && activeDistrict) return `${activeDistrict.name} · Stores`;
    return '';
  }, [cascade, activeRegion, activeDistrict]);

  // Breadcrumb steps
  const crumbs: CrumbStep[] = useMemo(() => {
    const steps: CrumbStep[] = [
      {
        label: 'Enterprise',
        onClick: () => setCascade({ level: 'region' }),
        active: cascade.level === 'region',
      },
    ];
    if (activeRegion) {
      steps.push({
        label: activeRegion.name,
        onClick: () => setCascade({ level: 'district', regionId: activeRegion.id }),
        active: cascade.level === 'district',
      });
    }
    if (activeDistrict) {
      steps.push({
        label: activeDistrict.name,
        onClick: () =>
          setCascade({
            level: 'store',
            regionId: activeRegion!.id,
            districtId: activeDistrict.id,
          }),
        active: cascade.level === 'store',
      });
    }
    return steps;
  }, [cascade, activeRegion, activeDistrict]);

  // Chart data for side panel
  const sideChartEntries = useMemo(() => {
    const source =
      cascade.level === 'store' && activeDistrict?.id !== 'district-pac'
        ? // Show generic placeholder data for non-Pacific (demo mock)
          [
            { name: 'Store A', revenue: 240000, quota: 260000, attainment: 92.3, band: 'accent' as const },
            { name: 'Store B', revenue: 210000, quota: 240000, attainment: 87.5, band: 'accent' as const },
            { name: 'Store C', revenue: 180000, quota: 230000, attainment: 78.3, band: 'warning' as const },
          ]
        : currentEntries.map((n) => {
            const att = (n.revenueMTD / n.quotaMTD) * 100;
            return {
              name: n.name,
              revenue: n.revenueMTD,
              quota: n.quotaMTD,
              attainment: att,
              band: attainmentBand(att),
            };
          });
    return source;
  }, [cascade.level, activeDistrict, currentEntries]);

  // Card click handlers
  const onRegionClick = (region: OrgNode) => {
    setCascade({ level: 'district', regionId: region.id });
  };
  const onDistrictClick = (district: OrgNode) => {
    setCascade({
      level: 'store',
      regionId: cascade.regionId,
      districtId: district.id,
    });
  };
  const onStoreClick = (mgr: OrgNode) => {
    if (mgr.id === 'mgr-galleria') {
      router.push('/register/comp/team');
    }
  };

  // Derived data for KPI sparklines (fake 7-day)
  const sparkRev = [7.9, 8.0, 8.1, 8.05, 8.2, 8.3, 8.42];
  const sparkComm = [640, 650, 655, 660, 668, 675, 682];
  const sparkAtt = [94.2, 95.0, 95.5, 95.8, 96.0, 96.1, 96.2];
  const sparkCompPct = [7.8, 7.9, 8.0, 8.05, 8.1, 8.12, 8.1];

  // Cascade content key — triggers re-mount animation
  const cascadeKey = `${cascade.level}-${cascade.regionId ?? ''}-${cascade.districtId ?? ''}`;

  return (
    <RegisterPage
      title="Executive Rollup"
      subtitle="Enterprise performance · drill Exec → Region → District → Store → Rep"
      accentColor="var(--register-primary)"
    >
      {/* ── Fan-out pill ─────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div
          className="reg-fade-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 16px',
            borderRadius: 999,
            background: 'color-mix(in srgb, var(--register-primary) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--register-primary) 30%, transparent)',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--register-text)',
          }}
        >
          <Radio size={14} color="var(--register-primary)" />
          All rules fan out from REGISTER Plan Designer · {icm.name} + 214 tablets + 38 consoles in sync
        </div>
      </div>

      {/* ── Section 1: Enterprise KPI Header ─────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          label="Enterprise Revenue MTD"
          value={`$${(totals.revenue / 1_000_000).toFixed(2)}M`}
          sub="of $8.75M quota"
          icon={DollarSign}
          spark={sparkRev}
          sparkColor="var(--register-chart-1)"
        />
        <StatCard
          label="Enterprise Commission MTD"
          value={fmtCurrency(totals.commission)}
          sub="across 850 reps"
          icon={TrendingUp}
          spark={sparkComm}
          sparkColor="var(--register-chart-2)"
        />
        <StatCard
          label="Quota Attainment"
          value={fmtPct(totals.attainment)}
          sub="Target: 100%"
          icon={Target}
          spark={sparkAtt}
          sparkColor="var(--register-success)"
          valueColor="var(--register-success)"
        />
        <StatCard
          label="Comp % of Revenue"
          value={fmtPct(totals.compPct, 2)}
          sub="Plan target: 8.0%"
          icon={Percent}
          spark={sparkCompPct}
          sparkColor="var(--register-warning)"
          valueColor="var(--register-warning)"
        />
      </div>

      {/* ── Section 2: Cascade Drill-Down ─────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)',
          gap: 20,
          marginBottom: 28,
          alignItems: 'stretch',
        }}
      >
        {/* Cascade panel */}
        <div
          className="register-section"
          style={{
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Breadcrumb steps={crumbs} />
          <div style={{ padding: '20px 24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--register-text)',
                  margin: 0,
                }}
              >
                {currentHeading}
              </h2>
              <span
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--register-text-muted)',
                }}
              >
                Click a card to drill in
              </span>
            </div>

            <div
              key={cascadeKey}
              className="reg-fade-up"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 16,
              }}
            >
              {cascade.level === 'region' &&
                regions.map((r, i) => (
                  <EntityCard
                    key={r.id}
                    node={r}
                    staggerIdx={i}
                    onClick={() => onRegionClick(r)}
                  />
                ))}

              {cascade.level === 'district' &&
                activeRegion &&
                (childrenOf.get(activeRegion.id) ?? []).map((d, i) => (
                  <EntityCard
                    key={d.id}
                    node={d}
                    staggerIdx={i}
                    onClick={() => onDistrictClick(d)}
                  />
                ))}

              {cascade.level === 'store' &&
                activeDistrict &&
                activeDistrict.id === 'district-pac' &&
                (childrenOf.get(activeDistrict.id) ?? []).map((m, i) => (
                  <EntityCard
                    key={m.id}
                    node={m}
                    staggerIdx={i}
                    onClick={m.id === 'mgr-galleria' ? () => onStoreClick(m) : undefined}
                    disabled={m.id !== 'mgr-galleria'}
                    disabledReason="Team drill available for Galleria in demo"
                  />
                ))}

              {cascade.level === 'store' &&
                activeDistrict &&
                activeDistrict.id !== 'district-pac' &&
                [1, 2, 3].map((i) => {
                  const mock: OrgNode = {
                    id: `mock-${activeDistrict.id}-${i}`,
                    name: `Store ${i}`,
                    role: 'manager',
                    store: `${activeDistrict.name} — Location ${i}`,
                    parentId: activeDistrict.id,
                    revenueMTD: Math.round(activeDistrict.revenueMTD / 4),
                    quotaMTD: Math.round(activeDistrict.quotaMTD / 4),
                    commissionMTD: Math.round(activeDistrict.commissionMTD / 4),
                    headcount: Math.round(activeDistrict.headcount / 4),
                  };
                  return (
                    <EntityCard
                      key={mock.id}
                      node={mock}
                      staggerIdx={i - 1}
                      disabled
                      disabledReason="Drill not available in demo"
                    />
                  );
                })}
            </div>
          </div>
        </div>

        {/* Side breakdown chart */}
        <SideBreakdownChart
          entries={sideChartEntries}
          title={
            cascade.level === 'region'
              ? 'Regions · Attainment'
              : cascade.level === 'district'
                ? 'Districts · Attainment'
                : 'Stores · Attainment'
          }
        />
      </div>

      {/* ── Section 3: Comp Cost % Chart ──────────────── */}
      <div className="register-section" style={{ padding: '24px 28px', marginBottom: 28 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>
            Comp Cost % of Revenue — 6 month trend
          </h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
            Plan target: 8.0%
          </span>
        </div>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={COMP_AS_PCT_REVENUE} margin={{ top: 10, right: 24, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[6, 10]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => [`${Number(v ?? 0)}%`, 'Comp %']} />
              <ReferenceLine
                y={8}
                stroke="var(--register-text-dim)"
                strokeDasharray="5 4"
                label={{
                  value: 'Plan target 8%',
                  position: 'right',
                  fill: 'var(--register-text-muted)',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="pct"
                stroke="var(--register-chart-3)"
                strokeWidth={3}
                dot={{ r: 5, fill: 'var(--register-chart-3)' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Section 4: Plan Distribution Status ────────── */}
      <div className="register-section" style={{ padding: '24px 28px', marginBottom: 28 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 4,
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>
            Active plans live across enterprise
          </h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
            Last publish {VARICENT_SYNC.lastPushToVaricent}
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', margin: '0 0 16px' }}>
          Plan Designer fan-out · three downstream systems synchronized
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PUBLISH_TARGETS.map((t) => {
            const detail =
              t.id === 'varicent'
                ? `Last push ${t.lastSync} · ${VARICENT_SYNC.varicentRuleCount} rules`
                : t.id === 'tablets'
                  ? `${t.recipients} / ${t.recipients} connected · last sync ${t.lastSync}`
                  : `${t.recipients} / ${t.recipients} consoles · real-time`;
            return (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 12,
                  background: 'var(--register-bg-surface)',
                  border: '1px solid var(--register-border)',
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: 'var(--register-success)',
                    boxShadow: '0 0 0 4px color-mix(in srgb, var(--register-success) 20%, transparent)',
                    flexShrink: 0,
                  }}
                />
                <CheckCircle2 size={18} color="var(--register-success)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--register-text)',
                    }}
                  >
                    {t.id === 'varicent' ? icm.name : t.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
                    {detail}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--register-success)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Healthy
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 5: Outlier detection ──────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>
            AI outlier scanner
          </h2>
          <span
            title="AI scanner runs every 30 min on commission anomaly detection"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.82rem',
              color: 'var(--register-text-muted)',
              cursor: 'help',
            }}
          >
            <Info size={14} />
            Runs every 30 min
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AIInsightCard label="Commission ratio drift">
            East Region commission ratio 8.1% — above 7.8% enterprise avg — review Southeast Q1
            SPIFF cadence.
          </AIInsightCard>
          <AIInsightCard label="Quota headroom">
            Pacific District 96% attainment — ahead of pace — consider raising Q2 quotas +3%.
          </AIInsightCard>
          <AIInsightCard label="Playbook candidate">
            Outlet #22 Livermore — only store exceeding quota — playbook candidate.
          </AIInsightCard>
        </div>
      </div>
    </RegisterPage>
  );
}
