import { NarrativeStrip } from '@/components/demos/routeiq/NarrativeStrip';

const STATES = [
  { state: 'MO', hq: 'Kansas City', reps: 16, quota: '$42M', attainment: 84, load: 'balanced' },
  { state: 'KS', hq: 'Wichita', reps: 11, quota: '$28M', attainment: 72, load: 'overloaded' },
  { state: 'NE', hq: 'Omaha', reps: 9, quota: '$22M', attainment: 91, load: 'slack' },
  { state: 'IA', hq: 'Des Moines', reps: 10, quota: '$24M', attainment: 88, load: 'balanced' },
  { state: 'OK', hq: 'Tulsa', reps: 8, quota: '$18M', attainment: 74, load: 'balanced' },
  { state: 'AR', hq: 'Little Rock', reps: 7, quota: '$16M', attainment: 69, load: 'understaffed' },
];

const LOAD_COLORS: Record<string, string> = {
  balanced: '#059669',
  slack: '#0EA5E9',
  overloaded: '#DC2626',
  understaffed: '#D97706',
};

export default function CapacityPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--rq-amber)' }}>§ 4 · Capacity & Coverage</div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--rq-text)' }}>
          Your plan assumes performance that your system cannot produce.
        </h1>
        <p className="max-w-3xl text-base" style={{ color: 'var(--rq-text-muted)' }}>
          Quota was raised 12% YoY but headcount is flat and the top 20% is already carrying 64% of revenue. The bottom 80% would need to grow 18% — they historically grow 4%.
        </p>
      </header>

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
        <div className="grid grid-cols-6 gap-2 border-b p-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)', borderColor: 'var(--rq-border)' }}>
          <div>State / DC</div>
          <div className="text-right">Reps</div>
          <div className="text-right">Quota</div>
          <div className="text-right">Attainment</div>
          <div className="col-span-2">Load balance</div>
        </div>
        {STATES.map((s) => (
          <div key={s.state} className="grid grid-cols-6 gap-2 border-b p-4 text-sm last:border-b-0" style={{ color: 'var(--rq-text)', borderColor: 'var(--rq-border)' }}>
            <div>
              <div className="font-bold">{s.state}</div>
              <div className="text-xs" style={{ color: 'var(--rq-text-faint)' }}>{s.hq}</div>
            </div>
            <div className="text-right font-mono">{s.reps}</div>
            <div className="text-right font-mono">{s.quota}</div>
            <div className="text-right font-mono" style={{ color: s.attainment < 75 ? '#DC2626' : s.attainment > 90 ? '#059669' : 'var(--rq-text)' }}>
              {s.attainment}%
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <div className="h-2 flex-1 rounded" style={{ background: 'var(--rq-chart-bar-track)' }}>
                <div className="h-full rounded" style={{ background: LOAD_COLORS[s.load], width: `${s.attainment}%` }} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: LOAD_COLORS[s.load] }}>{s.load}</span>
            </div>
          </div>
        ))}
      </div>

      <NarrativeStrip section="capacity" />
    </main>
  );
}
