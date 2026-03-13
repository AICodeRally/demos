'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';

/* ── Pipeline nodes ──────────────────────────────────────── */

const PIPELINE = [
  { label: 'POS Terminal', desc: 'iPad register app', color: '#8B5CF6' },
  { label: 'D365 Commerce', desc: 'RetailTransactionTable', color: '#1E3A5F' },
  { label: 'Transaction Event', desc: 'D365BusinessEvent envelope', color: '#06B6D4' },
  { label: 'BroadcastChannel', desc: 'register-pos channel', color: '#10B981' },
  { label: 'Manager Console', desc: 'Real-time coaching UI', color: '#F59E0B' },
];

/* ── D365TransactionEvent key fields ─────────────────────── */

const EVENT_FIELDS = [
  { field: 'BusinessEventId', type: 'string', example: 'RetailTransactionCreated' },
  { field: 'EventTime', type: 'string (ISO)', example: '2026-03-13T14:32:08Z' },
  { field: 'LegalEntity', type: 'string', example: 'SSC' },
  { field: 'transactionId', type: 'string', example: 'TXN-0847-20260313-001' },
  { field: 'store', type: 'string', example: 'STORE-0042' },
  { field: 'terminal', type: 'string', example: 'POS-03' },
  { field: 'staffId', type: 'string', example: 'REP-1042' },
  { field: 'grossAmount', type: 'number', example: '$3,247.00' },
  { field: 'netAmount', type: 'number', example: '$2,997.00' },
  { field: 'numberOfItems', type: 'number', example: '4' },
  { field: 'salesLines', type: 'D365SalesLine[]', example: '[...itemId, qty, price, netAmount]' },
  { field: 'tenderLines', type: 'D365TenderLine[]', example: '[...tenderTypeId, amount, maskedCardNumber]' },
];

/* ── BroadcastChannel message types ──────────────────────── */

const BROADCAST_TYPES = [
  {
    type: 'coaching',
    desc: 'Manager sends coaching nudge to a rep\'s POS tablet',
    shape: '{ repId, repName, message, action, commissionDelta?, timestamp }',
    color: '#8B5CF6',
  },
  {
    type: 'comp-update',
    desc: 'Comp admin pushes a plan change to all terminals',
    shape: '{ planId, planName, changeType, summary, pushedBy, timestamp }',
    color: '#1E3A5F',
  },
  {
    type: 'alert',
    desc: 'System alert broadcast (info / warning / urgent)',
    shape: '{ severity, message, timestamp }',
    color: '#EF4444',
  },
  {
    type: 'pos-sync',
    desc: 'Force POS terminals to reload comp rules',
    shape: '{ reason, planIds[], timestamp }',
    color: '#06B6D4',
  },
  {
    type: 'ack',
    desc: 'Acknowledgment from a terminal that it received a message',
    shape: '{ id }',
    color: '#10B981',
  },
];

/* ── Sample event JSON ───────────────────────────────────── */

const SAMPLE_EVENT = {
  BusinessEventId: 'RetailTransactionCreated',
  ControlNumber: 84732,
  EventId: 'evt-20260313-143208-042',
  EventTime: '2026-03-13T14:32:08Z',
  MajorVersion: 1,
  MinorVersion: 0,
  LegalEntity: 'SSC',
  Category: 'RetailTransaction',
  transactionId: 'TXN-0847-20260313-001',
  receiptId: 'RCP-042-001',
  store: 'STORE-0042',
  terminal: 'POS-03',
  channel: 5637144592,
  staffId: 'REP-1042',
  transDate: '2026-03-13',
  grossAmount: 3247.0,
  netAmount: 2997.0,
  taxAmount: 250.0,
  numberOfItems: 4,
  currency: 'USD',
  salesLines: [
    { lineNum: 1, itemId: 'MAT-QH-2026', description: 'Summit Cloud Queen Hybrid', qty: 1, price: 2499.0, netAmount: 2499.0 },
    { lineNum: 2, itemId: 'ACC-PROT-Q', description: 'Premium Mattress Protector', qty: 1, price: 249.0, netAmount: 249.0 },
    { lineNum: 3, itemId: 'ACC-PILLOW-2', description: 'Memory Foam Pillow (2-pack)', qty: 1, price: 149.0, netAmount: 149.0 },
    { lineNum: 4, itemId: 'ACC-FRAME-Q', description: 'Adjustable Base Frame Queen', qty: 1, price: 350.0, netAmount: 100.0 },
  ],
  tenderLines: [
    { tenderLineId: 'TND-001', tenderTypeId: 'VISA', amount: 2997.0, maskedCardNumber: '****4821' },
  ],
};

