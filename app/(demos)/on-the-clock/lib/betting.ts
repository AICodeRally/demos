/**
 * Betting Engine — Core types and logic for the On The Clock prediction market.
 * All client-side, mock credits, localStorage leaderboard.
 */

import type { DraftPlayer } from '../data/players';
import type { DraftPick } from '../components/PicksList';

// ── Types ─────────────────────────────────────────────────────────

export interface Prediction {
  slot: number;             // Overall pick number (1-5 for top-5 predictions)
  playerId: number;
  playerName: string;
  position: string;
  correct: boolean | null;  // null = not yet settled
  actualPlayerId?: number;
  actualPlayerName?: string;
}

export type PropBetSide = 'over' | 'under';
export type PickValueBet = 'steal' | 'reach' | 'solid';

export interface PropBet {
  id: string;
  description: string;     // e.g. "4+ QBs in Round 1"
  position: string;
  threshold: number;        // e.g. 4
  roundScope: number;       // which round (1 = Round 1)
  side: PropBetSide;
  amount: number;
  odds: number;             // decimal odds (e.g. 1.8)
  settled: boolean;
  won: boolean | null;
  payout: number;
}

export interface LiveBet {
  id: string;
  type: 'pick_value' | 'next_pick';
  pickNumber: number;       // which overall pick this bet is for
  teamAbbr: string;
  selection: string;        // 'steal' | 'reach' | 'solid' OR player name
  playerId?: number;        // for next_pick bets
  amount: number;
  odds: number;
  settled: boolean;
  won: boolean | null;
  payout: number;
}

export interface BettingState {
  balance: number;
  predictions: Prediction[];
  propBets: PropBet[];
  liveBets: LiveBet[];
  predictionScore: number | null;   // calculated after draft
  totalWinnings: number;
  totalWagered: number;
}

export interface LeaderboardEntry {
  id: string;
  date: string;
  teamAbbr: string | null;
  predictionAccuracy: number;       // 0-100%
  profitLoss: number;
  totalWagered: number;
  score: number;                    // composite score
  picks: number;                    // total draft picks
}

// ── Constants ─────────────────────────────────────────────────────

export const STARTING_BALANCE = 10_000;
export const MIN_BET = 100;
export const MAX_BET = 2_000;
const LEADERBOARD_KEY = 'otc-leaderboard';
const MAX_LEADERBOARD_ENTRIES = 50;

// ── Initial State ─────────────────────────────────────────────────

export function createInitialBettingState(): BettingState {
  return {
    balance: STARTING_BALANCE,
    predictions: [],
    propBets: [],
    liveBets: [],
    predictionScore: null,
    totalWinnings: 0,
    totalWagered: 0,
  };
}

// ── Prediction Helpers ────────────────────────────────────────────

export function addPrediction(
  state: BettingState,
  slot: number,
  player: DraftPlayer,
): BettingState {
  const existing = state.predictions.filter((p) => p.slot !== slot);
  return {
    ...state,
    predictions: [
      ...existing,
      {
        slot,
        playerId: player.id,
        playerName: player.name,
        position: player.position,
        correct: null,
      },
    ].sort((a, b) => a.slot - b.slot),
  };
}

export function removePrediction(state: BettingState, slot: number): BettingState {
  return {
    ...state,
    predictions: state.predictions.filter((p) => p.slot !== slot),
  };
}

export function settlePredictions(state: BettingState, picks: DraftPick[]): BettingState {
  const settled = state.predictions.map((pred) => {
    const actualPick = picks.find((p) => p.pickNumber === pred.slot);
    if (!actualPick) return pred;
    const correct = actualPick.player.id === pred.playerId;
    return {
      ...pred,
      correct,
      actualPlayerId: actualPick.player.id,
      actualPlayerName: actualPick.player.name,
    };
  });

  const correctCount = settled.filter((p) => p.correct === true).length;
  const total = settled.length;
  const predictionScore = total > 0 ? Math.round((correctCount / total) * 100) : null;

  // Prediction payout: 500 credits per correct prediction, bonus for streak
  const payout = correctCount * 500 + (correctCount >= 3 ? 1000 : 0) + (correctCount >= 5 ? 2000 : 0);

  return {
    ...state,
    predictions: settled,
    predictionScore,
    balance: state.balance + payout,
    totalWinnings: state.totalWinnings + payout,
  };
}

// ── Prop Bet Helpers ──────────────────────────────────────────────

