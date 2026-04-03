'use client';

import { useState } from 'react';
import { AI_RESPONSES, DEALS, VEHICLES, CUSTOMERS, DEAL_STATUS_COLORS } from '@/data/lotos';
import { MarkdownRenderer, Toast } from '@/components/demos/lotos';

const optimizerResponse = AI_RESPONSES.find((r) => r.id === 'ai-004')!;

function parseRecommendationSections(text: string): Array<{ header: string; body: string }> {
  const sections: Array<{ header: string; body: string }> = [];
  const lines = text.split('\n');
  let currentHeader = '';
  let currentBody: string[] = [];

  for (const line of lines) {
    const match = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s*[-—]?\s*(.*)/);
    if (match) {
      if (currentHeader) {
        sections.push({ header: currentHeader, body: currentBody.join('\n') });
      }
      currentHeader = match[1];
      currentBody = match[2] ? [match[2]] : [];
    } else if (currentHeader && line.trim()) {
      currentBody.push(line);
    }
  }
  if (currentHeader) {
    sections.push({ header: currentHeader, body: currentBody.join('\n') });
  }
  return sections;
}

export default function DealOptimizerPage() {
  const [selectedDealId, setSelectedDealId] = useState('DL-2026-005');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optimizedGross, setOptimizedGross] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [grossFlash, setGrossFlash] = useState(false);

  const deal = DEALS.find((d) => d.id === selectedDealId);
  const vehicle = deal ? VEHICLES.find((v) => v.id === deal.vehicleId) : null;
  const customer = deal ? CUSTOMERS.find((c) => c.id === deal.customerId) : null;

  const isOptimizableDeal = selectedDealId === 'DL-2026-005';

  const recommendationSections = parseRecommendationSections(optimizerResponse.answer);

  function handleRunOptimizer() {
    setLoading(true);
    setShowResults(false);
    setOptimizedGross(null);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 900);
  }

  function handleApplyRecommendations() {
    if (!deal) return;
    const newGross = deal.totalGross + 2560;
    setOptimizedGross(newGross);
    setGrossFlash(true);
    setToastMsg(`Optimized gross: $${newGross.toLocaleString()} (+$2,560)`);
    setTimeout(() => setGrossFlash(false), 1500);
  }

  return (
    <div className="lot-page" style={{ padding: '24px' }}>
      <div className="space-y-6">
        {toastMsg && <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />}

        <div className="flex items-start justify-between">
          <div>
            <h1 className="lot-heading">
              Deal Optimizer
            </h1>
            <p className="lot-description">
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

        <div className="lot-card lot-animate-in">
          <h2 className="lot-subheading">Select Deal</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {DEALS.map((d) => {
              const v = VEHICLES.find((v) => v.id === d.vehicleId);
              const c = CUSTOMERS.find((c) => c.id === d.customerId);
              const isSelected = d.id === selectedDealId;
              return (
                <button
                  key={d.id}
                  onClick={() => { setSelectedDealId(d.id); setShowResults(false); setOptimizedGross(null); }}
                  className="rounded-xl p-4 text-left transition-all"
                  style={{
                    border: isSelected ? '2px solid #DC2626' : '1px solid var(--lot-border)',
                    backgroundColor: isSelected ? '#FEF2F2' : 'var(--lot-card-alt)',
                  }}
                >
                  <p className="text-xs font-bold" style={{ color: isSelected ? '#DC2626' : 'var(--lot-text-muted)' }}>{d.id}</p>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--lot-text)' }}>
                    {v ? `${v.year} ${v.make} ${v.model}` : d.vehicleId}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--lot-text-secondary)' }}>{c ? `${c.firstName} ${c.lastName}` : d.customerId}</p>
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

        {deal && vehicle && customer && (
          <div className="lot-card lot-animate-in">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="lot-subheading">Deal Details — {deal.id}</h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--lot-text-secondary)' }}>
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
                { label: 'Trade Allowance', value: deal.tradeAllowance > 0 ? `$${deal.tradeAllowance.toLocaleString()}` : '-' },
                { label: 'Down Payment', value: `$${deal.downPayment.toLocaleString()}` },
                { label: 'Front Gross', value: `$${deal.frontGross.toLocaleString()}`, highlight: true },
                { label: 'F&I Gross', value: `$${deal.fniGross.toLocaleString()}`, highlight: true },
                { label: 'Total Gross', value: optimizedGross ? `$${optimizedGross.toLocaleString()}` : `$${deal.totalGross.toLocaleString()}`, big: true },
                { label: 'Lender', value: deal.lender },
                { label: 'Credit Tier', value: customer.creditTier.replace('-', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: item.big ? (grossFlash ? '#DCFCE7' : '#F0FDF4') : 'var(--lot-card-alt)',
                    border: '1px solid var(--lot-border)',
                    transition: 'background-color 0.5s',
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--lot-text-muted)' }}>{item.label}</p>
                  <p
                    className={`mt-1 font-bold ${item.big ? 'text-2xl' : 'text-lg'}`}
                    style={{ color: item.big ? '#16A34A' : 'var(--lot-text)' }}
                  >
                    {item.value}
                  </p>
                  {item.big && optimizedGross && (
                    <p className="text-xs font-bold mt-1" style={{ color: '#16A34A' }}>+$2,560 from optimization</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
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
                {loading ? 'Analyzing deal...' : 'Run Optimizer'}
              </button>
              {!isOptimizableDeal && (
                <p className="mt-2 text-sm self-center" style={{ color: 'var(--lot-text-muted)' }}>
                  Full optimization detail available for DL-2026-005. Other deals show summary analysis.
                </p>
              )}
            </div>
          </div>
        )}

        {showResults && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 lot-animate-in">
              <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--lot-text-muted)' }}>Current Total Gross</p>
                <p className="text-4xl font-bold mt-2" style={{ color: '#C2410C' }}>
                  ${(deal?.totalGross ?? 5195).toLocaleString()}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--lot-text-secondary)' }}>As submitted</p>
              </div>

              <div className="rounded-xl border p-6 flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--lot-card-alt)', borderColor: 'var(--lot-border)' }}>
                <div
                  className="rounded-full w-16 h-16 flex items-center justify-center text-2xl font-black"
                  style={{ backgroundColor: '#DCFCE7', color: '#16A34A', border: '2px solid #86EFAC' }}
                >
                  +
                </div>
                <p className="text-2xl font-black mt-3" style={{ color: '#16A34A' }}>+$2,560</p>
                <p className="text-sm font-semibold mt-1" style={{ color: 'var(--lot-text-secondary)' }}>Improvement</p>
              </div>

              <div className="rounded-xl border p-6" style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--lot-text-muted)' }}>Optimized Total Gross</p>
                <p className="text-4xl font-bold mt-2" style={{ color: '#15803D' }}>$7,755</p>
                <p className="text-sm mt-1" style={{ color: 'var(--lot-text-secondary)' }}>With F&I bundle</p>
              </div>
            </div>

            <div className="lot-card lot-animate-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                  >
                    AI
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#DC2626' }}>AskLotOS Recommendation</p>
                    <p className="text-xs" style={{ color: 'var(--lot-text-muted)' }}>{optimizerResponse.question}</p>
                  </div>
                </div>
                <button
                  onClick={handleApplyRecommendations}
                  className="rounded-xl px-5 py-2.5 text-sm font-bold"
                  style={{ backgroundColor: '#16A34A', color: '#FFFFFF', cursor: 'pointer', border: 'none' }}
                >
                  Apply Recommendations
                </button>
              </div>

              {recommendationSections.length > 0 ? (
                <div className="space-y-2">
                  {recommendationSections.map((section, idx) => (
                    <div key={idx} className="rounded-lg border" style={{ borderColor: 'var(--lot-border)' }}>
                      <button
                        onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                        className="w-full text-left px-4 py-3 flex items-center justify-between"
                        style={{ background: expandedSection === idx ? 'var(--lot-card-alt)' : 'var(--lot-card)', borderRadius: '8px' }}
                      >
                        <span className="text-sm font-bold" style={{ color: 'var(--lot-text)' }}>
                          {idx + 1}. {section.header}
                        </span>
                        <span style={{ color: 'var(--lot-text-muted)', fontSize: '18px' }}>{expandedSection === idx ? '-' : '+'}</span>
                      </button>
                      {expandedSection === idx && (
                        <div className="px-4 pb-3">
                          <div className="text-base leading-relaxed" style={{ color: 'var(--lot-text-secondary)' }}>
                            <MarkdownRenderer text={section.body} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-base leading-relaxed" style={{ color: 'var(--lot-text-secondary)' }}>
                  <MarkdownRenderer text={optimizerResponse.answer} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
