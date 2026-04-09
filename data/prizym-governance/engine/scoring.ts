// Maturity scoring + archetype classification for the 88-checkpoint assessment.
// Ported verbatim from aicr-sgm-cf/apps/workers/src/engine/scoring.ts so the
// Gold Standard demo and production sgm.aicoderally.com always produce the
// same score for the same AnswerMap input.

import { GOVERNANCE_FRAMEWORK } from './framework';
import type {
  AnswerMap,
  Archetype,
  Quadrant,
  Rating,
  ScoringResult,
} from './types';

const RATING_SCORES: Record<Rating, number> = {
  done: 1,
  partial: 0.5,
  not_started: 0,
};

export function scoreAssessment(answers: AnswerMap): ScoringResult {
  const phaseScores: Record<number, number> = {};
  const quadrantTotals: Record<Quadrant, { score: number; count: number }> = {
    design: { score: 0, count: 0 },
    operate: { score: 0, count: 0 },
    dispute: { score: 0, count: 0 },
    oversee: { score: 0, count: 0 },
  };

  let totalScore = 0;
  let totalCount = 0;
  const soxGaps: string[] = [];
  const risks: Array<{ id: string; label: string; severity: number }> = [];

  for (const phase of GOVERNANCE_FRAMEWORK.phases) {
    let phaseTotal = 0;
    let phaseCount = 0;

    for (const cp of phase.checkpoints) {
      const rating = answers[cp.id] || 'not_started';
      const score = RATING_SCORES[rating];

      phaseTotal += score;
      phaseCount++;
      quadrantTotals[phase.quadrant].score += score;
      quadrantTotals[phase.quadrant].count++;
      totalScore += score;
      totalCount++;

      if (cp.soxRelevant && rating !== 'done') {
        soxGaps.push(cp.id);
        risks.push({ id: cp.id, label: cp.label, severity: rating === 'not_started' ? 3 : 1 });
      }

      if (rating === 'not_started') {
        risks.push({ id: cp.id, label: cp.label, severity: 2 });
      }
    }

    phaseScores[phase.number] = phaseCount > 0 ? phaseTotal / phaseCount : 0;
  }

  const maturityScore = totalCount > 0 ? totalScore / totalCount : 0;

  const quadrantScores: Record<Quadrant, number> = {
    design: quadrantTotals.design.count > 0 ? quadrantTotals.design.score / quadrantTotals.design.count : 0,
    operate: quadrantTotals.operate.count > 0 ? quadrantTotals.operate.score / quadrantTotals.operate.count : 0,
    dispute: quadrantTotals.dispute.count > 0 ? quadrantTotals.dispute.score / quadrantTotals.dispute.count : 0,
    oversee: quadrantTotals.oversee.count > 0 ? quadrantTotals.oversee.score / quadrantTotals.oversee.count : 0,
  };

  const archetype = classifyArchetype(quadrantScores);

  const soxTotal = GOVERNANCE_FRAMEWORK.phases
    .flatMap(p => p.checkpoints.filter(c => c.soxRelevant))
    .length;
  const auditReadiness = soxGaps.length > 0 ? 1 - soxGaps.length / soxTotal : null;

  const topRisks = risks
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3)
    .map(r => r.label);

  return {
    maturityScore,
    quadrantScores,
    phaseScores,
    archetype,
    topRisks,
    auditReadiness,
    soxGaps,
  };
}

function classifyArchetype(scores: Record<Quadrant, number>): Archetype {
  const designStrong = scores.design >= 0.6;
  const operateStrong = scores.operate >= 0.6;
  const overseeStrong = scores.oversee >= 0.6;

  if (designStrong && operateStrong && overseeStrong) return 'Organic Grower';
  if (!designStrong && operateStrong) return 'Operator Without Framework';
  if (designStrong && !operateStrong) return 'Foundation Builder';
  return 'Greenfield';
}
