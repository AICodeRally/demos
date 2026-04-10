import { describe, it, expect } from 'vitest';
import {
  SCOPING_CATEGORIES,
  STAFFING_TEMPLATES,
  RATE_CARD,
  calculateEstimate,
} from '@/data/prizym-governance/scoping';

describe('scoping data', () => {
  it('has 5 categories', () => {
    expect(SCOPING_CATEGORIES).toHaveLength(5);
  });

  it('has exactly 20 questions', () => {
    const total = SCOPING_CATEGORIES.reduce((n, c) => n + c.questions.length, 0);
    expect(total).toBe(20);
  });

  it('has 3 staffing templates', () => {
    expect(STAFFING_TEMPLATES).toHaveLength(3);
  });

  it('has 8 rate card entries', () => {
    expect(RATE_CARD).toHaveLength(8);
  });
});

describe('calculateEstimate', () => {
  it('returns a complete Estimate for an empty answer set', () => {
    const e = calculateEstimate({});
    expect(e.complexity).toBeGreaterThanOrEqual(0);
    expect(['Lean', 'Standard', 'Enterprise']).toContain(e.template);
    expect(e.staffing.headcount).toBeGreaterThan(0);
    expect(e.estimate.totalEstimate).toBeGreaterThan(0);
  });

  it('produces higher complexity for complex-state answers', () => {
    const simple = calculateEstimate({ 'sc-02': '1-5', 'sc-03': 'Under 50' });
    const complex = calculateEstimate({ 'sc-02': '100+', 'sc-03': '2000+', 'sc-17': '30+' });
    expect(complex.complexity).toBeGreaterThan(simple.complexity);
  });
});
