'use client';

import { useState, useEffect, useRef } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { TrendingUp, DollarSign, Target } from 'lucide-react';

const ACCENT = '#10B981';

/* ── Animated count-up hook ─────────────────────────────── */

function useCountUp(target: number, duration = 1800, decimals = 0) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;
    const step = (ts: number) => {
      if (!startTime.current) startTime.current = ts;
      const progress = Math.min((ts - startTime.current) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, decimals]);

  return value;
}

/* ── SVG Radial Gauge ────────────────────────────────────── */

function RadialGauge({ pct, size = 110, stroke = 10 }: { pct: number; size?: number; stroke?: number }) {
  const [animPct, setAnimPct] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - animPct / 100);
  const color = pct > 90 ? '#EF4444' : pct > 75 ? '#F59E0B' : '#10B981';

  useEffect(() => {
    const timer = setTimeout(() => setAnimPct(pct), 100);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background ring */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
      />
      {/* Animated arc */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.33,1,0.68,1), stroke 0.3s' }}
      />
      {/* Glow */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={stroke + 4}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        opacity={0.15}
        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.33,1,0.68,1)' }}
      />
    </svg>
  );
}

/* ── Format data ─────────────────────────────────────────── */

const FORMAT_ROWS = [
  { format: 'Flagship', reps: 45, revenue: 2100000, compSpend: 63000, compPct: 3.0, variance: 4200, color: '#1E3A5F' },
  { format: 'Standard', reps: 89, revenue: 3400000, compSpend: 51000, compPct: 1.5, variance: -2100, color: '#06B6D4' },
  { format: 'Outlet', reps: 34, revenue: 890000, compSpend: 17800, compPct: 2.0, variance: 0, color: '#8B5CF6' },
  { format: 'Shop-in-Shop', reps: 12, revenue: 340000, compSpend: 11000, compPct: 3.2, variance: 1800, color: '#10B981' },
];

/* ── Sankey Flow Data ────────────────────────────────────── */

const SANKEY_LEFT = [
  { label: 'Flagship', value: '$2.1M', color: '#1E3A5F', pct: 31 },
  { label: 'Standard', value: '$3.4M', color: '#06B6D4', pct: 50 },
  { label: 'Outlet', value: '$890K', color: '#8B5CF6', pct: 13 },
  { label: 'SiS', value: '$340K', color: '#10B981', pct: 6 },
];

const SANKEY_MID = [
  { label: 'Base Commission', value: '$64K', color: '#3B82F6', pct: 45 },
  { label: 'SPIFFs', value: '$29K', color: '#F59E0B', pct: 20 },
  { label: 'Bonuses', value: '$31K', color: '#10B981', pct: 22 },
  { label: 'Product Prem.', value: '$19K', color: '#8B5CF6', pct: 13 },
];

const SANKEY_RIGHT = [
  { label: 'Rep Payouts', value: '$97K', color: '#10B981', pct: 68 },
  { label: 'Mgr Overrides', value: '$31K', color: '#06B6D4', pct: 22 },
  { label: 'Holdbacks', value: '$15K', color: '#94A3B8', pct: 10 },
];