export interface PropTemplate {
  id: string;
  description: string;
  position: string;
  threshold: number;
  roundScope: number;
  overOdds: number;
  underOdds: number;
}

/** Generate prop bet templates based on typical NFL Draft patterns */
export function generatePropTemplates(): PropTemplate[] {
  return [
    { id: 'qb-r1', description: 'QBs drafted in Round 1', position: 'QB', threshold: 4, roundScope: 1, overOdds: 2.1, underOdds: 1.7 },
    { id: 'wr-r1', description: 'WRs drafted in Round 1', position: 'WR', threshold: 5, roundScope: 1, overOdds: 1.9, underOdds: 1.85 },
    { id: 'edge-top10', description: 'EDGE players in top 10', position: 'EDGE', threshold: 3, roundScope: 1, overOdds: 2.3, underOdds: 1.6 },
    { id: 'ot-r1', description: 'OTs drafted in Round 1', position: 'OT', threshold: 4, roundScope: 1, overOdds: 1.8, underOdds: 1.95 },
    { id: 'cb-r1', description: 'CBs drafted in Round 1', position: 'CB', threshold: 3, roundScope: 1, overOdds: 2.0, underOdds: 1.8 },
    { id: 'dt-r1', description: 'DTs drafted in Round 1', position: 'DT', threshold: 2, roundScope: 1, overOdds: 1.75, underOdds: 2.0 },
  ];
}

export function placePropBet(
  state: BettingState,
  template: PropTemplate,
  side: PropBetSide,
  amount: number,
): BettingState {
  if (amount > state.balance || amount < MIN_BET) return state;

  const odds = side === 'over' ? template.overOdds : template.underOdds;
  const bet: PropBet = {
    id: `prop-${template.id}-${Date.now()}`,
    description: `${side === 'over' ? 'Over' : 'Under'} ${template.threshold} ${template.description}`,
    position: template.position,
    threshold: template.threshold,
    roundScope: template.roundScope,
    side,
    amount,
    odds,
    settled: false,
    won: null,
    payout: 0,
  };

  return {
    ...state,
    balance: state.balance - amount,
    totalWagered: state.totalWagered + amount,
    propBets: [...state.propBets, bet],
  };
}

export function settlePropBets(state: BettingState, picks: DraftPick[]): BettingState {
  const settled = state.propBets.map((bet) => {
    if (bet.settled) return bet;

    // Count how many players of this position were drafted in the scope
    const relevantPicks = picks.filter((p) => {
      if (p.round > bet.roundScope) return false;
      // For "top 10" style bets, check overall pick number
      if (bet.id.includes('top10')) return p.pickNumber <= 10 && p.player.position === bet.position;
      return p.player.position === bet.position;
    });

    const count = relevantPicks.length;
    const won = bet.side === 'over' ? count >= bet.threshold : count < bet.threshold;
    const payout = won ? Math.round(bet.amount * bet.odds) : 0;

    return { ...bet, settled: true, won, payout };
  });

  const newWinnings = settled.reduce((sum, b) => sum + (b.settled && !state.propBets.find((ob) => ob.id === b.id)?.settled ? b.payout : 0), 0);
  // Recalculate from scratch to avoid double-counting
  const totalPayout = settled.filter((b) => b.won).reduce((sum, b) => sum + b.payout, 0);

  return {
    ...state,
    propBets: settled,
    balance: state.balance + settled.filter((b) => b.won && !state.propBets.find((ob) => ob.id === b.id)?.settled).reduce((sum, b) => sum + b.payout, 0),
    totalWinnings: state.totalWinnings + settled.filter((b) => b.won && !state.propBets.find((ob) => ob.id === b.id)?.settled).reduce((sum, b) => sum + b.payout, 0),
  };
}

// ── Live Bet Helpers ──────────────────────────────────────────────

export function placeLiveBet(
  state: BettingState,
  type: 'pick_value' | 'next_pick',
  pickNumber: number,
  teamAbbr: string,
  selection: string,
  odds: number,
  amount: number,
  playerId?: number,
): BettingState {
  if (amount > state.balance || amount < MIN_BET) return state;

  const bet: LiveBet = {
    id: `live-${type}-${pickNumber}-${Date.now()}`,
    type,
    pickNumber,
    teamAbbr,
    selection,
    playerId,
    amount,
    odds,
    settled: false,
    won: null,
    payout: 0,
  };

  return {
    ...state,
    balance: state.balance - amount,
    totalWagered: state.totalWagered + amount,
    liveBets: [...state.liveBets, bet],
  };
}

