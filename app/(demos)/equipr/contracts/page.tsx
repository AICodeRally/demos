'use client';


import { CONTRACTS, type SignatureStatus } from '@/data/equipr/contracts';
import { FileText } from 'lucide-react';

/* ── Helpers ─────────────────────────────────────────── */

const SIGNATURE_STYLES: Record<SignatureStatus, { bg: string; text: string }> = {
  signed: { bg: 'rgba(16,185,129,0.10)', text: '#059669' },
  pending: { bg: 'rgba(245,158,11,0.10)', text: '#D97706' },
  expired: { bg: 'rgba(239,68,68,0.10)', text: '#DC2626' },
};

const DEPOSIT_STYLES: Record<string, { bg: string; text: string }> = {
  held: { bg: 'rgba(37,99,235,0.10)', text: '#2563EB' },
  applied: { bg: 'rgba(16,185,129,0.10)', text: '#059669' },
  refunded: { bg: 'rgba(148,163,184,0.10)', text: '#6B7280' },
  pending: { bg: 'rgba(245,158,11,0.10)', text: '#D97706' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ── Source Badge ─────────────────────────────────────── */

function SourceBadge({ source, synced }: { source: string; synced: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span>{source}</span>
      <span style={{ opacity: 0.5 }}>&bull;</span>
      <span>Synced {synced}</span>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */

export default function ContractsPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FileText size={20} style={{ color: '#2563EB' }} />
        <h1
          className="text-2xl font-bold"
          style={{
            color: 'var(--prizym-text-primary)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Contracts
        </h1>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(37,99,235,0.10)', color: '#2563EB' }}
        >
          {CONTRACTS.length} total
        </span>
      </div>
      <SourceBadge source="Wynne Systems ERP" synced="2 min ago" />

      {/* Table wrapper */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr
                style={{
                  background: '#F9FAFB',
                  borderBottom: '1px solid var(--prizym-border-default)',
                }}
              >
                <th
                  className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] font-mono font-semibold"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  Contract #
                </th>
                <th
                  className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] font-mono font-semibold"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  Customer
                </th>
                <th
                  className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] font-mono font-semibold max-w-[200px]"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  Items
                </th>
                <th
                  className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] font-mono font-semibold"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  Start
                </th>
                <th
                  className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] font-mono font-semibold"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  End
                </th>
                <th
                  className="text-right px-4 py-3 text-[10px] uppercase tracking-[1px] font-mono font-semibold"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  Value
                </th>
                <th
                  className="text-center px-4 py-3 text-[10px] uppercase tracking-[1px] font-mono font-semibold"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  Signature
                </th>
                <th
                  className="text-center px-4 py-3 text-[10px] uppercase tracking-[1px] font-mono font-semibold"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  Deposit
                </th>
              </tr>
            </thead>
            <tbody>
              {CONTRACTS.map((contract, idx) => {
                const sigStyle = SIGNATURE_STYLES[contract.signatureStatus];
                const depStyle = DEPOSIT_STYLES[contract.depositStatus];

                return (
                  <tr
                    key={contract.id}
                    style={{
                      background: idx % 2 === 1 ? 'rgba(0,0,0,0.02)' : 'transparent',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* Contract # */}
                    <td className="px-4 py-3">
                      <span
                        className="font-mono font-medium"
                        style={{ color: '#2563EB' }}
                      >
                        {contract.id}
                      </span>
                    </td>

                    {/* Customer */}
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: 'var(--prizym-text-primary)' }}
                    >
                      {contract.customerName}
                    </td>

                    {/* Items */}
                    <td
                      className="px-4 py-3 max-w-[200px] truncate"
                      style={{ color: 'var(--prizym-text-secondary)' }}
                      title={contract.items}
                    >
                      {contract.items}
                    </td>

                    {/* Start */}
                    <td
                      className="px-4 py-3"
                      style={{ color: 'var(--prizym-text-secondary)' }}
                    >
                      {formatDate(contract.startDate)}
                    </td>

                    {/* End */}
                    <td
                      className="px-4 py-3"
                      style={{ color: 'var(--prizym-text-secondary)' }}
                    >
                      {formatDate(contract.endDate)}
                    </td>

                    {/* Value */}
                    <td
                      className="px-4 py-3 text-right font-medium tabular-nums"
                      style={{ color: 'var(--prizym-text-primary)' }}
                    >
                      {formatCurrency(contract.value)}
                    </td>

                    {/* Signature */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: sigStyle.bg, color: sigStyle.text }}
                      >
                        {capitalize(contract.signatureStatus)}
                      </span>
                    </td>

                    {/* Deposit */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: depStyle.bg, color: depStyle.text }}
                      >
                        {capitalize(contract.depositStatus)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
