'use client';

import { useState, useEffect, useMemo } from 'react';
import { DRAFT_PLAYERS, POSITION_COLORS } from '../data/players';
import type { DraftPlayer } from '../data/players';
import type { NFLTeam } from '../data/teams';
import type { DraftPick } from './PicksList';
import type { BettingState } from '../lib/betting';
import type { StockEntry } from '../lib/stock-ticker';
import {
  placeLiveBet,
  getPickValueOdds,
  getNextPickCandidates,
  MIN_BET,
  MAX_BET,
  STARTING_BALANCE,
} from '../lib/betting';
import {
  getTopMovers,
  getByValue,
  formatPrice,
  formatChange,
  formatChangePercent,
} from '../lib/stock-ticker';

type BettingTab = 'live' | 'stocks' | 'bets' | 'results';

interface BettingHubProps {
  bettingState: BettingState;
  onBettingStateChange: (state: BettingState) => void;
  stocks: StockEntry[];
  picks: DraftPick[];
  currentPickNumber: number;   // overall pick (1-based)
  activeTeam: NFLTeam;
  teamNeeds: string[];
  draftedPlayerIds: Set<number>;
  isUserPick: boolean;
  draftComplete: boolean;
  draftStarted: boolean;
}

export default function BettingHub({
  bettingState,
  onBettingStateChange,
  stocks,
  picks,
  currentPickNumber,
  activeTeam,
  teamNeeds,
  draftedPlayerIds,
  isUserPick,
  draftComplete,
  draftStarted,
}: BettingHubProps) {
  const [tab, setTab] = useState<BettingTab>(draftComplete ? 'results' : 'live');

  // Auto-switch to results when draft completes
  useEffect(() => {
    if (draftComplete) setTab('results');
  }, [draftComplete]);

  const tabs: { key: BettingTab; label: string; badge?: string }[] = [
    { key: 'live', label: 'Live' },
    { key: 'stocks', label: 'Stocks' },
    { key: 'bets', label: 'My Bets', badge: `${bettingState.liveBets.length + bettingState.propBets.length}` },
    ...(draftComplete ? [{ key: 'results' as BettingTab, label: 'Results' }] : []),
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Balance bar */}
      <div className="px-4 py-2 border-b border-white/5 bg-[var(--otc-bg)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Draft Bucks</span>
          <span className={`text-sm font-black tabular-nums ${
            bettingState.balance >= STARTING_BALANCE ? 'text-emerald-400' : 'text-red-400'
          }`}>
            ${bettingState.balance.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">P/L</span>
          <span className={`text-xs font-black tabular-nums ${
            bettingState.balance - STARTING_BALANCE >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {bettingState.balance - STARTING_BALANCE >= 0 ? '+' : ''}
            ${(bettingState.balance - STARTING_BALANCE).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-white/5 bg-[var(--otc-bg)] shrink-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 px-2 py-2.5 text-xs font-bold text-center transition-all uppercase tracking-wider ${
              tab === t.key
                ? 'text-white border-b-2 border-amber-500 bg-white/5'
                : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            {t.label}
            {t.badge && t.badge !== '0' && (
              <span className="ml-1 text-[9px] px-1 rounded-full bg-amber-500/20 text-amber-400">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'live' && (
          <LiveBettingTab
            bettingState={bettingState}
            onBettingStateChange={onBettingStateChange}
            currentPickNumber={currentPickNumber}
            activeTeam={activeTeam}
            teamNeeds={teamNeeds}
            draftedPlayerIds={draftedPlayerIds}
            isUserPick={isUserPick}
            draftComplete={draftComplete}
          />
        )}
        {tab === 'stocks' && <StockTickerTab stocks={stocks} />}
        {tab === 'bets' && <MyBetsTab bettingState={bettingState} />}
        {tab === 'results' && <ResultsTab bettingState={bettingState} />}
      </div>
    </div>
  );
}

// ── Live Betting Tab ─────────────────────────────────────────────

function LiveBettingTab({
  bettingState,
  onBettingStateChange,
  currentPickNumber,
  activeTeam,
  teamNeeds,
  draftedPlayerIds,
  isUserPick,
  draftComplete,
}: {
  bettingState: BettingState;
  onBettingStateChange: (state: BettingState) => void;
  currentPickNumber: number;
  activeTeam: NFLTeam;
  teamNeeds: string[];
  draftedPlayerIds: Set<number>;
  isUserPick: boolean;
  draftComplete: boolean;
}) {
  const [betAmount, setBetAmount] = useState(500);

  // Clamp bet amount when balance drops below current bet
  useEffect(() => {
    if (betAmount > bettingState.balance) {
      setBetAmount(Math.max(MIN_BET, Math.min(betAmount, bettingState.balance)));
    }
  }, [bettingState.balance, betAmount]);

  const availablePlayers = DRAFT_PLAYERS.filter((p) => !draftedPlayerIds.has(p.id));
  const pickValueOdds = getPickValueOdds(activeTeam.abbr, teamNeeds, availablePlayers, currentPickNumber);
  const candidates = getNextPickCandidates(activeTeam.abbr, teamNeeds, availablePlayers, currentPickNumber);

  // Check if user already bet on this pick
  const alreadyBetPickValue = bettingState.liveBets.some(
    (b) => b.pickNumber === currentPickNumber && b.type === 'pick_value' && !b.settled
  );
  const alreadyBetNextPick = bettingState.liveBets.some(
    (b) => b.pickNumber === currentPickNumber && b.type === 'next_pick' && !b.settled
  );

  if (draftComplete) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-slate-400">Draft is over! Check the Results tab.</p>
      </div>
    );
  }

  if (isUserPick) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-amber-400 font-bold">It&apos;s your pick!</p>
        <p className="text-xs text-slate-300 mt-1">Betting is disabled when you&apos;re on the clock.</p>
      </div>
    );
  }

  if (bettingState.balance < MIN_BET) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-red-400 font-bold">Insufficient Funds</p>
        <p className="text-xs text-slate-300 mt-1">You need at least ${MIN_BET} to place a bet.</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      {/* Bet amount control */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold shrink-0">Wager</span>
        <input
          type="range"
          min={MIN_BET}
          max={Math.min(MAX_BET, bettingState.balance)}
          step={100}
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="flex-1 h-1 appearance-none bg-white/10 rounded-full accent-amber-500"
        />
        <span className="text-xs font-black text-amber-400 tabular-nums w-14 text-right">${betAmount}</span>
      </div>

      {/* Pick Value Betting */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-white uppercase tracking-wider">Pick #{currentPickNumber} Value</span>
          <span className="text-[9px] text-slate-400">
            {activeTeam.city} {activeTeam.name}
          </span>
        </div>
        <p className="text-[9px] text-slate-400 mb-2">
          STEAL = great value · SOLID = expected · REACH = overdrafted
        </p>

        {alreadyBetPickValue ? (
          <div className="text-xs text-emerald-400 font-bold px-3 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-[fadeIn_0.3s_ease-out]">
            Bet placed! Waiting for pick...
          </div>
        ) : (
          <div className="flex gap-2">
            {(['steal', 'solid', 'reach'] as const).map((type) => {
              const odds = pickValueOdds[type];
              const colors = {
                steal: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', hover: 'hover:bg-emerald-500/25' },
                solid: { bg: 'bg-blue-500/15', text: 'text-blue-400', hover: 'hover:bg-blue-500/25' },
                reach: { bg: 'bg-red-500/15', text: 'text-red-400', hover: 'hover:bg-red-500/25' },
              };
              const c = colors[type];
              return (
                <button
                  key={type}
                  onClick={() => {
                    onBettingStateChange(
                      placeLiveBet(bettingState, 'pick_value', currentPickNumber, activeTeam.abbr, type, odds, betAmount)
                    );
                  }}
                  disabled={bettingState.balance < betAmount}
                  className={`flex-1 ${c.bg} ${c.text} ${c.hover} rounded-lg py-3 px-2 min-h-[44px] text-center transition-all disabled:opacity-30`}
                >
                  <div className="text-xs font-black uppercase">{type}</div>
                  <div className="text-[10px] font-bold opacity-70">{odds}x</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Next Pick Prediction Market */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black text-white uppercase tracking-wider">Who Gets Picked?</span>
        </div>

        {alreadyBetNextPick ? (
          <div className="text-xs text-emerald-400 font-bold px-3 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-[fadeIn_0.3s_ease-out]">
            Prediction placed! Waiting for pick...
          </div>
        ) : (
          <div className="space-y-1">
            {candidates.map(({ player, odds, probability }) => {
              const posColor = POSITION_COLORS[player.position] ?? '#64748b';
              return (
                <button
                  key={player.id}
                  onClick={() => {
                    onBettingStateChange(
                      placeLiveBet(bettingState, 'next_pick', currentPickNumber, activeTeam.abbr, player.name, odds, betAmount, player.id)
                    );
                  }}
                  disabled={bettingState.balance < betAmount}
                  className="w-full flex items-center gap-2 px-3 py-2.5 min-h-[44px] rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/[0.03] transition-all disabled:opacity-30"
                >
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded text-white w-10 text-center"
                    style={{ backgroundColor: posColor }}
                  >
                    {player.position}
                  </span>
                  <span className="text-xs font-bold text-slate-300 flex-1 text-left truncate">{player.name}</span>
                  <span className="text-[10px] text-slate-300 tabular-nums">{Math.round(probability * 100)}%</span>
                  <span className="text-[10px] font-black text-amber-400 tabular-nums">{odds}x</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stock Ticker Tab ─────────────────────────────────────────────

function StockTickerTab({ stocks }: { stocks: StockEntry[] }) {
  const [view, setView] = useState<'movers' | 'value'>('movers');

  const { gainers, losers } = useMemo(() => getTopMovers(stocks, 8), [stocks]);
  const byValue = useMemo(() => getByValue(stocks).slice(0, 20), [stocks]);

  if (stocks.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-slate-300">Stock market initializing...</p>
        <p className="text-xs text-slate-400 mt-1">Prices appear once the draft begins</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex gap-1 mb-3">
        <button
          onClick={() => setView('movers')}
          className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-all ${
            view === 'movers' ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-300'
          }`}
        >
          Top Movers
        </button>
        <button
          onClick={() => setView('value')}
          className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-all ${
            view === 'value' ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-300'
          }`}
        >
          By Value
        </button>
      </div>

      {view === 'movers' ? (
        <div className="space-y-3">
          {/* Gainers */}
          <div>
            <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">Rising</div>
            {gainers.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic">No movers yet — draft hasn&apos;t started</p>
            ) : (
              gainers.map((stock) => <StockRow key={stock.playerId} stock={stock} />)
            )}
          </div>

          {/* Losers */}
          <div>
            <div className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1.5">Falling</div>
            {losers.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic">No drops yet</p>
            ) : (
              losers.map((stock) => <StockRow key={stock.playerId} stock={stock} />)
            )}
          </div>
        </div>
      ) : (
        <div>
          {byValue.map((stock, i) => (
            <StockRow key={stock.playerId} stock={stock} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function StockRow({ stock, rank }: { stock: StockEntry; rank?: number }) {
  const posColor = POSITION_COLORS[stock.position] ?? '#64748b';
  const isUp = stock.change > 0;
  const isDown = stock.change < 0;

  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-white/5">
      {rank !== undefined && (
        <span className="text-[10px] font-mono text-slate-400 w-5 text-right">{rank}</span>
      )}
      <span
        className="text-[9px] font-black px-1 py-0.5 rounded text-white w-9 text-center"
        style={{ backgroundColor: posColor }}
      >
        {stock.position}
      </span>
      <span className="text-xs font-bold text-slate-300 flex-1 truncate">{stock.playerName}</span>
      <span className="text-xs font-black text-white tabular-nums">{formatPrice(stock.currentPrice)}</span>
      <span className={`text-[10px] font-bold tabular-nums w-14 text-right ${
        isUp ? 'text-emerald-400' : isDown ? 'text-red-400' : 'text-slate-400'
      }`}>
        {stock.change !== 0 ? formatChangePercent(stock.changePercent) : '—'}
      </span>
    </div>
  );
}

// ── My Bets Tab ──────────────────────────────────────────────────

function MyBetsTab({ bettingState }: { bettingState: BettingState }) {
  const allBets = [
    ...bettingState.propBets.map((b) => ({
      id: b.id,
      description: b.description,
      amount: b.amount,
      odds: b.odds,
      settled: b.settled,
      won: b.won,
      payout: b.payout,
      type: 'prop' as const,
    })),
    ...bettingState.liveBets.map((b) => ({
      id: b.id,
      description: `Pick #${b.pickNumber} ${b.teamAbbr} — ${b.selection}`,
      amount: b.amount,
      odds: b.odds,
      settled: b.settled,
      won: b.won,
      payout: b.payout,
      type: b.type,
    })),
  ];

  const predictions = bettingState.predictions;

  if (allBets.length === 0 && predictions.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-slate-300">No bets placed yet</p>
        <p className="text-xs text-slate-400 mt-1">Use the Live tab to place bets during the draft</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      {/* Predictions */}
      {predictions.length > 0 && (
        <div>
          <div className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1.5">Predictions</div>
          {predictions.map((pred) => (
            <div key={pred.slot} className="flex items-center gap-2 py-1 border-b border-white/5">
              <span className="text-xs font-black text-slate-400 w-6">#{pred.slot}</span>
              <span className="text-xs font-bold text-slate-300 flex-1">{pred.playerName}</span>
              {pred.correct === null ? (
                <span className="text-[10px] text-slate-400">Pending</span>
              ) : pred.correct ? (
                <span className="text-[10px] font-black text-emerald-400">CORRECT +500</span>
              ) : (
                <span className="text-[10px] text-red-400">
                  Wrong — was {pred.actualPlayerName}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* All bets */}
      {allBets.length > 0 && (
        <div>
          <div className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1.5">Bets</div>
          {allBets.map((bet) => (
            <div key={bet.id} className="flex items-center gap-2 py-1.5 border-b border-white/5">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-300 truncate">{bet.description}</p>
                <p className="text-[10px] text-slate-400">${bet.amount} @ {bet.odds}x</p>
              </div>
              {!bet.settled ? (
                <span className="text-[10px] text-amber-400/60 font-bold px-2 py-0.5 rounded bg-amber-500/10">LIVE</span>
              ) : bet.won ? (
                <span className="text-[10px] font-black text-emerald-400">+${bet.payout}</span>
              ) : (
                <span className="text-[10px] text-red-400">-${bet.amount}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Results Tab ──────────────────────────────────────────────────

function getPerformanceReaction(profitLoss: number): { label: string; color: string } {
  if (profitLoss >= 2000) return { label: 'LEGENDARY', color: '#f59e0b' };
  if (profitLoss >= 500) return { label: 'NICE RUN', color: '#10b981' };
  if (profitLoss >= 0) return { label: 'BROKE EVEN', color: '#64748b' };
  if (profitLoss >= -1000) return { label: 'ROUGH DAY', color: '#ef4444' };
  return { label: 'BUSTED', color: '#ef4444' };
}

function ResultsTab({ bettingState }: { bettingState: BettingState }) {
  const profitLoss = bettingState.balance - STARTING_BALANCE;
  const totalBets = bettingState.liveBets.length + bettingState.propBets.length;
  const wonBets = [...bettingState.liveBets, ...bettingState.propBets].filter((b) => b.won).length;
  const winRate = totalBets > 0 ? Math.round((wonBets / totalBets) * 100) : 0;

  const correctPredictions = bettingState.predictions.filter((p) => p.correct === true).length;
  const totalPredictions = bettingState.predictions.length;
  const reaction = getPerformanceReaction(profitLoss);

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <p className="text-xs text-slate-300 uppercase tracking-widest font-bold mb-1">Final Results</p>

        {/* Reaction */}
        <p className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: reaction.color }}>
          {reaction.label}
        </p>

        {/* P/L Hero */}
        <div className={`text-3xl font-black ${profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {profitLoss >= 0 ? '+' : ''}${profitLoss.toLocaleString()}
        </div>
        <p className="text-[10px] text-slate-400">
          Started $10,000 &middot; Ended ${bettingState.balance.toLocaleString()}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatBox label="Win Rate" value={`${winRate}%`} sub={`${wonBets}/${totalBets} bets`} />
        <StatBox label="Total Wagered" value={`$${bettingState.totalWagered.toLocaleString()}`} />
        <StatBox label="Predictions" value={`${correctPredictions}/${totalPredictions}`} sub={`${bettingState.predictionScore ?? 0}% accuracy`} />
        <StatBox label="Total Won" value={`$${bettingState.totalWinnings.toLocaleString()}`} />
      </div>

      {/* Prediction details */}
      {bettingState.predictions.length > 0 && (
        <div>
          <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2">Pick Predictions</p>
          {bettingState.predictions.map((pred) => (
            <div key={pred.slot} className="flex items-center gap-2 py-1 border-b border-white/5">
              <span className="text-xs font-black text-slate-400 w-6">#{pred.slot}</span>
              <span className={`text-xs font-bold flex-1 ${pred.correct ? 'text-emerald-400' : 'text-slate-300'}`}>
                {pred.playerName}
              </span>
              {pred.correct ? (
                <span className="text-[10px] font-black text-emerald-400">NAILED IT</span>
              ) : (
                <span className="text-[10px] text-slate-400">Actual: {pred.actualPlayerName}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">{label}</p>
      <p className="text-lg font-black text-white">{value}</p>
      {sub && <p className="text-[10px] text-slate-300">{sub}</p>}
    </div>
  );
}
