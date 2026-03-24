'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import DraftClock from './components/DraftClock';
import type { DraftSpeed } from './lib/cpu-draft';
import PicksList from './components/PicksList';
import type { DraftPick } from './components/PicksList';
import PlayerPool from './components/PlayerPool';
import type { DraftPlayer } from './data/players';
import { NFL_TEAMS } from './data/teams';
import { TEAM_NEEDS } from './data/team-needs';
import { buildDraftOrder, getRoundLabel } from './data/draft-order';
import type { DraftSlot } from './data/draft-order';
import DraftExport from './components/DraftExport';
import Confetti from './components/Confetti';
import { cpuPickPlayer, getSpeedDelay } from './lib/cpu-draft';
import { draftSounds } from './lib/sounds';
import { getPickReaction } from './lib/grading';
// Betting system
import BettingHub from './components/BettingHub';
import PredictionSetup from './components/PredictionSetup';
import BettingLeaderboard from './components/BettingLeaderboard';
import StockTickerBar from './components/StockTicker';
import type { BettingState, LeaderboardEntry } from './lib/betting';
import {
  createInitialBettingState,
  settlePredictions,
  settlePropBets,
  settleLiveBet,
  saveToLeaderboard,
} from './lib/betting';
import type { StockEntry } from './lib/stock-ticker';
import { initializeStockPrices, updateStockPrices } from './lib/stock-ticker';

type MobileTab = 'clock' | 'board' | 'players' | 'bets';
type LeftPanel = 'board' | 'bets';

const TOTAL_ROUNDS = 7;

