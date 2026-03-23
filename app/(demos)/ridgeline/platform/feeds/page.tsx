'use client';

import { useState } from 'react';
import { DATA_FEEDS, INTEGRATION_SYSTEMS } from '@/data/ridgeline';
import { fmt } from '@/lib/utils';

const statusColors: Record<string, string> = { healthy: '#10B981', delayed: '#F59E0B', error: '#EF4444', disabled: '#94A3B8' };
const statusIcons: Record<string, string> = { healthy: '\u2705', delayed: '\u23F3', error: '\uD83D\uDED1', disabled: '\u23F8\uFE0F' };
const directionIcons: Record<string, string> = { inbound: '\u2B95', outbound: '\u2B05\uFE0F', bidirectional: '\u21C4' };
const formatColors: Record<string, string> = { 'CSV (pipe-delimited)': '#2563EB', XML: '#7C3AED', 'Fixed-width flat file': '#1E3A5F', 'JSON webhook': '#10B981', 'REST API': '#06B6D4', 'SQL/ETL': '#F59E0B', 'JSON API': '#EC4899' };

const totalRecords = DATA_FEEDS.reduce((s, f) => s + f.avgRecords, 0);

export default function DataFeedsPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filterStatus ? DATA_FEEDS.filter((f) => f.status === filterStatus) : DATA_FEEDS;
  const byStat = DATA_FEEDS.reduce<Record<string, number>>((a, f) => { a[f.status] = (a[f.status] || 0) + 1; return a; }, {});

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes barReveal { from { width: 0 } }
        @keyframes pipeFlow { 0% { stroke-dashoffset: 20 } 100% { stroke-dashoffset: 0 } }
        @keyframes nodeGlow { 0%, 100% { filter: drop-shadow(0 0 3px rgba(124,58,237,0.2)) } 50% { filter: drop-shadow(0 0 8px rgba(124,58,237,0.4)) } }
        @keyframes flowPulse { 0%, 100% { opacity: 0.4 } 50% { opacity: 1 } }
        @keyframes warningPulse { 0%, 100% { box-shadow: 0 0 4px rgba(245,158,11,0.1) } 50% { box-shadow: 0 0 14px rgba(245,158,11,0.3) } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
          <span className="text-3xl text-white">&#128450;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#7C3AED' }}>Act 5 &middot; Platform Architecture</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>Data Feeds</h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {DATA_FEEDS.length} feeds &middot; ~{fmt(totalRecords)} records/cycle &middot; Click to filter by status
          </p>
        </div>
      </div>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {(['healthy', 'delayed', 'error', 'disabled'] as const).map((status, i) => {
          const isActive = filterStatus === status;
          const count = byStat[status] || 0;
          return (
            <button key={status} onClick={() => setFilterStatus(isActive ? null : status)}
              className="rounded-xl border p-4 text-center transition-all"
              style={{
                background: isActive ? `${statusColors[status]}10` : 'var(--rl-card)',
                borderColor: isActive ? statusColors[status] : 'var(--rl-border)',
                borderTop: `4px solid ${statusColors[status]}`,
                boxShadow: isActive ? `0 0 16px ${statusColors[status]}20` : 'var(--rl-shadow)',
                animation: `fadeUp ${0.3 + i * 0.1}s ease-out`,
              }}>
              <div className="text-2xl mb-1">{statusIcons[status]}</div>
              <div className="text-3xl font-extrabold tabular-nums" style={{ color: statusColors[status] }}>{count}</div>
              <div className="text-[10px] uppercase tracking-[1px] capitalize" style={{ color: 'var(--rl-text-muted)' }}>{status}</div>
            </button>
          );
        })}
      </div>

      {/* Data Flow Diagram */}
      <div className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.5s ease-out' }}>
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Feed Topology &mdash; Source &rarr; Target
        </div>

        <div className="space-y-3">
          {filtered.map((feed, i) => {
            const sColor = statusColors[feed.status];
            const fColor = formatColors[feed.format] || '#94A3B8';
            const isExpanded = expandedId === feed.id;
            const source = INTEGRATION_SYSTEMS.find((s) => s.id === feed.sourceSystem);
            const target = INTEGRATION_SYSTEMS.find((s) => s.id === feed.targetSystem);

            return (
              <button key={feed.id} onClick={() => setExpandedId(isExpanded ? null : feed.id)} className="w-full text-left"
                style={{ animation: `fadeUp ${0.3 + i * 0.06}s ease-out` }}>
                <div className="rounded-xl border p-4 transition-all"
                  style={{
                    borderColor: isExpanded ? sColor : 'var(--rl-border)',
                    borderLeft: `4px solid ${sColor}`,
                    background: isExpanded ? `${sColor}05` : 'transparent',
                    ...(feed.status === 'delayed' ? { animation: 'warningPulse 2s ease-in-out infinite' } : {}),
                  }}>

                  {/* Flow visualization row */}
                  <div className="flex items-center gap-3 mb-2">
                    {/* Source */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: '#7C3AED' }}>
                        {source?.name.split(' ')[0].slice(0, 3).toUpperCase() || '?'}
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--rl-text)' }}>{source?.name.split(' ')[0] || '?'}</span>
                    </div>

                    {/* Flow arrow with status */}
                    <div className="flex-1 flex items-center gap-1">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden relative" style={{ background: `${sColor}20` }}>
                        <div className="h-full rounded-full" style={{ width: feed.status === 'healthy' ? '100%' : feed.status === 'delayed' ? '60%' : '20%', background: sColor, animation: `barReveal 0.6s ease-out ${i * 0.08}s both` }} />
                      </div>
                      <span className="text-sm" style={{ animation: feed.status === 'healthy' ? 'flowPulse 2s ease-in-out infinite' : 'none' }}>
                        {directionIcons[feed.direction]}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: `${sColor}20` }}>
                        <div className="h-full rounded-full" style={{ width: feed.status === 'healthy' ? '100%' : feed.status === 'delayed' ? '60%' : '20%', background: sColor, animation: `barReveal 0.6s ease-out ${i * 0.08 + 0.2}s both` }} />
                      </div>
                    </div>

                    {/* Target */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-semibold" style={{ color: 'var(--rl-text)' }}>{target?.name.split(' ')[0] || '?'}</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: '#2563EB' }}>
                        {target?.name.split(' ')[0].slice(0, 3).toUpperCase() || '?'}
                      </div>
                    </div>
                  </div>

                  {/* Feed info */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{feed.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${sColor}15`, color: sColor }}>
                        {feed.status}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: `${fColor}15`, color: fColor }}>
                      {feed.format}
                    </span>
                  </div>

                  {/* Quick stats */}
                  <div className="flex gap-6 text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                    <span>Freq: <strong style={{ color: 'var(--rl-text)' }}>{feed.frequency.split('+')[0].trim()}</strong></span>
                    <span>Avg: <strong className="tabular-nums" style={{ color: 'var(--rl-text)' }}>{fmt(feed.avgRecords)} rec</strong></span>
                    <span>Duration: <strong style={{ color: 'var(--rl-text)' }}>{feed.avgDuration}</strong></span>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid var(--rl-border)', animation: 'fadeUp 0.2s ease-out' }}>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--rl-text-muted)' }}>{feed.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-[10px]">
                        <div>
                          <div className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--rl-text-muted)' }}>Direction</div>
                          <div className="font-bold capitalize" style={{ color: 'var(--rl-text)' }}>{feed.direction}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--rl-text-muted)' }}>Full Frequency</div>
                          <div className="font-bold" style={{ color: 'var(--rl-text)' }}>{feed.frequency}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--rl-text-muted)' }}>Last Run</div>
                          <div className="font-bold" style={{ color: 'var(--rl-text)' }}>{new Date(feed.lastRun).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-[9px] mt-2 text-right" style={{ color: sColor }}>
                    {isExpanded ? '\u25B2 Less' : '\u25BC More detail'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Volume Comparison — Animated Bars */}
      <div className="rounded-xl border p-6"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.7s ease-out' }}>
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Feed Volume Comparison (avg records/cycle)
        </div>

        <div className="space-y-2">
          {[...DATA_FEEDS].sort((a, b) => b.avgRecords - a.avgRecords).map((feed, i) => {
            const maxRec = Math.max(...DATA_FEEDS.map((f) => f.avgRecords));
            const pct = (feed.avgRecords / maxRec) * 100;
            const sColor = statusColors[feed.status];

            return (
              <div key={feed.id} className="flex items-center gap-3" style={{ animation: `fadeUp ${0.4 + i * 0.06}s ease-out` }}>
                <div className="w-36 text-[11px] font-semibold truncate" style={{ color: 'var(--rl-text)' }}>
                  {feed.name.split('\u2192').pop()?.split('\u2190').pop()?.trim().split(' ').slice(0, 2).join(' ') || feed.name.slice(0, 20)}
                </div>
                <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: 'var(--rl-stripe)' }}>
                  <div className="h-full rounded-lg flex items-center px-2"
                    style={{ width: `${Math.max(pct, 5)}%`, background: `linear-gradient(90deg, ${sColor}80, ${sColor})`, animation: `barReveal 0.8s ease-out ${i * 0.1}s both` }}>
                    <span className="text-[10px] font-bold text-white tabular-nums">{fmt(feed.avgRecords)}</span>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: sColor }} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
