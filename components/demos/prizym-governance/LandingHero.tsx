'use client';

import React from 'react';
import Link from 'next/link';
import { henryScheinOrgProfile } from '@/data/prizym-governance/henry-schein/org-profile';
import { getComplianceScore } from '@/data/prizym-governance/oversee';
import { getApprovalStats } from '@/data/prizym-governance/operate';

export function LandingHero() {
  const complianceScore = getComplianceScore();
  const approvalStats = getApprovalStats();

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
        <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, opacity: 0.95 }}>
          Prizym Sales Planning Suite · Sales Governance Manager
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 800, margin: 0, lineHeight: 1.1, color: '#ffffff' }}>
          Governance that<br />scales with your<br />compensation program.
        </h1>
        <p style={{ fontSize: 20, marginTop: 24, maxWidth: 720, opacity: 0.95, lineHeight: 1.5, color: '#ffffff' }}>
          Design policies that stand up to audit. Operate approvals, decisions, committees,
          and calendars with confidence. Oversee compliance, reports, and pulse — all from one view.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
          <Link
            href="/prizym-governance/dashboard"
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
            Open Dashboard →
          </Link>
          <Link
            href="/prizym-governance/design/asc606-calculator"
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
            ASC 606 Calculator
          </Link>
        </div>
      </div>

      {/* Synthetic demo tenant preview card */}
      <div
        style={{
          background: 'var(--pg-card)',
          border: '1px solid var(--pg-border)',
          borderRadius: 20,
          padding: 32,
          boxShadow: 'var(--pg-shadow)',
          backdropFilter: 'blur(16px) saturate(140%)',
          WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Synthetic Demo Tenant
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--pg-text)', marginTop: 4 }}>
              {henryScheinOrgProfile.name}
            </div>
            <div style={{ fontSize: 16, color: 'var(--pg-text-secondary)', marginTop: 6 }}>
              {henryScheinOrgProfile.industry} · {henryScheinOrgProfile.entityType} · {henryScheinOrgProfile.countriesInScope} countries · {henryScheinOrgProfile.plansInScope} plans in scope
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: '#8b5cf6', lineHeight: 1 }}>{complianceScore}%</div>
            <div style={{ fontSize: 14, color: 'var(--pg-text-muted)', marginTop: 4 }}>Compliance Score</div>
          </div>
        </div>
        <div style={{ marginTop: 20, padding: 18, background: 'var(--pg-surface-alt)', borderRadius: 12 }}>
          <div style={{ fontSize: 16, color: 'var(--pg-text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--pg-text)' }}>
              {approvalStats.pending} pending approvals · {approvalStats.highPriority} high priority.
            </strong>{' '}
            {henryScheinOrgProfile.notes}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <Link
            href="/prizym-governance/oversee/compliance"
            style={{
              padding: '12px 22px',
              background: '#8b5cf6',
              color: '#ffffff',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Compliance Dashboard →
          </Link>
          <Link
            href="/prizym-governance/operate/approvals"
            style={{
              padding: '12px 22px',
              background: 'transparent',
              color: 'var(--pg-text)',
              border: '1px solid var(--pg-border)',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Approvals Queue
          </Link>
        </div>
      </div>
    </div>
  );
}
