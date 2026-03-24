/**
 * Stock Ticker Engine — Prospect "market prices" that fluctuate during the draft.
 *
 * Each prospect starts with a price based on their consensus grade.
 * Prices change as the draft progresses:
 * - Drafted: price locks at settlement value (pick slot value)
 * - Passed over by a need team: price drops
 * - Position scarcity (fewer available at position): remaining prices rise
 * - Position run (multiple at same position drafted): remaining prices spike
 */

import { DRAFT_PLAYERS } from '../data/players';
import type { DraftPlayer } from '../data/players';
import type { DraftPick } from '../components/PicksList';
import { expectedGrade } from './grading';

export interface StockEntry {
  playerId: number;
  playerName: string;
  position: string;
  basePrice: number;       // Starting price (based on grade)
  currentPrice: number;    // Current market price
  previousPrice: number;   // Price before last update
  change: number;          // Current change from previous
  changePercent: number;
  drafted: boolean;
  draftedAt?: number;      // Overall pick number
  draftedBy?: string;      // Team abbreviation
  priceHistory: number[];  // Price after each pick
}

// ── Price Constants ─────────────────────────────────────────────

const BASE_MULTIPLIER = 100;   // grade 95 → $9,500 starting price
const SCARCITY_BOOST = 0.03;   // +3% per drafted player at same position
const PASS_PENALTY = -0.015;   // -1.5% when passed by a need team
const RUN_BONUS = 0.05;        // +5% during a position run (3+ same pos in last 5 picks)
const VOLATILITY = 0.008;      // Random noise ±0.8%

// ── Initialization ──────────────────────────────────────────────

export function initializeStockPrices(): StockEntry[] {
  return DRAFT_PLAYERS.map((player) => {
    const basePrice = Math.round(player.grade * BASE_MULTIPLIER);
    return {
      playerId: player.id,
      playerName: player.name,
      position: player.position,
      basePrice,
      currentPrice: basePrice,
      previousPrice: basePrice,
      change: 0,
      changePercent: 0,
      drafted: false,
      priceHistory: [basePrice],
    };
  });
}

// ── Price Update After Each Pick ────────────────────────────────

export function updateStockPrices(
  stocks: StockEntry[],
  newPick: DraftPick,
  recentPicks: DraftPick[],
  _teamNeeds: Record<string, string[]>,
): StockEntry[] {
  const draftedPosition = newPick.player.position;

  // Count how many at this position have been drafted (including this pick)
  const positionDraftedCount = recentPicks.filter(
    (p) => p.player.position === draftedPosition
  ).length;

  // Detect position run (3+ same position in last 5 picks)
  const last5 = recentPicks.slice(-5);
  const positionRunCount = last5.filter(
    (p) => p.player.position === draftedPosition
  ).length;
  const isPositionRun = positionRunCount >= 3;

  // Count remaining at each position
  const remainingByPosition = new Map<string, number>();
  for (const stock of stocks) {
    if (!stock.drafted) {
      remainingByPosition.set(
        stock.position,
        (remainingByPosition.get(stock.position) ?? 0) + 1
      );
    }
  }

  return stocks.map((stock) => {
    // If this player was just drafted
    if (stock.playerId === newPick.player.id) {
      const settlementPrice = Math.round(
        expectedGrade(newPick.pickNumber) * BASE_MULTIPLIER
      );
      return {
        ...stock,
        previousPrice: stock.currentPrice,
        currentPrice: settlementPrice,
        change: settlementPrice - stock.currentPrice,
        changePercent: Math.round(((settlementPrice - stock.currentPrice) / stock.currentPrice) * 1000) / 10,
        drafted: true,
        draftedAt: newPick.pickNumber,
        draftedBy: newPick.teamAbbr,
        priceHistory: [...stock.priceHistory, settlementPrice],
      };
    }

    // Already drafted — no change
    if (stock.drafted) return stock;

    let priceMultiplier = 1;

    // Same position scarcity boost (capped to prevent absurd late-round prices)
    if (stock.position === draftedPosition) {
      priceMultiplier += SCARCITY_BOOST * Math.min(positionDraftedCount, 5);

      // Position run bonus
      if (isPositionRun) {
        priceMultiplier += RUN_BONUS;
      }
    }

    // Different position — slight gravity toward base
    if (stock.position !== draftedPosition) {
      const drift = (stock.basePrice - stock.currentPrice) * 0.005;
      priceMultiplier += drift / stock.currentPrice;
    }

    // Random volatility
    priceMultiplier += (Math.random() - 0.5) * 2 * VOLATILITY;

    const newPrice = Math.max(
      Math.round(stock.basePrice * 0.5), // Floor at 50% of base
      Math.round(stock.currentPrice * priceMultiplier)
    );

    const change = newPrice - stock.currentPrice;
    const changePercent = stock.currentPrice > 0
      ? Math.round((change / stock.currentPrice) * 1000) / 10
      : 0;

    return {
      ...stock,
      previousPrice: stock.currentPrice,
      currentPrice: newPrice,
      change,
      changePercent,
      priceHistory: [...stock.priceHistory, newPrice],
    };
  });
}

// ── Getters ─────────────────────────────────────────────────────

/** Get top movers (biggest absolute % change) */
export function getTopMovers(
  stocks: StockEntry[],
  count: number = 10,
): { gainers: StockEntry[]; losers: StockEntry[] } {
  const available = stocks.filter((s) => !s.drafted);

  const gainers = [...available]
    .filter((s) => s.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, count);

  const losers = [...available]
    .filter((s) => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, count);

  return { gainers, losers };
}

/** Get stocks sorted by current price (most valuable undrafted) */
export function getByValue(stocks: StockEntry[]): StockEntry[] {
  return [...stocks]
    .filter((s) => !s.drafted)
    .sort((a, b) => b.currentPrice - a.currentPrice);
}

/** Format price as currency */
export function formatPrice(price: number): string {
  if (price >= 10000) return `$${(price / 1000).toFixed(1)}K`;
  return `$${price.toLocaleString()}`;
}

/** Format change with + or - prefix */
export function formatChange(change: number): string {
  const prefix = change >= 0 ? '+' : '';
  return `${prefix}${change}`;
}

/** Format change percent */
export function formatChangePercent(pct: number): string {
  const prefix = pct >= 0 ? '+' : '';
  return `${prefix}${pct.toFixed(1)}%`;
}
