import { NarrativeStrip } from '@/components/demos/routeiq/NarrativeStrip';

const BANDS = [
  { band: 'Committed', value: '$48.2M', deals: 94, color: '#059669' },
  { band: 'Likely', value: '$12.6M', deals: 38, color: '#0EA5E9' },
  { band: 'Upside', value: '$8.4M', deals: 22, color: '#F59E0B' },
  { band: 'At risk', value: '$4.2M', deals: 18, color: '#DC2626' },
];

const ACCURACY = [
  { q: 'Q1 2025', commit: 84, actual: 86 },
  { q: 'Q2 2025', commit: 81, actual: 83 },
  { q: 'Q3 2025', commit: 83, actual: 85 },
  { q: 'Q4 2025', commit: 82, actual: 79 },
  { q: 'Q1 2026', commit: 78, actual: 61 },
];

export default function ForecastPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--rq-amber)' }}>§ 6 · Forecast & Risk</div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--rq-text)' }}>
          Forecasts don&rsquo;t fail randomly. They fail systematically.
        </h1>
        <p className="max-w-3xl text-base" style={{ color: 'var(--rq-text-muted)' }}>
          Commit accuracy dropped 21 points this quarter. Four reps consistently overcommit by 15%+. The rest of the field is forecasting within 3 points. Weight-adjust those four and the roll-up comes back in line.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {BANDS.map((b) => (
          <div key={b.band} className="flex flex-col gap-2 rounded-xl border p-4" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)', borderLeftColor: b.color, borderLeftWidth: 4 }}>
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: b.color }}>{b.band}</div>
            <div className="font-mono text-2xl font-bold" style={{ color: 'var(--rq-text)' }}>{b.value}</div>
            <div className="text-xs" style={{ color: 'var(--rq-text-muted)' }}>{b.deals} deals</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-5" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
        <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--rq-text)' }}>Commit accuracy — last 5 quarters</h2>
        <div className="flex flex-col gap-3">
          {ACCURACY.map((a) => {
            const diff = a.actual - a.commit;
            return (
              <div key={a.q} className="grid grid-cols-5 gap-3 items-center">
                <div className="font-mono text-sm font-semibold" style={{ color: 'var(--rq-text)' }}>{a.q}</div>
                <div className="col-span-2">
                  <div className="h-3 rounded" style={{ background: 'var(--rq-chart-bar-track)' }}>
                    <div className="h-full rounded" style={{ background: 'var(--rq-indigo)', width: `${a.commit}%` }} />
                  </div>
                  <div className="mt-1 text-xs" style={{ color: 'var(--rq-text-faint)' }}>Commit {a.commit}%</div>
                </div>
                <div className="col-span-1">
                  <div className="h-3 rounded" style={{ background: 'var(--rq-chart-bar-track)' }}>
                    <div className="h-full rounded" style={{ background: 'var(--rq-amber)', width: `${a.actual}%` }} />
                  </div>
                  <div className="mt-1 text-xs" style={{ color: 'var(--rq-text-faint)' }}>Actual {a.actual}%</div>
                </div>
                <div className="font-mono text-sm font-bold" style={{ color: Math.abs(diff) > 10 ? '#DC2626' : diff >= 0 ? '#059669' : 'var(--rq-text-muted)' }}>
                  Δ {diff > 0 ? '+' : ''}{diff}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NarrativeStrip section="forecast" />
    </main>
  );
}
