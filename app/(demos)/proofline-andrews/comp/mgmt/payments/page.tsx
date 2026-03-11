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
  { id: 'PA-001', rep: 'Marcus Reyes', type: 'Q1 Kicker Overage', amount: 2840, reason: 'Variable > $2,500 threshold \u2014 manager sign-off required', urgency: 'high' },
  { id: 'PA-002', rep: 'Priya Nair / Sofia Reyes', type: 'Split Credit Resolution', amount: 1260, reason: 'Split credit dispute resolved in both reps favor \u2014 retroactive credit', urgency: 'medium' },
  { id: 'PA-003', rep: 'James Park', type: 'New Hire Proration', amount: 980, reason: 'Feb 10 start date \u2014 proration applied. Controller review needed.', urgency: 'low' },
  { id: 'PA-004', rep: 'Elena Vargas', type: 'Spirits Adder Audit', amount: 375, reason: '15 new spirits accounts \u2014 3 flagged for account age verification', urgency: 'medium' },
];

const PAYMENTS = [
  { date: 'Mar 3', rep: 'Marcus Reyes', type: 'Variable', amount: 2210, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Marcus Reyes', type: 'Base', amount: 4333, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Sofia Reyes', type: 'Variable', amount: 1840, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Sofia Reyes', type: 'Commission', amount: 3760, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Diego Santos', type: 'Variable', amount: 1620, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Priya Nair', type: 'Variable', amount: 2080, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Priya Nair', type: 'Bonus', amount: 500, status: 'Deposited' },
  { date: 'Mar 17', rep: 'Marcus Reyes', type: 'Variable', amount: 2840, status: 'Pending' },
  { date: 'Mar 17', rep: 'Marcus Reyes', type: 'Base', amount: 4333, status: 'Pending' },
  { date: 'Mar 17', rep: 'Sofia Reyes', type: 'Commission', amount: 3920, status: 'Pending' },
  { date: 'Mar 17', rep: 'Elena Vargas', type: 'Variable', amount: 1780, status: 'Pending' },
  { date: 'Mar 17', rep: 'Elena Vargas', type: 'Bonus', amount: 375, status: 'Approved' },
  { date: 'Mar 17', rep: 'Raj Patel', type: 'Variable', amount: 1950, status: 'Pending' },
  { date: 'Mar 17', rep: 'Kenji Morales', type: 'Commission', amount: 2840, status: 'Approved' },
  { date: 'Mar 17', rep: 'Ana Lima', type: 'Variable', amount: 1640, status: 'Pending' },
  { date: 'Mar 17', rep: 'Carlos Reyes', type: 'Variable', amount: 1720, status: 'Pending' },
  { date: 'Mar 17', rep: 'James Park', type: 'Variable', amount: 980, status: 'Pending' },
  { date: 'Mar 28', rep: 'All Eligible Reps', type: 'Bonus', amount: 18400, status: 'Pending' },
  { date: 'Mar 31', rep: 'Marcus Reyes', type: 'Commission', amount: 4280, status: 'Pending' },
  { date: 'Mar 31', rep: 'Sofia Reyes', type: 'Base', amount: 4333, status: 'Pending' },
];

