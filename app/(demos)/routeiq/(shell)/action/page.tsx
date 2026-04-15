'use client';

import { useState } from 'react';
import { NarrativeStrip } from '@/components/demos/routeiq/NarrativeStrip';
import { Zap, CheckCircle2, Clock, AlertTriangle, Send, ExternalLink } from 'lucide-react';
import { broadcastCoaching, broadcastAlert, broadcastPriority } from '@/lib/routeiq-broadcast';

type ActionType = 'coaching' | 'alert' | 'guardrail' | 'priority';

interface LiveAction {
  time: string;
  type: ActionType;
  target: string;
  message: string;
  status: 'ack' | 'delivered' | 'pending';
  stopId?: string;
  stopName?: string;
  severity?: 'info' | 'warning' | 'urgent';
  product?: string;
  cases?: number;
}

const ACTIONS: LiveAction[] = [
  { time: '09:42', type: 'coaching', target: 'Marcus Reyes · KC-01', message: 'Stop 2 (Midwest Tap House): lead with Cinco tasting event, push Patron from 3 → 6 cases', status: 'delivered', stopId: 'stop-2', stopName: 'Midwest Tap House', product: 'Patron Silver Tequila', cases: 3 },
  { time: '09:31', type: 'alert', target: 'All KC reps', message: 'Heartland Beverage placed a Maker\'s Mark display in 64110 zip — counter with Buffalo Trace prominence', status: 'delivered', severity: 'warning' },
  { time: '09:15', type: 'guardrail', target: 'Diego Ramirez · WIC-01', message: '18% discount request on Acme Group — requires manager approval', status: 'pending' },
  { time: '08:58', type: 'priority', target: 'Marcus Reyes · KC-01', message: 'Stop 5 (Crown Town Cantina) upgraded to priority — inventory shortage upstream', status: 'delivered', stopId: 'stop-5', stopName: 'Crown Town Cantina' },
  { time: '08:42', type: 'coaching', target: 'Jenna Walsh · KC-02', message: 'Spirits kicker activated — quarter pacing on track, hold the line', status: 'ack', stopId: 'stop-3', stopName: 'Prairie Wine & Spirits', product: 'Tito\'s Handmade Vodka', cases: 4 },
  { time: '08:30', type: 'guardrail', target: 'Priya Chen · OMA-01', message: '21% discount request — exceeds ceiling', status: 'pending' },
  { time: '08:15', type: 'alert', target: 'All KS reps', message: 'Liquor license expiring in 14 days for 2 accounts', status: 'delivered', severity: 'info' },
  { time: '07:58', type: 'coaching', target: 'Tyler Brooks · DSM-01', message: 'KC-fringe account list pushed with script', status: 'ack' },
];

const TYPE_COLOR: Record<ActionType, string> = {
  coaching: '#0EA5E9',
  alert: '#D97706',
  guardrail: '#DC2626',
  priority: '#8B5CF6',
};

