'use client';

import { useState, useEffect } from 'react';

const GATEWAY_URL = 'https://api.aicoderally.com';

type Status = 'checking' | 'healthy' | 'degraded' | 'down';

export function GatewayHealth() {
  const [status, setStatus] = useState<Status>('checking');
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const start = Date.now();
      try {
        const res = await fetch(`${GATEWAY_URL}/healthz`, { mode: 'cors' });
        if (cancelled) return;
        setLatency(Date.now() - start);
        setStatus(res.ok ? 'healthy' : 'degraded');
      } catch {
        if (cancelled) return;
        setLatency(null);
        setStatus('down');
      }
    }
    check();
    const interval = setInterval(check, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const config: Record<Status, { dot: string; label: string; bg: string }> = {
    checking: { dot: 'bg-yellow-400 animate-pulse', label: 'Checking...', bg: 'bg-yellow-500/10 text-yellow-400' },
    healthy: { dot: 'bg-emerald-400', label: 'Gateway Online', bg: 'bg-emerald-500/10 text-emerald-400' },
    degraded: { dot: 'bg-amber-400', label: 'Degraded', bg: 'bg-amber-500/10 text-amber-400' },
    down: { dot: 'bg-red-400', label: 'Offline', bg: 'bg-red-500/10 text-red-400' },
  };

  const c = config[status];

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${c.bg}`}>
      <span className={`h-2 w-2 rounded-full ${c.dot}`} />
      {c.label}
      {latency !== null && status === 'healthy' && (
        <span className="text-[10px] opacity-60">{latency}ms</span>
      )}
    </div>
  );
}
