'use client';

import { useState, useEffect, useRef } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { DollarSign, Clock, TrendingUp, CheckCircle, Zap } from 'lucide-react';

const ACCENT = '#10B981';

/* ── Mock transaction feed ──────────────────────────────── */

const RECENT_TRANSACTIONS = [
  { time: '2:47 PM', item: 'CloudRest Hybrid Queen + Protector', revenue: 2648, commission: 132.40 },
  { time: '1:22 PM', item: 'ErgoMotion Adj Base Pro', revenue: 1999, commission: 99.95 },
  { time: '12:05 PM', item: 'Harmony Memory Foam King + Sheets + Pillows', revenue: 3097, commission: 154.85 },
  { time: '11:38 AM', item: 'DreamLift Firm Queen', revenue: 1499, commission: 74.95 },
  { time: '10:15 AM', item: 'Essential Comfort Queen + Protector', revenue: 1148, commission: 57.40 },
  { time: '9:52 AM', item: 'Sleep System Bundle (King Hybrid + Base)', revenue: 4998, commission: 324.87 },
  { time: 'Yesterday 4:30 PM', item: 'Premium Pillow Set (x4)', revenue: 396, commission: 19.80 },
  { time: 'Yesterday 3:15 PM', item: 'CloudRest Hybrid King + Base + Protector', revenue: 5147, commission: 334.56 },
  { time: 'Yesterday 1:40 PM', item: 'Platform Bed Frame + Sheet Set', revenue: 498, commission: 24.90 },
  { time: 'Yesterday 11:20 AM', item: 'Harmony Memory Foam Queen', revenue: 2299, commission: 114.95 },
];

/* ── Statement component breakdown ──────────────────────── */

const STATEMENT_COMPONENTS = [
  { label: 'Base Comm.', amount: 2880.00, color: '#1E3A5F' },
  { label: 'Product Premium', amount: 450.00, color: '#06B6D4' },
  { label: 'SPIFF', amount: 375.00, color: '#8B5CF6' },
  { label: 'Bundle Bonus', amount: 225.00, color: '#F59E0B' },
  { label: 'Outlet Comm.', amount: 317.50, color: '#10B981' },
];

const STATEMENT_TOTAL = 4247.50;

/* ── Live delta component breakdown ─────────────────────── */

const DELTA_COMPONENTS = [
  { label: 'Base Comm.', amount: 1120, target: 1800, color: '#1E3A5F' },
  { label: 'Product Premium', amount: 350, target: 500, color: '#06B6D4' },
  { label: 'SPIFF', amount: 225, target: 400, color: '#8B5CF6' },
  { label: 'Bundle Bonus', amount: 152, target: 300, color: '#F59E0B' },
];

/* ── Page ──────────────────────────────────────────────────── */

