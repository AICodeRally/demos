'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GOVERNANCE_FRAMEWORK } from '@/data/prizym-governance/engine/framework';
import { useAssessmentStore } from '@/lib/prizym-governance/store';
import { henryScheinOrgProfile } from '@/data/prizym-governance/henry-schein/org-profile';
import type { Rating, Quadrant } from '@/data/prizym-governance/engine/types';

const QUADRANT_COLORS: Record<Quadrant, string> = {
  design: '#0ea5e9',
  operate: '#3b82f6',
  dispute: '#6366f1',
  oversee: '#8b5cf6',
};

const RATING_OPTIONS: { value: Rating; label: string; color: string }[] = [
  { value: 'done', label: 'Done', color: '#10b981' },
  { value: 'partial', label: 'Partial', color: '#f59e0b' },
  { value: 'not_started', label: 'Not Started', color: '#ef4444' },
];

export function AssessmentWizard() {
  const router = useRouter();
  const isSox = henryScheinOrgProfile.entityType === 'Public (SOX)';
  const phases = GOVERNANCE_FRAMEWORK.phases;
  const answers = useAssessmentStore(s => s.answers);
  const currentPhaseNumber = useAssessmentStore(s => s.currentPhase);
  const setAnswerInStore = useAssessmentStore(s => s.setAnswer);
  const setCurrentPhaseInStore = useAssessmentStore(s => s.setCurrentPhase);

  const currentPhaseIdx = Math.max(0, phases.findIndex(p => p.number === currentPhaseNumber));
  const phase = phases[currentPhaseIdx];
  const totalPhases = phases.length;
  const answeredInPhase = phase.checkpoints.filter(cp => answers[cp.id]).length;
  const totalInPhase = phase.checkpoints.length;
  const totalAnswered = Object.keys(answers).length;
  const totalCheckpoints = phases.reduce((sum, p) => sum + p.checkpoints.length, 0);

  const setRating = (checkpointId: string, rating: Rating) => {
    setAnswerInStore(checkpointId, rating);
  };

  const goNext = () => {
    if (currentPhaseIdx < totalPhases - 1) {
      setCurrentPhaseInStore(phases[currentPhaseIdx + 1].number);
      window.scrollTo(0, 0);
    } else {
      router.push('/prizym-governance/assess/results');
    }
  };

  const goPrev = () => {
    if (currentPhaseIdx > 0) {
      setCurrentPhaseInStore(phases[currentPhaseIdx - 1].number);
      window.scrollTo(0, 0);
    } else {
      router.push('/prizym-governance');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 0' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-primary)' }}>
            Step 2 of 3 — Phase {phase.number} of {totalPhases}
          </span>
          <span style={{ fontSize: 14, color: 'var(--pg-text-secondary)' }}>
            {totalAnswered} / {totalCheckpoints} checkpoints
          </span>
        </div>
        <div style={{ height: 6, background: 'var(--pg-border)', borderRadius: 3 }}>
          <div style={{
            height: '100%',
            width: `${(totalAnswered / totalCheckpoints) * 100}%`,
            background: 'var(--pg-primary)',
            borderRadius: 3,
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      {/* Phase header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: QUADRANT_COLORS[phase.quadrant] || 'var(--pg-primary)',
          }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: QUADRANT_COLORS[phase.quadrant], textTransform: 'uppercase' as const }}>
            {phase.quadrant}
          </span>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--pg-text)', marginBottom: 8 }}>
          Phase {phase.number}: {phase.name}
        </h2>
        <p style={{ fontSize: 16, color: 'var(--pg-text-secondary)' }}>
          {answeredInPhase} of {totalInPhase} checkpoints answered
        </p>
      </div>

      {/* Phase navigation pills */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 32 }}>
        {phases.map((p, idx) => {
          const phaseAnswered = p.checkpoints.filter(cp => answers[cp.id]).length;
          const phaseTotal = p.checkpoints.length;
          const isComplete = phaseAnswered === phaseTotal;
          const isActive = idx === currentPhaseIdx;
          return (
            <button
              key={p.number}
              onClick={() => { setCurrentPhaseInStore(p.number); window.scrollTo(0, 0); }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: isActive ? '2px solid var(--pg-primary)' : '1px solid var(--pg-border)',
                background: isComplete ? 'var(--pg-primary)' : isActive ? 'var(--pg-bg)' : 'var(--pg-bg)',
                color: isComplete ? '#ffffff' : 'var(--pg-text)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {p.number}
            </button>
          );
        })}
      </div>

      {/* Checkpoints */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {phase.checkpoints.map(cp => (
          <div key={cp.id} style={{
            background: 'var(--pg-card)',
            border: '1px solid var(--pg-border)',
            borderRadius: 12,
            padding: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--pg-text)' }}>
                    {cp.label}
                  </span>
                  {cp.soxRelevant && isSox && (
                    <span style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#dc2626',
                      background: '#fee2e2',
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}>
                      SOX
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 16, color: 'var(--pg-text-secondary)', marginBottom: 8 }}>
                  {cp.description}
                </p>
                <p style={{ fontSize: 14, color: 'var(--pg-text-muted)', fontStyle: 'italic' }}>
                  {cp.evidencePrompt}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {RATING_OPTIONS.map(opt => {
                const selected = answers[cp.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setRating(cp.id, opt.value)}
                    style={{
                      padding: '10px 20px',
                      fontSize: 15,
                      fontWeight: 600,
                      background: selected ? opt.color : 'var(--pg-bg)',
                      color: selected ? '#ffffff' : 'var(--pg-text)',
                      border: `1px solid ${selected ? opt.color : 'var(--pg-border)'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      flex: 1,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
        <button
          onClick={goPrev}
          style={{
            padding: '14px 28px',
            fontSize: 16,
            fontWeight: 600,
            background: 'var(--pg-surface-alt)',
            color: 'var(--pg-text)',
            border: '1px solid var(--pg-border)',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          {currentPhaseIdx === 0 ? 'Back to Profile' : 'Previous Phase'}
        </button>
        <button
          onClick={goNext}
          style={{
            padding: '14px 28px',
            fontSize: 16,
            fontWeight: 600,
            background: 'var(--pg-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            flex: 1,
          }}
        >
          {currentPhaseIdx === totalPhases - 1 ? 'View Results' : 'Next Phase'}
        </button>
      </div>
    </div>
  );
}
