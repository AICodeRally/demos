import { NarrativeStrip } from '@/components/demos/routeiq/NarrativeStrip';
import Link from 'next/link';
import { Calculator, LineChart, ArrowRight } from 'lucide-react';

const DISTRIBUTION = [
  { band: '< 60%', count: 8, color: '#DC2626' },
  { band: '60-75%', count: 14, color: '#D97706' },
  { band: '75-85%', count: 17, color: '#F59E0B' },
  { band: '85-100%', count: 13, color: '#10B981' },
  { band: '100-110%', count: 5, color: '#059669' },
  { band: '> 110%', count: 3, color: '#047857' },
];

const MAX = Math.max(...DISTRIBUTION.map((d) => d.count));

export default function CompPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--rq-amber)' }}>§ 5 · Compensation & Behavior · THE KILLER WEDGE</div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--rq-text)' }}>
          You&rsquo;re not incentivizing behavior. You&rsquo;re funding randomness.
        </h1>
        <p className="max-w-3xl text-base" style={{ color: 'var(--rq-text-muted)' }}>
          The accelerator is mechanically unreachable for 87% of the field. Only 8 of 60 reps have hit 100% in the last 4 quarters. The other 52 see it as theater — and the plan still costs you 1.3 points of comp-to-revenue.
        </p>
      </header>

      <div className="rounded-xl border p-5" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
        <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--rq-text)' }}>Attainment distribution (60 reps)</h2>
        <div className="flex items-end justify-between gap-3 h-48">
          {DISTRIBUTION.map((d) => (
            <div key={d.band} className="flex flex-1 flex-col items-center gap-2">
              <div className="font-mono text-sm font-bold" style={{ color: 'var(--rq-text)' }}>{d.count}</div>
              <div className="w-full rounded-t" style={{ background: d.color, height: `${(d.count / MAX) * 100}%`, minHeight: 8 }} />
              <div className="text-[11px] font-semibold uppercase" style={{ color: 'var(--rq-text-muted)' }}>{d.band}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-lg p-3" style={{ background: 'var(--rq-card-alt)' }}>
          <div className="text-sm" style={{ color: 'var(--rq-text)' }}>
            <span className="font-bold">Accelerator threshold: 100%.</span>{' '}
            <span style={{ color: 'var(--rq-text-muted)' }}>Only 8 reps clear it. 52 reps land below.</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/routeiq/comp/calculator"
          className="group flex flex-col gap-3 rounded-xl border p-5 transition-colors"
          style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}
        >
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" style={{ color: 'var(--rq-amber)' }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-amber)' }}>Interactive</span>
          </div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--rq-text)' }}>Payout calculator</h3>
          <p className="text-sm" style={{ color: 'var(--rq-text-muted)' }}>Pick a rep, drag the attainment slider, watch the plan rebuild in real time. Test a lower accelerator threshold and see the team-wide impact.</p>
          <div className="mt-auto flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--rq-amber)' }}>
            Open calculator <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href="/routeiq/comp/story"
          className="group flex flex-col gap-3 rounded-xl border p-5 transition-colors"
          style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}
        >
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5" style={{ color: 'var(--rq-indigo)' }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-indigo)' }}>Narrative</span>
          </div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--rq-text)' }}>13-week earnings story</h3>
          <p className="text-sm" style={{ color: 'var(--rq-text-muted)' }}>Follow one rep across a quarter. What happens if they hit gates in week 5 vs week 10? Shows cumulative earnings, tier unlocks, and the moment the plan decides whether this person stays or leaves.</p>
          <div className="mt-auto flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--rq-indigo)' }}>
            Read the story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      <NarrativeStrip section="comp" />
    </main>
  );
}
