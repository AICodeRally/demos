'use client';

import { useState } from 'react';
import { AI_RESPONSES, DEALS, VEHICLES, CUSTOMERS, DEAL_STATUS_COLORS } from '@/data/lotos';

const optimizerResponse = AI_RESPONSES.find((r) => r.id === 'ai-004')!;

function renderMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const lines = text.split('\n');
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '') {
      parts.push(<br key={key++} />);
      continue;
    }

    // Numbered list item
    if (/^\d+\./.test(line.trim())) {
      const content = line.replace(/^\d+\.\s*/, '');
      parts.push(
        <div key={key++} className="flex gap-2 mt-2">
          <span style={{ color: '#DC2626', fontWeight: 700, minWidth: 20 }}>
            {line.match(/^(\d+)/)?.[1]}.
          </span>
          <span>{renderInline(content)}</span>
        </div>
      );
      continue;
    }

    parts.push(<span key={key++}>{renderInline(line)}<br /></span>);
  }

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

export default function DealOptimizerPage() {
  const [selectedDealId, setSelectedDealId] = useState('DL-2026-005');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const deal = DEALS.find((d) => d.id === selectedDealId);
  const vehicle = deal ? VEHICLES.find((v) => v.id === deal.vehicleId) : null;
  const customer = deal ? CUSTOMERS.find((c) => c.id === deal.customerId) : null;

  const isOptimizableDeal = selectedDealId === 'DL-2026-005';

  function handleRunOptimizer() {
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 900);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            Deal Optimizer
          </h1>
          <p className="mt-1 text-base" style={{ color: '#57534E' }}>
            AI-powered deal structuring — maximize gross on every transaction
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

      {/* Deal Selector */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1C1917' }}>Select Deal</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {DEALS.map((d) => {
            const v = VEHICLES.find((v) => v.id === d.vehicleId);
            const c = CUSTOMERS.find((c) => c.id === d.customerId);
            const isSelected = d.id === selectedDealId;
            return (
              <button
                key={d.id}
                onClick={() => { setSelectedDealId(d.id); setShowResults(false); }}
                className="rounded-xl p-4 text-left transition-all"
                style={{
                  border: isSelected ? '2px solid #DC2626' : '1px solid #E7E5E4',
                  backgroundColor: isSelected ? '#FEF2F2' : '#F8FAFC',
                }}
              >
                <p className="text-xs font-bold" style={{ color: isSelected ? '#DC2626' : '#78716C' }}>{d.id}</p>
                <p className="text-sm font-semibold mt-1" style={{ color: '#1C1917' }}>
                  {v ? `${v.year} ${v.make} ${v.model}` : d.vehicleId}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#57534E' }}>{c ? `${c.firstName} ${c.lastName}` : d.customerId}</p>
                <div className="mt-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{ backgroundColor: `${DEAL_STATUS_COLORS[d.status]}20`, color: DEAL_STATUS_COLORS[d.status] }}
                  >
                    {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Deal Details */}
      {deal && vehicle && customer && (
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>Deal Details — {deal.id}</h2>
              <p className="text-sm mt-0.5" style={{ color: '#57534E' }}>
                {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim} — {customer.firstName} {customer.lastName}
              </p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-sm font-bold"
              style={{ backgroundColor: `${DEAL_STATUS_COLORS[deal.status]}20`, color: DEAL_STATUS_COLORS[deal.status] }}
            >
              {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { label: 'Sale Price', value: `$${deal.salePrice.toLocaleString()}` },
              { label: 'Trade Allowance', value: deal.tradeAllowance > 0 ? `$${deal.tradeAllowance.toLocaleString()}` : '—' },
              { label: 'Down Payment', value: `$${deal.downPayment.toLocaleString()}` },
              { label: 'Front Gross', value: `$${deal.frontGross.toLocaleString()}`, highlight: true },
              { label: 'F&I Gross', value: `$${deal.fniGross.toLocaleString()}`, highlight: true },
              { label: 'Total Gross', value: `$${deal.totalGross.toLocaleString()}`, big: true },
              { label: 'Lender', value: deal.lender },
              { label: 'Credit Tier', value: customer.creditTier.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg p-4"
                style={{ backgroundColor: item.big ? '#F0FDF4' : '#F8FAFC', border: '1px solid #E7E5E4' }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>{item.label}</p>
                <p
                  className={`mt-1 font-bold ${item.big ? 'text-2xl' : 'text-lg'}`}
                  style={{ color: item.big ? '#16A34A' : item.highlight ? '#1C1917' : '#1C1917' }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Run Optimizer Button */}
          <div className="mt-6">
            <button
              onClick={handleRunOptimizer}
              disabled={loading}
              className="rounded-xl px-6 py-3 text-base font-bold transition-opacity"
              style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '⏳ Analyzing deal...' : '⚡ Run Optimizer'}
            </button>
            {!isOptimizableDeal && (
              <p className="mt-2 text-sm" style={{ color: '#78716C' }}>
                Full optimization detail available for DL-2026-005. Other deals show summary analysis.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Optimizer Results */}
      {showResults && (
        <div className="space-y-4">
          {/* Before / After Comparison */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#78716C' }}>Current Total Gross</p>
              <p className="text-4xl font-bold mt-2" style={{ color: '#C2410C' }}>
                ${(deal?.totalGross ?? 5195).toLocaleString()}
              </p>
              <p className="text-sm mt-1" style={{ color: '#57534E' }}>As submitted</p>
            </div>

            <div className="rounded-xl border p-6 flex flex-col items-center justify-center" style={{ backgroundColor: '#F8FAFC', borderColor: '#E7E5E4' }}>
              <div
                className="rounded-full w-16 h-16 flex items-center justify-center text-2xl font-black"
                style={{ backgroundColor: '#DCFCE7', color: '#16A34A', border: '2px solid #86EFAC' }}
              >
                ↑
              </div>
              <p className="text-2xl font-black mt-3" style={{ color: '#16A34A' }}>+$2,560</p>
              <p className="text-sm font-semibold mt-1" style={{ color: '#57534E' }}>Improvement</p>
            </div>

            <div className="rounded-xl border p-6" style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#78716C' }}>Optimized Total Gross</p>
              <p className="text-4xl font-bold mt-2" style={{ color: '#15803D' }}>$7,755</p>
              <p className="text-sm mt-1" style={{ color: '#57534E' }}>With F&I bundle</p>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
              >
                AI
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#DC2626' }}>AskLotOS Recommendation</p>
                <p className="text-xs" style={{ color: '#78716C' }}>{optimizerResponse.question}</p>
              </div>
            </div>
            <div className="text-base leading-relaxed" style={{ color: '#57534E' }}>
              {renderMarkdown(optimizerResponse.answer)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
