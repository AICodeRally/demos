import { NarrativeStrip } from '@/components/demos/routeiq/NarrativeStrip';
import { Zap, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const ACTIONS = [
  { time: '09:42', type: 'coaching', target: 'Tyler Brooks · DSM-01', message: 'KC-fringe account list pushed to tablet with script', status: 'ack', icon: CheckCircle2 },
  { time: '09:31', type: 'alert', target: 'All West region reps', message: 'Competitive pricing alert on Republic spirits portfolio', status: 'delivered', icon: CheckCircle2 },
  { time: '09:15', type: 'guardrail', target: 'Diego Ramirez · WIC-01', message: '18% discount request on Acme Group — requires manager approval', status: 'pending', icon: Clock },
  { time: '08:58', type: 'coaching', target: 'Amara Okoye · LR-01', message: 'Stop 3 tomorrow: new-account talking points + 2 AI upsell suggestions', status: 'ack', icon: CheckCircle2 },
  { time: '08:42', type: 'priority', target: 'Marcus Reyes · KC-01', message: 'Stop 5 upgraded to priority: inventory shortage upstream', status: 'ack', icon: CheckCircle2 },
  { time: '08:30', type: 'guardrail', target: 'Priya Chen · OMA-01', message: '21% discount request — exceeds ceiling', status: 'pending', icon: AlertTriangle },
  { time: '08:15', type: 'alert', target: 'All KS reps', message: 'Liquor license expiring in 14 days for 2 accounts', status: 'delivered', icon: CheckCircle2 },
  { time: '07:58', type: 'coaching', target: 'Jenna Walsh · KC-02', message: 'Spirits kicker activated — quarter pacing on track', status: 'ack', icon: CheckCircle2 },
];

const TYPE_COLOR: Record<string, string> = {
  coaching: '#0EA5E9',
  alert: '#D97706',
  guardrail: '#DC2626',
  priority: '#8B5CF6',
};

export default function ActionPage() {
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
          Most RevOps stacks stop at insight. RouteIQ closes the loop — coaching pushes, pricing guardrails, pipeline interventions flow from this layer directly to the rep tablets in the field. Here&rsquo;s what&rsquo;s happened in the last hour.
        </p>
      </header>

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
            const Icon = a.icon;
            return (
              <div key={i} className="grid grid-cols-[60px_90px_1fr_40px] gap-3 items-center rounded-lg p-3" style={{ background: 'var(--rq-card-alt)' }}>
                <div className="font-mono text-xs" style={{ color: 'var(--rq-text-faint)' }}>{a.time}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: TYPE_COLOR[a.type] }}>{a.type}</div>
                <div className="flex flex-col">
                  <div className="text-sm font-semibold" style={{ color: 'var(--rq-text)' }}>{a.target}</div>
                  <div className="text-xs" style={{ color: 'var(--rq-text-muted)' }}>{a.message}</div>
                </div>
                <Icon className="h-4 w-4" style={{ color: a.status === 'pending' ? '#D97706' : '#059669' }} />
              </div>
            );
          })}
        </div>
      </div>

      <NarrativeStrip section="action" />
    </main>
  );
}