const EXCEPTIONS = [
  { id: 'EX-017', rep: 'Tyler Brooks', issue: 'Negative clawback \u2014 account closed mid-quarter', amount: -340, resolution: 'Offset against next cycle' },
  { id: 'EX-018', rep: 'James Park', issue: 'New hire proration \u2014 start date Feb 10', amount: 980, resolution: 'Pending controller sign-off' },
  { id: 'EX-019', rep: 'Marcus Reyes', issue: 'Overpayment flag \u2014 variable exceeded $2,500', amount: 2840, resolution: 'Pending manager approval' },
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

/* ── SOX Compliance Data ────────────────────────── */
const CHANGE_AUDIT_LOG = [
  { timestamp: 'Mar 4 09:15', user: 'S. Chen', changeType: 'Rate Change', object: 'RSR Tier 2', before: '1.50%', after: '1.60%', approvedBy: 'Controller (J. Morris)' },
  { timestamp: 'Mar 3 14:22', user: 'T. Nguyen', changeType: 'Territory Transfer', object: 'DAL-05', before: 'A. Patel', after: 'Reassignment Pending', approvedBy: 'Mgr (S. Chen)' },
  { timestamp: 'Mar 1 11:00', user: 'System', changeType: 'Auto-Calc', object: 'Q1 Payout', before: '$142,400', after: '$142,800', approvedBy: 'Auto (within tolerance)' },
  { timestamp: 'Feb 28 16:45', user: 'J. Morris', changeType: 'Quota Adjustment', object: 'DAL District', before: '$2.4M', after: '$2.6M', approvedBy: 'VP Sales (R. Kim)' },
  { timestamp: 'Feb 27 10:30', user: 'S. Chen', changeType: 'New Hire Setup', object: 'James Park', before: 'N/A', after: 'RSR Tier 1', approvedBy: 'HR (M. Lopez)' },
];

const SOD_ROLES = [
  { role: 'Plan Designer', icon: '\u270E', user: 'S. Chen', description: 'Creates and modifies comp plan rules', color: '#3B82F6' },
  { role: 'Plan Approver', icon: '\u2713', user: 'J. Morris', description: 'Reviews and approves plan changes', color: '#F59E0B' },
  { role: 'Payment Releaser', icon: '\u2192', user: 'R. Kim', description: 'Authorizes final payout release', color: '#22C55E' },
];

const APPROVAL_CHAIN = [
  { step: 'Plan Change', color: '#3B82F6' },
  { step: 'Manager Review', color: '#F59E0B' },
  { step: 'Finance Approval', color: '#22C55E' },
  { step: 'Controller Sign-off', color: '#8B5CF6' },
];

const SOX_CONTROLS = [
  { objective: 'Accurate Reporting', feature: 'Immutable ledger, row-level lineage from source to payout', status: 'Active' },
  { objective: 'Authorized Changes', feature: 'Role-based approval chains, segregation of duties enforcement', status: 'Active' },
  { objective: 'Timely Processing', feature: 'Automated pay cycle with SLA monitoring and escalation', status: 'Active' },
  { objective: 'Complete Records', feature: 'Full transaction audit trail — 2.4M events, zero gaps', status: 'Active' },
  { objective: 'Valid Calculations', feature: 'Version-aware engine with regression test suite', status: 'Active' },
];

/* ── Payroll Export Data ────────────────────────── */
const PAYROLL_EXPORT = [
  { employeeId: 'LS-1001', name: 'Marcus Reyes', earningsCode: 'COM', amount: 2840, period: 'Mar 1-15', glCode: '5100-10' },
  { employeeId: 'LS-1002', name: 'Sofia Reyes', earningsCode: 'COM', amount: 3920, period: 'Mar 1-15', glCode: '5100-10' },
  { employeeId: 'LS-1003', name: 'Elena Vargas', earningsCode: 'VAR', amount: 1780, period: 'Mar 1-15', glCode: '5100-20' },
  { employeeId: 'LS-1004', name: 'Diego Santos', earningsCode: 'VAR', amount: 1620, period: 'Mar 1-15', glCode: '5100-20' },
  { employeeId: 'LS-1005', name: 'Raj Patel', earningsCode: 'VAR', amount: 1950, period: 'Mar 1-15', glCode: '5100-20' },
  { employeeId: 'LS-1006', name: 'Kenji Morales', earningsCode: 'COM', amount: 2840, period: 'Mar 1-15', glCode: '5100-10' },
];

const PAYROLL_EXPORT_STATUS = {
  lastExported: 'Mar 7, 2026',
  totalRecords: 36,
  totalAmount: 142800,
  target: 'ADP Workforce Now',
  format: 'CSV (ADP Standard Import)',
};

/* ── Breakage & Returns ────────────────────────── */
const CREDIT_MEMOS = [
  { id: 'CM-0341', date: 'Mar 6', rep: 'Marcus Reyes', product: 'Miller Lite 24pk', cases: 3, reason: 'Out of code — expired Feb 28', amount: -72.00, route: 'DAL-03' },
  { id: 'CM-0342', date: 'Mar 5', rep: 'Elena Vargas', product: 'Blue Moon 6pk', cases: 2, reason: 'Breakage — damaged in transit', amount: -38.40, route: 'FTW-02' },
  { id: 'CM-0343', date: 'Mar 4', rep: 'Diego Santos', product: 'Corona Extra 12pk', cases: 1, reason: 'Retailer rejection — warm product', amount: -33.00, route: 'DAL-01' },
  { id: 'CM-0344', date: 'Mar 3', rep: 'Sofia Reyes', product: 'High Noon Variety 12pk', cases: 4, reason: 'Out of code — seasonal SKU', amount: -132.00, route: 'ALN-02' },
];

export default function PaymentsPage() {
  const totalThisCycle = PAYMENTS.filter(p => p.date.startsWith('Mar 17')).reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <LightKpiCard label="Current Cycle Payroll" value={`$${(totalThisCycle / 1000).toFixed(0)}K`} accent={ACCENT} stagger={0} />
        <LightKpiCard label="Pending Approvals" value={String(PENDING_APPROVALS.length)} accent={ACCENT} stagger={1} />
        <LightKpiCard label="Exceptions" value={String(EXCEPTIONS.length)} accent={ACCENT} stagger={2} />
        <LightKpiCard label="Next Deposit Date" value="Mar 17" accent={ACCENT} stagger={3} />
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

      {/* ═══════ SOX COMPLIANCE — CHANGE AUDIT LOG ═══════ */}
      <LightSectionCard title="SOX COMPLIANCE \u2014 CHANGE AUDIT LOG">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                {['Timestamp', 'User', 'Change Type', 'Object', 'Before', 'After', 'Approved By'].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 text-xs uppercase tracking-wider font-bold"
                    style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHANGE_AUDIT_LOG.map((entry, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                  <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{entry.timestamp}</td>
                  <td className="py-1.5 pr-4 font-bold" style={{ color: 'var(--pl-text)' }}>{entry.user}</td>
                  <td className="py-1.5 pr-4">
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>{entry.changeType}</span>
                  </td>
                  <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text)' }}>{entry.object}</td>
                  <td className="py-1.5 pr-4" style={{ color: '#F87171' }}>{entry.before}</td>
                  <td className="py-1.5 pr-4" style={{ color: '#22C55E' }}>{entry.after}</td>
                  <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{entry.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LightSectionCard>

      {/* ═══════ SEGREGATION OF DUTIES ═══════ */}
      <LightSectionCard title="SEGREGATION OF DUTIES">
        <div className="flex items-center justify-center gap-4 mb-6">
          {SOD_ROLES.map((role, i) => (
            <div key={role.role} className="flex items-center gap-4">
              <div className="text-center p-4 rounded-xl min-w-[160px]" style={{
                background: `${role.color}08`,
                border: `1px solid ${role.color}20`,
              }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-2"
                  style={{ background: `${role.color}15`, color: role.color }}>
                  {role.icon}
                </div>
                <div className="text-sm font-bold mb-0.5" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>{role.role}</div>
                <div className="text-xs font-bold font-mono" style={{ color: role.color }}>{role.user}</div>
                <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>{role.description}</div>
              </div>
              {i < SOD_ROLES.length - 1 && (
                <div className="text-2xl font-bold" style={{ color: 'var(--pl-text-faint)' }}>{'\u2260'}</div>
              )}
            </div>
          ))}
        </div>

        {/* Approval Chain Flow */}
        <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--pl-text-muted)' }}>
            APPROVAL CHAIN
          </div>
          <div className="flex items-center justify-center gap-0">
            {APPROVAL_CHAIN.map((step, i) => (
              <div key={step.step} className="flex items-center">
                <div className="px-4 py-2 rounded-lg text-xs font-bold font-mono"
                  style={{ background: `${step.color}15`, color: step.color, border: `1px solid ${step.color}30` }}>
                  {step.step}
                </div>
                {i < APPROVAL_CHAIN.length - 1 && (
                  <div className="px-2 text-lg font-bold" style={{ color: 'var(--pl-text-faint)' }}>{'\u2192'}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </LightSectionCard>

      {/* ═══════ SOX CONTROL MAPPING ═══════ */}
      <LightSectionCard title="SOX CONTROL MAPPING">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                {['Control Objective', 'PROOFLINE Feature', 'Status'].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 text-xs uppercase tracking-wider font-bold"
                    style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SOX_CONTROLS.map((ctrl, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                  <td className="py-2 pr-4 font-bold" style={{ color: 'var(--pl-text)' }}>{ctrl.objective}</td>
                  <td className="py-2 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{ctrl.feature}</td>
                  <td className="py-2">
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>ACTIVE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LightSectionCard>

      {/* ═══════ PAYROLL EXPORT PREVIEW ═══════ */}
      <LightSectionCard title="PAYROLL EXPORT \u2014 ADP INTEGRATION">
        {/* Export status banner */}
        <div className="mb-4 p-4 rounded-xl flex items-center justify-between" style={{
          background: 'rgba(34,197,94,0.06)',
          border: '1px solid rgba(34,197,94,0.15)',
        }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>{'\u2713'}</div>
            <div>
              <div className="text-sm font-bold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
                Last exported {PAYROLL_EXPORT_STATUS.lastExported}
              </div>
              <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                {PAYROLL_EXPORT_STATUS.totalRecords} records &middot; ${PAYROLL_EXPORT_STATUS.totalAmount.toLocaleString()} &middot; {PAYROLL_EXPORT_STATUS.format}
              </div>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all"
            style={{ background: 'rgba(14,165,233,0.12)', color: ACCENT, border: `1px solid ${ACCENT}30` }}>
            EXPORT CURRENT PERIOD
          </button>
        </div>

        {/* Export preview table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                {['Employee ID', 'Name', 'Earnings Code', 'Amount', 'Period', 'GL Code'].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 text-xs uppercase tracking-wider font-bold"
                    style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYROLL_EXPORT.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                  <td className="py-1.5 pr-4 font-bold" style={{ color: 'var(--pl-text)' }}>{row.employeeId}</td>
                  <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text)' }}>{row.name}</td>
                  <td className="py-1.5 pr-4">
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{ background: 'rgba(14,165,233,0.1)', color: ACCENT }}>{row.earningsCode}</span>
                  </td>
                  <td className="py-1.5 pr-4 text-right font-bold" style={{ color: ACCENT }}>${row.amount.toLocaleString()}</td>
                  <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{row.period}</td>
                  <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-faint)' }}>{row.glCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADP mapping */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
            <div className="text-xs font-mono font-bold uppercase mb-1" style={{ color: 'var(--pl-text-muted)' }}>Target</div>
            <div className="text-sm font-bold" style={{ color: 'var(--pl-text)' }}>{PAYROLL_EXPORT_STATUS.target}</div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
            <div className="text-xs font-mono font-bold uppercase mb-1" style={{ color: 'var(--pl-text-muted)' }}>Format</div>
            <div className="text-sm font-bold" style={{ color: 'var(--pl-text)' }}>{PAYROLL_EXPORT_STATUS.format}</div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
            <div className="text-xs font-mono font-bold uppercase mb-1" style={{ color: 'var(--pl-text-muted)' }}>Schedule</div>
            <div className="text-sm font-bold" style={{ color: 'var(--pl-text)' }}>Biweekly (auto)</div>
          </div>
        </div>
      </LightSectionCard>

      {/* ═══════ BREAKAGE & RETURNS ═══════ */}
      <LightSectionCard title="BREAKAGE & RETURNS — CREDIT MEMOS">
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
            <div className="text-xl font-bold font-mono" style={{ color: '#F87171' }}>
              {CREDIT_MEMOS.length}
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Credit memos (MTD)</div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
            <div className="text-xl font-bold font-mono" style={{ color: '#F87171' }}>
              ${Math.abs(CREDIT_MEMOS.reduce((s, m) => s + m.amount, 0)).toFixed(2)}
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Total credit impact</div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
            <div className="text-xl font-bold font-mono" style={{ color: '#F87171' }}>
              {CREDIT_MEMOS.reduce((s, m) => s + m.cases, 0)}
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Cases returned</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                {['ID', 'Date', 'Rep', 'Product', 'Cases', 'Reason', 'Credit'].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 text-xs uppercase tracking-wider font-bold"
                    style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CREDIT_MEMOS.map((memo) => (
                <tr key={memo.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                  <td className="py-1.5 pr-4 font-bold" style={{ color: 'var(--pl-text-faint)' }}>{memo.id}</td>
                  <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{memo.date}</td>
                  <td className="py-1.5 pr-4 font-bold" style={{ color: 'var(--pl-text)' }}>{memo.rep}</td>
                  <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text)' }}>{memo.product}</td>
                  <td className="py-1.5 pr-4 text-right" style={{ color: 'var(--pl-text)' }}>{memo.cases}</td>
                  <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{memo.reason}</td>
                  <td className="py-1.5 pr-4 text-right font-bold" style={{ color: '#F87171' }}>{memo.amount < 0 ? '-' : ''}${Math.abs(memo.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
          Credit memos reduce credited revenue for the affected rep. Commission adjustments applied in the next pay cycle. Out-of-code returns exceeding 2% of route volume trigger a FIFO rotation audit.
        </div>
      </LightSectionCard>
    </>
  );
}