export function settleLiveBet(
  state: BettingState,
  pickNumber: number,
  pick: DraftPick,
  pickReaction: string, // 'STEAL!' | 'GREAT PICK' | 'SOLID' | 'REACH'
): BettingState {
  const updated = state.liveBets.map((bet) => {
    if (bet.settled || bet.pickNumber !== pickNumber) return bet;

    let won = false;
    if (bet.type === 'pick_value') {
      const reactionMap: Record<string, string[]> = {
        steal: ['STEAL!', 'GREAT PICK'],
        solid: ['SOLID'],
        reach: ['REACH'],
      };
      won = (reactionMap[bet.selection] ?? []).includes(pickReaction);
    } else if (bet.type === 'next_pick') {
      won = bet.playerId === pick.player.id;
    }

    const payout = won ? Math.round(bet.amount * bet.odds) : 0;
    return { ...bet, settled: true, won, payout };
  });

  const newPayouts = updated
    .filter((b) => b.settled && b.won && !state.liveBets.find((ob) => ob.id === b.id)?.settled)
    .reduce((sum, b) => sum + b.payout, 0);

  return {
    ...state,
    liveBets: updated,
    balance: state.balance + newPayouts,
    totalWinnings: state.totalWinnings + newPayouts,
  };
}

// ── Pick Value Odds Generator ─────────────────────────────────────

/** Generate odds for steal/solid/reach based on available players and team needs */
export function getPickValueOdds(
  _teamAbbr: string,
  _teamNeeds: string[],
  _availablePlayers: DraftPlayer[],
  _overallPick: number,
): { steal: number; solid: number; reach: number } {
  // Simplified odds — in a real system this would use Monte Carlo simulation
  return {
    steal: 3.2,    // ~31% chance
    solid: 1.8,    // ~56% chance
    reach: 2.5,    // ~40% chance (overlaps with solid)
  };
}

/** Generate odds for "who will be picked" — top 5 candidates with probabilities */
export function getNextPickCandidates(
  teamAbbr: string,
  teamNeeds: string[],
  availablePlayers: DraftPlayer[],
  overallPick: number,
): { player: DraftPlayer; odds: number; probability: number }[] {
  // Score each player (same logic as CPU draft, but deterministic for odds)
  const scored = availablePlayers.slice(0, 30).map((player) => {
    let score = player.grade;
    const needIndex = teamNeeds.indexOf(player.position);
    if (needIndex === 0) score += 8;
    else if (needIndex === 1) score += 5;
    else if (needIndex === 2) score += 3;

    const expectedGrade = 100 - overallPick * 0.4;
    if (player.grade < expectedGrade - 10) score -= 3;

    return { player, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top5 = scored.slice(0, 5);

  // Convert scores to probabilities
  const totalScore = top5.reduce((s, t) => s + t.score, 0);
  return top5.map(({ player, score }) => {
    const probability = score / totalScore;
    // Odds = 1 / probability, capped at reasonable range
    const rawOdds = 1 / probability;
    const odds = Math.max(1.3, Math.min(15, Math.round(rawOdds * 10) / 10));
    return { player, odds, probability };
  });
}

// ── Leaderboard ───────────────────────────────────────────────────

export function calculateScore(state: BettingState): number {
  const predBonus = (state.predictionScore ?? 0) * 10;
  const profitLoss = state.balance - STARTING_BALANCE;
  const plScore = Math.max(-500, Math.min(500, profitLoss / 10));
  return Math.round(predBonus + plScore);
}

export function saveToLeaderboard(state: BettingState, teamAbbr: string | null, totalPicks: number): LeaderboardEntry {
  const entry: LeaderboardEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    teamAbbr,
    predictionAccuracy: state.predictionScore ?? 0,
    profitLoss: state.balance - STARTING_BALANCE,
    totalWagered: state.totalWagered,
    score: calculateScore(state),
    picks: totalPicks,
  };

  try {
    const existing = loadLeaderboard();
    const updated = [entry, ...existing].slice(0, MAX_LEADERBOARD_ENTRIES);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  } catch {
    // localStorage not available (SSR or quota exceeded)
  }

  return entry;
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LeaderboardEntry[];
    return parsed.sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch {
    // ignore
  }
}