export default function ActionPage() {
  const [pushed, setPushed] = useState<Set<number>>(new Set());

  const handlePush = (idx: number, action: LiveAction) => {
    const now = new Date().toISOString();
    try {
      if (action.type === 'coaching' && action.stopId && action.stopName) {
        broadcastCoaching({
          id: `push-${Date.now()}`,
          stopId: action.stopId,
          stopName: action.stopName,
          message: action.message,
          product: action.product,
          cases: action.cases,
          timestamp: now,
        });
      } else if (action.type === 'alert') {
        broadcastAlert({
          id: `push-${Date.now()}`,
          severity: action.severity ?? 'info',
          message: action.message,
          timestamp: now,
        });
      } else if (action.type === 'priority' && action.stopId && action.stopName) {
        broadcastPriority({
          id: `push-${Date.now()}`,
          stopId: action.stopId,
          stopName: action.stopName,
          reason: action.message,
          timestamp: now,
        });
      }
      setPushed((prev) => new Set(prev).add(idx));
      setTimeout(() => {
        setPushed((prev) => {
          const next = new Set(prev);
          next.delete(idx);
          return next;
        });
      }, 3000);
    } catch {
      // BroadcastChannel might not be available in SSR/old browsers — silently skip
    }
  };

  const canPush = (action: LiveAction) =>
    action.type === 'coaching' || action.type === 'alert' || action.type === 'priority';

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--rq-amber)' }}>
          <Zap className="h-4 w-4" />
          § 7 · Execution Layer
        </div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--rq-text)' }}>
          Insight without action is just expensive reporting.
        </h1>
        <p className="max-w-3xl text-base" style={{ color: 'var(--rq-text-muted)' }}>
          Most RevOps stacks stop at insight. RouteIQ closes the loop — coaching pushes, pricing guardrails, pipeline interventions flow from this layer directly to the rep tablets in the field.
        </p>
      </header>

      <div
        className="flex items-start gap-3 rounded-xl border-l-4 p-4"
        style={{ background: 'var(--rq-amber-soft)', borderLeftColor: 'var(--rq-amber)' }}
      >
        <Send className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: 'var(--rq-amber)' }} />
        <div className="flex-1">
          <div className="text-sm font-bold" style={{ color: 'var(--rq-text)' }}>
            Live demo: open the Field Tablet in a second tab, then click &quot;Push to Tablet&quot; below.
          </div>
          <div className="mt-1 text-xs" style={{ color: 'var(--rq-text-muted)' }}>
            Uses a browser BroadcastChannel (<code>routeiq-route</code>) — the tablet&apos;s ManagerToast component listens and pops a real-time notification. No backend required.
          </div>
          <a
            href="/routeiq/tablet"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold underline"
            style={{ color: 'var(--rq-amber)' }}
          >
            Open Field Tablet in new tab <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-xl border p-4" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>Actions today</div>
          <div className="font-mono text-2xl font-bold" style={{ color: 'var(--rq-text)' }}>47</div>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border p-4" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>Ack rate</div>
          <div className="font-mono text-2xl font-bold" style={{ color: '#059669' }}>91%</div>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border p-4" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>Pending approval</div>
          <div className="font-mono text-2xl font-bold" style={{ color: '#D97706' }}>3</div>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border p-4" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>Auto-triggered</div>
          <div className="font-mono text-2xl font-bold" style={{ color: 'var(--rq-indigo)' }}>38</div>
        </div>
      </div>

      <div className="rounded-xl border p-5" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
        <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--rq-text)' }}>Live action feed</h2>
        <div className="flex flex-col gap-2">
          {ACTIONS.map((a, i) => {
            const StatusIcon = a.status === 'pending' ? Clock : a.status === 'ack' ? CheckCircle2 : AlertTriangle;
            const isPushed = pushed.has(i);
            return (
              <div key={i} className="grid grid-cols-[60px_90px_1fr_auto] gap-3 items-center rounded-lg p-3" style={{ background: 'var(--rq-card-alt)' }}>
                <div className="font-mono text-xs" style={{ color: 'var(--rq-text-faint)' }}>{a.time}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: TYPE_COLOR[a.type] }}>{a.type}</div>
                <div className="flex flex-col">
                  <div className="text-sm font-semibold" style={{ color: 'var(--rq-text)' }}>{a.target}</div>
                  <div className="text-xs" style={{ color: 'var(--rq-text-muted)' }}>{a.message}</div>
                </div>
                <div className="flex items-center gap-2">
                  {canPush(a) && (
                    <button
                      onClick={() => handlePush(i, a)}
                      className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors"
                      style={{
                        background: isPushed ? '#059669' : 'var(--rq-amber)',
                        color: '#0F172A',
                      }}
                    >
                      {isPushed ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Pushed
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          Push to Tablet
                        </>
                      )}
                    </button>
                  )}
                  <StatusIcon className="h-4 w-4" style={{ color: a.status === 'pending' ? '#D97706' : '#059669' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NarrativeStrip section="action" />
    </main>
  );
}
