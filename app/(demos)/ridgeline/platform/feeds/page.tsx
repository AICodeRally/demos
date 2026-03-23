'use client';

import { DATA_FEEDS } from '@/data/ridgeline';
import { fmt } from '@/lib/utils';

const statusColors: Record<string, string> = {
  healthy: '#10B981',
  delayed: '#F59E0B',
  error: '#EF4444',
  disabled: '#94A3B8',
};

export default function DataFeedsPage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
        >
          <span className="text-3xl text-white">&#128450;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#7C3AED' }}>
            Act 5 &middot; Platform Architecture
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Data Feeds
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {DATA_FEEDS.length} feeds &middot; {DATA_FEEDS.filter((f) => f.status === 'healthy').length} healthy
          </p>
        </div>
      </div>

      {/* Feed Status Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {(['healthy', 'delayed', 'error', 'disabled'] as const).map((status) => {
          const count = DATA_FEEDS.filter((f) => f.status === status).length;
          return (
            <div
              key={status}
              className="rounded-xl border p-4 text-center"
              style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${statusColors[status]}`, boxShadow: 'var(--rl-shadow)' }}
            >
              <div className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1 capitalize" style={{ color: 'var(--rl-text-muted)' }}>{status}</div>
              <div className="text-2xl font-extrabold" style={{ color: statusColors[status] }}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Feed Detail */}
      <div className="space-y-4">
        {DATA_FEEDS.map((feed) => (
          <div
            key={feed.id}
            className="rounded-xl border p-5"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderLeft: `4px solid ${statusColors[feed.status]}`, boxShadow: 'var(--rl-shadow)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold" style={{ color: 'var(--rl-text)' }}>{feed.name}</h3>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${statusColors[feed.status]}15`, color: statusColors[feed.status] }}
                  >
                    {feed.status}
                  </span>
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--rl-text-muted)' }}>
                  {feed.direction === 'inbound' ? '\u2192' : feed.direction === 'outbound' ? '\u2190' : '\u2194'} {feed.direction}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Format</div>
                <div className="text-[12px] font-bold" style={{ color: 'var(--rl-text)' }}>{feed.format}</div>
              </div>
            </div>

            <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'var(--rl-text-muted)' }}>{feed.description}</p>

            <div className="grid grid-cols-4 gap-4 text-[11px]">
              <div>
                <div className="text-[9px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Frequency</div>
                <div className="font-semibold" style={{ color: 'var(--rl-text)' }}>{feed.frequency}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Avg Records</div>
                <div className="font-semibold tabular-nums" style={{ color: 'var(--rl-text)' }}>{fmt(feed.avgRecords)}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Duration</div>
                <div className="font-semibold" style={{ color: 'var(--rl-text)' }}>{feed.avgDuration}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Last Run</div>
                <div className="font-semibold" style={{ color: 'var(--rl-text)' }}>{new Date(feed.lastRun).toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
