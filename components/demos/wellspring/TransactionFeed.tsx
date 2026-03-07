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
  Credit: { bg: '#1E3A5F', text: '#60A5FA' },
  Financing: { bg: '#3B1F6E', text: '#A78BFA' },
  Cash: { bg: '#14432A', text: '#34D399' },
  Digital: { bg: '#4A3400', text: '#FBBF24' },
};

interface TransactionFeedProps {
  transactions: Transaction[];
}

export function TransactionFeed({ transactions }: TransactionFeedProps) {
  return (
    <div className="rounded-xl border p-5" style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: '#F1F5F9' }}>
        Live Transaction Feed
      </h3>
      <div className="max-h-96 overflow-y-auto space-y-1.5">
        {transactions.map((tx, i) => {
          const method = METHOD_COLORS[tx.method] ?? METHOD_COLORS.Credit;
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-[12px]"
              style={{ backgroundColor: i % 2 === 0 ? '#2A3241' : 'transparent' }}
            >
              <span className="font-mono shrink-0" style={{ color: '#94A3B8', width: 48 }}>
                {tx.time}
              </span>
              <span className="font-medium shrink-0" style={{ color: '#CBD5E1', width: 64 }}>
                {tx.rep}
              </span>
              <span className="flex-1 truncate" style={{ color: '#94A3B8' }}>
                {tx.items}
              </span>
              <span className="font-bold shrink-0" style={{ color: '#F1F5F9', width: 64, textAlign: 'right' }}>
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
