'use client';

import { useState } from 'react';
import { AI_RESPONSES } from '@/data/lotos';

const acquisitionResponse = AI_RESPONSES.find((r) => r.id === 'ai-005')!;

const FACTORS = [
  { name: 'Market Demand', score: 92, detail: 'RAV4 is #2 selling SUV in your market' },
  { name: 'Price vs Market', score: 78, detail: 'Market retail $33,500. Spread: $6,000' },
  { name: 'Est. Recon', score: 90, detail: 'Low miles, Toyota reliability. Est. $400-600' },
  { name: 'Days to Sell', score: 85, detail: 'Projected 12-16 days based on your history' },
  { name: 'Margin Safety', score: 75, detail: '$5,400 projected gross after recon' },
];

function getScoreColor(score: number): string {
  if (score >= 85) return '#16A34A';
  if (score >= 70) return '#2563EB';
  return '#D97706';
}

function renderMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const lines = text.split('\n');
  let key = 0;
  let inTable = false;
  const tableLines: string[] = [];

  const flushTable = () => {
    if (tableLines.length > 0) {
      const rows = tableLines
        .filter((l) => !l.match(/^\|[\s-]+\|/))
        .map((l) => l.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).map((c) => c.trim()));

      if (rows.length > 1) {
        const header = rows[0];
        const body = rows.slice(1);
        parts.push(
          <div key={key++} className="overflow-x-auto my-3">
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E7E5E4' }}>
                  {header.map((h, i) => (
                    <th key={i} className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#78716C' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: '1px solid #F5F5F4' }}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2 font-medium" style={{ color: '#1C1917' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      tableLines.length = 0;
    }
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('|')) {
      if (!inTable) inTable = true;
      tableLines.push(line);
      continue;
    }

    if (inTable) flushTable();

    if (line.trim() === '') {
      parts.push(<br key={key++} />);
      continue;
    }

    parts.push(<span key={key++}>{renderInline(line)}<br /></span>);
  }

  if (inTable) flushTable();

  return <>{parts}</>;
}

function renderInline(text: string): React.ReactNode {
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.startsWith('**') && seg.endsWith('**')) {
          return <strong key={i} style={{ color: '#1C1917' }}>{seg.slice(2, -2)}</strong>;
        }
        return <span key={i}>{seg}</span>;
      })}
    </>
  );
}

const VEHICLE_FIELDS = [
  { label: 'Year', value: '2023' },
  { label: 'Make', value: 'Toyota' },
  { label: 'Model', value: 'RAV4' },
  { label: 'Trim', value: 'XLE' },
  { label: 'Mileage', value: '22,000' },
  { label: 'Source', value: 'Manheim Phoenix' },
  { label: 'Asking Price', value: '$27,500' },
];

export default function AcquisitionScorerPage() {
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleScore() {
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1100);
  }

  const overallScore = 82;

  // SVG gauge
  const radius = 70;
  const circumference = Math.PI * radius; // half circle
  const progress = (overallScore / 100) * circumference;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            Acquisition Scorer
          </h1>
          <p className="mt-1 text-base" style={{ color: '#57534E' }}>
            AI-powered buy/pass decisions — score any vehicle before you bid
          </p>
        </div>
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold"
          style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
        >
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#DC2626' }} />
          Powered by AskLotOS AI
        </div>
      </div>

      {/* Input Section */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1C1917' }}>Vehicle Information</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {VEHICLE_FIELDS.map((field) => (
            <div key={field.label}>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#78716C' }}>
                {field.label}
              </label>
              <input
                type="text"
                readOnly
                value={field.value}
                className="w-full rounded-lg px-4 py-2.5 text-base font-medium"
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E7E5E4',
                  color: '#1C1917',
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <button
            onClick={handleScore}
            disabled={loading}
            className="rounded-xl px-6 py-3 text-base font-bold transition-opacity"
            style={{ backgroundColor: '#DC2626', color: '#FFFFFF', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⏳ Scoring acquisition...' : '🎯 Score Acquisition'}
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-4">
          {/* Score Gauge + Overall */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Gauge */}
            <div className="rounded-xl bg-white border p-6 flex flex-col items-center" style={{ borderColor: '#E7E5E4' }}>
              <h2 className="text-lg font-bold mb-4 self-start" style={{ color: '#1C1917' }}>Acquisition Score</h2>
              <div className="relative" style={{ width: 180, height: 100 }}>
                <svg width="180" height="100" viewBox="0 0 180 100">
                  {/* Background arc */}
                  <path
                    d="M 10 90 A 80 80 0 0 1 170 90"
                    fill="none"
                    stroke="#E7E5E4"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  {/* Progress arc */}
                  <path
                    d="M 10 90 A 80 80 0 0 1 170 90"
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${(overallScore / 100) * 251} 251`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                  <span className="text-5xl font-black" style={{ color: '#16A34A' }}>{overallScore}</span>
                  <span className="text-base font-bold" style={{ color: '#16A34A' }}>/100</span>
                </div>
              </div>
              <div
                className="mt-4 rounded-full px-6 py-2 text-xl font-black"
                style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}
              >
                ✓ BUY
              </div>
              <p className="text-sm mt-3 text-center" style={{ color: '#57534E' }}>
                Strong buy signal — all factors favorable
              </p>
            </div>

            {/* Factor Breakdown */}
            <div className="rounded-xl bg-white border p-6 lg:col-span-2" style={{ borderColor: '#E7E5E4' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1C1917' }}>Factor Breakdown</h2>
              <div className="space-y-4">
                {FACTORS.map((factor) => (
                  <div key={factor.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold" style={{ color: '#1C1917' }}>{factor.name}</span>
                      <span className="text-sm font-bold" style={{ color: getScoreColor(factor.score) }}>
                        {factor.score}
                      </span>
                    </div>
                    <div className="relative h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E7E5E4' }}>
                      <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all"
                        style={{
                          width: `${factor.score}%`,
                          backgroundColor: getScoreColor(factor.score),
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#78716C' }}>{factor.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparable Sale */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }}>
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 rounded-lg px-3 py-2 text-xs font-black text-center"
                style={{ backgroundColor: '#DCFCE7', color: '#15803D', minWidth: 72 }}
              >
                COMP<br />SALE
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#1C1917' }}>
                  Reference: STK-014 — 2024 Toyota RAV4 XLE (8.9K miles)
                </p>
                <p className="text-sm mt-1" style={{ color: '#15803D', fontWeight: 700 }}>
                  Sold for $33,995 in just 6 days
                </p>
                <p className="text-sm mt-1" style={{ color: '#57534E' }}>
                  Current unit has more miles but $6,000 lower acquisition cost — maintains strong margin profile.
                </p>
              </div>
            </div>
          </div>

          {/* Full Analysis */}
          <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
              >
                AI
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#DC2626' }}>AskLotOS Analysis</p>
                <p className="text-xs" style={{ color: '#78716C' }}>{acquisitionResponse.question}</p>
              </div>
            </div>
            <div className="text-base leading-relaxed" style={{ color: '#57534E' }}>
              {renderMarkdown(acquisitionResponse.answer)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
