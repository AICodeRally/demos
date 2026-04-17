'use client';

import { useState, useMemo } from 'react';
import type { ClientConfig, PeriodContext } from '@/lib/swic/engine/types';
import { monteCarlo } from '@/lib/swic-engine';
import type { ScenarioDeal, DistributionResult } from '@/lib/swic-engine';
import { Plus, Trash2, Play, BarChart3, Dice5 } from 'lucide-react';

interface PipelineSimulatorProps {
  config: ClientConfig;
  period: PeriodContext;
  accent?: string;
}

interface PipelineDeal {
  id: string;
  name: string;
  revenue: number;
  probability: number;
}

let dealCounter = 0;

function makeId() {
  return `sim-deal-${++dealCounter}`;
}

const DEFAULT_DEALS: PipelineDeal[] = [
  { id: makeId(), name: 'Likely Close', revenue: 8000, probability: 0.8 },
  { id: makeId(), name: 'Big Maybe', revenue: 25000, probability: 0.4 },
  { id: makeId(), name: 'Long Shot', revenue: 45000, probability: 0.15 },
];

export function PipelineSimulator({ config, period, accent = '#6366f1' }: PipelineSimulatorProps) {
  const [deals, setDeals] = useState<PipelineDeal[]>(DEFAULT_DEALS);
  const [iterations, setIterations] = useState(1000);
  const [result, setResult] = useState<DistributionResult | null>(null);
  const [running, setRunning] = useState(false);

  const pipeline: ScenarioDeal[] = useMemo(() =>
    deals.map((d) => ({
      revenue: d.revenue,
      cost: d.revenue * 0.5, // Assume 50% cost
      items: [{
        id: d.id,
        name: d.name,
        category: 'pipeline',
        tags: [],
        price: d.revenue,
        cost: d.revenue * 0.5,
        quantity: 1,
      }],
      probability: d.probability,
    })),
    [deals]
  );

  const weightedRevenue = deals.reduce((s, d) => s + d.revenue * d.probability, 0);

  function handleRun() {
    setRunning(true);
    // Use setTimeout to let the UI update before heavy calc
    setTimeout(() => {
      const dist = monteCarlo({
        config,
        baseline: period,
        pipeline,
        iterations,
        seed: Date.now(),
      });
      setResult(dist);
      setRunning(false);
    }, 10);
  }

  function addDeal() {
    setDeals((prev) => [...prev, { id: makeId(), name: 'New Deal', revenue: 10000, probability: 0.5 }]);
    setResult(null);
  }

  function removeDeal(id: string) {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    setResult(null);
  }

  function updateDeal(id: string, field: keyof PipelineDeal, value: string | number) {
    setDeals((prev) => prev.map((d) => d.id === id ? { ...d, [field]: value } : d));
    setResult(null);
  }

  return (
    <div className="glass rounded-2xl p-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold tracking-tight uppercase flex items-center gap-1.5" style={{ color: 'var(--page-muted)' }}>
          <Dice5 className="w-3.5 h-3.5" style={{ color: accent }} />
          Pipeline Simulator
        </h3>
        <span className="text-[10px] font-mono" style={{ color: 'var(--page-muted)' }}>
          Weighted: ${weightedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </div>

      {/* Deal list */}
      <div className="space-y-2 mb-3">
        {deals.map((deal) => (
          <div key={deal.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'var(--glass-bg)' }}>
            <input
              type="text"
              value={deal.name}
              onChange={(e) => updateDeal(deal.id, 'name', e.target.value)}
              className="glass-input text-[11px] font-medium w-24 px-2 py-1 rounded-lg"
              placeholder="Deal name"
            />
            <div className="flex items-center gap-1 flex-1">
              <span className="text-[10px]" style={{ color: 'var(--page-muted)' }}>$</span>
              <input
                type="number"
                value={deal.revenue}
                onChange={(e) => updateDeal(deal.id, 'revenue', Number(e.target.value))}
                className="glass-input text-[11px] font-mono w-20 px-2 py-1 rounded-lg"
                min={0}
                step={1000}
              />
            </div>
            <div className="flex items-center gap-1">
              <input
                type="range"
                min={0}
                max={100}
                value={deal.probability * 100}
                onChange={(e) => updateDeal(deal.id, 'probability', Number(e.target.value) / 100)}
                className="w-14 h-1 accent-current"
                style={{ accentColor: accent }}
              />
              <span
                className="text-[10px] font-mono font-bold w-8 text-right"
                style={{
                  color: deal.probability >= 0.7 ? '#22c55e' :
                         deal.probability >= 0.4 ? '#f59e0b' : '#ef4444',
                }}
              >
                {(deal.probability * 100).toFixed(0)}%
              </span>
            </div>
            <button
              onClick={() => removeDeal(deal.id)}
              className="p-1 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3 h-3" style={{ color: '#ef4444' }} />
            </button>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={addDeal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold glass-pill hover:scale-[1.02] transition-all"
        >
          <Plus className="w-3 h-3" />
          Add Deal
        </button>
        <div className="flex-1" />
        <select
          value={iterations}
          onChange={(e) => { setIterations(Number(e.target.value)); setResult(null); }}
          className="glass-input text-[10px] font-mono rounded-lg px-2 py-1.5 cursor-pointer"
        >
          <option value={100}>100 runs</option>
          <option value={500}>500 runs</option>
          <option value={1000}>1K runs</option>
          <option value={5000}>5K runs</option>
          <option value={10000}>10K runs</option>
        </select>
        <button
          onClick={handleRun}
          disabled={running || deals.length === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          style={{
            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            color: '#ffffff',
            boxShadow: `0 2px 8px ${accent}40`,
          }}
        >
          <Play className="w-3 h-3" />
          {running ? 'Running...' : 'Simulate'}
        </button>
      </div>

      {/* Results */}
      {result && <DistributionChart result={result} accent={accent} iterations={iterations} />}
    </div>
  );
}

/* ── Distribution Chart ────────────────────────────────── */

function DistributionChart({ result, accent, iterations }: {
  result: DistributionResult;
  accent: string;
  iterations: number;
}) {
  const maxCount = Math.max(...result.histogram.map((h) => h.count));

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { label: 'Mean', value: result.mean },
          { label: 'Median', value: result.median },
          { label: 'P10', value: result.p10 },
          { label: 'P90', value: result.p90 },
        ].map((s) => (
          <div key={s.label} className="text-center p-1.5 rounded-lg" style={{ background: 'var(--glass-bg)' }}>
            <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--page-muted)' }}>{s.label}</div>
            <div className="text-[11px] font-mono font-bold">
              ${s.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        ))}
      </div>

      {/* Histogram */}
      <div className="flex items-center gap-1.5 mb-2">
        <BarChart3 className="w-3 h-3" style={{ color: accent }} />
        <span className="text-[10px] font-semibold" style={{ color: 'var(--page-muted)' }}>
          Distribution ({iterations.toLocaleString()} iterations)
        </span>
      </div>
      <div className="flex items-end gap-px h-20">
        {result.histogram.map((bucket, i) => {
          const height = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
          const isMedian = result.median >= bucket.bucketMin && result.median < bucket.bucketMax;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all duration-300 relative group"
              style={{
                height: `${height}%`,
                minHeight: bucket.count > 0 ? '2px' : '0px',
                background: isMedian
                  ? `linear-gradient(180deg, #f59e0b, ${accent})`
                  : `linear-gradient(180deg, ${accent}cc, ${accent}60)`,
              }}
              title={`$${bucket.bucketMin.toFixed(0)} – $${bucket.bucketMax.toFixed(0)}: ${bucket.count} runs`}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] font-mono" style={{ color: 'var(--page-muted)' }}>
          ${result.min.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
        <span className="text-[9px] font-mono" style={{ color: 'var(--page-muted)' }}>
          ${result.max.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </div>

      {/* Spread indicator */}
      <div className="mt-2 text-center">
        <span className="text-[10px]" style={{ color: 'var(--page-muted)' }}>
          Spread: <strong className="font-mono" style={{ color: accent }}>
            ${result.stdDev.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </strong> std dev
          {' · '}
          Range: <strong className="font-mono">
            ${result.min.toLocaleString(undefined, { maximumFractionDigits: 0 })} – ${result.max.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </strong>
        </span>
      </div>
    </div>
  );
}
