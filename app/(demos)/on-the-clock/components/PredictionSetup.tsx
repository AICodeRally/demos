'use client';

import { useState } from 'react';
import { DRAFT_PLAYERS, POSITION_COLORS } from '../data/players';
import type { DraftPlayer } from '../data/players';
import type { BettingState, PropTemplate, PropBetSide } from '../lib/betting';
import {
  addPrediction,
  removePrediction,
  generatePropTemplates,
  placePropBet,
  STARTING_BALANCE,
  MIN_BET,
  MAX_BET,
} from '../lib/betting';

interface PredictionSetupProps {
  bettingState: BettingState;
  onBettingStateChange: (state: BettingState) => void;
}

type SetupTab = 'predictions' | 'props';

export default function PredictionSetup({ bettingState, onBettingStateChange }: PredictionSetupProps) {
  const [tab, setTab] = useState<SetupTab>('predictions');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const propTemplates = generatePropTemplates();

  return (
    <div className="w-full max-w-[520px] mx-auto">
      {/* Balance display */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Draft Bucks</span>
        <span className="text-lg font-black text-amber-400 tabular-nums">
          ${bettingState.balance.toLocaleString()}
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-3 justify-center">
        {(['predictions', 'props'] as SetupTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all ${
              tab === t
                ? 'bg-amber-500 text-black'
                : 'bg-white/5 text-slate-500 hover:bg-white/10'
            }`}
          >
            {t === 'predictions' ? 'Top 5 Picks' : 'Prop Bets'}
          </button>
        ))}
      </div>

      {tab === 'predictions' ? (
        <PredictionsTab
          bettingState={bettingState}
          onBettingStateChange={onBettingStateChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeSlot={activeSlot}
          setActiveSlot={setActiveSlot}
        />
      ) : (
        <PropsTab
          bettingState={bettingState}
          onBettingStateChange={onBettingStateChange}
          templates={propTemplates}
        />
      )}
    </div>
  );
}

// ── Predictions Tab ─────────────────────────────────────────────

function PredictionsTab({
  bettingState,
  onBettingStateChange,
  searchQuery,
  setSearchQuery,
  activeSlot,
  setActiveSlot,
}: {
  bettingState: BettingState;
  onBettingStateChange: (state: BettingState) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeSlot: number | null;
  setActiveSlot: (s: number | null) => void;
}) {
  const predictions = bettingState.predictions;
  const usedPlayerIds = new Set(predictions.map((p) => p.playerId));

  const filteredPlayers = DRAFT_PLAYERS.filter((p) => {
    if (usedPlayerIds.has(p.id)) return false;
    if (!searchQuery) return true;
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.school.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).slice(0, 20);

  function handleSelectPlayer(player: DraftPlayer) {
    if (activeSlot === null) return;
    onBettingStateChange(addPrediction(bettingState, activeSlot, player));
    setActiveSlot(null);
    setSearchQuery('');
  }

  return (
    <div>
      <p className="text-[10px] text-slate-500 text-center mb-2">
        Predict who goes #1 through #5. 500 credits per correct pick!
      </p>

      {/* Prediction slots */}
      <div className="space-y-1.5 mb-3">
        {[1, 2, 3, 4, 5].map((slot) => {
          const pred = predictions.find((p) => p.slot === slot);
          const isActive = activeSlot === slot;
          return (
            <div
              key={slot}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? 'border-amber-500 bg-amber-500/10'
                  : pred
                    ? 'border-white/10 bg-white/[0.03]'
                    : 'border-white/5 bg-white/[0.01] hover:border-white/10'
              }`}
              onClick={() => setActiveSlot(isActive ? null : slot)}
            >
              <span className="text-lg font-black text-slate-600 w-6 text-center">#{slot}</span>
              {pred ? (
                <div className="flex-1 flex items-center gap-2">
                  <span
                    className="text-[10px] font-black px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: POSITION_COLORS[pred.position] ?? '#64748b' }}
                  >
                    {pred.position}
                  </span>
                  <span className="text-sm font-bold text-white">{pred.playerName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBettingStateChange(removePrediction(bettingState, slot));
                    }}
                    className="ml-auto text-[10px] text-red-400/60 hover:text-red-400 font-bold"
                  >
                    X
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-600 italic">
                  {isActive ? 'Select a player below...' : 'Tap to predict'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Player search (visible when a slot is active) */}
      {activeSlot !== null && (
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 text-sm text-white placeholder:text-slate-600 outline-none border-b border-white/5"
            autoFocus
          />
          <div className="max-h-[160px] overflow-y-auto">
            {filteredPlayers.map((player) => (
              <button
                key={player.id}
                onClick={() => handleSelectPlayer(player)}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-white/5 transition-colors"
              >
                <span
                  className="text-[9px] font-black px-1.5 py-0.5 rounded text-white w-10 text-center"
                  style={{ backgroundColor: POSITION_COLORS[player.position] ?? '#64748b' }}
                >
                  {player.position}
                </span>
                <span className="text-xs font-bold text-slate-300 truncate">{player.name}</span>
                <span className="text-[10px] text-slate-600 truncate">{player.school}</span>
                <span className="text-[10px] font-bold text-emerald-400/70 tabular-nums ml-auto">{player.grade}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Props Tab ─────────────────────────────────────────────────────

function PropsTab({
  bettingState,
  onBettingStateChange,
  templates,
}: {
  bettingState: BettingState;
  onBettingStateChange: (state: BettingState) => void;
  templates: PropTemplate[];
}) {
  const [amounts, setAmounts] = useState<Record<string, number>>(
    Object.fromEntries(templates.map((t) => [t.id, 500]))
  );

  const placedBetIds = new Set(bettingState.propBets.map((b) => b.id.split('-').slice(1, -1).join('-')));

  function handlePlace(template: PropTemplate, side: PropBetSide) {
    const amount = amounts[template.id] ?? 500;
    onBettingStateChange(placePropBet(bettingState, template, side, amount));
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-slate-500 text-center mb-2">
        Over/Under bets on Round 1 positions. Settled after Round 1 completes.
      </p>

      {templates.map((template) => {
        const alreadyPlaced = bettingState.propBets.some((b) => b.description.includes(template.description));
        const amount = amounts[template.id] ?? 500;
        const posColor = POSITION_COLORS[template.position] ?? '#64748b';

        return (
          <div
            key={template.id}
            className={`p-3 rounded-lg border transition-all ${
              alreadyPlaced
                ? 'border-emerald-500/20 bg-emerald-500/5'
                : 'border-white/5 bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[10px] font-black px-1.5 py-0.5 rounded text-white"
                style={{ backgroundColor: posColor }}
              >
                {template.position}
              </span>
              <span className="text-xs font-bold text-white flex-1">
                {template.threshold}+ {template.description}
              </span>
            </div>

            {alreadyPlaced ? (
              <div className="text-[10px] text-emerald-400 font-bold">
                Bet placed! {bettingState.propBets.find((b) => b.description.includes(template.description))?.description}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Amount slider */}
                <div className="flex-1">
                  <input
                    type="range"
                    min={MIN_BET}
                    max={Math.min(MAX_BET, bettingState.balance)}
                    step={100}
                    value={amount}
                    onChange={(e) => setAmounts({ ...amounts, [template.id]: Number(e.target.value) })}
                    className="w-full h-1 appearance-none bg-white/10 rounded-full accent-amber-500"
                  />
                  <div className="text-[9px] text-slate-500 tabular-nums text-center">${amount}</div>
                </div>

                {/* Over/Under buttons */}
                <button
                  onClick={() => handlePlace(template, 'over')}
                  disabled={bettingState.balance < amount}
                  className="px-2.5 py-1 text-[10px] font-black rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all disabled:opacity-30"
                >
                  OVER {template.overOdds}x
                </button>
                <button
                  onClick={() => handlePlace(template, 'under')}
                  disabled={bettingState.balance < amount}
                  className="px-2.5 py-1 text-[10px] font-black rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-30"
                >
                  UNDER {template.underOdds}x
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