export default function StatementsPage() {
  const [liveEarnings, setLiveEarnings] = useState(1847.00);
  const [txCount, setTxCount] = useState(47);
  const [visibleTx, setVisibleTx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animate the live earnings counter
  useEffect(() => {
    setMounted(true);
    intervalRef.current = setInterval(() => {
      setLiveEarnings(prev => {
        const increment = 2.5 + Math.random() * 8.5;
        return Math.min(prev + increment, 2400);
      });
      setTxCount(prev => {
        if (Math.random() > 0.6) return prev + 1;
        return prev;
      });
    }, 2500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Stagger transaction visibility
  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setVisibleTx(prev => Math.min(prev + 1, RECENT_TRANSACTIONS.length));
    }, 150);
    return () => clearInterval(timer);
  }, [mounted]);

  const projectedTotal = STATEMENT_TOTAL + liveEarnings;

  return (
    <RegisterPage title="Statement + Live Delta" subtitle="Sarah Johnson — Flagship #12" accentColor={ACCENT}>

      {/* ── Last Varicent Statement ─────────────────────────── */}
      <div className="register-section" style={{ overflow: 'hidden', padding: 0 }}>
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '28px 32px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="register-meta-label" style={{ color: '#94A3B8', marginBottom: 4 }}>
                Last Varicent Statement
              </p>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#E2E8F0', margin: 0 }}>
                Period Ending Feb 28, 2026
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 14px',
                borderRadius: 20,
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.3)',
              }}
            >
              <CheckCircle size={12} color={ACCENT} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: ACCENT }}>Published</span>
            </div>
          </div>
        </div>

        {/* Statement body */}
        <div style={{ padding: '24px 32px' }}>
          {/* Component rows */}
          <div style={{ marginBottom: 20 }}>
            {STATEMENT_COMPONENTS.map((comp, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: i < STATEMENT_COMPONENTS.length - 1 ? '1px solid var(--register-border)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: comp.color }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--register-text)' }}>{comp.label}</span>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)' }}>
                  ${comp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderRadius: 12,
              background: 'rgba(30,58,95,0.12)',
              border: '1px solid rgba(30,58,95,0.3)',
            }}
          >
            <span className="register-meta-label" style={{ color: 'var(--register-text)', fontSize: '0.85rem', fontWeight: 800 }}>
              Total Payout
            </span>
            <span className="register-kpi-value" style={{ fontSize: '1.4rem', color: '#1E3A5F' }}>
              $4,247.50
            </span>
          </div>

          {/* Varicent watermark */}
          <p style={{ fontSize: '0.65rem', color: 'var(--register-text-dim)', marginTop: 12, textAlign: 'right', fontStyle: 'italic' }}>
            Processed by Varicent ICM -- Batch #VRC-20260228-0047
          </p>
        </div>
      </div>

      {/* ── Since Last Statement (Live Delta) ───────────────── */}
      <div
        className="register-section"
        style={{
          overflow: 'hidden',
          padding: 0,
          borderLeftWidth: 4,
          borderLeftColor: ACCENT,
          position: 'relative',
        }}
      >
        {/* Subtle animated gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${ACCENT}, #06B6D4, ${ACCENT})`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        />

        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Zap size={16} color={ACCENT} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: ACCENT }}>
                  Since Last Statement
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', margin: 0 }}>
                Earnings accumulating since Mar 1 -- <strong style={{ color: 'var(--register-text)' }}>{txCount} transactions</strong> since last sync
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: ACCENT,
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: ACCENT }}>LIVE</span>
            </div>
          </div>

          {/* Big animated counter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              marginBottom: 24,
            }}
          >
            <span
              className="register-kpi-value"
              style={{
                fontSize: '2.8rem',
                fontWeight: 900,
                color: ACCENT,
                lineHeight: 1,
                transition: 'all 0.3s ease',
              }}
            >
              ${liveEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <TrendingUp size={20} color={ACCENT} style={{ marginBottom: 4 }} />
          </div>

          {/* Component mini-bars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {DELTA_COMPONENTS.map((comp, i) => {
              const pct = Math.min((comp.amount / comp.target) * 100, 100);
              return (
                <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--register-bg-surface)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>{comp.label}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)' }}>
                      ${comp.amount}
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--register-bg)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 3,
                        background: comp.color,
                        width: mounted ? `${pct}%` : '0%',
                        transition: 'width 1.5s cubic-bezier(0.4,0,0.2,1)',
                        transitionDelay: `${i * 200}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delta bar: Last Statement vs Projected */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(6,182,212,0.06) 100%)',
              border: '1px solid rgba(16,185,129,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>Last Statement</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>Projected Current</span>
            </div>
            <div style={{ position: 'relative', height: 32, borderRadius: 8, overflow: 'hidden', background: 'var(--register-bg-surface)' }}>
              {/* Last statement portion */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: mounted ? `${(STATEMENT_TOTAL / (STATEMENT_TOTAL + 2400)) * 100}%` : '0%',
                  background: '#1E3A5F',
                  borderRadius: '8px 0 0 8px',
                  transition: 'width 1s ease-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>$4,247</span>
              </div>
              {/* Delta portion */}
              <div
                style={{
                  position: 'absolute',
                  left: mounted ? `${(STATEMENT_TOTAL / (STATEMENT_TOTAL + 2400)) * 100}%` : '0%',
                  top: 0,
                  bottom: 0,
                  width: mounted ? `${(liveEarnings / (STATEMENT_TOTAL + 2400)) * 100}%` : '0%',
                  background: `linear-gradient(90deg, ${ACCENT}, #06B6D4)`,
                  transition: 'all 1.2s ease-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'white' }}>
                  +${liveEarnings.toFixed(0)}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#1E3A5F' }}>$4,247.50</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: ACCENT }}>
                ${projectedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Transaction Feed ─────────────────────────── */}
      <div className="register-section" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '20px 28px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock size={16} color="var(--register-text-muted)" />
          <span className="register-section-header" style={{ marginBottom: 0 }}>Recent Transactions</span>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--register-text-muted)',
              marginLeft: 'auto',
              background: 'var(--register-bg-surface)',
              padding: '3px 10px',
              borderRadius: 12,
            }}
          >
            Last 48 hours
          </span>
        </div>

        <div style={{ maxHeight: 380, overflowY: 'auto', padding: '0 28px 20px' }}>
          {RECENT_TRANSACTIONS.map((tx, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: i < RECENT_TRANSACTIONS.length - 1 ? '1px solid var(--register-border)' : 'none',
                opacity: i < visibleTx ? 1 : 0,
                transform: i < visibleTx ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
            >
              <div style={{ flex: '0 0 auto', marginRight: 14 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: i < 6 ? 'rgba(16,185,129,0.1)' : 'rgba(6,182,212,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DollarSign size={14} color={i < 6 ? ACCENT : '#06B6D4'} />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tx.item}
                </p>
                <p style={{ fontSize: '0.68rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>{tx.time}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)', margin: 0 }}>
                  ${tx.revenue.toLocaleString()}
                </p>
                <p style={{ fontSize: '0.68rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: ACCENT, margin: '2px 0 0' }}>
                  +${tx.commission.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Insight ──────────────────────────────────────── */}
      <AIInsightCard>
        March pace is 18% ahead of February. Projected month-end statement: <strong>$6,840</strong> -- would be Sarah&apos;s best month in Q1. Bundle attach rate up 23% since Adj Base SPIFF went live.
      </AIInsightCard>

      {/* ── Keyframe Animations ─────────────────────────────── */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </RegisterPage>
  );
}
