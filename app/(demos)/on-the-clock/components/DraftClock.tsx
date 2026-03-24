'use client';

import { useMemo, useEffect, useState } from 'react';
import { NFL_TEAMS, ALL_NFL_FRANCHISES, NO_FIRST_ROUND_PICK, getPickSlots } from '../data/teams';
import type { NFLTeam } from '../data/teams';
import { TEAM_NEEDS, TEAM_STRATEGY } from '../data/team-needs';
import { POSITION_COLORS } from '../data/players';
import type { DraftPick } from './PicksList';
import type { DraftSpeed } from '../lib/cpu-draft';
import { expectedGrade, pickValue, getGrade } from '../lib/grading';
import TeamLogo from './TeamLogo';

interface DraftClockProps {
  currentPick: number;       // Overall pick index (0-based into draftSlots)
  pickInRound?: number;      // 0-based position within current round (0-31)
  currentRound?: number;     // Current round number (1-7)
  totalRounds?: number;      // Total rounds in draft
  activeTeam?: NFLTeam;      // Team currently on the clock (passed from parent)
  isSpinning: boolean;
  picks: DraftPick[];
  draftComplete: boolean;
  userTeamAbbr?: string | null;
  isUserPick?: boolean;
  cpuDrafting?: boolean;
  // Pre-draft setup (shown inside clock face)
  draftStarted: boolean;
  onStart?: (userTeamAbbr: string | null, speed: DraftSpeed) => void;
}