export default function OnTheClockPage() {
  // Setup state
  const [draftStarted, setDraftStarted] = useState(false);
  const [userTeamAbbr, setUserTeamAbbr] = useState<string | null>(null);
  const [speed, setSpeed] = useState<DraftSpeed>('classic');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Draft order — built once when draft starts
  const [draftSlots, setDraftSlots] = useState<DraftSlot[]>([]);
  const totalPicks = draftSlots.length;

  // Draft state — currentPick is index into draftSlots (0-based)
  const [currentPick, setCurrentPick] = useState(0);
  const [picks, setPicks] = useState<DraftPick[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastPickFlash, setLastPickFlash] = useState(false);
  const [pickTimer, setPickTimer] = useState(300);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cpuDrafting, setCpuDrafting] = useState(false);

  // Mobile tab state
  const [mobileTab, setMobileTab] = useState<MobileTab>('clock');
  // Desktop left panel toggle
  const [leftPanel, setLeftPanel] = useState<LeftPanel>('board');

  // Betting state
  const [bettingState, setBettingState] = useState<BettingState>(createInitialBettingState);
  const [bettingEnabled, setBettingEnabled] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const [stocks, setStocks] = useState<StockEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [latestLeaderboardEntry, setLatestLeaderboardEntry] = useState<LeaderboardEntry | null>(null);

  // Refs for CPU draft loop
  const cpuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const picksRef = useRef<DraftPick[]>([]);
  picksRef.current = picks;

  const draftedPlayerIds = useMemo(() => new Set(picks.map((p) => p.player.id)), [picks]);
  const draftComplete = totalPicks > 0 && currentPick >= totalPicks;

  // Current slot info
  const currentSlot: DraftSlot | null = draftSlots[Math.min(currentPick, totalPicks - 1)] ?? null;
  const activeTeam = currentSlot?.team ?? NFL_TEAMS[0];
  const currentRound = currentSlot?.round ?? 1;
  const pickInRound = currentSlot?.pickInRound ?? 1;

  // Is the current pick a user pick?
  const isUserPick = userTeamAbbr !== null && activeTeam.abbr === userTeamAbbr && !draftComplete;

  // Auto-switch mobile tab when it's the user's turn
  useEffect(() => {
    if (!draftStarted) return;
    if (isUserPick) setMobileTab('players');
    else if (draftComplete) setMobileTab('clock');
  }, [isUserPick, draftStarted, draftComplete]);

  // Sound effects for state changes
  useEffect(() => {
    if (!soundEnabled || !draftStarted) return;
    if (isUserPick) draftSounds.userTurn();
  }, [isUserPick, draftStarted, soundEnabled]);

  useEffect(() => {
    if (!soundEnabled) return;
    if (draftComplete && picks.length > 0) draftSounds.draftComplete();
  }, [draftComplete, soundEnabled, picks.length]);

  // Settle all bets when draft completes
  useEffect(() => {
    if (!draftComplete || !bettingEnabled || picks.length === 0) return;

    setBettingState((prev) => {
      let state = settlePredictions(prev, picks);
      state = settlePropBets(state, picks);
      return state;
    });
  }, [draftComplete, bettingEnabled, picks]);

  // Save to leaderboard when predictions are settled (predictionScore becomes non-null)
  const bettingStateRef = useRef(bettingState);
  bettingStateRef.current = bettingState;
  useEffect(() => {
    if (!draftComplete || !bettingEnabled) return;
    // Delay slightly so settled state is used
    const timeout = setTimeout(() => {
      const entry = saveToLeaderboard(bettingStateRef.current, userTeamAbbr, picks.length);
      setLatestLeaderboardEntry(entry);
    }, 500);
    return () => clearTimeout(timeout);
  }, [draftComplete, bettingEnabled, userTeamAbbr, picks.length]);

  // Countdown timer — ticks every second, resets on new pick
  useEffect(() => {
    if (draftComplete || isSpinning || cpuDrafting) return;
    if (!isUserPick) return;
    setPickTimer(300);
    const interval = setInterval(() => {
      setPickTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentPick, draftComplete, isSpinning, cpuDrafting, isUserPick]);

  const timerMin = Math.floor(pickTimer / 60);
  const timerSec = pickTimer % 60;

  // Execute a single pick (shared by user and CPU)
  const executePick = useCallback(
    (player: DraftPlayer, showFlash: boolean) => {
      if (isSpinning || draftComplete || !currentSlot) return;

      const newPick: DraftPick = {
        pickNumber: currentSlot.overall,
        round: currentSlot.round,
        pickInRound: currentSlot.pickInRound,
        teamIndex: currentSlot.pickInRound - 1,
        teamAbbr: activeTeam.abbr,
        teamColor: activeTeam.color,
        teamColorAlt: activeTeam.colorAlt,
        teamCity: activeTeam.city,
        teamName: activeTeam.name,
        player,
      };
      setPicks((prev) => [...prev, newPick]);

      // Settle live bets and update stocks at the same batching level (not nested inside setPicks)
      if (bettingEnabled) {
        const reaction = getPickReaction(player.grade, currentSlot.overall);
        setBettingState((bs) => settleLiveBet(bs, currentSlot.overall, newPick, reaction.label));
        setStocks((prevStocks) => updateStockPrices(prevStocks, newPick, [...picksRef.current, newPick], TEAM_NEEDS));
      }

      if (soundEnabled) draftSounds.pickIsIn();

      if (showFlash) {
        setLastPickFlash(true);
        setTimeout(() => setLastPickFlash(false), 2400);
      }

      if (currentPick < totalPicks - 1) {
        setIsSpinning(true);
        const spinDuration = speed === 'instant' ? 300 : Math.max(800, getSpeedDelay(speed));
        setTimeout(() => {
          setCurrentPick((prev) => prev + 1);
          setIsSpinning(false);
        }, spinDuration);
      } else {
        setCurrentPick(totalPicks);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    },
    [currentPick, isSpinning, draftComplete, speed, totalPicks, currentSlot, activeTeam, soundEnabled, bettingEnabled]
  );

  // User manually drafts a player
  const handleDraftPlayer = useCallback(
    (player: DraftPlayer) => {
      if (isSpinning || draftComplete || cpuDrafting) return;
      if (!isUserPick) return;
      executePick(player, true);
    },
    [isSpinning, draftComplete, cpuDrafting, isUserPick, userTeamAbbr, executePick]
  );

  // CPU auto-draft: triggers when it's not the user's pick
  useEffect(() => {
    if (!draftStarted || draftComplete || isSpinning) return;
    if (isUserPick) {
      setCpuDrafting(false);
      return;
    }

    setCpuDrafting(true);
    const delay = getSpeedDelay(speed);

    const timeoutId = setTimeout(() => {
      const draftedIds = new Set(picksRef.current.map((p) => p.player.id));
      const cpuPlayer = cpuPickPlayer(activeTeam, draftedIds, currentSlot?.overall ?? currentPick);
      if (cpuPlayer) {
        const showFlash = speed === 'slow' || speed === 'classic';
        executePick(cpuPlayer, showFlash);
      }
      setCpuDrafting(false);
    }, delay);
    cpuTimeoutRef.current = timeoutId;

    return () => clearTimeout(timeoutId);
  }, [draftStarted, currentPick, draftComplete, isSpinning, isUserPick, speed, executePick, activeTeam, currentSlot]);

  // Start the draft from setup screen
  const handleStartDraft = useCallback((teamAbbr: string | null, selectedSpeed: DraftSpeed) => {
    setUserTeamAbbr(teamAbbr);
    setSpeed(selectedSpeed);
    setDraftSlots(buildDraftOrder(TOTAL_ROUNDS));
    setDraftStarted(true);
    draftSounds.resume();
    // Initialize stocks when draft starts
    if (bettingEnabled) {
      setStocks(initializeStockPrices());
    }
  }, [bettingEnabled]);

  // Reset the draft
  const handleReset = useCallback(() => {
    if (cpuTimeoutRef.current) clearTimeout(cpuTimeoutRef.current);
    setDraftStarted(false);
    setCurrentPick(0);
    setPicks([]);
    setDraftSlots([]);
    setIsSpinning(false);
    setLastPickFlash(false);
    setPickTimer(300);
    setShowConfetti(false);
    setCpuDrafting(false);
    setUserTeamAbbr(null);
    // Reset betting
    setBettingEnabled(false);
    setBettingState(createInitialBettingState());
    setStocks([]);
    setShowPredictions(false);
    setShowLeaderboard(false);
    setLatestLeaderboardEntry(null);
    setLeftPanel('board');
  }, []);

  const lastPick = picks.length > 0 ? picks[picks.length - 1] : null;
  const lastPickGrade = lastPick ? getPickReaction(lastPick.player.grade, lastPick.pickNumber) : null;

  // Current overall pick number (1-based)
  const currentPickNumber = currentSlot?.overall ?? 1;

  return (
    <div className="h-screen bg-[var(--otc-bg)] flex flex-col overflow-hidden">
      {/* ── TOP BAR — broadcast-style team on the clock ── */}
      {draftStarted && <header className="relative shrink-0 overflow-hidden">
        {/* Team color wash background */}
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{
            background: draftComplete
              ? 'linear-gradient(90deg, #064e3b 0%, var(--otc-bg) 50%, #064e3b 100%)'
              : `linear-gradient(90deg, ${activeTeam.color}40 0%, var(--otc-bg) 40%, var(--otc-bg) 60%, ${activeTeam.color}40 100%)`,
          }}
        />

        <div className="relative flex items-center justify-between px-3 md:px-5 py-2 md:py-2.5">
          {/* Left: Logo + title + reset */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handleReset}
              className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-110 transition-transform shrink-0"
              title="New Draft"
              aria-label="Start a new draft"
            >
              <span className="text-[9px] md:text-[10px] font-black text-black tracking-tight">OTC</span>
            </button>
            <div className="hidden sm:block">
              <h1 className="text-sm font-black text-white leading-tight tracking-tight">ON THE CLOCK</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-300 font-medium">2026 NFL DRAFT</span>
                {userTeamAbbr && (
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${NFL_TEAMS.find((t) => t.abbr === userTeamAbbr)?.color ?? '#666'}30`,
                      color: NFL_TEAMS.find((t) => t.abbr === userTeamAbbr)?.color ?? '#666',
                    }}
                  >
                    GM: {userTeamAbbr}
                  </span>
                )}
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-300 uppercase">
                  {speed}
                </span>
                {/* Betting indicator */}
                {bettingEnabled && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase">
                    ${bettingState.balance.toLocaleString()}
                  </span>
                )}
                {/* Sound toggle */}
                <button
                  onClick={() => setSoundEnabled((s) => !s)}
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-300 hover:text-white transition-colors"
                  title={soundEnabled ? 'Mute' : 'Unmute'}
                  aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
                >
                  {soundEnabled ? '🔊' : '🔇'}
                </button>
              </div>
            </div>
          </div>

          {/* Center: team on the clock */}
          <div className="flex items-center gap-2 md:gap-4">
            {!draftComplete ? (
              <>
                {/* Timer/CPU — hidden on smallest screens */}
                <div className="hidden md:flex flex-col items-center mr-2">
                  <span className="text-[9px] uppercase tracking-widest text-slate-300 font-bold">
                    {isUserPick ? 'Time' : 'CPU'}
                  </span>
                  {isUserPick ? (
                    <span className={`text-xl font-black tabular-nums leading-none ${pickTimer <= 30 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                      {timerMin}:{timerSec.toString().padStart(2, '0')}
                    </span>
                  ) : (
                    <span className="text-xl font-black tabular-nums leading-none text-amber-400">
                      {cpuDrafting ? 'Picking...' : 'AUTO'}
                    </span>
                  )}
                </div>
                <div className="hidden md:block w-px h-10 bg-white/10" />

                {/* Team badge */}
                <div
                  className="w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-500 shrink-0"
                  style={{
                    backgroundColor: activeTeam.color,
                    borderColor: `${activeTeam.colorAlt}60`,
                    boxShadow: `0 0 20px ${activeTeam.color}60, 0 0 40px ${activeTeam.color}30`,
                  }}
                >
                  <span className="text-[10px] md:text-xs font-black" style={{ color: activeTeam.colorAlt }}>
                    {activeTeam.abbr}
                  </span>
                </div>

                {/* Team name */}
                <div className="text-center">
                  <p
                    className="text-sm md:text-xl font-black leading-tight transition-colors duration-500"
                    style={{ color: activeTeam.colorAlt === '#FFFFFF' ? '#fff' : activeTeam.color }}
                  >
                    <span className="hidden sm:inline">{activeTeam.city} </span>{activeTeam.name}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {activeTeam.tradeNote && (
                      <span className="text-[9px] md:text-[10px] text-slate-300 italic hidden sm:inline">({activeTeam.tradeNote})</span>
                    )}
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] font-black">
                      {isSpinning ? (
                        <span className="text-emerald-400">Pick Is In!</span>
                      ) : isUserPick ? (
                        <span className="text-amber-400" style={{ animation: 'pulse 2s ease-in-out infinite' }}>Your Pick!</span>
                      ) : cpuDrafting ? (
                        <span className="text-blue-400">CPU...</span>
                      ) : (
                        <span className="text-amber-400" style={{ animation: 'pulse 2s ease-in-out infinite' }}>On The Clock</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="hidden md:block w-px h-10 bg-white/10" />
              </>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-lg md:text-2xl font-black text-emerald-400 tracking-tight">Draft Complete!</p>
                <p className="text-[9px] md:text-[10px] text-slate-300 uppercase tracking-widest">All {totalPicks} picks are in</p>
              </div>
            )}
          </div>

          {/* Right: Pick counter + round indicator + export */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex flex-col items-center">
              <span
                className="text-sm md:text-lg font-black px-2.5 md:px-4 py-0.5 md:py-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: draftComplete ? '#16a34a' : `${activeTeam.color}30`,
                  color: draftComplete ? '#fff' : activeTeam.color === '#000000' ? '#fff' : activeTeam.color,
                  border: `1px solid ${draftComplete ? '#16a34a' : activeTeam.color}50`,
                }}
              >
                {draftComplete ? 'DONE' : `${pickInRound}/32`}
              </span>
              {!draftComplete && (
                <span className="text-[8px] md:text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">
                  {getRoundLabel(currentRound)}
                </span>
              )}
            </div>
            {draftComplete && (
              <div className="flex items-center gap-2">
                <DraftExport picks={picks} userTeamAbbr={userTeamAbbr} />
                {bettingEnabled && (
                  <button
                    onClick={() => setShowLeaderboard(true)}
                    className="text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all"
                  >
                    Leaderboard
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  New Draft
                </button>
              </div>
            )}
          </div>
        </div>
      </header>}

      {/* ── PICK ANNOUNCEMENT OVERLAY ── */}
      {lastPickFlash && lastPick && lastPickGrade && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ animation: 'pickReveal 1.8s ease-out forwards' }}
        >
          {/* Subtle team color wash */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, ${lastPick.teamColor}18 0%, transparent 50%)`,
            }}
          />
          {/* Staggered text reveal */}
          <div className="relative text-center px-4">
            <p
              className="text-xs md:text-sm font-bold text-white/70 uppercase tracking-[0.2em] md:tracking-[0.3em]"
              style={{ animation: 'slideUp 0.4s ease-out 0.15s both' }}
            >
              {getRoundLabel(lastPick.round)} &mdash; Pick #{lastPick.pickInRound}
            </p>
            <p
              className="text-2xl md:text-5xl font-black mt-2 md:mt-3"
              style={{
                color: lastPick.teamColor === '#000000' ? '#fff' : lastPick.teamColor,
                animation: 'slideUp 0.4s ease-out 0.35s both',
                textShadow: `0 0 40px ${lastPick.teamColor}80`,
              }}
            >
              <span className="hidden sm:inline">{lastPick.teamCity} </span>{lastPick.teamName}
            </p>
            <p
              className="text-xs md:text-sm text-white/60 mt-1.5 md:mt-2 uppercase tracking-[0.2em]"
              style={{ animation: 'slideUp 0.3s ease-out 0.55s both' }}
            >
              select
            </p>
            <p
              className="text-xl md:text-4xl font-black text-white mt-1.5 md:mt-2"
              style={{ animation: 'slideUp 0.4s ease-out 0.7s both' }}
            >
              {lastPick.player.name}
            </p>
            <p
              className="text-sm md:text-base text-white/80 mt-1.5 md:mt-2"
              style={{ animation: 'slideUp 0.3s ease-out 0.85s both' }}
            >
              {lastPick.player.position} &mdash; {lastPick.player.school}
            </p>
            {/* Pick grade reaction */}
            <div
              className="mt-3 md:mt-4 inline-block px-4 md:px-5 py-1 md:py-1.5 rounded-full font-black text-base md:text-lg tracking-wider"
              style={{
                backgroundColor: `${lastPickGrade.color}30`,
                color: lastPickGrade.color,
                border: `2px solid ${lastPickGrade.color}`,
                animation: 'scaleIn 0.3s ease-out 1.1s both',
              }}
            >
              {lastPickGrade.label}
            </div>
          </div>
        </div>
      )}

      {/* ── CONFETTI on Draft Complete ── */}
      {showConfetti && <Confetti />}

      {/* ── LEADERBOARD OVERLAY ── */}
      {showLeaderboard && (
        <div className="absolute inset-0 z-40 bg-[var(--otc-bg)]/95 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-[520px] h-[80vh] bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
            <BettingLeaderboard
              latestEntry={latestLeaderboardEntry}
              onClose={() => setShowLeaderboard(false)}
            />
          </div>
        </div>
      )}

      {/* ── MOBILE TAB BAR (visible < lg when draft started) ── */}
      {draftStarted && (
        <div className="flex lg:hidden border-b border-white/5 bg-[var(--otc-bg)] shrink-0">
          {([
            ['clock', 'Clock'],
            ['board', 'Board'],
            ['players', 'Players'],
            ...(bettingEnabled ? [['bets', 'Bets']] : []),
          ] as [MobileTab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMobileTab(key)}
              className={`flex-1 px-2 py-2 text-xs font-bold text-center uppercase tracking-wider transition-all ${
                mobileTab === key
                  ? 'text-white border-b-2'
                  : 'text-slate-600 hover:text-slate-400'
              }`}
              style={mobileTab === key ? { borderBottomColor: key === 'bets' ? '#f59e0b' : activeTeam.color } : undefined}
            >
              {label}
              {key === 'players' && isUserPick && (
                <span className="ml-1 w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              )}
              {key === 'board' && picks.length > 0 && (
                <span className="ml-1 text-[10px] text-slate-300">{picks.length}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── FOUR-PANEL LAYOUT (desktop) / TABBED (mobile) ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — Draft Board or Betting Hub */}
        {draftStarted && (
          <aside className={`${
            mobileTab === 'board' || mobileTab === 'bets' ? 'flex' : 'hidden'
          } lg:flex w-full lg:w-[320px] border-r border-white/5 bg-[#0d1117] overflow-hidden flex-col shrink-0`}>
            {/* Desktop panel toggle */}
            {bettingEnabled && (
              <div className="hidden lg:flex border-b border-white/5 bg-[var(--otc-bg)] shrink-0">
                <button
                  onClick={() => setLeftPanel('board')}
                  className={`flex-1 px-2 py-1.5 text-[10px] font-bold text-center uppercase tracking-wider transition-all ${
                    leftPanel === 'board' ? 'text-white border-b-2 border-white/30' : 'text-slate-400'
                  }`}
                >
                  Board
                </button>
                <button
                  onClick={() => setLeftPanel('bets')}
                  className={`flex-1 px-2 py-1.5 text-[10px] font-bold text-center uppercase tracking-wider transition-all ${
                    leftPanel === 'bets' ? 'text-amber-400 border-b-2 border-amber-500' : 'text-slate-400'
                  }`}
                >
                  Bets ${bettingState.balance.toLocaleString()}
                </button>
              </div>
            )}

            {/* Mobile: show based on mobileTab */}
            <div className={`flex-1 overflow-hidden lg:hidden ${
              mobileTab === 'bets' || mobileTab === 'board' ? 'flex flex-col' : 'hidden'
            }`}>
              {mobileTab === 'bets' && bettingEnabled ? (
                <BettingHub
                  bettingState={bettingState}
                  onBettingStateChange={setBettingState}
                  stocks={stocks}
                  picks={picks}
                  currentPickNumber={currentPickNumber}
                  activeTeam={activeTeam}
                  teamNeeds={TEAM_NEEDS[activeTeam.abbr] ?? []}
                  draftedPlayerIds={draftedPlayerIds}
                  isUserPick={isUserPick}
                  draftComplete={draftComplete}
                  draftStarted={draftStarted}
                />
              ) : (
                <PicksList picks={picks} currentPick={currentPick} userTeamAbbr={userTeamAbbr} activeTeam={activeTeam} />
              )}
            </div>

            {/* Desktop: determined by leftPanel */}
            <div className="hidden lg:flex flex-col flex-1 overflow-hidden">
              {leftPanel === 'bets' && bettingEnabled ? (
                <BettingHub
                  bettingState={bettingState}
                  onBettingStateChange={setBettingState}
                  stocks={stocks}
                  picks={picks}
                  currentPickNumber={currentPickNumber}
                  activeTeam={activeTeam}
                  teamNeeds={TEAM_NEEDS[activeTeam.abbr] ?? []}
                  draftedPlayerIds={draftedPlayerIds}
                  isUserPick={isUserPick}
                  draftComplete={draftComplete}
                  draftStarted={draftStarted}
                />
              ) : (
                <PicksList picks={picks} currentPick={currentPick} userTeamAbbr={userTeamAbbr} activeTeam={activeTeam} />
              )}
            </div>
          </aside>
        )}

        {/* Center panel — The Clock */}
        <main className={`${
          !draftStarted || mobileTab === 'clock' ? 'flex' : 'hidden'
        } lg:flex flex-1 items-center justify-center relative overflow-hidden`}>
          {/* Radial gradient behind clock */}
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              background: `radial-gradient(circle at center, ${activeTeam.color}10 0%, transparent 50%), radial-gradient(circle at center, var(--otc-bg) 0%, var(--otc-bg-deep) 100%)`,
            }}
          />

          {/* Prediction setup overlay (before draft starts) */}
          {!draftStarted && showPredictions && (
            <div className="absolute inset-0 z-30 bg-[var(--otc-bg)]/95 flex items-center justify-center p-4 overflow-y-auto">
              <div className="w-full max-w-[540px]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-white">Pre-Draft Predictions</h2>
                  <button
                    onClick={() => setShowPredictions(false)}
                    className="text-xs font-bold text-slate-300 hover:text-white px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-all"
                  >
                    Close
                  </button>
                </div>
                <PredictionSetup
                  bettingState={bettingState}
                  onBettingStateChange={setBettingState}
                />
              </div>
            </div>
          )}

          <div className="relative">
            <DraftClock
              currentPick={currentPick}
              pickInRound={(pickInRound ?? 1) - 1}
              currentRound={currentRound}
              totalRounds={TOTAL_ROUNDS}
              activeTeam={activeTeam}
              isSpinning={isSpinning}
              picks={picks}
              draftComplete={draftComplete}
              userTeamAbbr={userTeamAbbr}
              isUserPick={isUserPick}
              cpuDrafting={cpuDrafting}
              draftStarted={draftStarted}
              onStart={handleStartDraft}
            />

            {/* Betting toggle (below clock, before draft starts) */}
            {!draftStarted && !showPredictions && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[420px] flex flex-col items-center gap-2 px-4">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setBettingEnabled((e) => !e)}
                    className={`px-4 py-2.5 min-h-[44px] rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                      bettingEnabled
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                    aria-label={bettingEnabled ? 'Disable betting mode' : 'Enable betting mode'}
                  >
                    {bettingEnabled ? 'Betting ON' : 'Enable Betting'}
                  </button>
                  {bettingEnabled && (
                    <button
                      onClick={() => setShowPredictions(true)}
                      className="px-4 py-2.5 min-h-[44px] rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all"
                    >
                      Predictions ({bettingState.predictions.length}/5)
                    </button>
                  )}
                  <button
                    onClick={() => setShowLeaderboard(true)}
                    className="px-4 py-2.5 min-h-[44px] rounded-full text-xs font-bold text-slate-600 hover:text-slate-400 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    Leaderboard
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center">
                  Predict picks · Place prop bets · Trade player stocks
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right panel — Player Pool */}
        {draftStarted && (
          <aside className={`${
            mobileTab === 'players' ? 'flex' : 'hidden'
          } lg:flex w-full lg:w-[320px] border-l border-white/5 bg-[#0d1117] overflow-hidden flex-col shrink-0`}>
            <PlayerPool
              draftedPlayerIds={draftedPlayerIds}
              onSelectPlayer={handleDraftPlayer}
              disabled={isSpinning || draftComplete || (cpuDrafting && !isUserPick)}
              teamNeeds={TEAM_NEEDS[activeTeam.abbr] ?? []}
              activeTeam={activeTeam}
              isUserPick={isUserPick}
              userTeamAbbr={userTeamAbbr}
            />
          </aside>
        )}
      </div>

      {/* ── BOTTOM TICKER (compact on mobile, full on desktop) ── */}
      {draftStarted && picks.length > 0 && (
        <div className="flex md:hidden h-6 bg-[var(--otc-bg-deep)] border-t border-white/5 items-center overflow-hidden shrink-0 px-3">
          <span className="text-[10px] font-black text-amber-500 mr-2 shrink-0">LAST</span>
          <span className="text-[10px] text-slate-400 truncate">
            <span className="font-bold" style={{ color: picks[picks.length - 1].teamColor === '#000000' ? '#A5ACAF' : picks[picks.length - 1].teamColor }}>
              {picks[picks.length - 1].teamAbbr}
            </span>
            {' '}&mdash; {picks[picks.length - 1].player.name} ({picks[picks.length - 1].player.position})
          </span>
        </div>
      )}
      {draftStarted && <div className="hidden md:flex h-7 bg-[var(--otc-bg-deep)] border-t border-white/5 items-center overflow-hidden shrink-0">
        <div className="flex items-center gap-2 px-3 shrink-0 bg-amber-500 h-full">
          <span className="text-[10px] font-black text-black uppercase tracking-wider">
            {bettingEnabled && stocks.length > 0 ? 'Stocks' : 'Live'}
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-6 animate-ticker whitespace-nowrap px-4">
            {bettingEnabled && stocks.some((s) => s.change !== 0) ? (
              <StockTickerBar stocks={stocks} />
            ) : picks.length === 0 ? (
              <span className="text-[11px] text-slate-300">
                2026 NFL Draft {getRoundLabel(currentRound)} — {activeTeam.city} {activeTeam.name} are on the clock
              </span>
            ) : (
              picks.slice(-20).map((p) => (
                <span key={p.pickNumber} className="text-[11px] text-slate-400">
                  <span className="font-bold" style={{ color: p.teamColor === '#000000' ? '#A5ACAF' : p.teamColor }}>
                    R{p.round}#{p.pickInRound} {p.teamAbbr}
                  </span>
                  {' '}&mdash; {p.player.name} ({p.player.position})
                </span>
              ))
            )}
          </div>
        </div>
      </div>}

      <style>{`
        :root { --otc-bg: #0a0e1a; --otc-bg-deep: #060810; }
        @keyframes pickReveal {
          0% { opacity: 0; }
          8% { opacity: 1; }
          75% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
