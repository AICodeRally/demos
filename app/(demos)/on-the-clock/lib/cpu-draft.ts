import { DRAFT_PLAYERS } from '../data/players';
import type { DraftPlayer } from '../data/players';
import { NFL_TEAMS } from '../data/teams';
import type { NFLTeam } from '../data/teams';
import { TEAM_NEEDS } from '../data/team-needs';

export type DraftSpeed = 'slow' | 'classic' | 'fast' | 'instant';

/**
 * CPU auto-draft: picks the best player for a team based on needs + BPA.
 *
 * Accepts either a pickIndex (for Round 1 backward compat) or a team directly.
 * When team is provided, overallPick is used for reach penalty calculation.
 */
export function cpuPickPlayer(
  pickIndexOrTeam: number | NFLTeam,
  draftedPlayerIds: Set<number>,
  overallPick?: number,
): DraftPlayer | null {
  const available = DRAFT_PLAYERS.filter((p) => !draftedPlayerIds.has(p.id));
  if (available.length === 0) return null;

  const team = typeof pickIndexOrTeam === 'number'
    ? NFL_TEAMS[pickIndexOrTeam]
    : pickIndexOrTeam;
  const pickNum = overallPick ?? (typeof pickIndexOrTeam === 'number' ? pickIndexOrTeam : 0);
  const needs = TEAM_NEEDS[team.abbr] ?? [];

  // Score each player
  const scored = available.map((player) => {
    let score = player.grade;

    // Need bonus: primary need gets biggest boost
    const needIndex = needs.indexOf(player.position);
    if (needIndex === 0) score += 8;       // Primary need
    else if (needIndex === 1) score += 5;  // Secondary need
    else if (needIndex === 2) score += 3;  // Tertiary need

    // Slight randomness (±2 points) to avoid perfectly deterministic drafts
    score += (Math.random() - 0.5) * 4;

    // Penalize reaching too far — if a player's grade is much lower than
    // what's expected at this pick, reduce the score
    const expectedGrade = 100 - pickNum * 0.4;
    if (player.grade < expectedGrade - 10) {
      score -= 3; // mild reach penalty
    }

    return { player, score };
  });

  // Sort by score descending and pick the top
  scored.sort((a, b) => b.score - a.score);
  return scored[0].player;
}

/**
 * Returns the delay in ms for each draft speed setting.
 */
export function getSpeedDelay(speed: DraftSpeed): number {
  switch (speed) {
    case 'slow': return 2000;
    case 'classic': return 1000;
    case 'fast': return 500;
    case 'instant': return 0;
    default: return 1000;
  }
}
