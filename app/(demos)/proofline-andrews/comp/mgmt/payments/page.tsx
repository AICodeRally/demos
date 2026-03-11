'use client';

import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';

const ACCENT = '#0EA5E9';

const PAY_CYCLES = [
  { label: 'Jan 1\u201315', date: 'Jan 17', status: 'deposited', current: false },
  { label: 'Jan 16\u201331', date: 'Feb 3', status: 'deposited', current: false },
  { label: 'Feb 1\u201315', date: 'Feb 17', status: 'deposited', current: false },
  { label: 'Feb 16\u201328', date: 'Mar 3', status: 'deposited', current: false },
  { label: 'Mar 1\u201315', date: 'Mar 17', status: 'current', current: true },
  { label: 'Mar 16\u201331', date: 'Mar 31', status: 'upcoming', current: false },
  { label: 'Apr 1\u201315', date: 'Apr 17', status: 'upcoming', current: false },
];

const PENDING_APPROVALS = [
  { id: 'PA-001', rep: 'Marcus Webb', type: 'Q1 Kicker Overage', amount: 2840, reason: 'Variable > $2,500 threshold \u2014 manager sign-off required', urgency: 'high' },
  { id: 'PA-002', rep: 'Priya Nair / Sofia Reyes', type: 'Split Credit Resolution', amount: 1260, reason: 'Split credit dispute resolved in both reps favor \u2014 retroactive credit', urgency: 'medium' },
  { id: 'PA-003', rep: 'James Park', type: 'New Hire Proration', amount: 980, reason: 'Feb 10 start date \u2014 proration applied. Controller review needed.', urgency: 'low' },
  { id: 'PA-004', rep: 'Elena Vargas', type: 'Spirits Adder Audit', amount: 375, reason: '15 new spirits accounts \u2014 3 flagged for account age verification', urgency: 'medium' },
];

const PAYMENTS = [
  { date: 'Mar 3', rep: 'Marcus Webb', type: 'Variable', amount: 2210, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Marcus Webb', type: 'Base', amount: 4333, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Sofia Reyes', type: 'Variable', amount: 1840, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Sofia Reyes', type: 'Commission', amount: 3760, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Diego Santos', type: 'Variable', amount: 1620, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Priya Nair', type: 'Variable', amount: 2080, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Priya Nair', type: 'Bonus', amount: 500, status: 'Deposited' },
  { date: 'Mar 17', rep: 'Marcus Webb', type: 'Variable', amount: 2840, status: 'Pending' },
  { date: 'Mar 17', rep: 'Marcus Webb', type: 'Base', amount: 4333, status: 'Pending' },
  { date: 'Mar 17', rep: 'Sofia Reyes', type: 'Commission', amount: 3920, status: 'Pending' },
  { date: 'Mar 17', rep: 'Elena Vargas', type: 'Variable', amount: 1780, status: 'Pending' },
  { date: 'Mar 17', rep: 'Elena Vargas', type: 'Bonus', amount: 375, status: 'Approved' },
  { date: 'Mar 17', rep: 'Raj Patel', type: 'Variable', amount: 1950, status: 'Pending' },
  { date: 'Mar 17', rep: 'Kenji Morales', type: 'Commission', amount: 2840, status: 'Approved' },
  { date: 'Mar 17', rep: 'Ana Lima', type: 'Variable', amount: 1640, status: 'Pending' },
  { date: 'Mar 17', rep: 'Carlos Reyes', type: 'Variable', amount: 1720, status: 'Pending' },
  { date: 'Mar 17', rep: 'James Park', type: 'Variable', amount: 980, status: 'Pending' },
  { date: 'Mar 28', rep: 'All Eligible Reps', type: 'Bonus', amount: 18400, status: 'Pending' },
  { date: 'Mar 31', rep: 'Marcus Webb', type: 'Commission', amount: 4280, status: 'Pending' },
  { date: 'Mar 31', rep: 'Sofia Reyes', type: 'Base', amount: 4333, status: 'Pending' },
];

const EXCEPTIONS = [
  { id: 'EX-017', rep: 'Tyler Brooks', issue: 'Negative clawback \u2014 account closed mid-quarter', amount: -340, resolution: 'Offset against next cycle' },
  { id: 'EX-018', rep: 'James Park', issue: 'New hire proration \u2014 start date Feb 10', amount: 980, resolution: 'Pending controller sign-off' },
  { id: 'EX-019', rep: 'Marcus Webb', issue: 'Overpayment flag \u2014 variable exceeded $2,500', amount: 2840, resolution: 'Pending manager approval' },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Deposited: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E' },
  Approved: { bg: 'rgba(37,99,235,0.1)', color: '#2563EB' },
  Pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  Held: { bg: 'rgba(248,113,113,0.1)', color: '#F87171' },
};

