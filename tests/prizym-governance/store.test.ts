import { describe, it, expect, beforeEach } from 'vitest';
import { useAssessmentStore } from '@/lib/prizym-governance/store';

describe('useAssessmentStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAssessmentStore.getState().reset();
  });

  it('starts with empty answers', () => {
    const s = useAssessmentStore.getState();
    expect(Object.keys(s.answers)).toHaveLength(0);
    expect(s.currentPhase).toBe(1);
  });

  it('hydrate() seeds Henry Schein state on first visit', () => {
    useAssessmentStore.getState().hydrate();
    const s = useAssessmentStore.getState();
    expect(Object.keys(s.answers).length).toBe(88);
  });

  it('setAnswer() persists to localStorage', () => {
    useAssessmentStore.getState().hydrate();
    useAssessmentStore.getState().setAnswer('p1-01', 'not_started');
    expect(useAssessmentStore.getState().answers['p1-01']).toBe('not_started');
    const raw = window.localStorage.getItem('sgm-gold-assessment-v1');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.answers['p1-01']).toBe('not_started');
  });

  it('reset() clears answers and localStorage', () => {
    useAssessmentStore.getState().hydrate();
    useAssessmentStore.getState().reset();
    expect(Object.keys(useAssessmentStore.getState().answers)).toHaveLength(0);
    expect(window.localStorage.getItem('sgm-gold-assessment-v1')).toBeNull();
  });

  it('resetToSeed() restores Henry Schein state after mutation', () => {
    useAssessmentStore.getState().hydrate();
    useAssessmentStore.getState().setAnswer('p1-01', 'not_started');
    useAssessmentStore.getState().resetToSeed();
    expect(useAssessmentStore.getState().answers['p1-01']).toBe('done');
  });

  it('score() returns a valid ScoringResult', () => {
    useAssessmentStore.getState().hydrate();
    const r = useAssessmentStore.getState().score();
    expect(r.maturityScore).toBeGreaterThan(0);
    expect(r.maturityScore).toBeLessThan(1);
    expect(['Foundation Builder', 'Operator Without Framework', 'Organic Grower', 'Greenfield']).toContain(r.archetype);
  });
});
