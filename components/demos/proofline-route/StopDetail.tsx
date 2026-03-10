'use client';

import { useState } from 'react';
import { Package, History, Brain, TrendingUp, TrendingDown, Minus, Shield, AlertTriangle, XCircle, Phone, Tag, MessageCircle, Sparkles } from 'lucide-react';
import type { RouteStop } from '@/data/proofline-route/route-data';
import { STOP_TYPE_COLORS, STOP_TYPE_LABELS, STRATEGY_TAG_CONFIG } from '@/data/proofline-route/route-data';
import { useSwipe } from '@/hooks/useSwipe';

interface StopDetailProps {
  stop: RouteStop;
  slideDirection?: 'left' | 'right' | null;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

type Tab = 'visit' | 'history' | 'intel' | 'coaching';

const TAB_CONFIG: { key: Tab; label: string; icon: typeof Package }[] = [
  { key: 'visit', label: 'Visit Plan', icon: Package },
  { key: 'history', label: 'History', icon: History },
  { key: 'intel', label: 'Intelligence', icon: Brain },
  { key: 'coaching', label: 'Coaching', icon: MessageCircle },
];

export function StopDetail({ stop, slideDirection, onSwipeLeft, onSwipeRight }: StopDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('visit');
  const color = STOP_TYPE_COLORS[stop.type];

  const swipeHandlers = useSwipe({
    onSwipeLeft,
    onSwipeRight,
    threshold: 50,
  });

  const slideClass = slideDirection === 'left'
    ? 'slide-enter'
    : slideDirection === 'right'
      ? 'slide-enter'
      : '';

  return (
    <div
      className={`h-full flex flex-col ${slideClass}`}
      {...swipeHandlers}
    >
      <div className="px-3 pt-1.5 pb-0.5 flex-shrink-0">
        <h3 className="font-bold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)', fontSize: '0.7em' }}>
          Stop Detail
        </h3>
      </div>

      <div className="px-3 pt-1 pb-1.5 flex-shrink-0" style={{ borderBottom: '1px solid var(--pl-zone-border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center font-black"
              style={{ fontSize: '0.85em', background: '#C6A052', color: '#0a0f1e' }}
            >
              {stop.sequence}
            </div>
            <div>
              <h2 className="font-bold" style={{ color: 'var(--pl-text)', fontSize: '1em' }}>{stop.accountName}</h2>
              <p style={{ color: 'var(--pl-text-muted)', fontSize: '0.8em' }}>
                {stop.address} &middot; {stop.arrivalTime}
              </p>
            </div>
          </div>
          <span
            className="font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ fontSize: '0.6em', background: `${color}15`, color }}
          >
            {STOP_TYPE_LABELS[stop.type]}
          </span>
        </div>

        <div className="flex gap-1 mt-1.5">
          {TAB_CONFIG.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="tap-active flex items-center gap-1 px-2.5 py-1.5 rounded-md font-semibold transition-all"
              style={{
                fontSize: '0.8em',
                background: activeTab === key ? 'var(--pl-gold-bg)' : 'transparent',
                color: activeTab === key ? 'var(--pl-gold)' : 'var(--pl-text-muted)',
                border: activeTab === key ? '1px solid var(--pl-gold-border)' : '1px solid transparent',
                minHeight: 36,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain px-3 py-2">
        {activeTab === 'visit' && <VisitPlanTab stop={stop} />}
        {activeTab === 'history' && <HistoryTab stop={stop} />}
        {activeTab === 'intel' && <IntelTab stop={stop} />}
        {activeTab === 'coaching' && <CoachingTab stop={stop} />}
      </div>
    </div>
  );
}

/* ── Visit Plan Tab ─────────────────────────────────────── */

function VisitPlanTab({ stop }: { stop: RouteStop }) {
  if (stop.manifest.length === 0) {
    return (
      <div>
        <div className="rounded-lg p-4 mb-4" style={{ background: 'var(--pl-surface)', border: '1px solid var(--pl-surface-border)' }}>
          <p className="font-semibold mb-2" style={{ color: 'var(--pl-text)', fontSize: '0.9em' }}>Load-out Checklist</p>
          {stop.talkingPoints.map((tp, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--pl-gold)' }} />
              <p style={{ color: 'var(--pl-text-secondary)', fontSize: '0.85em' }}>{tp}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h4 className="font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--pl-text-muted)', fontSize: '0.75em' }}>
          Delivery Manifest
        </h4>
        <div className="space-y-1.5">
          {stop.manifest.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg px-3 py-2"
              style={{ background: 'var(--pl-surface)', border: '1px solid var(--pl-surface-border)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate" style={{ color: 'var(--pl-text)', fontSize: '0.9em' }}>
                    {item.name}
                  </p>
                  {item.promo && (
                    <span className="flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-full"
                      style={{ fontSize: '0.6em', background: 'var(--pl-gold-bg)', color: 'var(--pl-gold)' }}>
                      <Tag className="w-2 h-2" />
                      {item.promo}
                    </span>
                  )}
                </div>
                <p className="font-mono" style={{ color: 'var(--pl-text-muted)', fontSize: '0.75em' }}>
                  SKU: {item.sku}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="font-bold font-mono" style={{ color: 'var(--pl-gold)', fontSize: '0.9em' }}>
                  {item.cases}cs
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--pl-text-muted)', fontSize: '0.75em' }}>
          Talking Points
        </h4>
        {stop.talkingPoints.map((tp, i) => (
          <div key={i} className="flex items-start gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--pl-gold)' }} />
            <p style={{ color: 'var(--pl-text-secondary)', fontSize: '0.85em' }}>{tp}</p>
          </div>
        ))}
      </div>

      {stop.displayInstructions && (
        <div className="rounded-lg p-3" style={{ background: 'var(--pl-gold-bg)', border: '1px solid var(--pl-gold-border)' }}>
          <h4 className="font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--pl-gold)', fontSize: '0.75em' }}>
            Display Instructions
          </h4>
          <p style={{ color: 'var(--pl-text-secondary)', fontSize: '0.85em' }}>{stop.displayInstructions}</p>
        </div>
      )}
    </div>
  );
}

/* ── History Tab ────────────────────────────────────────── */

function HistoryTab({ stop }: { stop: RouteStop }) {
  if (stop.history.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p style={{ color: 'var(--pl-text-muted)', fontSize: '0.85em' }}>No visit history (warehouse / new account)</p>
      </div>
    );
  }

  const TrendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
  const trendColor = { up: '#22c55e', down: '#ef4444', flat: 'var(--pl-text-muted)' };

  return (
    <div className="space-y-2">
      {stop.history.map((visit, i) => {
        const Icon = TrendIcon[visit.trend];
        return (
          <div
            key={i}
            className="rounded-lg px-3 py-2.5"
            style={{ background: 'var(--pl-surface)', border: '1px solid var(--pl-surface-border)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold" style={{ color: 'var(--pl-text)', fontSize: '0.85em' }}>
                {visit.date}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold" style={{ color: 'var(--pl-gold)', fontSize: '0.85em' }}>
                  {visit.cases}cs &middot; ${visit.revenue.toLocaleString()}
                </span>
                <Icon className="w-3.5 h-3.5" style={{ color: trendColor[visit.trend] }} />
              </div>
            </div>
            <p style={{ color: 'var(--pl-text-muted)', fontSize: '0.8em' }}>{visit.notes}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ── Intelligence Tab ───────────────────────────────────── */

function IntelTab({ stop }: { stop: RouteStop }) {
  const { intelligence } = stop;
  const tabcColors = {
    verified: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', color: '#22c55e', icon: Shield },
    expiring: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b', icon: AlertTriangle },
    flagged: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', icon: XCircle },
  };
  const tabc = tabcColors[intelligence.tabcStatus];
  const TabcIcon = tabc.icon;

  return (
    <div>
      <div className="mb-4">
        <h4 className="font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--pl-text-muted)', fontSize: '0.75em' }}>
          AI Insights
        </h4>
        {intelligence.insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-2 mb-2">
            <Brain className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--pl-gold)' }} />
            <p style={{ color: 'var(--pl-text-secondary)', fontSize: '0.85em' }}>{insight}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h4 className="font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--pl-text-muted)', fontSize: '0.75em' }}>
          Competitive Intel
        </h4>
        <div className="rounded-lg p-3" style={{ background: 'var(--pl-competitive-bg)', border: '1px solid var(--pl-competitive-border)' }}>
          <p style={{ color: 'var(--pl-competitive-text)', fontSize: '0.85em' }}>{intelligence.competitiveIntel}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--pl-text-muted)', fontSize: '0.75em' }}>
          Contact
        </h4>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{ background: 'var(--pl-surface)', border: '1px solid var(--pl-surface-border)' }}>
          <Phone className="w-3.5 h-3.5" style={{ color: 'var(--pl-text-muted)' }} />
          <div>
            <p className="font-semibold" style={{ color: 'var(--pl-text)', fontSize: '0.9em' }}>{intelligence.contactName}</p>
            <p className="font-mono" style={{ color: 'var(--pl-text-muted)', fontSize: '0.8em' }}>{intelligence.contactPhone}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--pl-text-muted)', fontSize: '0.75em' }}>
          TABC License
        </h4>
        <div
          className="flex items-center justify-between rounded-lg px-3 py-2.5"
          style={{ background: tabc.bg, border: `1px solid ${tabc.border}` }}
        >
          <div className="flex items-center gap-2">
            <TabcIcon className="w-4 h-4" style={{ color: tabc.color }} />
            <div>
              <p className="font-bold uppercase" style={{ color: tabc.color, fontSize: '0.8em' }}>
                {intelligence.tabcStatus}
              </p>
              <p className="font-mono" style={{ color: 'var(--pl-text-muted)', fontSize: '0.75em' }}>
                {intelligence.tabcLicenseNo}
              </p>
            </div>
          </div>
          <span style={{ color: 'var(--pl-text-muted)', fontSize: '0.8em' }}>
            Exp: {intelligence.tabcExpiry}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Coaching Tab ──────────────────────────────────────── */

function CoachingTab({ stop }: { stop: RouteStop }) {
  const suggestions = stop.aiSuggestions;

  if (suggestions.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p style={{ color: 'var(--pl-text-muted)', fontSize: '0.85em' }}>
          {stop.type === 'warehouse' ? 'Load-out stop — review talking points in Visit Plan' : 'No coaching plays for this stop'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-lg p-3 mb-4" style={{ background: 'var(--pl-gold-bg)', border: '1px solid var(--pl-gold-border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle className="w-4 h-4" style={{ color: 'var(--pl-gold)' }} />
          <h4 className="font-bold" style={{ color: 'var(--pl-gold)', fontSize: '0.85em' }}>
            Your Game Plan — {stop.accountName}
          </h4>
        </div>
        <p style={{ color: 'var(--pl-text-secondary)', fontSize: '0.8em' }}>
          {suggestions.length} opportunity{suggestions.length > 1 ? 's' : ''} identified.
          {' '}Potential +${suggestions.reduce((sum, s) => sum + s.commissionDelta, 0)} commission.
        </p>
      </div>

      <div className="space-y-3">
        {suggestions.map((sug) => {
          const stratConfig = STRATEGY_TAG_CONFIG[sug.strategy];
          return (
            <div
              key={sug.id}
              className="rounded-lg overflow-hidden"
              style={{ border: '1px solid var(--pl-surface-border)' }}
            >
              <div
                className="flex items-center justify-between px-3 py-1.5"
                style={{ background: `${stratConfig.color}15`, borderBottom: '1px solid var(--pl-surface-border)' }}
              >
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: '0.75em' }}>{stratConfig.icon}</span>
                  <span className="font-black uppercase tracking-wider" style={{ color: stratConfig.color, fontSize: '0.65em' }}>
                    {stratConfig.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold" style={{ color: 'var(--pl-gold)', fontSize: '0.8em' }}>
                    +${sug.commissionDelta}
                  </span>
                  <span className="font-mono" style={{ color: 'var(--pl-text-muted)', fontSize: '0.7em' }}>
                    {'\u25B2'}{sug.marginDelta}% margin
                  </span>
                </div>
              </div>

              <div className="px-3 py-2" style={{ background: 'var(--pl-surface)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold" style={{ color: 'var(--pl-text)', fontSize: '0.9em' }}>
                    {sug.product}
                  </span>
                  <span className="font-mono" style={{ color: 'var(--pl-text-muted)', fontSize: '0.75em' }}>
                    {sug.cases}cs
                  </span>
                </div>

                <div className="flex items-start gap-1.5 mb-2">
                  <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--pl-gold)' }} />
                  <p style={{ color: 'var(--pl-text-muted)', fontSize: '0.8em' }}>
                    {sug.reasoning}
                  </p>
                </div>

                <div className="rounded-md p-2" style={{ background: 'var(--pl-gold-bg)', border: '1px solid var(--pl-gold-border)' }}>
                  <div className="flex items-start gap-1.5">
                    <MessageCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--pl-gold)' }} />
                    <div>
                      <p className="font-bold mb-0.5" style={{ color: 'var(--pl-gold)', fontSize: '0.7em' }}>
                        SAY THIS
                      </p>
                      <p style={{ color: 'var(--pl-text-secondary)', fontSize: '0.8em', lineHeight: 1.4 }}>
                        {sug.coachingPlay}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-1.5 font-mono" style={{ color: 'var(--pl-text-muted)', fontSize: '0.65em' }}>
                  Source: {sug.source}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {stop.talkingPoints.length > 0 && (
        <div className="mt-4">
          <h4 className="font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--pl-text-muted)', fontSize: '0.75em' }}>
            Also Cover
          </h4>
          {stop.talkingPoints.map((tp, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--pl-text-muted)' }} />
              <p style={{ color: 'var(--pl-text-secondary)', fontSize: '0.8em' }}>{tp}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