function SankeyColumn({ items, side }: { items: typeof SANKEY_LEFT; side: 'left' | 'mid' | 'right' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            flex: item.pct,
            background: `linear-gradient(135deg, ${item.color}30, ${item.color}18)`,
            borderLeft: side === 'left' ? `3px solid ${item.color}` : undefined,
            borderRight: side === 'right' ? `3px solid ${item.color}` : undefined,
            border: side === 'mid' ? `1px solid ${item.color}40` : undefined,
            borderRadius: 8,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 36,
          }}
        >
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--register-text)' }}>{item.label}</span>
          {'value' in item && (
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: item.color, fontVariantNumeric: 'tabular-nums' }}>
              {(item as typeof SANKEY_LEFT[0]).value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function SankeyConnectors() {
  return (
    <div style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <svg width="32" height="200" viewBox="0 0 32 200" style={{ overflow: 'visible' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M 0 ${20 + i * 42} C 16 ${20 + i * 42}, 16 ${30 + ((i * 37) % 160)}, 32 ${30 + ((i * 37) % 160)}`}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function ExecutiveViewPage() {
  const compSpend = useCountUp(142800, 2000);
  const compRatio = useCountUp(2.3, 1600, 1);
  const budgetPct = useCountUp(68, 1400);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <RegisterPage title="Comp Spend Command Center" subtitle="Real-time budget, payout, and flow intelligence" accentColor={ACCENT}>
      {/* ── Top Metric Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginBottom: 28 }}>
        {/* Total Comp Spend MTD */}
        <div
          className="register-card"
          style={{
            background: 'linear-gradient(135deg, var(--register-bg-elevated), rgba(30,58,95,0.15))',
            padding: '24px 28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 14, right: 16, opacity: 0.15 }}>
            <DollarSign size={48} color="#1E3A5F" />
          </div>
          <p className="register-meta-label">
            Total Comp Spend MTD
          </p>
          <p className="register-kpi-value" style={{ color: 'var(--register-text)' }}>
            ${compSpend.toLocaleString()}
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--register-text-dim)', marginTop: 4 }}>
            of $210,000 monthly budget
          </p>
        </div>

        {/* Budget Utilization — Radial Gauge */}
        <div
          className="register-card"
          style={{
            background: 'linear-gradient(135deg, var(--register-bg-elevated), rgba(16,185,129,0.06))',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <RadialGauge pct={68} />
          <div>
            <p className="register-meta-label">
              Budget Utilization
            </p>
            <p className="register-kpi-value" style={{ color: '#10B981' }}>
              {budgetPct}%
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--register-text-dim)', marginTop: 4 }}>
              Day 13 of 31 — on pace
            </p>
          </div>
        </div>

        {/* Comp-to-Revenue Ratio */}
        <div
          className="register-card"
          style={{
            background: 'linear-gradient(135deg, var(--register-bg-elevated), rgba(245,158,11,0.06))',
            padding: '24px 28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 14, right: 16, opacity: 0.15 }}>
            <Target size={48} color="#F59E0B" />
          </div>
          <p className="register-meta-label">
            Comp-to-Revenue Ratio
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <p className="register-kpi-value" style={{ color: '#F59E0B' }}>
              {compRatio}%
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <TrendingUp size={14} color="#F59E0B" />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#F59E0B' }}>+0.2%</span>
            </div>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--register-text-dim)', marginTop: 4 }}>
            Target: 2.1% — slightly over
          </p>
        </div>
      </div>

      {/* ── Budget Burn Bar ──────────────────────────── */}
      <div
        className="register-section"
        style={{
          padding: '24px 28px',
          marginBottom: 28,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>Budget Burn Rate</h2>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--register-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            March 2026
          </span>
        </div>

        {/* Labels row */}
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)' }}>$0</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)' }}>$210,000</span>
        </div>

        {/* Bar track */}
        <div style={{ position: 'relative', height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.04)', overflow: 'visible' }}>
          {/* Actual spend fill */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: mounted ? '68%' : '0%',
              borderRadius: 16,
              background: 'linear-gradient(90deg, #10B981, #06B6D4)',
              transition: 'width 1.5s cubic-bezier(0.33,1,0.68,1)',
              boxShadow: '0 0 20px rgba(16,185,129,0.3)',
            }}
          />
          {/* Projected marker */}
          <div
            style={{
              position: 'absolute',
              top: -6,
              left: '94.3%', // $198K / $210K
              width: 2,
              height: 44,
              background: 'transparent',
              borderLeft: '2px dashed #F59E0B',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.8s 1.2s',
            }}
          />
          {/* Projected label */}
          <div
            style={{
              position: 'absolute',
              top: -24,
              left: '94.3%',
              transform: 'translateX(-50%)',
              fontSize: '0.6rem',
              fontWeight: 700,
              color: '#F59E0B',
              whiteSpace: 'nowrap',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.8s 1.5s',
            }}
          >
            Projected: $198K
          </div>
          {/* Actual label on bar */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: mounted ? '34%' : '0%',
              transform: 'translateY(-50%)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'white',
              transition: 'left 1.5s cubic-bezier(0.33,1,0.68,1)',
            }}
          >
            $142.8K spent
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 16, textAlign: 'center' }}>
          On pace to finish at <strong style={{ color: '#F59E0B' }}>$198K</strong> of $210K budget — <strong style={{ color: '#10B981' }}>$12K under budget</strong>
        </p>
      </div>

      {/* ── Format Breakdown Table ───────────────────── */}
      <div
        className="register-section"
        style={{
          padding: '24px 28px',
          marginBottom: 28,
          overflowX: 'auto',
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: '0 0 16px' }}>Format Breakdown</h2>

        <div className="overflow-x-auto -mx-1">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--register-border)' }}>
              {['Format', 'Reps', 'Revenue', 'Comp Spend', 'Comp %', 'Variance'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: h === 'Format' ? 'left' : 'right',
                    padding: '10px 14px',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--register-text-muted)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FORMAT_ROWS.map((row) => {
              const varColor = row.variance > 0 ? '#EF4444' : row.variance < 0 ? '#10B981' : 'var(--register-text-muted)';
              const varLabel = row.variance > 0
                ? `+$${(row.variance / 1000).toFixed(1)}K over`
                : row.variance < 0
                  ? `-$${(Math.abs(row.variance) / 1000).toFixed(1)}K under`
                  : 'On target';
              const isOver = row.variance > 1000;
              return (
                <tr
                  key={row.format}
                  style={{
                    borderBottom: '1px solid var(--register-border)',
                    background: isOver ? 'rgba(239,68,68,0.04)' : 'transparent',
                    transition: 'background 0.3s',
                  }}
                >
                  <td style={{ padding: '12px 14px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: row.color, flexShrink: 0, boxShadow: isOver ? `0 0 8px ${row.color}80` : 'none' }} />
                      <span style={{ fontWeight: 600, color: 'var(--register-text)' }}>{row.format}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)' }}>{row.reps}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)' }}>${(row.revenue / 1000000).toFixed(1)}M</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'var(--register-text)' }}>${(row.compSpend / 1000).toFixed(0)}K</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--register-text-muted)' }}>{row.compPct.toFixed(1)}%</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600, color: varColor }}>
                    {varLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* ── Sankey-style Flow ────────────────────────── */}
      <div
        className="register-section"
        style={{
          padding: '24px 28px',
          marginBottom: 28,
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: '0 0 6px' }}>
          Compensation Flow
        </h2>
        <p style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', marginBottom: 20 }}>
          Revenue Sources &rarr; Comp Pools &rarr; Payout Types
        </p>

        {/* Column headers */}
        <div className="flex items-center" style={{ marginBottom: 10, gap: 32 }}>
          {['Revenue Sources', 'Comp Pools', 'Payout Types'].map((label) => (
            <div key={label} style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--register-text-dim)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Sankey columns */}
        <div className="flex items-stretch" style={{ minHeight: 220, gap: 0 }}>
          <SankeyColumn items={SANKEY_LEFT} side="left" />
          <SankeyConnectors />
          <SankeyColumn items={SANKEY_MID} side="mid" />
          <SankeyConnectors />
          <SankeyColumn items={SANKEY_RIGHT} side="right" />
        </div>
      </div>

      {/* ── AI Insight ───────────────────────────────── */}
      <AIInsightCard label="AI Budget Intelligence">
        Comp spend tracking 2.1% above Q1 budget. Primary driver: Flagship overpayment on Platinum tier — 8 reps hit accelerator thresholds early after strong Presidents Day performance. Recommend raising Flagship targets by 8% for Q2 to realign budget with revenue trajectory.
      </AIInsightCard>
    </RegisterPage>
  );
}
