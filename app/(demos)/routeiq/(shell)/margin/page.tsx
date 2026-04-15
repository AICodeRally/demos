import { NarrativeStrip } from '@/components/demos/routeiq/NarrativeStrip';

const WATERFALL = [
  { label: 'List price', value: 100.0, color: '#4338CA' },
  { label: '− Volume discount', value: -4.2, color: '#DC2626' },
  { label: '− Promotional allowance', value: -5.8, color: '#DC2626' },
  { label: '− Invoice discount', value: -1.2, color: '#DC2626' },
  { label: 'Net price', value: 88.8, color: '#059669' },
  { label: '− COGS', value: -67.1, color: '#64748B' },
  { label: 'Gross margin', value: 21.7, color: '#F59E0B' },
];

const ROUTES_AT_RISK = [
  { route: 'KC-01', gm: '14.8%', reason: 'Spirits mix-shift' },
  { route: 'KC-04', gm: '16.1%', reason: 'Over-discounted mixers' },
  { route: 'OMA-02', gm: '17.2%', reason: 'Promo allowance leakage' },
  { route: 'DSM-01', gm: '17.8%', reason: 'Volume bracket pressure' },
  { route: 'TUL-03', gm: '15.9%', reason: 'Competitive price match' },
  { route: 'WIC-02', gm: '16.7%', reason: 'New-account pricing' },
  { route: 'LR-01', gm: '17.4%', reason: 'Spirits mix-shift' },
];

export default function MarginPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--rq-amber)' }}>§ 3 · Pricing & Margin</div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--rq-text)' }}>
          You&rsquo;re not losing revenue. You&rsquo;re leaking margin quietly.
        </h1>
        <p className="max-w-3xl text-base" style={{ color: 'var(--rq-text-muted)' }}>
          The top line looks healthy. Discount depth is climbing, list-to-net compression is up 1.4 pts, and most of the leak is in promotional allowances where no one is watching.
        </p>
      </header>

      <div className="rounded-xl border p-5" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
        <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--rq-text)' }}>Price waterfall — list → gross margin</h2>
        <div className="flex flex-col gap-2">
          {WATERFALL.map((w) => {
            const abs = Math.abs(w.value);
            const isNeg = w.value < 0;
            return (
              <div key={w.label} className="flex items-center gap-3">
                <div className="w-48 text-sm font-medium" style={{ color: 'var(--rq-text)' }}>{w.label}</div>
                <div className="flex-1">
                  <div className="h-6 rounded" style={{ background: 'var(--rq-chart-bar-track)' }}>
                    <div
                      className="h-full rounded"
                      style={{ background: w.color, width: `${Math.min(100, abs)}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right font-mono text-sm font-bold" style={{ color: isNeg ? '#DC2626' : w.color }}>
                  {isNeg ? '' : '+'}{w.value.toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border p-5" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
        <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--rq-text)' }}>7 routes below 18% gross margin floor</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {ROUTES_AT_RISK.map((r) => (
            <div key={r.route} className="flex items-center justify-between rounded-lg p-3" style={{ background: 'var(--rq-card-alt)' }}>
              <div>
                <div className="font-mono text-sm font-bold" style={{ color: 'var(--rq-text)' }}>{r.route}</div>
                <div className="text-xs" style={{ color: 'var(--rq-text-muted)' }}>{r.reason}</div>
              </div>
              <div className="font-mono text-lg font-bold" style={{ color: '#DC2626' }}>{r.gm}</div>
            </div>
          ))}
        </div>
      </div>

      <NarrativeStrip section="margin" />
    </main>
  );
}
