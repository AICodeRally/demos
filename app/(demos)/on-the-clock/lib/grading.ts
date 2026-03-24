/**
 * Shared grading constants and utilities for draft pick evaluation.
 * Single source of truth — imported by page.tsx, DraftClock.tsx, and DraftExport.tsx.
 */

// Expected grade = BASE - (overallPick - 1) * DECAY_PER_PICK
// Pick 1 expects ~100, pick 224 expects ~86.6
export const EXPECTED_GRADE_BASE = 100;
export const EXPECTED_GRADE_DECAY = 0.06;

// Letter grade thresholds: avgValue >= threshold → [grade, color]
export const GRADE_THRESHOLDS: [number, string, string][] = [
  [8, 'A+', '#10b981'], [5, 'A', '#10b981'], [3, 'A-', '#34d399'],
  [1, 'B+', '#3b82f6'], [-1, 'B', '#3b82f6'], [-3, 'B-', '#60a5fa'],
  [-5, 'C+', '#f59e0b'], [-7, 'C', '#f59e0b'], [-10, 'C-', '#f97316'],
  [-13, 'D', '#ef4444'],
];

/** Compute expected grade for a given overall pick number (1-based) */
export function expectedGrade(overallPick: number): number {
  return EXPECTED_GRADE_BASE - (overallPick - 1) * EXPECTED_GRADE_DECAY;
}

/** Compute pick value: how much better/worse than expected */
export function pickValue(playerGrade: number, overallPick: number): number {
  return Math.round((playerGrade - expectedGrade(overallPick)) * 10) / 10;
}

/** Get letter grade and color for a given average value */
export function getGrade(avgValue: number): { letter: string; color: string } {
  const match = GRADE_THRESHOLDS.find(([threshold]) => avgValue >= threshold);
  return match ? { letter: match[1], color: match[2] } : { letter: 'F', color: '#dc2626' };
}

/** Get pick reaction for the flash overlay */
export function getPickReaction(playerGrade: number, overallPick: number): { label: string; color: string } {
  const diff = playerGrade - expectedGrade(overallPick);
  if (diff >= 10) return { label: 'STEAL!', color: '#10b981' };
  if (diff >= 3) return { label: 'GREAT PICK', color: '#3b82f6' };
  if (diff >= -3) return { label: 'SOLID', color: '#f59e0b' };
  return { label: 'REACH', color: '#ef4444' };
}
