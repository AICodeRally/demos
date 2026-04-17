'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';
import {
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Radio,
  Info,
  Store,
  Zap,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import {
  ORG_HIERARCHY,
  COMP_TIERS,
  KPI_MEASUREMENTS,
  type OrgNode,
} from '@/data/register/comp-data';

const STATEMENT_URL = '/register/comp/statements';

/* ── SPIFF ROI data (polished) ─────────────────────────── */
const SPIFF_DATA = [
  { name: 'Adjustable Base SPIFF', roi: 4.1, triggered: 23, spend: 575, revenue: 2358 },
  { name: 'Premium Tier Bonus',    roi: 2.8, triggered: 15, spend: 450, revenue: 1260 },
  { name: 'Bundle Accelerator',    roi: 3.7, triggered: 11, spend: 825, revenue: 3053 },
  { name: 'Protector Attach',      roi: 3.2, triggered: 34, spend: 340, revenue: 1088 },
];

/* ── Format performance summary ────────────────────────── */
const FORMAT_CARDS = [
  { id: 'flagship',     name: 'Flagship', storeCount: 8,  revenue: KPI_MEASUREMENTS.flagship[1].value,  quota: KPI_MEASUREMENTS.flagship[1].goal,   chartColor: 'var(--register-chart-1)' },
  { id: 'standard',     name: 'Standard', storeCount: 32, revenue: KPI_MEASUREMENTS.standard[1].value,  quota: KPI_MEASUREMENTS.standard[1].goal,   chartColor: 'var(--register-chart-2)' },
  { id: 'outlet',       name: 'Outlet',   storeCount: 14, revenue: KPI_MEASUREMENTS.outlet[1].value,    quota: KPI_MEASUREMENTS.outlet[1].goal,     chartColor: 'var(--register-chart-3)' },
  { id: 'shop-in-shop', name: 'SiS',      storeCount: 6,  revenue: KPI_MEASUREMENTS['shop-in-shop'][1].value, quota: KPI_MEASUREMENTS['shop-in-shop'][1].goal, chartColor: 'var(--register-chart-4)' },
];

/* ── Helpers ────────────────────────────────────────────── */
function fmtCurrency(n: number, compact = false) {
  if (compact && n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function fmtPct(n: number) {
  return `${Math.round(n)}%`;
}

function initialsOf(name: string) {
  const p = name.trim().split(/\s+/);
  return (p[0][0] + (p[1]?.[0] ?? '')).toUpperCase();
}

function attainmentColor(pct: number) {
  if (pct >= 90) return 'var(--register-success)';
  if (pct >= 75) return 'var(--register-warning)';
  return 'var(--register-danger)';
}

function tierForRevenue(revenue: number) {
  return COMP_TIERS.find(t => revenue >= t.minRevenue && revenue <= t.maxRevenue) ?? COMP_TIERS[0];
}

/* ── Sort state ─────────────────────────────────────────── */
type SortKey = 'rank' | 'name' | 'revenueMTD' | 'quotaMTD' | 'attainment' | 'deals' | 'commissionMTD';
type SortDir = 'asc' | 'desc';

interface LeaderboardRow extends OrgNode {
  attainment: number;
  deals: number;
  tierName: string;
  tierColor: string;
}

export default function ManagerTeamRollupPage() {
  const [sortKey, setSortKey] = useState<SortKey>('revenueMTD');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [barsReady, setBarsReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  /* ── Manager + team data ──────────────────────────────── */
  const manager = useMemo(() => ORG_HIERARCHY.find(n => n.id === 'mgr-galleria')!, []);

  const teamRows: LeaderboardRow[] = useMemo(() => {
    return ORG_HIERARCHY
      .filter(n => n.parentId === 'mgr-galleria')
      .map(rep => {
        const attainment = (rep.revenueMTD / rep.quotaMTD) * 100;
        const deals = Math.round(rep.revenueMTD / 1800);
        const tier = tierForRevenue(rep.revenueMTD);
        return {
          ...rep,
          attainment,
          deals,
          tierName: tier.tier,
          tierColor: tier.color,
        };
      });
  }, []);

  const teamRevenue = teamRows.reduce((s, r) => s + r.revenueMTD, 0);
  const teamCommission = teamRows.reduce((s, r) => s + r.commissionMTD, 0);
  const quotaAttainment = (teamRevenue / manager.quotaMTD) * 100;

  /* ── Sorted rows with ranks ───────────────────────────── */
  const sortedRows = useMemo(() => {
    const ranked = [...teamRows]
      .sort((a, b) => b.revenueMTD - a.revenueMTD)
      .map((r, i) => ({ ...r, rank: i + 1 }));

    const sorted = [...ranked].sort((a, b) => {
      let av: number | string, bv: number | string;
      switch (sortKey) {
        case 'rank':          av = a.rank;          bv = b.rank; break;
        case 'name':          av = a.name;          bv = b.name; break;
        case 'revenueMTD':    av = a.revenueMTD;    bv = b.revenueMTD; break;
        case 'quotaMTD':      av = a.quotaMTD;      bv = b.quotaMTD; break;
        case 'attainment':    av = a.attainment;    bv = b.attainment; break;
        case 'deals':         av = a.deals;         bv = b.deals; break;
        case 'commissionMTD': av = a.commissionMTD; bv = b.commissionMTD; break;
      }
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });
    return sorted;
  }, [teamRows, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(k);
      setSortDir(k === 'name' ? 'asc' : 'desc');
    }
  }

  /* ── Earnings chart data ──────────────────────────────── */
  const chartColors = [
    'var(--register-chart-1)',
    'var(--register-chart-2)',
    'var(--register-chart-3)',
    'var(--register-chart-4)',
    'var(--register-chart-5)',
    'var(--register-chart-6)',
  ];
  const earningsChart = [...teamRows]
    .sort((a, b) => b.commissionMTD - a.commissionMTD)
    .map((r, i) => ({
      name: r.name.split(' ')[0] + ' ' + r.name.split(' ')[1][0] + '.',
      commission: r.commissionMTD,
      fill: chartColors[i % chartColors.length],
    }));

  /* ── SPIFF ROI max for bar-fill scaling ───────────────── */
  const spiffMaxROI = Math.max(...SPIFF_DATA.map(s => s.roi));

  return (
    <RegisterPage
      title="Team Rollup — Galleria Flagship #12"
      subtitle="Alex Rivera · Store Manager · March 2026"
    >
      {/* ── Breadcrumb + Rules-Pushed Pill ─────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 22,
        }}
      >
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          <span style={{ color: 'var(--register-text-muted)' }}>Pacific District</span>
          <ChevronRight size={16} style={{ color: 'var(--register-text-dim)' }} />
          <span style={{ color: 'var(--register-text)', fontWeight: 700 }}>
            Galleria Flagship #12
          </span>
        </nav>

        <div
          role="status"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 999,
            background: 'rgba(124, 58, 237, 0.10)',
            border: '1px solid rgba(124, 58, 237, 0.30)',
            color: 'var(--register-ai)',
            fontSize: '0.82rem',
            fontWeight: 600,
          }}
        >
          <Radio size={14} />
          <span>
            Rules pushed from REGISTER Plan Designer at 2:30 PM · 214 tablets received
          </span>
        </div>
      </div>

      {/* ── Section 1: Manager KPI Tiles ───────────────────── */}
      <div className="register-kpi-strip" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        {[
          {
            label: 'Team Revenue MTD',
            value: fmtCurrency(teamRevenue),
            color: 'var(--register-primary)',
            sub: `${teamRows.length} reps · ${teamRows.reduce((s, r) => s + Math.round(r.revenueMTD / 1800), 0)} deals`,
          },
          {
            label: 'Team Commission MTD',
            value: fmtCurrency(teamCommission),
            color: 'var(--register-success)',
            sub: `${fmtPct((teamCommission / teamRevenue) * 100)} blended comp rate`,
          },
          {
            label: 'Quota Attainment',
            value: fmtPct(quotaAttainment),
            color: attainmentColor(quotaAttainment),
            sub: `${fmtCurrency(teamRevenue, true)} of ${fmtCurrency(manager.quotaMTD, true)}`,
            progress: quotaAttainment,
          },
        ].map((tile, i) => (
          <div
            key={tile.label}
            className="register-card reg-fade-up"
            style={{
              padding: '22px 24px',
              animationDelay: `${60 * i}ms`,
            }}
          >
            <p
              className="register-meta-label"
              style={{
                marginBottom: 8,
                color: 'var(--register-text-dim)',
              }}
            >
              {tile.label}
            </p>
            <p
              className="register-kpi-value tabular"
              style={{
                color: tile.color,
                margin: 0,
                fontSize: '2.15rem',
                lineHeight: 1.05,
              }}
            >
              {tile.value}
            </p>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: '0.88rem',
                color: 'var(--register-text-muted)',
                fontWeight: 500,
              }}
            >
              {tile.sub}
            </p>
            {tile.progress !== undefined && (
              <div
                style={{
                  marginTop: 14,
                  height: 8,
                  borderRadius: 4,
                  background: 'var(--register-bg-surface)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: barsReady ? `${Math.min(tile.progress, 100)}%` : '0%',
                    background: tile.color,
                    borderRadius: 4,
                    transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Section 2: Leaderboard ─────────────────────────── */}
      <section className="register-section reg-fade-up" style={{ padding: 0, overflow: 'hidden', animationDelay: '120ms' }}>
        <div
          style={{
            padding: '20px 28px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderBottom: '1px solid var(--register-border)',
          }}
        >
          <Trophy size={18} style={{ color: 'var(--register-primary)' }} />
          <h2
            className="register-section-header"
            style={{ margin: 0, fontSize: '1.1rem' }}
          >
            Rep Leaderboard
          </h2>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.82rem',
              color: 'var(--register-text-muted)',
              fontWeight: 500,
            }}
          >
            {teamRows.length} reps · sorted by {sortKey === 'revenueMTD' ? 'revenue' : sortKey} {sortDir === 'desc' ? 'high → low' : 'low → high'}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.92rem',
            }}
          >
            <thead>
              <tr
                style={{
                  background: 'var(--register-bg-surface)',
                  textAlign: 'left',
                }}
              >
                {([
                  { k: 'rank',          label: '#',         width: 48 },
                  { k: 'name',          label: 'Rep',       width: 220 },
                  { k: 'revenueMTD',    label: 'Revenue MTD', width: 130, right: true },
                  { k: 'quotaMTD',      label: 'Quota',     width: 110, right: true },
                  { k: 'attainment',    label: 'Attainment', width: 200, tooltip: 'Live from POS — updates every 15 min' },
                  { k: 'deals',         label: 'Deals',     width: 80,  right: true },
                  { k: 'commissionMTD', label: 'Commission', width: 120, right: true },
                ] as { k: SortKey; label: string; width: number; right?: boolean; tooltip?: string }[]).map(col => {
                  const active = sortKey === col.k;
                  return (
                    <th
                      key={col.k}
                      onClick={() => toggleSort(col.k)}
                      title={col.tooltip}
                      style={{
                        padding: '12px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: active ? 'var(--register-text)' : 'var(--register-text-muted)',
                        textAlign: col.right ? 'right' : 'left',
                        cursor: 'pointer',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                        width: col.width,
                        transition: 'color 60ms ease',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          justifyContent: col.right ? 'flex-end' : 'flex-start',
                          width: '100%',
                        }}
                      >
                        {col.label}
                        {col.tooltip && (
                          <Info
                            size={12}
                            style={{
                              color: 'var(--register-text-dim)',
                            }}
                          />
                        )}
                        {active && (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                      </span>
                    </th>
                  );
                })}
                <th
                  style={{
                    padding: '12px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--register-text-muted)',
                    textAlign: 'right',
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, i) => {
                const isCasey = row.id === 'rep-casey';
                const attColor = attainmentColor(row.attainment);
                return (
                  <tr
                    key={row.id}
                    className="reg-fade-up"
                    style={{
                      animationDelay: `${60 * (i + 2)}ms`,
                      borderBottom: i < sortedRows.length - 1 ? '1px solid var(--register-border)' : 'none',
                      transition: 'background 60ms ease',
                      background: isCasey ? 'rgba(8, 145, 178, 0.05)' : 'transparent',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--register-bg-surface)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = isCasey ? 'rgba(8, 145, 178, 0.05)' : 'transparent')}
                  >
                    {/* Rank */}
                    <td style={{ padding: '14px 14px', fontWeight: 700, color: 'var(--register-text)', fontSize: '0.92rem' }}>
                      {row.rank}
                    </td>

                    {/* Rep */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${row.tierColor}55, ${row.tierColor}30)`,
                            border: `2px solid ${row.tierColor}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: 'var(--register-text)',
                          }}
                        >
                          {initialsOf(row.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--register-text)', fontSize: '0.95rem' }}>
                            {row.name}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', fontWeight: 500 }}>
                            Floor Sales Rep
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Revenue */}
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'var(--register-text)', fontSize: '0.95rem' }}>
                      {fmtCurrency(row.revenueMTD)}
                    </td>

                    {/* Quota */}
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--register-text-muted)', fontWeight: 500, fontSize: '0.92rem' }}>
                      {fmtCurrency(row.quotaMTD)}
                    </td>

                    {/* Attainment with progress */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums' }}>
                          <span style={{ color: attColor, fontWeight: 700 }}>{fmtPct(row.attainment)}</span>
                          <span style={{ color: 'var(--register-text-muted)', fontWeight: 500 }}>of quota</span>
                        </div>
                        <div
                          style={{
                            height: 7,
                            borderRadius: 4,
                            background: 'var(--register-bg-surface)',
                            overflow: 'hidden',
                            position: 'relative',
                            border: '1px solid var(--register-border)',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: barsReady ? `${Math.min(row.attainment, 115)}%` : '0%',
                              maxWidth: '100%',
                              background: attColor,
                              borderRadius: 4,
                              transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)',
                              transitionDelay: `${60 * i}ms`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Deals */}
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)', fontWeight: 600, fontSize: '0.92rem' }}>
                      {row.deals}
                    </td>

                    {/* Commission */}
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'var(--register-success)', fontSize: '0.95rem' }}>
                      {fmtCurrency(row.commissionMTD)}
                    </td>

                    {/* Action */}
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <Link
                        href={STATEMENT_URL}
                        title={isCasey ? 'Open Casey\u2019s commission statement' : 'Sample statement for demo — opens Casey\u2019s statement'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '7px 14px',
                          borderRadius: 8,
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          transition: 'all 60ms ease',
                          background: isCasey ? 'var(--register-primary)' : 'var(--register-bg-surface)',
                          color: isCasey ? '#FFFFFF' : 'var(--register-text)',
                          border: isCasey ? '1px solid var(--register-primary)' : '1px solid var(--register-border)',
                        }}
                        onMouseEnter={(e) => {
                          if (!isCasey) {
                            e.currentTarget.style.background = 'var(--register-primary)';
                            e.currentTarget.style.color = '#FFFFFF';
                            e.currentTarget.style.borderColor = 'var(--register-primary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCasey) {
                            e.currentTarget.style.background = 'var(--register-bg-surface)';
                            e.currentTarget.style.color = 'var(--register-text)';
                            e.currentTarget.style.borderColor = 'var(--register-border)';
                          }
                        }}
                      >
                        View statement
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 3: Format Performance Comparison ───────── */}
      <section className="register-section reg-fade-up" style={{ animationDelay: '180ms' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Store size={18} style={{ color: 'var(--register-accent)' }} />
          <h2 className="register-section-header" style={{ margin: 0, fontSize: '1.1rem' }}>
            Format Performance — District View
          </h2>
          <span style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--register-text-muted)', fontWeight: 500 }}>
            March 2026 MTD
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
          }}
        >
          {FORMAT_CARDS.map((fmt, i) => {
            const pct = (fmt.revenue / fmt.quota) * 100;
            const color = attainmentColor(pct);
            return (
              <div
                key={fmt.id}
                className="register-card register-card-hover reg-fade-up"
                title="District manager view →"
                style={{
                  padding: '18px 20px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  animationDelay: `${60 * (i + 3)}ms`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: fmt.chartColor,
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)' }}>
                    {fmt.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: 'var(--register-bg-surface)',
                      color: 'var(--register-text-muted)',
                    }}
                  >
                    {fmt.storeCount} stores
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                  <span
                    className="tabular"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'var(--register-text)',
                      lineHeight: 1.1,
                    }}
                  >
                    {fmtCurrency(fmt.revenue, true)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--register-text-muted)', fontWeight: 500 }}>
                    / {fmtCurrency(fmt.quota, true)}
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    background: 'var(--register-bg-surface)',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: barsReady ? `${Math.min(pct, 115)}%` : '0%',
                      maxWidth: '100%',
                      background: color,
                      borderRadius: 4,
                      transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)',
                      transitionDelay: `${60 * i + 200}ms`,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color, fontWeight: 700 }}>{fmtPct(pct)}</span>
                  <span style={{ color: 'var(--register-text-muted)', fontWeight: 500 }}>attainment</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 4: Team Earnings Chart ─────────────────── */}
      <section className="register-section reg-fade-up" style={{ animationDelay: '240ms' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Sparkles size={18} style={{ color: 'var(--register-success)' }} />
          <h2 className="register-section-header" style={{ margin: 0, fontSize: '1.1rem' }}>
            Team Earnings Distribution
          </h2>
          <span style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--register-text-muted)', fontWeight: 500 }}>
            MTD commission · sorted high → low
          </span>
        </div>

        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <BarChart
              data={earningsChart}
              layout="vertical"
              margin={{ top: 12, right: 80, left: 12, bottom: 8 }}
            >
              <XAxis
                type="number"
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}K`}
                stroke="var(--register-chart-axis)"
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="var(--register-chart-axis)"
                tickLine={false}
                width={100}
                tick={{ fontSize: 14, fontWeight: 600 }}
              />
              <Tooltip
                cursor={{ fill: 'var(--register-bg-surface)', opacity: 0.6 }}
                formatter={(value) => [fmtCurrency(Number(value)), 'Commission']}
              />
              <Bar dataKey="commission" radius={[0, 6, 6, 0]} animationDuration={600}>
                {earningsChart.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="commission"
                  position="right"
                  formatter={(v) => fmtCurrency(Number(v))}
                  style={{
                    fill: 'var(--register-text)',
                    fontWeight: 700,
                    fontSize: 14,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Section 5: SPIFF ROI ─────────────────────────────── */}
      <section className="register-section reg-fade-up" style={{ padding: 0, overflow: 'hidden', animationDelay: '300ms' }}>
        <div style={{ padding: '20px 28px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--register-border)' }}>
          <Zap size={18} style={{ color: 'var(--register-warning)' }} />
          <h2 className="register-section-header" style={{ margin: 0, fontSize: '1.1rem' }}>
            SPIFF ROI — rolling 30 day
          </h2>
          <span style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--register-text-muted)', fontWeight: 500 }}>
            Higher ROI = more revenue per incentive dollar
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ background: 'var(--register-bg-surface)', textAlign: 'left' }}>
                {['SPIFF', 'Triggered', 'Spend', 'Revenue', 'ROI Multiplier'].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 16px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--register-text-muted)',
                      textAlign: i === 0 ? 'left' : 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPIFF_DATA.map((s, i) => {
                const highRoi = s.roi > 3.5;
                const fillPct = (s.roi / spiffMaxROI) * 100;
                return (
                  <tr
                    key={s.name}
                    className="reg-fade-up"
                    style={{
                      animationDelay: `${60 * (i + 4)}ms`,
                      borderBottom: i < SPIFF_DATA.length - 1 ? '1px solid var(--register-border)' : 'none',
                      background: highRoi ? 'rgba(5, 150, 105, 0.06)' : 'transparent',
                      transition: 'background 60ms ease',
                    }}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--register-text)', fontSize: '0.95rem' }}>
                      {s.name}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--register-text-muted)', fontWeight: 600 }}>
                      {s.triggered}×
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)', fontWeight: 600 }}>
                      {fmtCurrency(s.spend)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--register-success)', fontWeight: 700 }}>
                      {fmtCurrency(s.revenue)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', width: 220 }}>
                      <div style={{ position: 'relative', height: 26, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'var(--register-bg-surface)',
                            borderRadius: 6,
                            border: '1px solid var(--register-border)',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: barsReady ? `${fillPct}%` : '0%',
                            background: highRoi
                              ? 'linear-gradient(90deg, rgba(5,150,105,0.28), rgba(5,150,105,0.18))'
                              : 'linear-gradient(90deg, rgba(30,64,175,0.22), rgba(30,64,175,0.12))',
                            borderRadius: 6,
                            transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)',
                            transitionDelay: `${60 * i}ms`,
                          }}
                        />
                        <span
                          style={{
                            position: 'relative',
                            zIndex: 1,
                            padding: '0 12px',
                            fontSize: '0.95rem',
                            fontWeight: 800,
                            fontVariantNumeric: 'tabular-nums',
                            color: highRoi ? 'var(--register-success)' : 'var(--register-text)',
                          }}
                        >
                          {s.roi.toFixed(1)}×
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 6: AI Insight ──────────────────────────────── */}
      <AIInsightCard label="Coaching Insight">
        <strong>Casey Miller</strong> is 31% below quota but carries the highest deal-size
        potential (Sleep System Bundles). Consider pairing her with{' '}
        <strong>Sarah Lin</strong> on 3 bundle opportunities this week — projected uplift{' '}
        <strong>+$4,200 revenue</strong>, closes Casey&rsquo;s gap by ~40%. Adjustable Base SPIFF at
        4.1× ROI is the best lever you have right now.
      </AIInsightCard>
    </RegisterPage>
  );
}