export default function DraftClock({ currentPick, pickInRound: pickInRoundProp, currentRound = 1, totalRounds = 7, activeTeam: activeTeamProp, isSpinning, picks, draftComplete, userTeamAbbr, isUserPick, cpuDrafting, draftStarted, onStart }: DraftClockProps) {
  const sliceAngle = 360 / 32;
  const [handAngle, setHandAngle] = useState(0);
  const [showContent, setShowContent] = useState(true);

  // Use pickInRound for the clock hand (always 0-31 per round)
  const clockPosition = pickInRoundProp ?? Math.min(currentPick, 31);

  // Use activeTeam from parent (correct for all rounds) — fallback to R1 for pre-draft
  const activeTeam = activeTeamProp ?? NFL_TEAMS[0];
  const needs = TEAM_NEEDS[activeTeam.abbr] ?? [];
  const strategy = TEAM_STRATEGY[activeTeam.abbr] ?? '';

  // Hand points to current pick position within the round
  useEffect(() => {
    if (isSpinning) {
      setShowContent(false);
      const nextAngle = (clockPosition + 1) * sliceAngle;
      setHandAngle(nextAngle);
      const t = setTimeout(() => setShowContent(true), 1200);
      return () => clearTimeout(t);
    } else {
      const angle = clockPosition * sliceAngle;
      setHandAngle(angle);
      setShowContent(true);
    }
  }, [clockPosition, isSpinning, sliceAngle]);

  // Outer bezel gradient — thin ring of team colors
  const bezelGradient = useMemo(() => {
    const stops = NFL_TEAMS.map((team, i) => {
      const start = i * sliceAngle;
      const end = (i + 1) * sliceAngle;
      return `${team.color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(from -${sliceAngle / 2}deg, ${stops.join(', ')})`;
  }, [sliceAngle]);

  // Which bezel slots are done (for current round only)
  const currentRoundPicks = picks.filter((p) => p.round === currentRound);
  const pickedSlots = new Set(currentRoundPicks.map((p) => p.pickInRound - 1));

  const noPicks = picks.length === 0 && !isSpinning;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* ── CLOCK CONTAINER ── */}
      <div
        className="relative rounded-full"
        style={{
          width: 'min(85vw, min(88vh, 820px))',
          height: 'min(85vw, min(88vh, 820px))',
        }}
      >
        {/* ── OUTER BEZEL — team color ring ── */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: bezelGradient,
            boxShadow: `0 0 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.3)`,
          }}
        />

        {/* ── INNER CLOCK FACE — inset from bezel ── */}
        <div
          className="absolute rounded-full overflow-hidden transition-all duration-700"
          style={{
            inset: 'clamp(20px, 5%, 40px)',
            background: noPicks
              ? 'radial-gradient(circle at center, #1a1f2e 0%, #0a0e1a 100%)'
              : `radial-gradient(circle at center, ${activeTeam.color}12 0%, #0a0e1a 70%)`,
            border: '3px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Face content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-12">
            {!draftStarted ? (
              /* ── TEAM SELECTOR — before draft starts ── */
              <TeamSelector onStart={onStart} />
            ) : draftComplete ? (
              /* ── DRAFT GRADE REPORT ── */
              <DraftGradeReport picks={picks} userTeamAbbr={userTeamAbbr} />
            ) : (
              /* ── ACTIVE TEAM — on the clock ── */
              <div
                className="flex flex-col items-center text-center transition-all duration-500"
                style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'scale(1)' : 'scale(0.95)' }}
              >
                {/* Round + Pick number */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[10px] font-black text-amber-400 uppercase tracking-[0.15em] px-2 py-0.5 rounded bg-amber-500/10"
                  >
                    Rd {currentRound}
                  </span>
                  <span
                    className="text-lg font-black tabular-nums px-3 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${activeTeam.color}25`,
                      color: activeTeam.color === '#000000' ? '#A5ACAF' : activeTeam.color,
                      border: `1px solid ${activeTeam.color}30`,
                    }}
                  >
                    #{(pickInRoundProp ?? currentPick) + 1}
                  </span>
                  {activeTeam.tradeNote && currentRound === 1 && (
                    <span className="text-[10px] text-white/25 italic">({activeTeam.tradeNote})</span>
                  )}
                </div>

                {/* Team badge with logo */}
                <div
                  className="w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-2 md:mb-3 transition-all duration-500"
                  style={{
                    backgroundColor: activeTeam.color,
                    boxShadow: `0 0 30px ${activeTeam.color}50, 0 0 60px ${activeTeam.color}20`,
                    border: `2px solid ${activeTeam.colorAlt}30`,
                  }}
                >
                  <TeamLogo abbr={activeTeam.abbr} size={28} />
                </div>

                {/* Team name */}
                <p
                  className="text-base md:text-2xl font-black tracking-tight transition-colors duration-500"
                  style={{ color: activeTeam.color === '#000000' ? '#A5ACAF' : activeTeam.color }}
                >
                  <span className="hidden sm:inline">{activeTeam.city} </span><span className="sm:hidden">{activeTeam.abbr}</span>
                </p>
                <p className="text-lg md:text-3xl font-black text-white tracking-tight -mt-0.5 md:-mt-1">
                  {activeTeam.name}
                </p>

                {/* Needs pills */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-[9px] text-white/30 uppercase tracking-wider font-bold mr-1">Needs</span>
                  {needs.map((pos, i) => {
                    const posColor = POSITION_COLORS[pos] ?? '#64748b';
                    return (
                      <span
                        key={pos}
                        className="text-[11px] font-black px-2 py-0.5 rounded text-white"
                        style={{
                          backgroundColor: i === 0 ? activeTeam.color : posColor,
                          boxShadow: i === 0 ? `0 0 8px ${activeTeam.color}40` : undefined,
                          opacity: i === 0 ? 1 : 0.8,
                        }}
                      >
                        {pos}
                      </span>
                    );
                  })}
                </div>

                {/* Strategy blurb — hidden on small clocks */}
                {strategy && (
                  <div
                    className="mt-3 md:mt-4 max-w-[360px] text-[11px] md:text-[13px] text-white/50 leading-relaxed text-center px-3 md:px-4 py-2 md:py-3 rounded-lg hidden sm:block"
                    style={{
                      backgroundColor: `${activeTeam.color}08`,
                      border: `1px solid ${activeTeam.color}12`,
                    }}
                  >
                    {strategy}
                  </div>
                )}

                {/* On the clock indicator */}
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: isUserPick ? '#f59e0b' : activeTeam.color,
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.15em]"
                    style={{
                      color: isSpinning
                        ? '#10b981'
                        : isUserPick
                          ? '#f59e0b'
                          : cpuDrafting
                            ? '#60a5fa'
                            : `${activeTeam.color}cc`,
                    }}
                  >
                    {isSpinning
                      ? 'The Pick Is In!'
                      : isUserPick
                        ? 'Your Pick — Select a Player!'
                        : cpuDrafting
                          ? 'CPU Picking...'
                          : 'On The Clock'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── TEAM LABELS on bezel ── */}
        {NFL_TEAMS.map((team, i) => {
          const angle = i * sliceAngle;
          const isPicked = pickedSlots.has(i);
          const isCurrent = i === clockPosition && !draftComplete;
          return (
            <div
              key={`label-${i}`}
              className="absolute left-1/2 top-1/2 pointer-events-none"
              style={{
                transform: `rotate(${angle + sliceAngle / 2}deg)`,
                transformOrigin: '0 0',
              }}
            >
              <span
                className="absolute text-[9px] font-black leading-none transition-all duration-300"
                style={{
                  // Position on the outer bezel ring
                  left: '0',
                  top: '-5px',
                  transform: `translateX(min(42.5vh, 396px)) rotate(-${angle + sliceAngle / 2}deg)`,
                  color: isCurrent ? '#fff' : isPicked ? team.colorAlt + '60' : team.colorAlt,
                  textShadow: isCurrent
                    ? `0 0 10px ${team.color}, 0 1px 3px rgba(0,0,0,0.9)`
                    : '0 1px 2px rgba(0,0,0,0.8)',
                  opacity: isPicked && !isCurrent ? 0.4 : 1,
                }}
              >
                {team.abbr}
              </span>
            </div>
          );
        })}

        {/* ── TICK MARKS — between segments ── */}
        {Array.from({ length: 32 }, (_, i) => {
          const isPicked = pickedSlots.has(i);
          return (
            <div
              key={`tick-${i}`}
              className="absolute left-1/2 top-0 origin-bottom"
              style={{
                transform: `rotate(${i * sliceAngle}deg)`,
                height: '50%',
                width: '1px',
              }}
            >
              <div
                className="w-full transition-all duration-300"
                style={{
                  height: isPicked ? '6px' : '14px',
                  backgroundColor: isPicked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)',
                }}
              />
            </div>
          );
        })}

        {/* ── PICKED INDICATORS — small dots on completed picks (current round) ── */}
        {currentRoundPicks.map((pick) => {
          const angle = (pick.pickInRound - 1) * sliceAngle + sliceAngle / 2;
          const teamColor = pick.teamColor ?? '#666';
          return (
            <div
              key={`done-${pick.pickNumber}`}
              className="absolute left-1/2 top-1/2 pointer-events-none"
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: '0 0',
              }}
            >
              <div
                className="absolute w-3 h-3 rounded-full -translate-y-1/2"
                style={{
                  left: '0',
                  transform: `translateX(min(38vh, 355px))`,
                  backgroundColor: teamColor,
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  boxShadow: `0 0 6px ${teamColor}40`,
                }}
              />
            </div>
          );
        })}

        {/* ── CLOCK HAND ── */}
        <div
          className="absolute left-1/2 top-1/2 origin-bottom z-10 pointer-events-none clock-hand"
          style={{
            width: '4px',
            height: 'calc(50% - 30px)', // from center to just inside bezel
            marginLeft: '-2px',
            marginTop: 'calc(-50% + 30px)', // position correctly
            transform: `rotate(${handAngle}deg)`,
            transition: isSpinning
              ? 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              : 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transformOrigin: 'bottom center',
          }}
        >
          {/* Hand body */}
          <div
            className="w-full h-full rounded-t-full transition-colors duration-500"
            style={{
              background: noPicks
                ? 'linear-gradient(to top, #f59e0b, #f59e0b80 70%, transparent)'
                : `linear-gradient(to top, ${activeTeam.color}, ${activeTeam.color}80 70%, transparent)`,
              boxShadow: noPicks
                ? '0 0 10px #f59e0b40'
                : `0 0 10px ${activeTeam.color}40`,
            }}
          />
          {/* Hand tip — arrow */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: `10px solid ${noPicks ? '#f59e0b' : activeTeam.color}`,
              filter: `drop-shadow(0 0 4px ${noPicks ? '#f59e0b' : activeTeam.color}80)`,
            }}
          />
        </div>

        {/* ── CENTER PIN ── */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div
            className="w-5 h-5 rounded-full transition-all duration-500"
            style={{
              backgroundColor: noPicks ? '#f59e0b' : activeTeam.color,
              boxShadow: `0 0 12px ${noPicks ? '#f59e0b' : activeTeam.color}60`,
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          .clock-hand { transition: transform 0.01s linear !important; }
          * { animation-duration: 0.01s !important; }
        }
      `}</style>
    </div>
  );
}

// ── DRAFT GRADE REPORT (shown inside clock face after draft completes) ──

interface TeamGrade {
  abbr: string;
  teamName: string;
  color: string;
  colorAlt: string;
  picks: { pickNumber: number; playerName: string; position: string; grade: number; value: number }[];
  avgValue: number;
  letterGrade: string;
  gradeColor: string;
}


function gradeAllTeams(picks: DraftPick[]): TeamGrade[] {
  // Group picks by team abbreviation
  const byTeam = new Map<string, DraftPick[]>();
  picks.forEach((p) => {
    const abbr = p.teamAbbr ?? NFL_TEAMS[p.teamIndex]?.abbr ?? 'UNK';
    const existing = byTeam.get(abbr) ?? [];
    existing.push(p);
    byTeam.set(abbr, existing);
  });

  const grades: TeamGrade[] = [];
  byTeam.forEach((teamPicks, abbr) => {
    const first = teamPicks[0];
    const color = first.teamColor ?? NFL_TEAMS[first.teamIndex]?.color ?? '#666';
    const colorAlt = first.teamColorAlt ?? NFL_TEAMS[first.teamIndex]?.colorAlt ?? '#fff';
    const city = first.teamCity ?? '';
    const name = first.teamName ?? '';
    const pickDetails = teamPicks.map((p) => ({
      pickNumber: p.pickNumber,
      playerName: p.player.name,
      position: p.player.position,
      grade: p.player.grade,
      value: pickValue(p.player.grade, p.pickNumber),
    }));

    const avgValue = pickDetails.reduce((sum, p) => sum + p.value, 0) / pickDetails.length;

    const { letter: letterGrade, color: gradeColor } = getGrade(avgValue);

    grades.push({ abbr, teamName: `${city} ${name}`, color, colorAlt, picks: pickDetails, avgValue, letterGrade, gradeColor });
  });

  // Sort by avgValue descending (best draft first)
  grades.sort((a, b) => b.avgValue - a.avgValue);
  return grades;
}

function DraftGradeReport({ picks, userTeamAbbr }: { picks: DraftPick[]; userTeamAbbr?: string | null }) {
  const grades = gradeAllTeams(picks);
  const userGrade = userTeamAbbr ? grades.find((g) => g.abbr === userTeamAbbr) : null;

  // Overall draft class grade (average of all)
  const overallAvg = grades.reduce((s, g) => s + g.avgValue, 0) / grades.length;

  return (
    <div className="flex flex-col items-center w-full h-full px-3 md:px-6 overflow-y-auto py-3 md:py-4">
      {/* Header */}
      <p className="text-emerald-400 text-base md:text-xl font-black tracking-tight mb-0.5">Draft Complete!</p>
      <p className="text-[10px] text-white/30 mb-1">{picks.length} picks &middot; Draft class avg: <span className="text-white/50 font-bold">{overallAvg >= 0 ? '+' : ''}{overallAvg.toFixed(1)}</span></p>

      {/* User team hero grade */}
      {userGrade ? (
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: userGrade.color, boxShadow: `0 0 20px ${userGrade.color}40` }}
          >
            <TeamLogo abbr={userGrade.abbr} size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-4xl font-black"
                style={{ color: userGrade.gradeColor }}
              >
                {userGrade.letterGrade}
              </span>
              <span className="text-sm text-white/60 font-bold">Your Draft</span>
            </div>
            {userGrade.picks.map((p) => (
              <p key={p.pickNumber} className="text-[11px] text-white/40">
                #{p.pickNumber} {p.playerName} <span className="text-white/25">({p.position})</span>{' '}
                <span style={{ color: p.value >= 0 ? '#10b981' : '#ef4444' }}>
                  {p.value >= 0 ? '+' : ''}{p.value}
                </span>
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-white/30 text-xs mb-3">All 32 picks are in</p>
      )}

      {/* All teams leaderboard */}
      <div className="w-full max-w-[460px]">
        <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-2 text-center">Draft Grades</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
          {grades.map((g, i) => {
            const isUser = g.abbr === userTeamAbbr;
            return (
              <div
                key={g.abbr}
                className="flex items-center gap-2 px-2 py-1 rounded"
                style={{
                  backgroundColor: isUser ? `${g.color}20` : 'transparent',
                  border: isUser ? `1px solid ${g.color}30` : '1px solid transparent',
                }}
              >
                <span className="text-[10px] text-white/20 font-mono w-4 text-right">{i + 1}</span>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: g.color }}
                >
                  <span className="text-[6px] font-black" style={{ color: g.colorAlt }}>{g.abbr}</span>
                </div>
                <span className={`text-[11px] font-bold flex-1 truncate ${isUser ? 'text-white' : 'text-white/50'}`}>
                  {g.abbr}
                </span>
                <span
                  className="text-xs font-black w-7 text-right"
                  style={{ color: g.gradeColor }}
                >
                  {g.letterGrade}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── TEAM SELECTOR (shown inside clock face before draft starts) ──
const SPEED_OPTIONS: { key: DraftSpeed; label: string; desc: string }[] = [
  { key: 'slow', label: 'Slow', desc: '2s' },
  { key: 'classic', label: 'Classic', desc: '1s' },
  { key: 'fast', label: 'Fast', desc: '0.5s' },
  { key: 'instant', label: 'Instant', desc: '0s' },
];

function TeamSelector({ onStart }: { onStart?: (abbr: string | null, speed: DraftSpeed) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [speed, setSpeed] = useState<DraftSpeed>('classic');

  const afc = ALL_NFL_FRANCHISES.filter((t) => t.conference === 'AFC');
  const nfc = ALL_NFL_FRANCHISES.filter((t) => t.conference === 'NFC');

  const selectedData = ALL_NFL_FRANCHISES.find((t) => t.abbr === selected);
  const selectedSlots = selected ? getPickSlots(selected) : [];
  const hasNoPick = selected ? NO_FIRST_ROUND_PICK.has(selected) : false;

  return (
    <div className="flex flex-col items-center w-full h-full justify-center px-6 overflow-y-auto">
      {/* Title */}
      <div className="text-center mb-3 shrink-0">
        <p className="text-white font-black text-lg tracking-tight">2026 NFL Draft</p>
        <p className="text-white/30 text-[11px]">Pick your team or run a full sim</p>
      </div>

      {/* Conference columns — side-by-side on md+, stacked on small */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-[520px] mb-2 sm:mb-3 shrink-0 overflow-y-auto">
        {/* AFC */}
        <div className="flex-1">
          <p className="text-[9px] font-black text-center text-red-400/80 uppercase tracking-widest mb-1.5">AFC</p>
          <div className="grid grid-cols-4 gap-1">
            {afc.map((team) => {
              const isSelected = selected === team.abbr;
              const noRd1 = NO_FIRST_ROUND_PICK.has(team.abbr);
              return (
                <button
                  key={team.abbr}
                  onClick={() => setSelected(isSelected ? null : team.abbr)}
                  className="flex flex-col items-center gap-0.5 p-1.5 rounded-md transition-all min-h-[44px]"
                  style={{
                    backgroundColor: isSelected ? `${team.color}35` : 'rgba(255,255,255,0.02)',
                    border: isSelected ? `1.5px solid ${team.color}` : '1.5px solid transparent',
                    boxShadow: isSelected ? `0 0 10px ${team.color}30` : undefined,
                    opacity: noRd1 ? 0.5 : 1,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: team.color }}
                  >
                    <TeamLogo abbr={team.abbr} size={18} />
                  </div>
                  <span className={`text-[7px] font-bold truncate w-full text-center ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                    {team.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* NFC */}
        <div className="flex-1">
          <p className="text-[9px] font-black text-center text-blue-400/80 uppercase tracking-widest mb-1.5">NFC</p>
          <div className="grid grid-cols-4 gap-1">
            {nfc.map((team) => {
              const isSelected = selected === team.abbr;
              const noRd1 = NO_FIRST_ROUND_PICK.has(team.abbr);
              return (
                <button
                  key={team.abbr}
                  onClick={() => setSelected(isSelected ? null : team.abbr)}
                  className="flex flex-col items-center gap-0.5 p-1.5 rounded-md transition-all min-h-[44px]"
                  style={{
                    backgroundColor: isSelected ? `${team.color}35` : 'rgba(255,255,255,0.02)',
                    border: isSelected ? `1.5px solid ${team.color}` : '1.5px solid transparent',
                    boxShadow: isSelected ? `0 0 10px ${team.color}30` : undefined,
                    opacity: noRd1 ? 0.5 : 1,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: team.color }}
                  >
                    <TeamLogo abbr={team.abbr} size={18} />
                  </div>
                  <span className={`text-[7px] font-bold truncate w-full text-center ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                    {team.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected team info */}
      {selectedData && (
        <div
          className="text-center mb-2 px-4 py-1.5 rounded-lg shrink-0"
          style={{ backgroundColor: `${selectedData.color}15`, border: `1px solid ${selectedData.color}25` }}
        >
          <span className="text-xs font-black" style={{ color: selectedData.color }}>
            {selectedData.city} {selectedData.name}
          </span>
          {hasNoPick ? (
            <span className="text-[10px] text-red-400/80 ml-2">No 1st round pick (traded)</span>
          ) : (
            <span className="text-[10px] text-slate-500 ml-2">
              Pick{selectedSlots.length > 1 ? 's' : ''}: {selectedSlots.map((s) => `#${s}`).join(', ')}
            </span>
          )}
        </div>
      )}

      {/* Speed + Start row — sticky so it's always visible */}
      <div className="flex items-center gap-3 shrink-0 sticky bottom-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a] to-transparent pt-4 pb-1">
        <div className="flex gap-1">
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSpeed(opt.key)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                speed === opt.key ? 'text-black' : 'bg-white/5 text-slate-500 hover:bg-white/10'
              }`}
              style={speed === opt.key ? { backgroundColor: '#f59e0b' } : undefined}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => onStart?.(selected, speed)}
          className="px-5 py-1.5 rounded-lg text-sm font-black transition-all bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105"
        >
          {selected ? (hasNoPick ? 'Watch Sim' : `Draft as ${selected}`) : 'Full Sim'}
        </button>
      </div>
    </div>
  );
}
