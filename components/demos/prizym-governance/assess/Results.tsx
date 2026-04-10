'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePrizymTheme } from '../ThemeProvider';
import { useAssessmentStore } from '@/lib/prizym-governance/store';
import { scoreAssessment } from '@/data/prizym-governance/engine/scoring';
import { henryScheinOrgProfile } from '@/data/prizym-governance/henry-schein/org-profile';
import { MaturityDial } from './MaturityDial';
import { QuadrantScoreCard } from './QuadrantScoreCard';

export function Results() {
  const router = useRouter();
  const { theme } = usePrizymTheme();
  const isDark = theme === 'dark';
  const answers = useAssessmentStore(s => s.answers);
  const score = useMemo(() => scoreAssessment(answers), [answers]);
  const resetToSeed = useAssessmentStore(s => s.resetToSeed);

  const totalAnswered = Object.keys(answers).length;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 0' }}>
      {/* Henry Schein header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Assessment for
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--pg-text)', marginTop: 4, marginBottom: 8 }}>
          {henryScheinOrgProfile.name}
        </h1>
        <p style={{ fontSize: 16, color: 'var(--pg-text-secondary)' }}>
          {henryScheinOrgProfile.industry} · {henryScheinOrgProfile.entityType} · Assessment owner: {henryScheinOrgProfile.assessmentOwner.name}
        </p>
      </div>

      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#6366f1' }}>Step 3 of 3</span>
      </div>
      <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--pg-text)', marginBottom: 8 }}>
        Governance Maturity Results
      </h2>
      <p style={{ fontSize: 18, color: 'var(--pg-text-secondary)', marginBottom: 40 }}>
        {henryScheinOrgProfile.name} — {totalAnswered} checkpoints assessed
      </p>

      {/* Maturity Score */}
      <div style={{
        background: 'var(--pg-card)',
        border: '1px solid var(--pg-border)',
        borderRadius: 16,
        padding: 40,
        textAlign: 'center',
        marginBottom: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        <MaturityDial score={score.maturityScore} size={220} />
        <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--pg-text-secondary)', marginTop: 8 }}>
          Overall Maturity Score
        </div>
        <div style={{
          display: 'inline-block',
          padding: '8px 20px',
          background: '#6366f1',
          color: '#ffffff',
          borderRadius: 20,
          fontSize: 16,
          fontWeight: 700,
        }}>
          {score.archetype}
        </div>
      </div>

      {/* Quadrant Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        <QuadrantScoreCard quadrant="design" score={score.quadrantScores.design} />
        <QuadrantScoreCard quadrant="operate" score={score.quadrantScores.operate} />
        <QuadrantScoreCard quadrant="dispute" score={score.quadrantScores.dispute} />
        <QuadrantScoreCard quadrant="oversee" score={score.quadrantScores.oversee} />
      </div>

      {/* SOX Audit Readiness */}
      {score.auditReadiness !== null && (
        <div style={{
          background: 'var(--pg-card)',
          border: '1px solid var(--pg-border)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 32,
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--pg-text)', marginBottom: 8 }}>
            SOX Audit Readiness
          </h3>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#6366f1' }}>
            {Math.round(score.auditReadiness * 100)}%
          </div>
          <div style={{ height: 8, background: 'var(--pg-border)', borderRadius: 4, marginTop: 12 }}>
            <div style={{
              height: '100%',
              width: `${score.auditReadiness * 100}%`,
              background: '#6366f1',
              borderRadius: 4,
              transition: 'width 0.6s ease-out',
            }} />
          </div>
        </div>
      )}

      {/* Top Risks */}
      {score.topRisks.length > 0 && (
        <div style={{
          background: 'var(--pg-card)',
          border: '1px solid var(--pg-border)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 32,
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--pg-text)', marginBottom: 16 }}>
            Top Risks
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {score.topRisks.map((risk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#ef4444',
                  flexShrink: 0,
                  marginTop: 6,
                }} />
                <span style={{ fontSize: 16, color: 'var(--pg-text-secondary)' }}>{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Three Tracks */}
      <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--pg-text)', marginBottom: 16 }}>
        What&apos;s Next?
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {[
          {
            title: 'Build It Myself',
            description: 'Get a prioritized task queue based on your gaps. Work through improvements at your own pace.',
            color: '#059669',
          },
          {
            title: 'Guide Me',
            description: 'Get a 30-60-90 day roadmap with milestones. Structured path to governance maturity.',
            color: '#6366f1',
          },
          {
            title: 'I Need Expert Help',
            description: 'Connect with an advisory team for hands-on governance consulting and implementation.',
            color: '#dc2626',
          },
        ].map(track => (
          <button
            key={track.title}
            style={{
              background: 'var(--pg-bg)',
              border: '2px solid var(--pg-border)',
              borderRadius: 12,
              padding: 24,
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: track.color,
              flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--pg-text)', marginBottom: 4 }}>
                {track.title}
              </div>
              <div style={{ fontSize: 16, color: 'var(--pg-text-secondary)' }}>
                {track.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
        <button
          onClick={() => { resetToSeed(); router.push('/prizym-governance/assess/wizard'); }}
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
          Reset + Retake
        </button>
        <button
          onClick={() => router.push('/prizym-governance/dashboard')}
          style={{
            padding: '14px 28px',
            fontSize: 16,
            fontWeight: 600,
            background: '#6366f1',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            flex: 1,
          }}
        >
          View Dashboard
        </button>
      </div>
    </div>
  );
}
