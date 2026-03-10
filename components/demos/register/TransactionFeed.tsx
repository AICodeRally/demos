'use client';

export interface Transaction {
  time: string;
  rep: string;
  items: string;
  total: string;
  commission: string;
  method: 'Credit' | 'Financing' | 'Cash' | 'Digital';
}

const METHOD_COLORS: Record<string, { bg: string; text: string }> = {
  Credit: { bg: '#DBEAFE', text: '#2563EB' },
  Financing: { bg: '#EDE9FE', text: '#7C3AED' },
  Cash: { bg: '#D1FAE5', text: '#059669' },
  Digital: { bg: '#FEF3C7', text: '#D97706' },
};

interface TransactionFeedProps {
  transactions: Transaction[];
}

export function TransactionFeed({ transactions }: TransactionFeedProps) {
  return (
    <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--pl-card, #FFFFFF)', borderColor: 'var(--pl-border, #E2E8F0)' }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--pl-text, #0F172A)' }}>
        Live Transaction Feed
      </h3>
      <div className="max-h-96 overflow-y-auto space-y-1.5">
        {transactions.map((tx, i) => {
          const method = METHOD_COLORS[tx.method] ?? METHOD_COLORS.Credit;
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-[12px]"
              style={{ backgroundColor: i % 2 === 0 ? 'var(--pl-stripe, #F8FAFC)' : 'transparent' }}
            >
              <span className="font-mono shrink-0" style={{ color: 'var(--pl-text-muted, #94A3B8)', width: 48 }}>
                {tx.time}
              </span>
              <span className="font-medium shrink-0" style={{ color: 'var(--pl-text, #1E3A5F)', width: 64 }}>
                {tx.rep}
              </span>
              <span className="flex-1 truncate" style={{ color: 'var(--pl-text-secondary, #475569)' }}>
                {tx.items}
              </span>
              <span className="font-bold shrink-0" style={{ color: 'var(--pl-text, #0F172A)', width: 64, textAlign: 'right' }}>
                {tx.total}
              </span>
              <span className="font-medium shrink-0" style={{ color: '#10B981', width: 56, textAlign: 'right' }}>
                +{tx.commission}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0"
                style={{ backgroundColor: method.bg, color: method.text }}
              >
                {tx.method}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
