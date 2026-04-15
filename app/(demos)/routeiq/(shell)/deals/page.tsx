import { NarrativeStrip } from '@/components/demos/routeiq/NarrativeStrip';

const DEAL_HEALTH = [
  { segment: 'Enterprise >$100K', win: '52%', slip: '14%', push: '11%' },
  { segment: 'Mid-market $50-100K', win: '38%', slip: '32%', push: '22%' },
  { segment: 'Mid-market $25-50K', win: '44%', slip: '18%', push: '19%' },
  { segment: 'SMB <$25K', win: '61%', slip: '8%', push: '14%' },
];

const SEGMENT_ANOMALIES = [
  { region: 'West (KS, NE)', issue: 'Mid-market slipping 2.3× normal', rep: '2 reps responsible' },
  { region: 'Central (MO, IA)', issue: 'Win rate steady at 47%', rep: 'Healthy' },
  { region: 'South (OK, AR)', issue: 'Push rate elevated (28%)', rep: '3 reps over-committing' },
];

export default function DealsPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--rq-amber)' }}>§ 2 · Deal Execution</div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--rq-text)' }}>
          Revenue doesn&rsquo;t miss because of effort. It misses because of execution breakdowns.
        </h1>
        <p className="max-w-3xl text-base" style={{ color: 'var(--rq-text-muted)' }}>
          Every segment has a different failure signature. One bucket slips, one pushes, one discounts — and the aggregates hide which reps and regions are actually broken.
        </p>
      </header>

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
        <div className="grid grid-cols-4 gap-2 border-b p-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)', borderColor: 'var(--rq-border)' }}>
          <div>Segment</div>
          <div className="text-right">Win rate</div>
          <div className="text-right">Slip rate</div>
          <div className="text-right">Push rate</div>
        </div>
        {DEAL_HEALTH.map((d) => (
          <div key={d.segment} className="grid grid-cols-4 gap-2 border-b p-4 text-sm last:border-b-0" style={{ color: 'var(--rq-text)', borderColor: 'var(--rq-border)' }}>
            <div className="font-semibold">{d.segment}</div>
            <div className="text-right font-mono" style={{ color: '#059669' }}>{d.win}</div>
            <div className="text-right font-mono" style={{ color: d.slip.startsWith('3') ? '#DC2626' : 'var(--rq-text-muted)' }}>{d.slip}</div>
            <div className="text-right font-mono" style={{ color: 'var(--rq-text-muted)' }}>{d.push}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {SEGMENT_ANOMALIES.map((a) => (
          <div key={a.region} className="flex flex-col gap-2 rounded-xl border p-4" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--rq-indigo)' }}>{a.region}</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--rq-text)' }}>{a.issue}</div>
            <div className="text-xs" style={{ color: 'var(--rq-text-muted)' }}>{a.rep}</div>
          </div>
        ))}
      </div>

      <NarrativeStrip section="deals" />
    </main>
  );
}
