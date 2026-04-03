'use client';

import { useState } from 'react';
import { AI_RESPONSES } from '@/data/lotos';
import { MarkdownRenderer } from '@/components/demos/lotos';

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

interface EditableFields {
  year: number;
  make: string;
  model: string;
  miles: number;
  price: number;
}

interface SavedScore {
  fields: EditableFields;
  score: number;
  date: string;
}

function calculateScore(fields: EditableFields): number {
  let score = 82;
  if (fields.miles > 30000) score -= 5;
  if (fields.miles > 50000) score -= 10;
  if (fields.price < 25000) score += 3;
  if (fields.price > 30000) score -= 3;
  return Math.max(0, Math.min(100, score));
}

export default function AcquisitionScorerPage() {
  const [editableFields, setEditableFields] = useState<EditableFields>({
    year: 2023,
    make: 'Toyota',
    model: 'RAV4 XLE',
    miles: 22000,
    price: 27500,
  });
  const [savedScores, setSavedScores] = useState<SavedScore[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentScore, setCurrentScore] = useState(82);

  function handleScore() {
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      const score = calculateScore(editableFields);
      setCurrentScore(score);
      setLoading(false);
      setShowResults(true);
    }, 1100);
  }

  function handleSaveScore() {
    const entry: SavedScore = {
      fields: { ...editableFields },
      score: currentScore,
      date: new Date().toLocaleString(),
    };
    setSavedScores((prev) => [entry, ...prev].slice(0, 3));
  }

  const scoreLabel = currentScore >= 75 ? 'BUY' : currentScore >= 50 ? 'CONSIDER' : 'PASS';
  const scoreLabelColor = currentScore >= 75 ? '#15803D' : currentScore >= 50 ? '#D97706' : '#DC2626';
  const scoreLabelBg = currentScore >= 75 ? '#DCFCE7' : currentScore >= 50 ? '#FEF3C7' : '#FEE2E2';

  return (
    <div className="lot-page" style={{ padding: '24px' }}>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="lot-heading">
              Acquisition Scorer
            </h1>
            <p className="lot-description">
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

        <div style={{ display: 'grid', gridTemplateColumns: savedScores.length > 0 ? '1fr 320px' : '1fr', gap: '20px' }}>
          <div className="space-y-6">
            <div className="lot-card lot-animate-in">
              <h2 className="lot-subheading">Vehicle Information</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--lot-text-muted)' }}>Year</label>
                  <input
                    type="number"
                    value={editableFields.year}
                    onChange={(e) => setEditableFields((prev) => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
                    className="lot-input w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--lot-text-muted)' }}>Make</label>
                  <input
                    type="text"
                    value={editableFields.make}
                    onChange={(e) => setEditableFields((prev) => ({ ...prev, make: e.target.value }))}
                    className="lot-input w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--lot-text-muted)' }}>Model</label>
                  <input
                    type="text"
                    value={editableFields.model}
                    onChange={(e) => setEditableFields((prev) => ({ ...prev, model: e.target.value }))}
                    className="lot-input w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--lot-text-muted)' }}>Trim</label>
                  <input
                    type="text"
                    readOnly
                    value="XLE"
                    className="lot-input w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--lot-text-muted)' }}>Mileage</label>
                  <input
                    type="number"
                    value={editableFields.miles}
                    onChange={(e) => setEditableFields((prev) => ({ ...prev, miles: parseInt(e.target.value) || 0 }))}
                    className="lot-input w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--lot-text-muted)' }}>Source</label>
                  <input
                    type="text"
                    readOnly
                    value="Manheim Phoenix"
                    className="lot-input w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--lot-text-muted)' }}>Asking Price</label>
                  <input
                    type="number"
                    value={editableFields.price}
                    onChange={(e) => setEditableFields((prev) => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    className="lot-input w-full"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleScore}
                  disabled={loading}
                  className="rounded-xl px-6 py-3 text-base font-bold transition-opacity"
                  style={{ backgroundColor: '#DC2626', color: '#FFFFFF', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Scoring acquisition...' : 'Re-Score'}
                </button>
                {showResults && (
                  <button
                    onClick={handleSaveScore}
                    className="rounded-xl px-6 py-3 text-base font-bold"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                  >
                    Save Score
                  </button>
                )}
              </div>
            </div>

            {showResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lot-animate-in">
                  <div className="lot-card flex flex-col items-center">
                    <h2 className="lot-subheading self-start">Acquisition Score</h2>
                    <div className="relative" style={{ width: 180, height: 100 }}>
                      <svg width="180" height="100" viewBox="0 0 180 100">
                        <path
                          d="M 10 90 A 80 80 0 0 1 170 90"
                          fill="none"
                          stroke="var(--lot-border)"
                          strokeWidth="14"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 10 90 A 80 80 0 0 1 170 90"
                          fill="none"
                          stroke={getScoreColor(currentScore)}
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray={`${(currentScore / 100) * 251} 251`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                        <span className="text-5xl font-black" style={{ color: getScoreColor(currentScore) }}>{currentScore}</span>
                        <span className="text-base font-bold" style={{ color: getScoreColor(currentScore) }}>/100</span>
                      </div>
                    </div>
                    <div
                      className="mt-4 rounded-full px-6 py-2 text-xl font-black"
                      style={{ backgroundColor: scoreLabelBg, color: scoreLabelColor }}
                    >
                      {scoreLabel}
                    </div>
                    <p className="text-sm mt-3 text-center" style={{ color: 'var(--lot-text-secondary)' }}>
                      {currentScore >= 75 ? 'Strong buy signal — all factors favorable' : currentScore >= 50 ? 'Moderate signal — review factors carefully' : 'Weak signal — consider passing'}
                    </p>
                  </div>

                  <div className="lot-card lg:col-span-2">
                    <h2 className="lot-subheading">Factor Breakdown</h2>
                    <div className="space-y-4">
                      {FACTORS.map((factor) => (
                        <div key={factor.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold" style={{ color: 'var(--lot-text)' }}>{factor.name}</span>
                            <span className="text-sm font-bold" style={{ color: getScoreColor(factor.score) }}>
                              {factor.score}
                            </span>
                          </div>
                          <div className="relative h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--lot-border)' }}>
                            <div
                              className="absolute left-0 top-0 h-full rounded-full transition-all"
                              style={{
                                width: `${factor.score}%`,
                                backgroundColor: getScoreColor(factor.score),
                              }}
                            />
                          </div>
                          <p className="text-xs mt-1" style={{ color: 'var(--lot-text-muted)' }}>{factor.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border p-5 lot-animate-in" style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }}>
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 rounded-lg px-3 py-2 text-xs font-black text-center"
                      style={{ backgroundColor: '#DCFCE7', color: '#15803D', minWidth: 72 }}
                    >
                      COMP<br />SALE
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--lot-text)' }}>
                        Reference: STK-014 — 2024 Toyota RAV4 XLE (8.9K miles)
                      </p>
                      <p className="text-sm mt-1" style={{ color: '#15803D', fontWeight: 700 }}>
                        Sold for $33,995 in just 6 days
                      </p>
                      <p className="text-sm mt-1" style={{ color: 'var(--lot-text-secondary)' }}>
                        Current unit has more miles but $6,000 lower acquisition cost — maintains strong margin profile.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lot-card lot-animate-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                    >
                      AI
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#DC2626' }}>AskLotOS Analysis</p>
                      <p className="text-xs" style={{ color: 'var(--lot-text-muted)' }}>{acquisitionResponse.question}</p>
                    </div>
                  </div>
                  <div className="text-base leading-relaxed" style={{ color: 'var(--lot-text-secondary)' }}>
                    <MarkdownRenderer text={acquisitionResponse.answer} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {savedScores.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold" style={{ color: 'var(--lot-text)' }}>Saved Scores</h3>
              {savedScores.map((saved, idx) => (
                <div
                  key={idx}
                  className="lot-card"
                  style={{ padding: '16px' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold" style={{ color: 'var(--lot-text)' }}>
                      {saved.fields.year} {saved.fields.make} {saved.fields.model}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: getScoreColor(saved.score) + '18', color: getScoreColor(saved.score) }}
                    >
                      {saved.score}/100
                    </span>
                  </div>
                  <div className="text-xs space-y-0.5" style={{ color: 'var(--lot-text-muted)' }}>
                    <div>{saved.fields.miles.toLocaleString()} mi · ${saved.fields.price.toLocaleString()}</div>
                    <div>{saved.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
