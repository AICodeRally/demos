'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAssessmentStore } from '@/lib/prizym-governance/store';
import { scoreAssessment } from '@/data/prizym-governance/engine/scoring';
import { henryScheinOrgProfile } from '@/data/prizym-governance/henry-schein/org-profile';

export function LandingHero() {
  const hydrate = useAssessmentStore(s => s.hydrate);
  const answers = useAssessmentStore(s => s.answers);
  const score = useMemo(() => scoreAssessment(answers), [answers]);

  useEffect(() => { hydrate(); }, [hydrate]);

  const maturityPct = Math.round(score.maturityScore * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '48px 32px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Hero banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 33%, #6366f1 66%, #8b5cf6 100%)',
          borderRadius: 24,
          padding: '64px 48px',
          color: '#ffffff',
          boxShadow: '0 12px 48px rgba(99,102,241,0.25)',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, opacity: 0.9 }}>
          Prizym SGM — Sales Governance Manager
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 800, margin: 0, lineHeight: 1.1, color: '#ffffff' }}>
          Governance that<br />scales with your<br />compensation program.
        </h1>
        <p style={{ fontSize: 20, marginTop: 24, maxWidth: 700, opacity: 0.95, lineHeight: 1.5, color: '#ffffff' }}>
          Assess 88 controls across 12 phases. Design policies that stand up to audit.
          Operate plans with confidence. Oversee the full lifecycle from one view.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
          <Link
            href="/prizym-governance/assess/wizard"
            style={{
              padding: '16px 32px',
              background: '#ffffff',
              color: '#6366f1',
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            Take the Assessment →
          </Link>
          <Link
            href="/prizym-governance/assess/scoping"
            style={{
              padding: '16px 32px',
              background: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Size an Engagement
          </Link>
        </div>
      </div>

      {/* Henry Schein synthetic preview card */}
      <div
        style={{
          background: 'var(--pg-card)',
          border: '1px solid var(--pg-border)',
          borderRadius: 16,
          padding: 32,
          boxShadow: 'var(--pg-shadow)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Live Demo Client
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--pg-text)', marginTop: 4 }}>
              {henryScheinOrgProfile.name}
            </div>
            <div style={{ fontSize: 16, color: 'var(--pg-text-secondary)', marginTop: 6 }}>
              {henryScheinOrgProfile.industry} · {henryScheinOrgProfile.entityType} · {henryScheinOrgProfile.countriesInScope} countries · {henryScheinOrgProfile.plansInScope} plans in scope
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: '#6366f1', lineHeight: 1 }}>{maturityPct}%</div>
            <div style={{ fontSize: 14, color: 'var(--pg-text-muted)', marginTop: 4 }}>Governance Maturity</div>
          </div>
        </div>
        <div style={{ marginTop: 20, padding: 16, background: 'var(--pg-surface-alt)', borderRadius: 8 }}>
          <div style={{ fontSize: 14, color: 'var(--pg-text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--pg-text)' }}>Current Archetype: {score.archetype}.</strong>{' '}
            {henryScheinOrgProfile.notes}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <Link
            href="/prizym-governance/dashboard"
            style={{
              padding: '10px 20px',
              background: '#6366f1',
              color: '#ffffff',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            View Live Dashboard →
          </Link>
          <Link
            href="/prizym-governance/assess/results"
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: 'var(--pg-text)',
              border: '1px solid var(--pg-border)',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            See Assessment Results
          </Link>
        </div>
      </div>
    </div>
  );
}
