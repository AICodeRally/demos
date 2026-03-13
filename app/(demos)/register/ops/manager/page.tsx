'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Tablet, Send, Megaphone, Clock,
  Sparkles, AlertTriangle,
} from 'lucide-react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import {
  REPS, COACHING_CARDS, getRepStatus,
  type CoachingPriority, type CoachingCard as CoachingCardType,
} from '@/data/register/coaching-data';
import { broadcastCoaching, broadcastAlert, onRegisterBroadcast, type BroadcastMessage } from '@/lib/register-broadcast';
import { getInsight } from '@/data/register/ai-insights';

/* ── Priority config ─────────────────────────────────────── */

const PRIORITY_CONFIG: Record<CoachingPriority, { color: string; bg: string; label: string }> = {
  urgent: { color: '#DC2626', bg: 'rgba(220,38,38,0.08)', label: 'URGENT' },
  high: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', label: 'HIGH' },
  medium: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', label: 'MED' },
  low: { color: '#10B981', bg: 'rgba(16,185,129,0.08)', label: 'LOW' },
};

const STATUS_DOT: Record<string, string> = {
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
};

/* ── Coaching Card Component ─────────────────────────────── */

function CoachingCardView({ card, onPush, pushed }: {
  card: CoachingCardType;
  onPush: (card: CoachingCardType) => void;
  pushed: boolean;
}) {
  const rep = REPS.find((r) => r.id === card.repId);
  const cfg = PRIORITY_CONFIG[card.priority];
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        padding: 14, borderRadius: 12,
        background: cfg.bg,
        border: `1px solid ${cfg.color}20`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-flex', padding: '2px 6px', borderRadius: 4,
              fontSize: '0.6rem', fontWeight: 700, color: '#FFFFFF',
              background: cfg.color,
            }}
          >
            {cfg.label}
          </span>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '2px 6px', borderRadius: 10,
              fontSize: '0.55rem', fontWeight: 600,
              background: 'rgba(139,92,246,0.1)', color: '#8B5CF6',
            }}
          >
            <Sparkles size={8} /> AI-Generated
          </span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6rem', color: 'var(--register-text-dim)' }}>
          <Clock size={10} /> {card.timestamp}
        </span>
      </div>

      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)', margin: '0 0 8px' }}>
        {rep?.name}: {card.title}
      </p>

      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
        {card.dataPoints.map((dp, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.7rem', color: 'var(--register-text-muted)' }}>
            <span style={{ width: 4, height: 4, borderRadius: 2, background: cfg.color, marginTop: 6, flexShrink: 0 }} />
            {dp}
          </li>
        ))}
      </ul>

      {expanded && (
        <div style={{ padding: 10, borderRadius: 8, background: 'rgba(139,92,246,0.06)', marginBottom: 10 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--register-ai)', margin: 0 }}>
            {card.suggestedAction}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#10B981' }}>
            {card.commissionImpact}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: 'none', border: 'none', fontSize: '0.65rem', color: 'var(--register-ai)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {expanded ? 'Less' : 'Details'}
          </button>
        </div>
        <button
          onClick={() => onPush(card)}
          disabled={pushed}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '6px 12px', borderRadius: 8,
            fontSize: '0.7rem', fontWeight: 600, color: '#FFFFFF',
            background: pushed ? '#94A3B8' : 'var(--register-primary)',
            border: 'none', cursor: pushed ? 'default' : 'pointer',
            opacity: pushed ? 0.6 : 1,
          }}
        >
          <Send size={10} />
          {pushed ? 'Sent' : 'Push to Rep Tablet'}
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function ManagerConsole() {
  const [pushedCards, setPushedCards] = useState<Set<string>>(new Set());
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [liveFeed, setLiveFeed] = useState<string[]>([]);

  const insight = getInsight('ops/floor');

  // Listen for sale:closed events from POS
  useEffect(() => {
    const unsub = onRegisterBroadcast((msg: BroadcastMessage) => {
      if (msg.type === 'alert') {
        setLiveFeed((prev) => [`${new Date().toLocaleTimeString()} — ${msg.data.message}`, ...prev].slice(0, 10));
      }
    });
    return unsub;
  }, []);

  const handlePushCoaching = useCallback((card: CoachingCardType) => {
    const rep = REPS.find((r) => r.id === card.repId);
    broadcastCoaching({
      id: card.id,
      repId: card.repId,
      repName: rep?.name ?? card.repId,
      message: card.title,
      action: card.suggestedAction,
      commissionDelta: parseInt(card.commissionImpact.replace(/[^0-9]/g, '')) || undefined,
      timestamp: new Date().toISOString(),
    });
    setPushedCards((prev) => new Set(prev).add(card.id));
  }, []);

  const handleBroadcastAll = useCallback(() => {
    broadcastAlert({
      id: `alert-${Date.now()}`,
      severity: 'info',
      message: 'New SPIFF active: $25 bonus for every ErgoMotion Adjustable Base sold this month! Demo the zero-gravity position on every up.',
      timestamp: new Date().toISOString(),
    });
    setBroadcastSent(true);
  }, []);

  return (
    <RegisterPage title="Manager Console" subtitle="Flagship #12 — Galleria" accentColor="#8B5CF6">
      {/* AI Insight */}
      {insight && (
        <div style={{ marginBottom: 20 }}>
          <AIInsightCard>{insight.text}</AIInsightCard>
        </div>
      )}

      {/* Header actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => window.open('/register/ops/pos-terminal', '_blank')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 8,
            background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)',
            color: 'var(--register-text)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Tablet size={14} /> Open Rep Tablet
        </button>
        <button
          onClick={handleBroadcastAll}
          disabled={broadcastSent}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: broadcastSent ? '#94A3B8' : 'var(--register-ai)',
            color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 600,
            cursor: broadcastSent ? 'default' : 'pointer',
            opacity: broadcastSent ? 0.6 : 1,
          }}
        >
          <Megaphone size={14} />
          {broadcastSent ? 'Alert Sent' : 'Broadcast All'}
        </button>
      </div>

      {/* Store status bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 24,
          padding: '14px 20px', borderRadius: 12,
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
          marginBottom: 20,
        }}
      >
        {[
          { label: "Today's Revenue", value: '$47,200', color: 'var(--register-text)' },
          { label: 'Traffic', value: '142', color: 'var(--register-text)' },
          { label: 'Active Shoppers', value: '8', color: '#10B981' },
          { label: 'Open Sales', value: '3', color: 'var(--register-accent)' },
        ].map((stat, i) => (
          <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {i > 0 && <div style={{ width: 1, height: 32, background: 'var(--register-border)' }} />}
            <div>
              <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--register-text-dim)', margin: 0 }}>
                {stat.label}
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', color: stat.color, margin: '2px 0 0' }}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Rep Cards */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 12 }}>
          Floor Team
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {REPS.map((rep) => {
            const status = getRepStatus(rep.id);
            const dotColor = status ? STATUS_DOT[status.statusColor] : '#10B981';
            return (
              <div
                key={rep.id}
                style={{
                  position: 'relative',
                  padding: 14, borderRadius: 12,
                  background: 'var(--register-bg-elevated)',
                  border: `1px solid var(--register-border)`,
                }}
              >
                <Link
                  href={`/register/ops/manager/coaching/${rep.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: 18,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF',
                        background: `linear-gradient(135deg, ${dotColor}, ${dotColor}88)`,
                      }}
                    >
                      {rep.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>{rep.name}</p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>{rep.role}</p>
                    </div>
                    <span style={{ width: 10, height: 10, borderRadius: 5, background: dotColor }} />
                    <ChevronRight size={14} style={{ color: 'var(--register-text-dim)' }} />
                  </div>

                  {/* Shift attainment */}
                  {status && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', marginBottom: 4 }}>
                        <span style={{ color: 'var(--register-text-muted)' }}>Shift Attainment</span>
                        <span style={{ fontWeight: 700, color: dotColor }}>{status.shiftAttainment}%</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: `${dotColor}20` }}>
                        <div style={{ height: 6, borderRadius: 3, width: `${Math.min(status.shiftAttainment, 100)}%`, background: dotColor }} />
                      </div>
                    </div>
                  )}

                  {/* 3 metrics */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { label: 'Attach', value: `${rep.metrics.attachRate}%`, bad: rep.metrics.attachRate < rep.metrics.floorAvgAttach },
                      { label: 'Finance', value: `${rep.metrics.financingPitch}%`, bad: rep.metrics.financingPitch < rep.metrics.floorAvgFinancing },
                      { label: 'ASP', value: `$${(rep.metrics.asp / 1000).toFixed(1)}K`, bad: rep.metrics.asp < rep.metrics.floorAvgAsp },
                    ].map((m) => (
                      <div key={m.label} style={{ flex: 1, textAlign: 'center' }}>
                        <p style={{ fontSize: '0.55rem', color: 'var(--register-text-dim)', margin: 0 }}>{m.label}</p>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: m.bad ? '#EF4444' : '#10B981', margin: '2px 0 0' }}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                </Link>

                {/* Push to iPad hover button */}
                <button
                  onClick={() => {
                    const card = COACHING_CARDS.find((c) => c.repId === rep.id);
                    if (card) handlePushCoaching(card);
                  }}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 8px', borderRadius: 6,
                    fontSize: '0.6rem', fontWeight: 600, color: '#FFFFFF',
                    background: 'var(--register-primary)', border: 'none', cursor: 'pointer',
                    opacity: 0.85,
                  }}
                >
                  <Send size={8} /> Push
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Feed from POS */}
      {liveFeed.length > 0 && (
        <div
          style={{
            padding: 14, borderRadius: 12,
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.2)',
            marginBottom: 20,
          }}
        >
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', marginBottom: 8 }}>Live POS Feed</p>
          {liveFeed.map((msg, i) => (
            <p key={i} style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', margin: '4px 0' }}>{msg}</p>
          ))}
        </div>
      )}

      {/* Live Coaching Feed */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>
              Live Coaching Feed
            </span>
            <span
              style={{
                display: 'inline-flex', padding: '2px 8px', borderRadius: 10,
                fontSize: '0.6rem', fontWeight: 600,
                background: 'rgba(16,185,129,0.1)', color: '#10B981',
              }}
            >
              {COACHING_CARDS.length} active
            </span>
          </div>
          <Link
            href="/register/comp/admin"
            style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--register-ai)', textDecoration: 'none' }}
          >
            Comp Admin &rarr;
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {COACHING_CARDS.map((card) => (
            <CoachingCardView
              key={card.id}
              card={card}
              onPush={handlePushCoaching}
              pushed={pushedCards.has(card.id)}
            />
          ))}
        </div>
      </div>
    </RegisterPage>
  );
}
