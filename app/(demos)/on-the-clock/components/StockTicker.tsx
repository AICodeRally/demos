'use client';

import { useMemo } from 'react';
import type { StockEntry } from '../lib/stock-ticker';
import { formatPrice, formatChangePercent } from '../lib/stock-ticker';
import { POSITION_COLORS } from '../data/players';

interface StockTickerBarProps {
  stocks: StockEntry[];
}

/**
 * Bottom-bar stock ticker — scrolling tape of prospect prices.
 * Shows top movers (both up and down) in a horizontal scroll.
 */
export default function StockTickerBar({ stocks }: StockTickerBarProps) {
  const movers = useMemo(() => {
    const available = stocks.filter((s) => !s.drafted && s.change !== 0);
    return [...available]
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 15);
  }, [stocks]);

  if (movers.length === 0) return null;

  return (
    <div className="flex items-center gap-4 whitespace-nowrap">
      {/* Duplicate for seamless loop */}
      {[...movers, ...movers].map((stock, i) => {
        const isUp = stock.change > 0;
        const posColor = POSITION_COLORS[stock.position] ?? '#64748b';
        return (
          <span key={`${stock.playerId}-${i}`} className="inline-flex items-center gap-1.5">
            <span
              className="text-[9px] font-black px-1 py-0.5 rounded text-white"
              style={{ backgroundColor: posColor }}
            >
              {stock.position}
            </span>
            <span className="text-[11px] font-bold text-slate-400">{stock.playerName}</span>
            <span className="text-[11px] font-black text-white tabular-nums">{formatPrice(stock.currentPrice)}</span>
            <span className={`text-[10px] font-bold tabular-nums ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatChangePercent(stock.changePercent)}
            </span>
          </span>
        );
      })}
    </div>
  );
}
