'use client';

import { useState } from 'react';
import { DRAFT_PLAYERS, POSITION_COLORS } from '../data/players';
import type { DraftPlayer } from '../data/players';
import type { NFLTeam } from '../data/teams';

interface PlayerPoolProps {
  draftedPlayerIds: Set<number>;
  onSelectPlayer: (player: DraftPlayer) => void;
  disabled: boolean;
  teamNeeds: string[];
  activeTeam: NFLTeam;
  isUserPick: boolean;
  userTeamAbbr: string | null;
}

const POSITIONS = ['ALL', 'QB', 'WR', 'RB', 'TE', 'OT', 'OG', 'EDGE', 'DT', 'LB', 'CB', 'S'];

const POSITION_GROUPS: Record<string, string[]> = {
  Offense: ['QB', 'WR', 'RB', 'TE', 'OT', 'OG'],
  Defense: ['EDGE', 'DT', 'LB', 'CB', 'S'],
};

export default function PlayerPool({
  draftedPlayerIds,
  onSelectPlayer,
  disabled,
  teamNeeds,
  activeTeam,
  isUserPick,
  userTeamAbbr,
}: PlayerPoolProps) {
  const [posFilter, setPosFilter] = useState('ALL');
  const [showLegend, setShowLegend] = useState(false);

  const available = DRAFT_PLAYERS.filter((p) => !draftedPlayerIds.has(p.id));
  const filtered = posFilter === 'ALL' ? available : available.filter((p) => p.position === posFilter);

  // Sort: team needs first, then by grade
  const sorted = [...filtered].sort((a, b) => {
    const aIsNeed = teamNeeds.includes(a.position) ? 1 : 0;
    const bIsNeed = teamNeeds.includes(b.position) ? 1 : 0;
    if (aIsNeed !== bIsNeed) return bIsNeed - aIsNeed;
    return b.grade - a.grade;
  });

  // Best available overall
  const bestAvailable = available.length > 0
    ? available.reduce((best, p) => (p.grade > best.grade ? p : best), available[0])
    : null;

  const isCpuPick = userTeamAbbr !== null && !isUserPick && !disabled;

  return (
    <div className="flex flex-col h-full relative">
      {/* CPU picking overlay */}
      {isCpuPick && (
        <div className="absolute inset-0 z-10 bg-[#0d1117]/80 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{
                backgroundColor: activeTeam.color,
                boxShadow: `0 0 20px ${activeTeam.color}40`,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            >
              <span className="text-[10px] font-black" style={{ color: activeTeam.colorAlt }}>
                {activeTeam.abbr}
              </span>
            </div>
            <p className="text-sm font-black text-white">{activeTeam.city} {activeTeam.name}</p>
            <p className="text-xs text-blue-400 font-bold mt-1">CPU is picking...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-4 py-2.5 border-b border-white/5 bg-[var(--otc-bg)]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-white uppercase tracking-wider">Player Pool</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLegend((v) => !v)}
              className="text-[9px] font-bold text-slate-600 hover:text-slate-400 transition-colors"
              aria-label="Toggle position legend"
            >
              {showLegend ? 'Hide' : 'Positions'}
            </button>
            <span className="text-[10px] text-slate-500 font-bold tabular-nums">{available.length} left</span>
          </div>
        </div>
        {showLegend && (
          <div className="mt-2 space-y-1.5">
            {Object.entries(POSITION_GROUPS).map(([group, positions]) => (
              <div key={group} className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[8px] text-slate-600 uppercase tracking-wider font-bold w-10">{group}</span>
                {positions.map((pos) => (
                  <span
                    key={pos}
                    className="text-[8px] font-black px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: POSITION_COLORS[pos] ?? '#64748b' }}
                  >
                    {pos}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Best Available banner */}
      {bestAvailable && !disabled && (
        <div
          className="px-4 py-2 border-b flex items-center gap-2"
          style={{
            background: `linear-gradient(90deg, ${activeTeam.color}15 0%, transparent 100%)`,
            borderColor: `${activeTeam.color}20`,
          }}
        >
          <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider shrink-0">
            #1 Available
          </span>
          <span className="text-xs font-bold text-white truncate">{bestAvailable.name}</span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white shrink-0"
            style={{ backgroundColor: POSITION_COLORS[bestAvailable.position] ?? '#64748b' }}
          >
            {bestAvailable.position}
          </span>
          <span className="text-[10px] font-bold text-emerald-400 tabular-nums shrink-0">{bestAvailable.grade}</span>
        </div>
      )}

      {/* Position filter pills */}
      <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-white/5 bg-[var(--otc-bg)]/50">
        {POSITIONS.map((pos) => {
          const isNeed = teamNeeds.includes(pos);
          const isActive = posFilter === pos;
          return (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              aria-pressed={isActive}
              aria-label={`Filter by ${pos === 'ALL' ? 'all positions' : pos}${isNeed ? ' (team need)' : ''}`}
              className={`px-2 py-1 text-[10px] font-bold rounded-md whitespace-nowrap transition-all ${
                isActive
                  ? 'text-white shadow-sm'
                  : isNeed
                    ? 'text-white'
                    : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
              }`}
              style={
                isActive
                  ? { backgroundColor: activeTeam.color, boxShadow: `0 0 10px ${activeTeam.color}40` }
                  : isNeed && !isActive
                    ? { backgroundColor: `${activeTeam.color}80` }
                    : undefined
              }
            >
              {pos}
              {isNeed && pos !== 'ALL' && ' ★'}
            </button>
          );
        })}
      </div>

      {/* Player list */}
      <div className="flex-1 overflow-y-auto">
        {sorted.map((player, rank) => {
          const isNeed = teamNeeds.includes(player.position);
          return (
            <PlayerRow
              key={player.id}
              player={player}
              rank={rank + 1}
              onSelect={() => onSelectPlayer(player)}
              disabled={disabled}
              isNeed={isNeed}
              teamColor={activeTeam.color}
              isBest={player.id === bestAvailable?.id}
            />
          );
        })}
        {sorted.length === 0 && (
          <div className="p-6 text-center text-slate-600 text-sm">
            No players available at this position
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerRow({
  player,
  rank,
  onSelect,
  disabled,
  isNeed,
  teamColor,
  isBest,
}: {
  player: DraftPlayer;
  rank: number;
  onSelect: () => void;
  disabled: boolean;
  isNeed: boolean;
  teamColor: string;
  isBest: boolean;
}) {
  const posColor = POSITION_COLORS[player.position] ?? '#64748b';

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-2.5 border-b transition-all text-left group ${
        disabled
          ? 'opacity-40 cursor-not-allowed border-white/5'
          : 'cursor-pointer border-white/5 hover:bg-white/[0.06]'
      }`}
      style={{
        borderLeftWidth: isNeed && !disabled ? '3px' : undefined,
        borderLeftColor: isNeed && !disabled ? teamColor : undefined,
        backgroundColor: isNeed && !disabled ? `${teamColor}08` : undefined,
      }}
    >
      {/* Rank */}
      <span className="text-xs font-mono text-slate-600 w-5 text-right shrink-0 tabular-nums">
        {rank}
      </span>

      {/* Position badge */}
      <span
        className="text-[11px] font-black px-1.5 py-0.5 rounded text-white shrink-0 w-12 text-center transition-all"
        style={{
          backgroundColor: isNeed ? teamColor : posColor,
          boxShadow: isNeed ? `0 0 10px ${teamColor}40` : undefined,
        }}
      >
        {player.position}
      </span>

      {/* Player info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors">
            {player.name}
          </p>
          {isNeed && (
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded shrink-0"
              style={{ backgroundColor: `${teamColor}25`, color: teamColor }}
            >
              FIT
            </span>
          )}
          {isBest && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 bg-amber-500/20 text-amber-400">
              BPA
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <span className="truncate">{player.school}</span>
          <span className="text-slate-700">&middot;</span>
          <span className="truncate">{player.height} / {player.weight}</span>
          <span className="text-slate-700">&middot;</span>
          <span
            className={`font-bold tabular-nums shrink-0 ${
              player.grade >= 95
                ? 'text-emerald-400'
                : player.grade >= 90
                  ? 'text-blue-400'
                  : player.grade >= 85
                    ? 'text-slate-400'
                    : 'text-slate-600'
            }`}
          >
            {player.grade}
          </span>
        </p>
      </div>

      {/* Draft button — always visible on mobile, hover on desktop */}
      {!disabled && (
        <div
          className="shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity text-[10px] font-black text-white px-2 py-1 rounded"
          style={{
            backgroundColor: teamColor,
            boxShadow: `0 0 10px ${teamColor}40`,
          }}
        >
          DRAFT
        </div>
      )}
    </button>
  );
}
