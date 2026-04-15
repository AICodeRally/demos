import { NarrativeStrip } from '@/components/demos/routeiq/NarrativeStrip';
import { Eye, Brain, Sparkles, ArrowRight } from 'lucide-react';

const LAYERS = [
  {
    icon: Eye,
    name: 'Pulse',
    tagline: 'Observe',
    color: '#0EA5E9',
    what: 'Continuously monitors every signal in the revenue flow — pipeline, deals, margin, capacity, comp, forecast — and surfaces anomalies without being asked.',
    hooks: ['847 signals / 24h', '23 flags surfaced', '91% precision'],
  },
  {
    icon: Brain,
    name: 'OpsChief',
    tagline: 'Decide',
    color: '#8B5CF6',
    what: 'Diagnoses each flag with evidence and a recommendation. Connects multiple data points into a story a human can act on.',
    hooks: ['91% diagnostic accuracy', 'Confidence scored per insight', 'Root cause not symptom'],
  },
  {
    icon: Sparkles,
    name: 'AskForge',
    tagline: 'Act',
    color: '#F59E0B',
    what: 'Natural-language interface to the revenue operating system. Accepts a question, returns an answer, and pushes an action into the execution layer.',
    hooks: ['34 queries / 24h', '68% of flags actioned', 'Every action traced and auditable'],
  },
];

export default function SystemPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--rq-amber)' }}>§ 8 · System View</div>
        <h1 className="text-4xl font-bold leading-tight" style={{ color: 'var(--rq-text)' }}>
          This isn&rsquo;t RevOps reporting.<br />
          This is a revenue operating system.
        </h1>
        <p className="max-w-3xl text-base" style={{ color: 'var(--rq-text-muted)' }}>
          Three layers. Observe. Decide. Act. Every failure point in the revenue flow — demand, deals, margin, capacity, compensation, forecast — is detected, explained, and fixed from one surface.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {LAYERS.map((l, i) => {
          const Icon = l.icon;
          return (
            <div key={l.name} className="relative flex flex-col gap-4 rounded-2xl border p-6 md:flex-row md:items-start" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)', borderLeftColor: l.color, borderLeftWidth: 6 }}>
              <div className="flex items-center gap-3 md:w-72">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl" style={{ background: l.color, color: '#0A0A15' }}>
                  <Icon className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: l.color }}>{i + 1} · {l.tagline}</div>
                  <div className="text-2xl font-bold" style={{ color: 'var(--rq-text)' }}>{l.name}</div>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-base leading-relaxed" style={{ color: 'var(--rq-text-secondary)' }}>{l.what}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {l.hooks.map((h) => (
                    <span key={h} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: 'var(--rq-card-alt)', color: 'var(--rq-text-muted)' }}>{h}</span>
                  ))}
                </div>
              </div>

              {i < LAYERS.length - 1 && (
                <div className="absolute -bottom-7 left-1/2 z-10 -translate-x-1/2">
                  <ArrowRight className="h-6 w-6 rotate-90" style={{ color: 'var(--rq-text-faint)' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border-l-4 p-6" style={{ background: 'var(--rq-amber-soft)', borderLeftColor: 'var(--rq-amber)' }}>
        <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--rq-amber)' }}>The demo flow</div>
        <div className="mt-2 text-lg font-semibold leading-relaxed" style={{ color: 'var(--rq-text)' }}>
          Dashboard (Pulse) → Drill into issue (OpsChief) → Ask a question (AskForge) → Run simulation → Trigger action → Show impact
        </div>
        <p className="mt-3 text-sm" style={{ color: 'var(--rq-text-secondary)' }}>
          Don&rsquo;t organize by tools. Organize by failure points in the revenue flow: demand fails, deals fail, margin leaks, capacity breaks, incentives misfire, forecasts lie, no action happens. Every one is a page in this demo. Every page has Pulse, OpsChief, and AskForge.
        </p>
      </div>

      <NarrativeStrip section="system" />
    </main>
  );
}
