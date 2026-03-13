'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Tablet, TrendingDown, TrendingUp, Sparkles, MessageSquare, Send, Settings } from 'lucide-react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { getRepById, getScenarioByRepId } from '@/data/register/coaching-data';
import { broadcastCoaching } from '@/lib/register-broadcast';

export default function RepCoachingClient({ params }: { params: Promise<{ id: string }> }) {
  const { id: repId } = use(params);
  const rep = getRepById(repId);
  const scenario = getScenarioByRepId(repId);

  if (!rep || !scenario) {
    return (
      <RegisterPage title="Rep Coaching" accentColor="#8B5CF6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
          <p style={{ color: 'var(--register-text-dim)' }}>Rep not found</p>
        </div>
      </RegisterPage>
    );
  }

  return (
    <RegisterPage title={`Coaching — ${rep.name}`} subtitle={`${rep.role} — ${rep.store}`} accentColor="#8B5CF6">
      {/* Back nav */}
      <Link
        href="/register/ops/manager"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-ai)', textDecoration: 'none' }}
      >
        <ArrowLeft size={16} />
        Back to Manager Console
      </Link>

      {/* Rep header card */}
      <div className="register-section" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: '#FFFFFF',
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
            }}
          >
            {rep.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--register-text)', margin: 0 }}>{rep.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>
              {rep.role} &mdash; {rep.store}
            </p>
            <p style={{ fontSize: '0.65rem', color: 'var(--register-text-dim)', margin: '2px 0 0' }}>{rep.shift}</p>
          </div>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', borderRadius: 10,
              fontSize: '0.7rem', fontWeight: 600,
              background: 'rgba(245,158,11,0.1)', color: '#F59E0B',
            }}
          >
            <TrendingDown size={12} />
            {scenario.weaknessLabel}
          </span>
        </div>

        {/* Key metrics row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { label: 'Attach Rate', value: `${rep.metrics.attachRate}%`, sub: `Floor avg: ${rep.metrics.floorAvgAttach}%`, bad: rep.metrics.attachRate < rep.metrics.floorAvgAttach },
            { label: 'Financing Pitch', value: `${rep.metrics.financingPitch}%`, sub: `Floor avg: ${rep.metrics.floorAvgFinancing}%`, bad: rep.metrics.financingPitch < rep.metrics.floorAvgFinancing },
            { label: 'Avg Sale Price', value: `$${rep.metrics.asp.toLocaleString()}`, sub: `Floor avg: $${rep.metrics.floorAvgAsp.toLocaleString()}`, bad: rep.metrics.asp < rep.metrics.floorAvgAsp },
            { label: 'Shift Revenue', value: `$${rep.metrics.shiftRevenue.toLocaleString()}`, sub: '', bad: false },
          ].map((m) => (
            <div key={m.label} style={{ padding: 12, borderRadius: 10, background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)' }}>
              <p className="register-meta-label" style={{ margin: 0 }}>{m.label}</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: m.bad ? '#EF4444' : '#10B981', margin: '4px 0 0' }}>{m.value}</p>
              {m.sub && <p style={{ fontSize: '0.6rem', color: 'var(--register-text-dim)', margin: '2px 0 0' }}>{m.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Split view: What they did vs What they should do */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* What They Did */}
        <div style={{ padding: 18, borderRadius: 12, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <TrendingDown size={18} style={{ color: '#EF4444' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--register-text)' }}>What They Did</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginBottom: 10 }}>Last sale &mdash; missed opportunity</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            {scenario.lastSale.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--register-text)' }}>{item.name}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--register-text)' }}>${item.price.toLocaleString()}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(239,68,68,0.15)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700 }}>
              <span style={{ color: 'var(--register-text)' }}>Total</span>
              <span style={{ color: 'var(--register-text)' }}>${scenario.lastSale.total.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.7rem', color: 'var(--register-text-muted)' }}>
            <span>Attach: {scenario.lastSale.attachRate}%</span>
            <span>Financing: {scenario.lastSale.financingUsed ? 'Yes' : 'No'}</span>
          </div>
        </div>

        {/* What They Should Do */}
        <div style={{ padding: 18, borderRadius: 12, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <TrendingUp size={18} style={{ color: '#10B981' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--register-text)' }}>What They Should Do</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginBottom: 10 }}>{scenario.recommendation.action}</p>

          {scenario.recommendation.products.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              <p className="register-meta-label" style={{ color: '#10B981', margin: 0 }}>Recommended Add-ons</p>
              {scenario.recommendation.products.map((product, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--register-text)' }}>{product.name}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#10B981' }}>+${product.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.1)' }}>
            <Sparkles size={14} style={{ color: '#10B981' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10B981' }}>
              +${scenario.recommendation.commissionDelta} commission per sale
            </span>
          </div>
        </div>
      </div>

      {/* Coaching Script */}
      <div className="register-section" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <MessageSquare size={18} style={{ color: 'var(--register-ai)' }} />
          <span className="register-section-header" style={{ margin: 0 }}>Coaching Script</span>
        </div>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {scenario.recommendation.script.map((point, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, fontSize: '0.8rem', color: 'var(--register-text-muted)' }}>
              <span
                style={{
                  flexShrink: 0, width: 24, height: 24, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700, color: '#FFFFFF',
                  background: 'var(--register-ai)',
                }}
              >
                {i + 1}
              </span>
              <span style={{ paddingTop: 2 }}>{point}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Push Coaching to POS */}
        <div
          style={{
            padding: 20, borderRadius: 12, textAlign: 'center',
            background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)',
          }}
        >
          <Send size={28} style={{ color: '#10B981', margin: '0 auto 10px' }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--register-text)', margin: '0 0 4px' }}>Push Coaching to POS</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', margin: '0 0 14px' }}>
            Send to {rep.name.split(' ')[0]}&apos;s iPad POS terminal
          </p>
          <button
            onClick={() => {
              broadcastCoaching({
                id: `coaching-${repId}-${Date.now()}`,
                repId,
                repName: rep.name,
                message: scenario.weaknessLabel,
                action: scenario.recommendation.action,
                commissionDelta: scenario.recommendation.commissionDelta,
                timestamp: new Date().toISOString(),
              });
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Send size={14} />
            Push to Rep Tablet
          </button>
          <div style={{ marginTop: 10, padding: '6px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', display: 'inline-block' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#10B981' }}>
              +${scenario.recommendation.commissionDelta} commission impact
            </span>
          </div>
        </div>

        {/* Open POS Terminal */}
        <div
          style={{
            padding: 20, borderRadius: 12, textAlign: 'center',
            background: 'rgba(30,58,95,0.05)', border: '1px solid rgba(30,58,95,0.15)',
          }}
        >
          <Tablet size={28} style={{ color: 'var(--register-primary)', margin: '0 auto 10px' }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--register-text)', margin: '0 0 4px' }}>Practice This Scenario</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', margin: '0 0 14px' }}>
            Open POS pre-loaded with {rep.name.split(' ')[0]}&apos;s scenario
          </p>
          <button
            onClick={() => window.open('/register/ops/pos-terminal', '_blank')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #1E3A5F, #06B6D4)',
              color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Tablet size={14} />
            Open on iPad
          </button>
        </div>
      </div>

      {/* Comp Admin Link */}
      <div
        className="register-card"
        style={{ marginTop: 20, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Settings size={16} style={{ color: 'var(--register-ai)' }} />
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)', margin: 0 }}>Plan design issue?</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>Edit tiers, SPIFFs, and accelerators</p>
          </div>
        </div>
        <Link
          href="/register/comp/admin"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '6px 14px', borderRadius: 8,
            fontSize: '0.75rem', fontWeight: 600, color: '#FFFFFF',
            background: 'var(--register-ai)', textDecoration: 'none',
          }}
        >
          <Settings size={12} />
          Comp Admin
        </Link>
      </div>
    </RegisterPage>
  );
}