export default function D365IntegrationPage() {
  return (
    <RegisterPage
      title="D365 Commerce Integration"
      subtitle="Microsoft Dynamics 365 Retail"
      accentColor="#F59E0B"
    >
      {/* ── Architecture Pipeline ────────────────────────────── */}
      <section className="mb-10">
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--register-text)' }}>
          Data Flow Pipeline
        </p>
        <p className="text-xs mb-5" style={{ color: 'var(--register-text-muted)' }}>
          Every closed sale travels this path in under 200ms
        </p>

        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {PIPELINE.map((node, i) => (
            <div key={node.label} className="flex items-center gap-2 shrink-0">
              <div
                className="rounded-xl px-5 py-4 text-center min-w-[150px]"
                style={{
                  backgroundColor: `${node.color}18`,
                  border: `2px solid ${node.color}`,
                }}
              >
                <p className="text-[13px] font-bold" style={{ color: node.color }}>
                  {node.label}
                </p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--register-text-muted)' }}>
                  {node.desc}
                </p>
              </div>
              {i < PIPELINE.length - 1 && (
                <span className="text-xl font-bold shrink-0" style={{ color: 'var(--register-text-muted)' }}>
                  &rarr;
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Transaction Event Schema ─────────────────────────── */}
      <section className="mb-10">
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--register-text)' }}>
          D365TransactionEvent Schema
        </p>
        <p className="text-xs mb-4" style={{ color: 'var(--register-text-muted)' }}>
          Key fields from the combined BusinessEvent + TransactionHeader + SalesLines + TenderLines
        </p>

        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: 'var(--register-border)' }}
        >
          <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--register-bg-elevated)' }}>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--register-text-muted)' }}>Field</th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--register-text-muted)' }}>Type</th>
                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--register-text-muted)' }}>Example</th>
              </tr>
            </thead>
            <tbody>
              {EVENT_FIELDS.map((f, i) => (
                <tr
                  key={f.field}
                  style={{
                    borderTop: '1px solid var(--register-border)',
                    backgroundColor: i % 2 === 0 ? 'var(--register-bg-surface)' : 'transparent',
                  }}
                >
                  <td className="px-4 py-2 text-[12px] font-mono font-semibold" style={{ color: '#F59E0B' }}>
                    {f.field}
                  </td>
                  <td className="px-4 py-2 text-[12px] font-mono" style={{ color: 'var(--register-text-muted)' }}>
                    {f.type}
                  </td>
                  <td className="px-4 py-2 text-[12px]" style={{ color: 'var(--register-text)' }}>
                    {f.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── BroadcastChannel Messages ────────────────────────── */}
      <section className="mb-10">
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--register-text)' }}>
          BroadcastChannel Message Types
        </p>
        <p className="text-xs mb-4" style={{ color: 'var(--register-text-muted)' }}>
          Channel: <code className="font-mono" style={{ color: '#F59E0B' }}>register-pos</code> — 5 message types for real-time POS &harr; Manager communication
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BROADCAST_TYPES.map((bt) => (
            <div
              key={bt.type}
              className="rounded-xl border p-5"
              style={{
                borderColor: 'var(--register-border)',
                backgroundColor: 'var(--register-bg-surface)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: bt.color }}
                />
                <span className="text-[13px] font-bold font-mono" style={{ color: bt.color }}>
                  {bt.type}
                </span>
              </div>
              <p className="text-[12px] mb-3" style={{ color: 'var(--register-text)' }}>
                {bt.desc}
              </p>
              <div
                className="rounded-lg px-3 py-2 font-mono text-[10px] leading-relaxed"
                style={{ backgroundColor: 'var(--register-bg-elevated)', color: 'var(--register-text-muted)' }}
              >
                {bt.shape}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sample Event JSON ────────────────────────────────── */}
      <section className="mb-6">
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--register-text)' }}>
          Sample Transaction Event
        </p>
        <p className="text-xs mb-4" style={{ color: 'var(--register-text-muted)' }}>
          A real-shaped D365 Commerce transaction captured at POS-03, Store 42
        </p>

        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: 'var(--register-border)' }}
        >
          <div
            className="px-4 py-2 flex items-center justify-between"
            style={{ backgroundColor: 'var(--register-bg-elevated)', borderBottom: '1px solid var(--register-border)' }}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--register-text-muted)' }}>
              D365TransactionEvent
            </span>
            <span className="text-[10px] font-mono" style={{ color: '#F59E0B' }}>
              application/json
            </span>
          </div>
          <pre
            className="p-4 overflow-x-auto text-[11px] leading-relaxed font-mono"
            style={{ backgroundColor: 'var(--register-bg-surface)', color: 'var(--register-text)' }}
          >
            {JSON.stringify(SAMPLE_EVENT, null, 2)}
          </pre>
        </div>
      </section>
    </RegisterPage>
  );
}
