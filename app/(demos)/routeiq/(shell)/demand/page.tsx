import { NarrativeStrip } from '@/components/demos/routeiq/NarrativeStrip';

const STAGES = [
  { name: 'Prospect', count: 412, value: '$28.4M', velocity: '4 days', conversion: '62%' },
  { name: 'Qualify', count: 256, value: '$19.1M', velocity: '6 days', conversion: '41%' },
  { name: 'Discovery', count: 105, value: '$12.8M', velocity: '11 days', conversion: '58%' },
  { name: 'Proposal', count: 61, value: '$8.4M', velocity: '9 days', conversion: '44%' },
  { name: 'Negotiate', count: 27, value: '$4.2M', velocity: '8 days', conversion: '71%' },
];

const CHANNELS = [
  { name: 'Inbound web', volume: 148, conversion: '22%', trend: -18 },
  { name: 'Referral', volume: 84, conversion: '41%', trend: +2 },
  { name: 'Trade show', volume: 42, conversion: '11%', trend: -9 },
  { name: 'Partner', volume: 36, conversion: '38%', trend: +4 },
  { name: 'Outbound', volume: 98, conversion: '14%', trend: -1 },
];

export default function DemandPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--rq-amber)' }}>§ 1 · Demand Engine</div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--rq-text)' }}>
          You don&rsquo;t have a pipeline problem. You have a conversion + velocity problem.
        </h1>
        <p className="max-w-3xl text-base" style={{ color: 'var(--rq-text-muted)' }}>
          Coverage is close to target. Volume is fine. The failure point is the gap between stages — where deals sit waiting on something the system could automate.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-5">
        {STAGES.map((s, i) => (
          <div key={s.name} className="flex flex-col gap-2 rounded-xl border p-4" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>Stage {i + 1}</span>
              <span className="font-mono text-xs font-semibold" style={{ color: 'var(--rq-indigo)' }}>{s.conversion}</span>
            </div>
            <div className="text-sm font-semibold" style={{ color: 'var(--rq-text)' }}>{s.name}</div>
            <div className="font-mono text-xl font-bold" style={{ color: 'var(--rq-text)' }}>{s.value}</div>
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--rq-text-muted)' }}>
              <span>{s.count} deals</span>
              <span>{s.velocity}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-5" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
        <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--rq-text)' }}>Channel performance</h2>
        <div className="grid gap-3 md:grid-cols-5">
          {CHANNELS.map((c) => (
            <div key={c.name} className="flex flex-col gap-1 rounded-lg p-3" style={{ background: 'var(--rq-card-alt)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>{c.name}</div>
              <div className="font-mono text-lg font-bold" style={{ color: 'var(--rq-text)' }}>{c.conversion}</div>
              <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--rq-text-muted)' }}>
                <span>{c.volume} leads</span>
                <span style={{ color: c.trend < 0 ? '#DC2626' : '#059669' }}>
                  {c.trend > 0 ? '+' : ''}{c.trend}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NarrativeStrip section="demand" />
    </main>
  );
}
