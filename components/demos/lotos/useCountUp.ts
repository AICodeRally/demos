'use client';

import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp({ end, duration = 800, decimals = 0, prefix = '', suffix = '' }: UseCountUpOptions): string {
  const safeDecimals = Math.max(0, Math.min(100, Math.floor(decimals)));
  const safeDuration = Math.max(1, duration);
  const [display, setDisplay] = useState(`${prefix}${(0).toFixed(safeDecimals)}${suffix}`);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / safeDuration, 1);
      const eased = easeOutCubic(progress);
      const current = eased * end;

      setDisplay(`${prefix}${current.toFixed(safeDecimals)}${suffix}`);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, safeDuration, safeDecimals, prefix, suffix]);

  return display;
}
