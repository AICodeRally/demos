import { NarrativeStrip } from '@/components/demos/routeiq/NarrativeStrip';
import { TrendingUp, Target, Coins, Users, Trophy, Compass } from 'lucide-react';

const HERO_KPIS = [
  { label: 'Revenue YTD', value: '$184.2M', delta: '+4.2%', trend: 'up', icon: TrendingUp },
  { label: 'Comp / Revenue', value: '7.4%', delta: '+1.3 pts', trend: 'down', icon: Coins },
  { label: 'Attainment (median)', value: '78%', delta: '−4 pts', trend: 'down', icon: Target },
  { label: 'Active reps', value: '61 / 64', delta: '3 open', trend: 'flat', icon: Users },
  { label: 'Top-20% share', value: '64%', delta: '+12 pts', trend: 'warn', icon: Trophy },
  { label: 'Commit accuracy', value: '61%', delta: '−21 pts', trend: 'down', icon: Compass },
];

const TREND_COLORS: Record<string, string> = {
  up: '#059669',
  down: '#DC2626',
  warn: '#D97706',
  flat: '#64748B',
};

export default function CockpitPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-8" style={{ background: 'var(--rq-bg)' }}>
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--rq-amber)' }}>
          <span className="h-px w-8" style={{ background: 'var(--rq-amber)' }} />
          Royal Distributing · Kansas City
        </div>
        <h1 className="text-4xl font-bold leading-tight" style={{ color: 'var(--rq-text)' }}>
          Revenue isn&rsquo;t a number.<br />
          It&rsquo;s a system.
        </h1>
        <p className="max-w-3xl text-base" style={{ color: 'var(--rq-text-muted)' }}>
          And most companies are flying blind inside it. RouteIQ observes every signal in the revenue flow, explains
          what&rsquo;s breaking, and lets you act from one surface. This cockpit is the system view — seven failure
          points on one screen, with Pulse flagging anomalies before you ask.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {HERO_KPIS.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="flex flex-col gap-2 rounded-xl border p-4"
              style={{
                background: 'var(--rq-card)',
                borderColor: 'var(--rq-border)',
                boxShadow: 'var(--rq-shadow)',
              }}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: 'var(--rq-text-faint)' }} />
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>
                  {k.label}
                </span>
              </div>
              <div className="font-mono text-2xl font-bold" style={{ color: 'var(--rq-text)' }}>
                {k.value}
              </div>
              <div className="font-mono text-xs font-semibold" style={{ color: TREND_COLORS[k.trend] }}>
                {k.delta}
              </div>
            </div>
          );
        })}
      </div>

      <NarrativeStrip
        section="cockpit"
        title="What Pulse is flagging right now"
        subtitle="The system runs continuously. These are the anomalies it surfaced in the last 24 hours that warrant attention."
      />

      <footer className="border-t pt-6 text-sm" style={{ borderColor: 'var(--rq-border)', color: 'var(--rq-text-muted)' }}>
        <div className="flex flex-col gap-2">
          <div className="font-semibold" style={{ color: 'var(--rq-text)' }}>
            Follow the revenue flow →
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <a href="/routeiq/demand" className="rounded-full border px-3 py-1.5 transition-colors hover:border-current" style={{ borderColor: 'var(--rq-border)' }}>1 · Demand</a>
            <a href="/routeiq/deals" className="rounded-full border px-3 py-1.5 transition-colors hover:border-current" style={{ borderColor: 'var(--rq-border)' }}>2 · Deals</a>
            <a href="/routeiq/margin" className="rounded-full border px-3 py-1.5 transition-colors hover:border-current" style={{ borderColor: 'var(--rq-border)' }}>3 · Margin</a>
            <a href="/routeiq/capacity" className="rounded-full border px-3 py-1.5 transition-colors hover:border-current" style={{ borderColor: 'var(--rq-border)' }}>4 · Capacity</a>
            <a href="/routeiq/comp" className="rounded-full border px-3 py-1.5 transition-colors hover:border-current" style={{ borderColor: 'var(--rq-border)' }}>5 · Comp</a>
            <a href="/routeiq/forecast" className="rounded-full border px-3 py-1.5 transition-colors hover:border-current" style={{ borderColor: 'var(--rq-border)' }}>6 · Forecast</a>
            <a href="/routeiq/action" className="rounded-full border px-3 py-1.5 transition-colors hover:border-current" style={{ borderColor: 'var(--rq-border)' }}>7 · Action</a>
            <a href="/routeiq/tablet" className="rounded-full border px-3 py-1.5 transition-colors hover:border-current" style={{ borderColor: 'var(--rq-border)' }}>Field Tablet</a>
            <a href="/routeiq/system" className="rounded-full border px-3 py-1.5 transition-colors hover:border-current" style={{ borderColor: 'var(--rq-border)' }}>System View</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
