import { describe, it, expect } from 'vitest';
import { GOVERNANCE_FRAMEWORK } from '@/data/prizym-governance/engine/framework';
import { scoreAssessment } from '@/data/prizym-governance/engine/scoring';
import type { AnswerMap, Rating } from '@/data/prizym-governance/engine/types';

const allIds = () => GOVERNANCE_FRAMEWORK.phases.flatMap(p => p.checkpoints.map(c => c.id));

describe('GOVERNANCE_FRAMEWORK', () => {
  it('has exactly 12 phases', () => {
    expect(GOVERNANCE_FRAMEWORK.phases).toHaveLength(12);
  });

  it('has exactly 88 checkpoints total', () => {
    expect(allIds()).toHaveLength(88);
  });

  it('every checkpoint ID is unique', () => {
    const ids = allIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every phase has a valid quadrant', () => {
    const valid = new Set(['design', 'operate', 'dispute', 'oversee']);
    for (const p of GOVERNANCE_FRAMEWORK.phases) {
      expect(valid.has(p.quadrant)).toBe(true);
    }
  });
});

describe('scoreAssessment', () => {
  const mkAnswers = (rating: Rating): AnswerMap => {
    const a: AnswerMap = {};
    for (const id of allIds()) a[id] = rating;
    return a;
  };

  it('returns Organic Grower for all-done', () => {
    const r = scoreAssessment(mkAnswers('done'));
    expect(r.archetype).toBe('Organic Grower');
    expect(r.maturityScore).toBe(1);
    expect(r.auditReadiness).toBeNull();
    expect(r.soxGaps).toHaveLength(0);
  });

  it('returns Greenfield for all-not-started', () => {
    const r = scoreAssessment(mkAnswers('not_started'));
    expect(r.archetype).toBe('Greenfield');
    expect(r.maturityScore).toBe(0);
    expect(r.auditReadiness).not.toBeNull();
    expect(r.auditReadiness!).toBeLessThan(0.01);
  });

  it('returns 0.5 maturity for all-partial', () => {
    const r = scoreAssessment(mkAnswers('partial'));
    expect(r.maturityScore).toBe(0.5);
  });

  it('returns all four quadrant scores in [0,1]', () => {
    const r = scoreAssessment(mkAnswers('partial'));
    for (const q of ['design', 'operate', 'dispute', 'oversee'] as const) {
      expect(r.quadrantScores[q]).toBeGreaterThanOrEqual(0);
      expect(r.quadrantScores[q]).toBeLessThanOrEqual(1);
    }
  });

  it('classifies Foundation Builder when design strong + operate weak', () => {
    const a: AnswerMap = {};
    for (const id of allIds()) a[id] = 'not_started';
    for (const p of GOVERNANCE_FRAMEWORK.phases) {
      if (p.quadrant === 'design') {
        for (const c of p.checkpoints) a[c.id] = 'done';
      }
    }
    const r = scoreAssessment(a);
    expect(r.archetype).toBe('Foundation Builder');
  });
});
