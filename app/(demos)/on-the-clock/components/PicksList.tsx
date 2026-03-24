'use client';

import { useState, useEffect, useRef } from 'react';
import { NFL_TEAMS, ALL_NFL_FRANCHISES } from '../data/teams';
import type { NFLTeam } from '../data/teams';
import { TEAM_NEEDS, TEAM_STRATEGY } from '../data/team-needs';
import { POSITION_COLORS } from '../data/players';
import type { DraftPlayer } from '../data/players';

export interface DraftPick {
  pickNumber: number;   // Overall pick (1-224)
  round: number;        // Round (1-7)
  pickInRound: number;  // Pick within round (1-32)
  teamIndex: number;    // Legacy: slot index for R1 lookups
  teamAbbr: string;     // Team abbreviation
  teamColor: string;    // Team primary color
  teamColorAlt: string; // Team alt color
  teamCity: string;     // Team city
  teamName: string;     // Team name
  player: DraftPlayer;
}

interface PicksListProps {
  picks: DraftPick[];
  currentPick: number;
  userTeamAbbr?: string | null;
  activeTeam?: NFLTeam;
}

type ViewMode = 'teams' | 'needs' | 'strategy' | 'picks';

export default function PicksList({ picks, currentPick, userTeamAbbr, activeTeam: activeTeamProp }: PicksListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('teams');
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeTeam = activeTeamProp ?? NFL_TEAMS[0];
  const needs = TEAM_NEEDS[activeTeam.abbr] ?? [];
  const strategy = TEAM_STRATEGY[activeTeam.abbr] ?? '';

  useEffect(() => {
    if (viewMode === 'teams' && scrollRef.current) {
      const target = scrollRef.current.querySelector(`[data-pick="${currentPick + 1}"]`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentPick, viewMode]);

  const tabs: { key: ViewMode; label: string }[] = [
    { key: 'teams', label: 'Teams' },
    { key: 'needs', label: 'Needs' },
    { key: 'strategy', label: 'Strategy' },
    { key: 'picks', label: 'Picks' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-white/5 bg-[var(--otc-bg)] shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setViewMode(tab.key)}
            className={`flex-1 px-2 py-2.5 text-xs font-bold text-center transition-all uppercase tracking-wider ${
              viewMode === tab.key
                ? 'text-white border-b-2 bg-white/5'
                : 'text-slate-600 hover:text-slate-400 hover:bg-white/[0.02]'
            }`}
            style={viewMode === tab.key ? { borderBottomColor: activeTeam.color } : undefined}
          >
            {tab.label}
            {tab.key === 'picks' && picks.length > 0 && (
              <span
                className="ml-1 text-[10px] px-1.5 rounded-full font-black"
                style={{ backgroundColor: `${activeTeam.color}30`, color: activeTeam.color }}
              >
                {picks.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin" ref={scrollRef}>
        {viewMode === 'teams' && <TeamsView currentPick={currentPick} picks={picks} userTeamAbbr={userTeamAbbr} />}
        {viewMode === 'needs' && <NeedsView needs={needs} team={activeTeam} />}
        {viewMode === 'strategy' && <StrategyView strategy={strategy} needs={needs} team={activeTeam} />}
        {viewMode === 'picks' && <PicksView picks={picks} />}
      </div>
    </div>
  );
}

// ── Teams Tab ───────────────────────────────────
function TeamsView({ currentPick, picks, userTeamAbbr }: { currentPick: number; picks: DraftPick[]; userTeamAbbr?: string | null }) {
  // Group all picks by team abbreviation (works across all rounds)
  const picksByTeam = new Map<string, DraftPick[]>();
  for (const p of picks) {
    const existing = picksByTeam.get(p.teamAbbr) ?? [];
    existing.push(p);
    picksByTeam.set(p.teamAbbr, existing);
  }

  return (
    <>
      {ALL_NFL_FRANCHISES.map((team) => {
        const teamPicks = picksByTeam.get(team.abbr) ?? [];
        const hasPicks = teamPicks.length > 0;
        const needs = TEAM_NEEDS[team.abbr] ?? [];

        return (
          <div
            key={team.abbr}
            className={`flex items-center gap-3 px-4 py-2 border-b transition-all duration-500 ${
              hasPicks
                ? 'bg-white/[0.02] border-white/5'
                : 'bg-transparent border-white/5'
            }`}
          >
            {/* Team badge */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: team.color,
                  opacity: hasPicks ? 1 : 0.6,
                }}
              >
                <span className="text-[9px] font-black" style={{ color: team.colorAlt }}>
                  {team.abbr}
                </span>
              </div>
            </div>

            {/* Team info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-sm font-bold truncate ${hasPicks ? 'text-slate-300' : 'text-slate-300'}`}
                >
                  {team.city} {team.name}
                </span>
                {userTeamAbbr && team.abbr === userTeamAbbr && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 shrink-0">
                    YOU
                  </span>
                )}
                {hasPicks && (
                  <span className="text-[9px] text-slate-400 font-bold shrink-0">
                    {teamPicks.length} pick{teamPicks.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {hasPicks ? (
                <div className="space-y-0.5">
                  {teamPicks.map((p) => (
                    <p key={p.pickNumber} className="text-[11px] text-slate-300 truncate">
                      <span className="text-slate-400 font-mono">R{p.round}#{p.pickInRound}</span>{' '}
                      <span className="font-medium text-slate-400">{p.player.name}</span>{' '}
                      <span className="text-slate-400">{p.player.position}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 truncate">
                  {needs.join(' / ') || '—'}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ── Needs Tab ─────────────────────────────────────
function NeedsView({ needs, team }: { needs: string[]; team: (typeof NFL_TEAMS)[number] }) {
  return (
    <div className="p-4 space-y-3">
      {/* Team header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: team.color,
            boxShadow: `0 0 16px ${team.color}40`,
          }}
        >
          <span className="text-[10px] font-black" style={{ color: team.colorAlt }}>
            {team.abbr}
          </span>
        </div>
        <div>
          <p className="text-sm font-black text-white">{team.city} {team.name}</p>
          <p className="text-[10px] text-slate-300 uppercase tracking-wider">Position Needs</p>
        </div>
      </div>

      {needs.map((pos, i) => {
        const posColor = POSITION_COLORS[pos] ?? '#64748b';
        const urgency = i === 0 ? 'CRITICAL' : i === 1 ? 'HIGH' : 'MODERATE';
        const urgencyColor = i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#3b82f6';
        return (
          <div
            key={pos}
            className="flex items-center gap-3 p-3 rounded-lg border transition-all"
            style={{
              backgroundColor: i === 0 ? `${team.color}10` : 'rgba(255,255,255,0.02)',
              borderColor: i === 0 ? `${team.color}30` : 'rgba(255,255,255,0.05)',
            }}
          >
            <span className="text-2xl font-black w-7 text-center" style={{ color: `${team.color}40` }}>
              {i + 1}
            </span>
            <span
              className="text-xs font-black px-2.5 py-1 rounded text-white shadow-sm"
              style={{ backgroundColor: posColor }}
            >
              {pos}
            </span>
            <span
              className="text-[10px] font-black uppercase tracking-wider"
              style={{ color: urgencyColor }}
            >
              {urgency}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Strategy Tab ─────────────────────────────────
function StrategyView({
  strategy,
  needs,
  team,
}: {
  strategy: string;
  needs: string[];
  team: (typeof NFL_TEAMS)[number];
}) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: team.color,
            boxShadow: `0 0 16px ${team.color}40`,
          }}
        >
          <span className="text-[10px] font-black" style={{ color: team.colorAlt }}>
            {team.abbr}
          </span>
        </div>
        <div>
          <p className="text-sm font-black text-white">{team.city} {team.name}</p>
          <p className="text-[10px] text-slate-300 uppercase tracking-wider">Draft Strategy</p>
        </div>
      </div>

      <div
        className="p-4 rounded-lg border text-sm text-slate-300 leading-relaxed"
        style={{
          backgroundColor: `${team.color}08`,
          borderColor: `${team.color}20`,
        }}
      >
        {strategy.includes('.') ? (
          <>
            <span className="font-bold text-white">{strategy.slice(0, strategy.indexOf('.') + 1)}</span>
            {strategy.slice(strategy.indexOf('.') + 1)}
          </>
        ) : strategy}
      </div>

      <div>
        <p className="text-[10px] text-slate-300 uppercase tracking-wider font-bold mb-2">
          Target Positions
        </p>
        <div className="flex flex-wrap gap-2">
          {needs.map((pos) => {
            const posColor = POSITION_COLORS[pos] ?? '#64748b';
            return (
              <span
                key={pos}
                className="text-xs font-black px-3 py-1.5 rounded-full text-white shadow-sm"
                style={{
                  backgroundColor: posColor,
                  boxShadow: `0 0 8px ${posColor}40`,
                }}
              >
                {pos}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Picks Tab ─────────────────────────────────────
function PicksView({ picks }: { picks: DraftPick[] }) {
  if (picks.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🏈</span>
        </div>
        <p className="text-sm font-bold text-slate-400">No picks made yet</p>
        <p className="text-xs text-slate-400 mt-1">Click a player on the right to start the draft</p>
        <div className="mt-4 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-amber-500/40"
              style={{ animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Group picks by round
  const picksByRound = new Map<number, DraftPick[]>();
  for (const pick of picks) {
    const existing = picksByRound.get(pick.round) ?? [];
    existing.push(pick);
    picksByRound.set(pick.round, existing);
  }

  const rounds = Array.from(picksByRound.keys()).sort((a, b) => a - b);

  return (
    <>
      {rounds.map((round) => {
        const roundPicks = picksByRound.get(round) ?? [];
        return (
          <div key={round}>
            {/* Round header */}
            <div className="sticky top-0 z-10 px-4 py-1.5 bg-[var(--otc-bg)] border-b border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Round {round}</span>
              <span className="text-[10px] text-slate-400 font-bold tabular-nums">{roundPicks.length}/32</span>
            </div>
            {roundPicks.map((pick, idx) => {
              const posColor = POSITION_COLORS[pick.player.position] ?? '#64748b';
              return (
                <div
                  key={pick.pickNumber}
                  className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5 transition-all"
                  style={{ animation: `slideIn 0.3s ease-out ${idx * 0.02}s both` }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                    style={{
                      backgroundColor: pick.teamColor,
                      boxShadow: `0 0 8px ${pick.teamColor}30`,
                    }}
                  >
                    <span className="text-[10px] font-black" style={{ color: pick.teamColorAlt }}>
                      {pick.pickInRound}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {pick.player.name}
                    </p>
                    <p className="text-xs text-slate-300 truncate flex items-center gap-1.5">
                      <span className="font-bold" style={{ color: pick.teamColor === '#000000' ? '#A5ACAF' : pick.teamColor }}>
                        {pick.teamAbbr}
                      </span>
                      <span className="text-slate-500">&middot;</span>
                      <span
                        className="font-bold text-white px-1 py-0.5 rounded text-[10px]"
                        style={{ backgroundColor: posColor }}
                      >
                        {pick.player.position}
                      </span>
                      <span className="text-slate-500">&middot;</span>
                      <span className="text-slate-300">{pick.player.school}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
