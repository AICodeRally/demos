'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { useIcm } from '@/components/demos/register/IcmContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  DollarSign,
  Calendar,
  CheckCircle2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  FileText,
  Printer,
  AlertCircle,
  Link2,
  Tag,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  STATEMENTS,
  REP_DEALS_CASEY,
  DISPUTES,
} from '@/data/register/comp-data';
import type { MonthlyStatement, RepDeal } from '@/data/register/comp-data';

/* ── Count-up hook (local copy) ─────────────────────────────── */

function useCountUp(target: number, duration = 1200, decimals = 0) {
  const [value, setValue] = useState(0);
  const [mounted, setMounted] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

/* ── Helpers ────────────────────────────────────────────────── */

function fmtMoney(n: number, decimals = 2) {
  return (
    '$' +
    n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}

// Use REGISTER chart token palette (resolved against ThemeProvider vars)
const CHART_VARS = [
  'var(--register-chart-1)',
  'var(--register-chart-2)',
  'var(--register-chart-3)',
  'var(--register-chart-4)',
  'var(--register-chart-5)',
  'var(--register-chart-6)',
  'var(--register-chart-7)',
  'var(--register-chart-8)',
];

type SortKey = 'dateISO' | 'basis' | 'totalCommission';
type SortDir = 'asc' | 'desc';

/* ── Fade-up wrapper (staggered) ────────────────────────────── */

function FadeUp({
  delay,
  mounted,
  children,
  style,
}: {
  delay: number;
  mounted: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 520ms cubic-bezier(0.4,0,0.2,1), transform 520ms cubic-bezier(0.4,0,0.2,1)',
        transitionDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function StatementsPage() {
  const { provider: icm } = useIcm();
  const [mounted, setMounted] = useState(false);
  const [periodIdx, setPeriodIdx] = useState(0); // 0 = March 1-15 (default), 1 = Feb 16-28
  const [sortKey, setSortKey] = useState<SortKey>('dateISO');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedDeal, setSelectedDeal] = useState<RepDeal | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statement: MonthlyStatement = STATEMENTS[periodIdx];

  // YTD = sum of all statements for this rep (two periods here)
  const ytd = useMemo(
    () =>
      STATEMENTS.filter((s) => s.repId === statement.repId).reduce(
        (a, b) => a + b.netPayout,
        0,
      ),
    [statement.repId],
  );

  // Deals filtered to selected period. REP_DEALS_CASEY is all March 1-15.
  const periodDeals = useMemo(() => {
    return REP_DEALS_CASEY.filter((d) => {
      // period = '2026-03' matches March deals, '2026-02' matches none (sandbox)
      return d.dateISO.startsWith(statement.period);
    });
  }, [statement.period]);

  const dealsCount = periodDeals.length;

  // Attach rate — pull from plan-applied value in the lineItem description,
  // falling back to computed from deals.
  const attachRatePct = useMemo(() => {
    const acc = statement.lineItems.find((li) =>
      li.category.toLowerCase().includes('attach'),
    );
    if (acc) {
      const m = acc.description.match(/(\d+)\s*%/);
      if (m) return parseInt(m[1], 10);
    }
    if (periodDeals.length === 0) return 0;
    const attached = periodDeals.filter((d) => d.protectorAttached).length;
    return Math.round((attached / periodDeals.length) * 100);
  }, [statement, periodDeals]);

  /* ── Net payout count-up ─────────────────────────────────── */
  const payoutCount = useCountUp(statement.netPayout, 1400, 2);

  /* ── Earnings composition chart data ─────────────────────── */
  const nonZeroLineItems = useMemo(
    () => statement.lineItems.filter((li) => li.amount > 0),
    [statement.lineItems],
  );

  const totalLineItems = useMemo(
    () => nonZeroLineItems.reduce((a, b) => a + b.amount, 0),
    [nonZeroLineItems],
  );

  // Single-row object for stacked horizontal BarChart — one dataKey per category
  const stackedRow = useMemo(() => {
    const row: Record<string, string | number> = { name: 'Earnings' };
    nonZeroLineItems.forEach((li) => {
      row[li.category] = li.amount;
    });
    return [row];
  }, [nonZeroLineItems]);

  const legendSorted = useMemo(
    () =>
      [...nonZeroLineItems]
        .map((li, idx) => ({
          ...li,
          color: CHART_VARS[idx % CHART_VARS.length],
          share: totalLineItems > 0 ? (li.amount / totalLineItems) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount),
    [nonZeroLineItems, totalLineItems],
  );

  const colorByCategory = useMemo(() => {
    const m: Record<string, string> = {};
    nonZeroLineItems.forEach((li, idx) => {
      m[li.category] = CHART_VARS[idx % CHART_VARS.length];
    });
    return m;
  }, [nonZeroLineItems]);

  /* ── Rule attribution rows (derive units from description) ── */
  const ruleRows = useMemo(
    () =>
      statement.lineItems.map((li) => {
        const unitsMatch = li.description.match(/(\d+)\s*units?/);
        const units = unitsMatch ? parseInt(unitsMatch[1], 10) : null;
        return {
          rule: li.category,
          plan: statement.planName,
          units,
          amount: li.amount,
          description: li.description,
        };
      }),
    [statement],
  );

  /* ── Sorted deals table ──────────────────────────────────── */
  const sortedDeals = useMemo(() => {
    const arr = [...periodDeals];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const as = String(av);
      const bs = String(bv);
      return sortDir === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as);
    });
    return arr;
  }, [periodDeals, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  /* ── Drill panel — Escape closes, body scroll lock ───────── */
  useEffect(() => {
    if (!selectedDeal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedDeal(null);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedDeal]);

  const closePanel = useCallback(() => setSelectedDeal(null), []);

  /* ── Open disputes for this rep ──────────────────────────── */
  const openDisputes = DISPUTES.filter(
    (d) => d.status === 'submitted' || d.status === 'under_review',
  ).length;

  /* ── UI ──────────────────────────────────────────────────── */

  return (
    <RegisterPage
      title="Rep Comp Statement"
      subtitle="Casey Miller — Galleria Flagship #12"
      accentColor="var(--register-primary)"
    >
      {/* ── Section 1: Header strip ───────────────────────── */}
      <FadeUp delay={0} mounted={mounted}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            background: 'var(--register-bg)',
            paddingTop: 4,
            paddingBottom: 8,
            marginBottom: 20,
          }}
        >
          <div
            className="register-card"
            style={{
              padding: '22px 24px',
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 1.2fr) minmax(240px, 1fr) 1fr 1fr 1fr',
              gap: 18,
              alignItems: 'center',
            }}
          >
            {/* Rep identity */}
            <div>
              <p
                className="register-meta-label"
                style={{ margin: 0, fontSize: '0.82rem' }}
              >
                Rep
              </p>
              <p
                style={{
                  margin: '4px 0 2px',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--register-text)',
                }}
              >
                Casey Miller · Floor Associate
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  color: 'var(--register-text-muted)',
                }}
              >
                Galleria Flagship #12
              </p>
              <div
                style={{
                  marginTop: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: 'var(--register-bg-surface)',
                  border: '1px solid var(--register-border)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--register-text-dim)',
                }}
                title={`Source: ${icm.name} ICM`}
              >
                <Info size={12} aria-hidden="true" />
                Pulled from {icm.name} 2026-03-15 6:00 AM · next sync in 6h
              </div>
            </div>

            {/* Period selector */}
            <div>
              <p
                className="register-meta-label"
                style={{ margin: 0, fontSize: '0.82rem' }}
              >
                Pay period
              </p>
              <div
                role="tablist"
                aria-label="Pay period"
                style={{
                  marginTop: 6,
                  display: 'inline-flex',
                  padding: 4,
                  borderRadius: 10,
                  background: 'var(--register-bg-surface)',
                  border: '1px solid var(--register-border)',
                }}
              >
                {STATEMENTS.map((s, i) => {
                  const active = i === periodIdx;
                  return (
                    <button
                      key={s.period}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setPeriodIdx(i)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 14px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        borderRadius: 8,
                        border: 'none',
                        cursor: 'pointer',
                        background: active
                          ? 'var(--register-bg-elevated)'
                          : 'transparent',
                        color: active
                          ? 'var(--register-text)'
                          : 'var(--register-text-muted)',
                        boxShadow: active
                          ? '0 1px 3px rgba(15,23,42,0.08)'
                          : 'none',
                        transition: 'all 160ms ease',
                      }}
                    >
                      <Calendar size={13} aria-hidden="true" />
                      {s.periodLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Net payout */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                background: 'var(--register-bg-surface)',
                border: '1px solid var(--register-border)',
              }}
            >
              <p
                className="register-meta-label"
                style={{ margin: 0, fontSize: '0.82rem' }}
              >
                Net payout
              </p>
              <p
                className="register-kpi-value"
                style={{
                  fontSize: '2rem',
                  color: 'var(--register-primary)',
                  margin: '4px 0 2px',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1.05,
                }}
              >
                {fmtMoney(payoutCount, 2)}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.82rem',
                  color: 'var(--register-text-dim)',
                }}
              >
                2026-03-15 · Paid via ADP
              </p>
            </div>

            {/* YTD */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                background: 'var(--register-bg-surface)',
                border: '1px solid var(--register-border)',
              }}
            >
              <p
                className="register-meta-label"
                style={{ margin: 0, fontSize: '0.82rem' }}
              >
                YTD Earnings
              </p>
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--register-text)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {fmtMoney(ytd, 2)}
              </p>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: '0.82rem',
                  color: 'var(--register-text-dim)',
                }}
              >
                2 periods · FY26
              </p>
            </div>

            {/* MTD deals + attach rate (stacked in two mini-tiles) */}
            <div style={{ display: 'grid', gap: 8 }}>
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: 'var(--register-bg-surface)',
                  border: '1px solid var(--register-border)',
                }}
              >
                <p
                  className="register-meta-label"
                  style={{ margin: 0, fontSize: '0.82rem' }}
                >
                  Deals (period)
                </p>
                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--register-text)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {dealsCount === 0 ? '—' : dealsCount}
                </p>
              </div>
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: 'var(--register-bg-surface)',
                  border: '1px solid var(--register-border)',
                }}
              >
                <p
                  className="register-meta-label"
                  style={{ margin: 0, fontSize: '0.82rem' }}
                >
                  Attach rate
                </p>
                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--register-text)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {attachRatePct}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── Section 2: Earnings composition ───────────────── */}
      <FadeUp delay={80} mounted={mounted}>
        <div className="register-section" style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <span className="register-section-header" style={{ marginBottom: 0 }}>
              Earnings Composition
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--register-text-muted)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmtMoney(totalLineItems, 2)} across {nonZeroLineItems.length} categories
            </span>
          </div>

          {/* Horizontal stacked bar */}
          <div style={{ width: '100%', height: 72 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stackedRow}
                layout="vertical"
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <XAxis type="number" hide domain={[0, totalLineItems]} />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip
                  formatter={(v) =>
                    fmtMoney(typeof v === 'number' ? v : Number(v) || 0, 2)
                  }
                  cursor={{ fill: 'transparent' }}
                />
                {nonZeroLineItems.map((li) => (
                  <Bar
                    key={li.category}
                    dataKey={li.category}
                    stackId="a"
                    fill={colorByCategory[li.category]}
                    radius={0}
                    onMouseEnter={() => setHoveredCategory(li.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    opacity={
                      hoveredCategory && hoveredCategory !== li.category
                        ? 0.45
                        : 1
                    }
                    style={{ transition: 'opacity 160ms ease' }}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
              marginTop: 16,
            }}
          >
            {legendSorted.map((li) => {
              const dim =
                hoveredCategory && hoveredCategory !== li.category ? 0.5 : 1;
              return (
                <div
                  key={li.category}
                  onMouseEnter={() => setHoveredCategory(li.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'var(--register-bg-surface)',
                    border: '1px solid var(--register-border)',
                    opacity: dim,
                    transition: 'opacity 160ms ease',
                    cursor: 'default',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: li.color,
                      flex: '0 0 auto',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--register-text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {li.category}
                    </p>
                    <p
                      style={{
                        margin: '2px 0 0',
                        fontSize: '0.82rem',
                        color: 'var(--register-text-muted)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {fmtMoney(li.amount, 2)} · {li.share.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FadeUp>

      {/* ── Section 3: Rule Attribution ───────────────────── */}
      <FadeUp delay={160} mounted={mounted}>
        <div className="register-section" style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <span className="register-section-header" style={{ marginBottom: 0 }}>
              Rule Attribution
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--register-text-muted)',
              }}
            >
              <Tag size={12} aria-hidden="true" />
              How each dollar was earned
            </span>
          </div>

          <div
            style={{
              overflowX: 'auto',
              borderRadius: 10,
              border: '1px solid var(--register-border)',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
              }}
            >
              <thead>
                <tr
                  style={{
                    background: 'var(--register-bg-surface)',
                    textAlign: 'left',
                  }}
                >
                  <th
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--register-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Rule
                  </th>
                  <th
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--register-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Plan
                  </th>
                  <th
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--register-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      textAlign: 'right',
                    }}
                  >
                    Applied (units)
                  </th>
                  <th
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--register-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      textAlign: 'right',
                    }}
                  >
                    Earnings
                  </th>
                </tr>
              </thead>
              <tbody>
                {ruleRows.map((r, i) => {
                  const isDimmed =
                    hoveredCategory && hoveredCategory !== r.rule;
                  return (
                    <tr
                      key={r.rule}
                      onMouseEnter={() => setHoveredCategory(r.rule)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      style={{
                        borderTop:
                          i === 0
                            ? 'none'
                            : '1px solid var(--register-border)',
                        opacity: isDimmed ? 0.5 : 1,
                        background:
                          hoveredCategory === r.rule
                            ? 'var(--register-bg-surface)'
                            : 'transparent',
                        transition:
                          'opacity 160ms ease, background 160ms ease',
                      }}
                    >
                      <td
                        style={{
                          padding: '12px 14px',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: 'var(--register-text)',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 3,
                              background:
                                colorByCategory[r.rule] ??
                                'var(--register-chart-8)',
                            }}
                          />
                          {r.rule}
                        </span>
                        <div
                          style={{
                            marginTop: 2,
                            fontSize: '0.82rem',
                            fontWeight: 400,
                            color: 'var(--register-text-dim)',
                          }}
                        >
                          {r.description}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '12px 14px',
                          fontSize: '0.9rem',
                          color: 'var(--register-text-muted)',
                        }}
                      >
                        {r.plan}
                      </td>
                      <td
                        style={{
                          padding: '12px 14px',
                          fontSize: '0.9rem',
                          color: 'var(--register-text-muted)',
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {r.units ?? '—'}
                      </td>
                      <td
                        style={{
                          padding: '12px 14px',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'var(--register-text)',
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {fmtMoney(r.amount, 2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p
            style={{
              margin: '12px 0 0',
              fontSize: '0.85rem',
              color: 'var(--register-text-dim)',
            }}
          >
            Plan: <strong style={{ color: 'var(--register-text-muted)' }}>{statement.planName}</strong> · v3.2 · pulled from {icm.name}
          </p>
        </div>
      </FadeUp>

      {/* ── Section 4: Deal drill table ───────────────────── */}
      <FadeUp delay={240} mounted={mounted}>
        <div className="register-section" style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <span className="register-section-header" style={{ marginBottom: 0 }}>
              Deal Drill
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--register-text-muted)',
              }}
            >
              {sortedDeals.length} deals · click a row to see the math
            </span>
          </div>

          {sortedDeals.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--register-text-muted)',
                fontSize: '0.9rem',
                background: 'var(--register-bg-surface)',
                border: '1px dashed var(--register-border)',
                borderRadius: 10,
              }}
            >
              No deal-level data recorded for this period in the sandbox.
            </div>
          ) : (
            <div
              style={{
                overflowX: 'auto',
                borderRadius: 10,
                border: '1px solid var(--register-border)',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem',
                }}
              >
                <thead>
                  <tr style={{ background: 'var(--register-bg-surface)', textAlign: 'left' }}>
                    <SortHeader
                      label="Date / Time"
                      k="dateISO"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onClick={toggleSort}
                    />
                    <Th>ID</Th>
                    <Th>Customer</Th>
                    <Th>Items</Th>
                    <SortHeader
                      label="Basis"
                      k="basis"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onClick={toggleSort}
                      align="right"
                    />
                    <Th align="left">Tier</Th>
                    <Th align="right">Base</Th>
                    <Th align="right">SPIFF</Th>
                    <Th align="right">Bundle</Th>
                    <Th align="right">Accel</Th>
                    <SortHeader
                      label="Total"
                      k="totalCommission"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onClick={toggleSort}
                      align="right"
                      emphasis
                    />
                  </tr>
                </thead>
                <tbody>
                  {sortedDeals.map((d, i) => (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDeal(d)}
                      className="statement-deal-row"
                      style={{
                        borderTop:
                          i === 0 ? 'none' : '1px solid var(--register-border)',
                        cursor: 'pointer',
                        transition: 'background 140ms ease',
                      }}
                    >
                      <Td>
                        <div style={{ fontWeight: 700, color: 'var(--register-text)' }}>
                          {d.dateISO}
                        </div>
                        <div
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--register-text-dim)',
                          }}
                        >
                          {d.time}
                        </div>
                      </Td>
                      <Td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: 'var(--register-bg-surface)',
                            border: '1px solid var(--register-border)',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: 'var(--register-text-muted)',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {d.id}
                        </span>
                      </Td>
                      <Td>
                        <span
                          style={{
                            fontWeight: 600,
                            color: 'var(--register-text)',
                          }}
                        >
                          {d.customer}
                        </span>
                      </Td>
                      <Td>
                        <span
                          style={{
                            display: 'inline-block',
                            maxWidth: 220,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'var(--register-text-muted)',
                          }}
                          title={d.items.join(', ')}
                        >
                          {d.items.join(', ')}
                        </span>
                      </Td>
                      <Td align="right" numeric>
                        {fmtMoney(d.basis, 0)}
                      </Td>
                      <Td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: 'var(--register-bg-surface)',
                            border: '1px solid var(--register-border)',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: 'var(--register-text-muted)',
                          }}
                        >
                          {d.tier}
                        </span>
                      </Td>
                      <Td align="right" numeric>
                        {fmtMoney(d.baseCommission, 2)}
                      </Td>
                      <Td align="right" numeric>
                        {d.spiffBonus > 0 ? fmtMoney(d.spiffBonus, 2) : '—'}
                      </Td>
                      <Td align="right" numeric>
                        {d.bundleBonus > 0 ? fmtMoney(d.bundleBonus, 2) : '—'}
                      </Td>
                      <Td align="right" numeric>
                        {d.attachAccelerator > 0
                          ? fmtMoney(d.attachAccelerator, 2)
                          : '—'}
                      </Td>
                      <Td align="right" emphasis numeric>
                        {fmtMoney(d.totalCommission, 2)}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </FadeUp>

      {/* ── Section 5: Adjustments & Disputes ─────────────── */}
      <FadeUp delay={320} mounted={mounted}>
        <div className="register-section" style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <span className="register-section-header" style={{ marginBottom: 0 }}>
              Adjustments & Disputes
            </span>
            <a
              href="/register/comp/statements/disputes"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid var(--register-border)',
                background: 'transparent',
                color: 'var(--register-primary)',
                fontSize: '0.9rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'background 140ms ease',
              }}
            >
              <AlertCircle size={14} aria-hidden="true" />
              {openDisputes} open disputes — review
              <ChevronRight size={14} aria-hidden="true" />
            </a>
          </div>

          {statement.adjustments.length === 0 ? (
            <p
              style={{
                margin: 0,
                fontSize: '0.9rem',
                color: 'var(--register-text-muted)',
              }}
            >
              No adjustments applied to this period.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: 10,
              }}
            >
              {statement.adjustments.map((adj, i) => (
                <div
                  key={`${adj.category}-${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'var(--register-bg-surface)',
                    border: '1px solid var(--register-border)',
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--register-text)',
                      }}
                    >
                      {adj.category}
                    </p>
                    <p
                      style={{
                        margin: '2px 0 0',
                        fontSize: '0.85rem',
                        color: 'var(--register-text-muted)',
                      }}
                    >
                      {adj.description}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color:
                        adj.amount >= 0
                          ? 'var(--register-success)'
                          : 'var(--register-danger)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {adj.amount >= 0 ? '+' : ''}
                    {fmtMoney(adj.amount, 2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeUp>

      {/* ── Section 6: Footer actions ─────────────────────── */}
      <FadeUp delay={400} mounted={mounted}>
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'flex-end',
            paddingBottom: 12,
          }}
        >
          <button
            type="button"
            style={secondaryButtonStyle}
            aria-label="Export statement as PDF"
          >
            <FileText size={14} aria-hidden="true" />
            Export PDF
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.print();
            }}
            style={secondaryButtonStyle}
            aria-label="Print statement"
          >
            <Printer size={14} aria-hidden="true" />
            Print statement
          </button>
        </div>
      </FadeUp>

      {/* ── Drill panel overlay ───────────────────────────── */}
      {selectedDeal && (
        <>
          {/* Overlay */}
          <div
            onClick={closePanel}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,23,42,0.45)',
              zIndex: 80,
              animation: 'statement-fade-in 200ms ease-out',
            }}
          />

          {/* Panel */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`Deal ${selectedDeal.id} detail`}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(92vw, 460px)',
              background: 'var(--register-bg-elevated)',
              borderLeft: '1px solid var(--register-border)',
              boxShadow: 'var(--register-shadow-card-hover)',
              zIndex: 90,
              display: 'flex',
              flexDirection: 'column',
              animation:
                'statement-slide-in 220ms cubic-bezier(0.4,0,0.2,1) forwards',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid var(--register-border)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <p
                  className="register-meta-label"
                  style={{ margin: 0, fontSize: '0.82rem' }}
                >
                  Deal {selectedDeal.id}
                </p>
                <p
                  style={{
                    margin: '4px 0 2px',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: 'var(--register-text)',
                  }}
                >
                  {selectedDeal.customer}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    color: 'var(--register-text-muted)',
                  }}
                >
                  {selectedDeal.dateISO} · {selectedDeal.time}
                </p>
              </div>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close deal detail"
                style={{
                  border: '1px solid var(--register-border)',
                  background: 'var(--register-bg-surface)',
                  color: 'var(--register-text-muted)',
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '18px 22px', overflowY: 'auto', flex: 1 }}>
              {/* Items */}
              <p
                className="register-meta-label"
                style={{ margin: '0 0 8px', fontSize: '0.82rem' }}
              >
                Items
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'grid',
                  gap: 6,
                }}
              >
                {selectedDeal.items.map((it, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'var(--register-bg-surface)',
                      border: '1px solid var(--register-border)',
                      fontSize: '0.9rem',
                      color: 'var(--register-text)',
                      fontWeight: 600,
                    }}
                  >
                    <DollarSign
                      size={13}
                      aria-hidden="true"
                      color="var(--register-primary)"
                    />
                    {it}
                  </li>
                ))}
              </ul>

              {/* Flags */}
              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <FlagPill
                  label="Protector attached"
                  on={selectedDeal.protectorAttached}
                />
                <FlagPill
                  label="Financing used"
                  on={selectedDeal.financingUsed}
                />
              </div>

              {/* Commission math */}
              <p
                className="register-meta-label"
                style={{ margin: '22px 0 8px', fontSize: '0.82rem' }}
              >
                Commission math
              </p>
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  background: 'var(--register-bg-surface)',
                  border: '1px solid var(--register-border)',
                }}
              >
                <MathRow
                  label={`Basis × ${(selectedDeal.tierRate * 100).toFixed(
                    2,
                  )}% (${selectedDeal.tier})`}
                  rawLabel={`${fmtMoney(selectedDeal.basis, 0)} × ${(
                    selectedDeal.tierRate * 100
                  ).toFixed(2)}%`}
                  value={selectedDeal.baseCommission}
                />
                {selectedDeal.spiffBonus > 0 && (
                  <MathRow
                    label="+ SPIFF bonus"
                    value={selectedDeal.spiffBonus}
                    op="+"
                  />
                )}
                {selectedDeal.bundleBonus > 0 && (
                  <MathRow
                    label="+ Bundle bonus"
                    value={selectedDeal.bundleBonus}
                    op="+"
                  />
                )}
                {selectedDeal.attachAccelerator > 0 && (
                  <MathRow
                    label="+ Attach accelerator"
                    value={selectedDeal.attachAccelerator}
                    op="+"
                  />
                )}
                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: '1px solid var(--register-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: 'var(--register-text)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Total
                  </span>
                  <span
                    className="register-kpi-value"
                    style={{
                      fontSize: '1.6rem',
                      color: 'var(--register-primary)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {fmtMoney(selectedDeal.totalCommission, 2)}
                  </span>
                </div>
              </div>

              {/* Footer hint + What-If link */}
              <p
                style={{
                  margin: '16px 0 12px',
                  fontSize: '0.85rem',
                  color: 'var(--register-text-dim)',
                  fontStyle: 'italic',
                }}
              >
                This calculation runs live on the rep&apos;s tablet during sales conversations.
              </p>
              <a
                href="/register/comp/calculator"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'var(--register-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <Link2 size={14} aria-hidden="true" />
                Simulate variations in What-If
                <ChevronRight size={14} aria-hidden="true" />
              </a>
            </div>
          </aside>
        </>
      )}

      <style>{`
        @keyframes statement-slide-in {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes statement-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .statement-deal-row:hover {
          background: var(--register-bg-surface) !important;
        }
        @media print {
          .register-section { break-inside: avoid; }
        }
      `}</style>
    </RegisterPage>
  );
}

/* ── Subcomponents ──────────────────────────────────────────── */

const secondaryButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 16px',
  borderRadius: 8,
  border: '1px solid var(--register-border)',
  background: 'transparent',
  color: 'var(--register-text)',
  fontSize: '0.9rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'background 140ms ease, border-color 140ms ease',
};

function Th({
  children,
  align = 'left',
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
}) {
  return (
    <th
      style={{
        padding: '10px 14px',
        fontSize: '0.82rem',
        fontWeight: 700,
        color: 'var(--register-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        textAlign: align,
      }}
    >
      {children}
    </th>
  );
}

function SortHeader({
  label,
  k,
  sortKey,
  sortDir,
  onClick,
  align = 'left',
  emphasis = false,
}: {
  label: string;
  k: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onClick: (k: SortKey) => void;
  align?: 'left' | 'right';
  emphasis?: boolean;
}) {
  const active = sortKey === k;
  return (
    <th
      scope="col"
      style={{
        padding: '10px 14px',
        fontSize: '0.82rem',
        fontWeight: 700,
        color: emphasis ? 'var(--register-text)' : 'var(--register-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        textAlign: align,
      }}
    >
      <button
        type="button"
        onClick={() => onClick(k)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontSize: 'inherit',
          fontWeight: 'inherit',
          color: 'inherit',
          letterSpacing: 'inherit',
          textTransform: 'inherit',
        }}
      >
        {label}
        {active ? (
          sortDir === 'asc' ? (
            <ArrowUp size={12} aria-hidden="true" />
          ) : (
            <ArrowDown size={12} aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown
            size={12}
            aria-hidden="true"
            style={{ opacity: 0.5 }}
          />
        )}
      </button>
    </th>
  );
}

function Td({
  children,
  align = 'left',
  emphasis = false,
  numeric = false,
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
  emphasis?: boolean;
  numeric?: boolean;
}) {
  return (
    <td
      style={{
        padding: '12px 14px',
        fontSize: emphasis ? '0.95rem' : '0.9rem',
        color: emphasis ? 'var(--register-text)' : 'var(--register-text-muted)',
        fontWeight: emphasis ? 800 : 500,
        textAlign: align,
        fontVariantNumeric: numeric ? 'tabular-nums' : 'normal',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </td>
  );
}

function FlagPill({ label, on }: { label: string; on: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: '0.82rem',
        fontWeight: 700,
        background: on
          ? 'color-mix(in srgb, var(--register-success) 14%, transparent)'
          : 'var(--register-bg-surface)',
        color: on
          ? 'var(--register-success)'
          : 'var(--register-text-dim)',
        border: `1px solid ${
          on
            ? 'color-mix(in srgb, var(--register-success) 40%, transparent)'
            : 'var(--register-border)'
        }`,
      }}
    >
      {on ? (
        <CheckCircle2 size={12} aria-hidden="true" />
      ) : (
        <X size={12} aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

function MathRow({
  label,
  rawLabel,
  value,
  op,
}: {
  label: string;
  rawLabel?: string;
  value: number;
  op?: '+' | '-';
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '6px 0',
        gap: 12,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.9rem',
            color: 'var(--register-text)',
            fontWeight: 600,
          }}
        >
          {label}
        </div>
        {rawLabel && (
          <div
            style={{
              fontSize: '0.82rem',
              color: 'var(--register-text-dim)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {rawLabel}
          </div>
        )}
      </div>
      <span
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          color:
            op === '+'
              ? 'var(--register-success)'
              : 'var(--register-text)',
          fontVariantNumeric: 'tabular-nums',
          flex: '0 0 auto',
        }}
      >
        {fmtMoney(value, 2)}
      </span>
    </div>
  );
}

