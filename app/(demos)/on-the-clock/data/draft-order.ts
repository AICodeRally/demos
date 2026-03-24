import { NFL_TEAMS } from './teams';
import type { NFLTeam } from './teams';

export interface DraftSlot {
  overall: number;      // Overall pick number (1-224)
  round: number;        // Round (1-7)
  pickInRound: number;  // Pick within round (1-32)
  team: NFLTeam;        // Team making the pick
}

/**
 * Build the full 7-round draft order.
 *
 * Round 1: Uses the actual 2026 draft order from NFL_TEAMS (includes trades).
 * Rounds 2-7: Uses a simplified order — same base order as Round 1 but
 * without trade-specific picks. Teams that traded away Round 1 picks
 * get slotted back in at their original draft position for later rounds.
 *
 * This is a simplification — real NFL drafts have different trade arrangements
 * per round, but for a simulator this creates a realistic-feeling draft.
 */
export function buildDraftOrder(totalRounds: number = 7): DraftSlot[] {
  const slots: DraftSlot[] = [];
  let overall = 1;

  // Round 1: Use exact NFL_TEAMS order (32 entries with trades baked in)
  for (let i = 0; i < NFL_TEAMS.length; i++) {
    slots.push({
      overall,
      round: 1,
      pickInRound: i + 1,
      team: NFL_TEAMS[i],
    });
    overall++;
  }

  // Rounds 2-7: Use simplified order based on Round 1 base positions
  // Strip trade notes and deduplicate (teams with multiple R1 picks appear once)
  // Then add back teams that traded away their R1 pick at their draft position
  const round2PlusOrder = buildSimplifiedOrder();

  for (let round = 2; round <= totalRounds; round++) {
    for (let i = 0; i < round2PlusOrder.length; i++) {
      slots.push({
        overall,
        round,
        pickInRound: i + 1,
        team: { ...round2PlusOrder[i], tradeNote: undefined },
        // Strip tradeNote for rounds 2+ since it only applies to R1 trades
      });
      overall++;
    }
  }

  return slots;
}

/**
 * Build simplified 32-team order for rounds 2-7.
 * Uses reverse standings order (worst to best, same concept as Round 1).
 * Teams appear exactly once per round.
 */
function buildSimplifiedOrder(): NFLTeam[] {
  // Start with Round 1 order, but deduplicate teams and fill in traded-away teams
  const seen = new Set<string>();
  const order: NFLTeam[] = [];

  // First pass: collect unique teams from R1 order (preserves draft position)
  for (const team of NFL_TEAMS) {
    if (!seen.has(team.abbr)) {
      seen.add(team.abbr);
      order.push({ ...team, tradeNote: undefined });
    }
  }

  // Teams that traded away their R1 pick need to be inserted
  // They draft at roughly their record-based position in later rounds
  const missingTeams: { team: NFLTeam; insertAfter: number }[] = [
    // ATL (traded to LAR at #13) — ATL was ~13th worst record
    { team: { name: 'Falcons', abbr: 'ATL', city: 'Atlanta', color: '#A71930', colorAlt: '#000000', conference: 'NFC', division: 'South' }, insertAfter: 12 },
    // GB (traded to DAL at #20) — GB was ~20th worst record
    { team: { name: 'Packers', abbr: 'GB', city: 'Green Bay', color: '#203731', colorAlt: '#FFB612', conference: 'NFC', division: 'North' }, insertAfter: 19 },
    // JAX (traded to CLE at #24) — JAX was ~24th worst record
    { team: { name: 'Jaguars', abbr: 'JAX', city: 'Jacksonville', color: '#006778', colorAlt: '#D7A22A', conference: 'AFC', division: 'South' }, insertAfter: 23 },
    // IND (traded to NYJ at #16) — IND was ~16th worst record
    { team: { name: 'Colts', abbr: 'IND', city: 'Indianapolis', color: '#002C5F', colorAlt: '#A2AAAD', conference: 'AFC', division: 'South' }, insertAfter: 15 },
    // DEN (traded to MIA at #30) — DEN was ~30th worst record
    { team: { name: 'Broncos', abbr: 'DEN', city: 'Denver', color: '#FB4F14', colorAlt: '#002244', conference: 'AFC', division: 'West' }, insertAfter: 29 },
  ];

  // Insert missing teams at their approximate draft positions
  // Sort by insertAfter descending so indices don't shift
  missingTeams.sort((a, b) => b.insertAfter - a.insertAfter);
  for (const { team, insertAfter } of missingTeams) {
    order.splice(insertAfter, 0, team);
  }

  // Validate exactly 32 unique franchises
  if (order.length !== 32) {
    console.warn(`[draft-order] buildSimplifiedOrder produced ${order.length} teams, expected 32`);
  }
  return order.slice(0, 32);
}

/** Get total picks for a given number of rounds */
export function getTotalPicks(rounds: number): number {
  return rounds * 32;
}

/** Get the round label (e.g., "Round 1", "Round 2") */
export function getRoundLabel(round: number): string {
  return `Round ${round}`;
}

/** Get all draft slots for a specific team across all rounds */
export function getTeamSlots(slots: DraftSlot[], abbr: string): DraftSlot[] {
  return slots.filter((s) => s.team.abbr === abbr);
}