const URGENCY_STYLES: Record<string, { bg: string; color: string }> = {
  high: { bg: 'rgba(248,113,113,0.1)', color: '#F87171' },
  medium: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  low: { bg: 'rgba(148,163,184,0.1)', color: '#94A3B8' },
};

export default function PaymentsPage() {
  const totalThisCycle = PAYMENTS.filter(p => p.date.startsWith('Mar 17')).reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <LightKpiCard label="Current Cycle Payroll" value={`$${(totalThisCycle / 1000).toFixed(0)}K`} accent={ACCENT} />
        <LightKpiCard label="Pending Approvals" value={String(PENDING_APPROVALS.length)} accent={ACCENT} />
        <LightKpiCard label="Exceptions" value={String(EXCEPTIONS.length)} accent={ACCENT} />
        <LightKpiCard label="Next Deposit Date" value="Mar 17" accent={ACCENT} />
      </div>

      {/* Pay Cycle Timeline */}
      <LightSectionCard title="PAY CYCLE TIMELINE">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {PAY_CYCLES.map((cycle, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[90px] text-center"
              style={{
                background: cycle.current ? `${ACCENT}18` : 'var(--pl-card-alt)',
                border: `1px solid ${cycle.current ? ACCENT : 'var(--pl-border)'}`,
              }}>
              <div className="text-xs font-mono font-bold uppercase"
                style={{ color: cycle.current ? ACCENT : 'var(--pl-text-faint)' }}>
                {cycle.status === 'current' ? '\u25B6 CURRENT' : cycle.status === 'deposited' ? '\u2713 PAID' : 'UPCOMING'}
              </div>
              <div className="text-xs font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{cycle.label}</div>
              <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>Dep. {cycle.date}</div>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* Pending Approvals */}
      <LightSectionCard title="PENDING APPROVALS">
        <div className="grid gap-3">
          {PENDING_APPROVALS.map(item => {
            const urg = URGENCY_STYLES[item.urgency];
            return (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                <div className="flex-shrink-0 text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                  style={{ background: urg.bg, color: urg.color }}>
                  {item.urgency.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{item.rep}</span>
                    <span className="text-xs font-bold font-mono" style={{ color: ACCENT }}>${item.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-xs font-mono font-bold mb-0.5" style={{ color: 'var(--pl-text-muted)' }}>{item.type}</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>{item.reason}</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-2 py-1 rounded text-xs font-bold font-mono"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>
                    APPROVE
                  </button>
                  <button className="px-2 py-1 rounded text-xs font-bold font-mono"
                    style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171' }}>
                    FLAG
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </LightSectionCard>

      {/* Payment Ledger */}
      <LightSectionCard title="PAYMENT LEDGER">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                {['Date', 'Rep', 'Type', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 text-xs uppercase tracking-wider font-bold"
                    style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((payment, i) => {
                const s = STATUS_STYLES[payment.status] ?? STATUS_STYLES['Pending'];
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                    <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{payment.date}</td>
                    <td className="py-1.5 pr-4 font-bold" style={{ color: 'var(--pl-text)' }}>{payment.rep}</td>
                    <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{payment.type}</td>
                    <td className="py-1.5 pr-4 text-right font-bold" style={{ color: ACCENT }}>${payment.amount.toLocaleString()}</td>
                    <td className="py-1.5">
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                        style={{ background: s.bg, color: s.color }}>{payment.status.toUpperCase()}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LightSectionCard>

      {/* Exceptions */}
      <LightSectionCard title="PAYMENT EXCEPTIONS">
        <div className="grid gap-3">
          {EXCEPTIONS.map(ex => (
            <div key={ex.id} className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <div className="flex-shrink-0 text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171' }}>
                {ex.id}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{ex.rep}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: ex.amount < 0 ? '#F87171' : ACCENT }}>
                    {ex.amount < 0 ? '-' : ''}${Math.abs(ex.amount).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs font-mono mb-0.5" style={{ color: 'var(--pl-text-muted)' }}>{ex.issue}</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Resolution: {ex.resolution}</div>
              </div>
            </div>
          ))}
        </div>
      </LightSectionCard>
    </>
  );
}
