'use client';

import { useState, useEffect, useMemo } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard, StatusBadge, GaugeChart } from '@/components/demos/prizym-governance/StatusBadge';
import { GOVERNANCE_KPIS, RECENT_HIGHLIGHTS, POLICY_COVERAGE_HEALTH, CASE_VOLUME_BY_TYPE, APPROVAL_DECISIONS } from '@/data/prizym-governance/analytics';
import { ALL_POLICIES, getPolicyStats } from '@/data/prizym-governance/policies';
import { PLANS, getPlanStats } from '@/data/prizym-governance/plans';
import { DOCUMENT_COUNTS } from '@/data/prizym-governance/documents';
import { useAssessmentStore } from '@/lib/prizym-governance/store';
import { scoreAssessment } from '@/data/prizym-governance/engine/scoring';
import { MaturityDial } from '@/components/demos/prizym-governance/assess/MaturityDial';
import { QuadrantScoreCard } from '@/components/demos/prizym-governance/assess/QuadrantScoreCard';
import { henryScheinOrgProfile } from '@/data/prizym-governance/henry-schein/org-profile';
import {
  Shield, FileText, ScrollText, AlertTriangle,
  CheckCircle2, TrendingUp, TrendingDown, Minus, Activity, Target, BarChart3,
} from 'lucide-react';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const policyStats = getPolicyStats();
  const planStats = getPlanStats();

  const hydrate = useAssessmentStore(s => s.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);

  const answers = useAssessmentStore(s => s.answers);
  const score = useMemo(() => scoreAssessment(answers), [answers]);
  const answeredCount = Object.values(answers).filter(r => r !== 'not_started').length;
  const maturityPct = Math.round(score.maturityScore * 100);

  const HERO_KPIS = [
    { label: 'Policies', value: String(policyStats.total), icon: Shield, color: '#3b82f6', sub: `${policyStats.approved} approved` },
    { label: 'Comp Plans', value: String(planStats.total), icon: FileText, color: '#06b6d4', sub: `${planStats.avgCompletion}% avg completion` },
    { label: 'Documents', value: String(DOCUMENT_COUNTS.TOTAL), icon: ScrollText, color: '#8b5cf6', sub: '6 categories' },
    { label: 'Active Cases', value: '4', icon: AlertTriangle, color: '#f59e0b', sub: '2 high priority' },
  ];

  return (
    <PrizymPage title="Governance Dashboard" subtitle={`${henryScheinOrgProfile.name} — Sales Compensation Governance`} hero>
      {/* Hero KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" role="region" aria-label="Key metrics">
        {HERO_KPIS.map((kpi, i) => (
          <MetricCard key={kpi.label} {...kpi} mounted={mounted} delay={i * 0.1} />
        ))}
      </div>

      {/* Assessment Maturity + Quadrant Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6" role="region" aria-label="Assessment maturity">
        {/* Maturity Dial */}
        <div className="pg-card-elevated" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <h3 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
            <Target size={16} color="var(--pg-cyan)" />
            Governance Maturity
          </h3>
          <MaturityDial score={score.maturityScore} size={180} />
          <div style={{ textAlign: 'center' }}>
            <div className="pg-caption" style={{ marginBottom: 4 }}>
              {answeredCount} of 88 checkpoints answered
            </div>
            <div className="pg-label" style={{ fontWeight: 700 }}>
              Archetype: <span style={{ color: 'var(--pg-cyan)' }}>{score.archetype}</span>
            </div>
          </div>
        </div>

        {/* Quadrant Score Cards */}
        <div className="lg:col-span-2" role="region" aria-label="Quadrant scores">
          <h3 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BarChart3 size={16} color="var(--pg-cyan)" />
            Quadrant Scores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuadrantScoreCard quadrant="design" score={score.quadrantScores.design} />
            <QuadrantScoreCard quadrant="operate" score={score.quadrantScores.operate} />
            <QuadrantScoreCard quadrant="dispute" score={score.quadrantScores.dispute} />
            <QuadrantScoreCard quadrant="oversee" score={score.quadrantScores.oversee} />
          </div>
        </div>
      </div>

      {/* Governance Health + Coverage Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 pg-card" role="region" aria-label="Governance KPIs">
          <h2 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={16} color="var(--pg-cyan)" />
            Governance Health
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pg-stack-sm">
            {GOVERNANCE_KPIS.map((kpi, i) => {
              const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
              const trendColor = kpi.status === 'good' ? '#10b981' : kpi.status === 'warning' ? '#f59e0b' : '#ef4444';
              return (
                <div
                  key={kpi.label}
                  className="pg-metric-tile"
                  style={{
                    background: 'var(--pg-surface-alt)',
                    border: '1px solid var(--pg-border-faint)',
                    borderRadius: 10,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${0.4 + i * 0.06}s`,
                  }}
                >
                  <div className="pg-value-sm" style={{ color: trendColor }}>{kpi.value}{kpi.unit === '%' || kpi.unit === 'days' ? kpi.unit : ''}</div>
                  <div className="pg-overline" style={{ marginTop: 4 }}>{kpi.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
                    <TrendIcon size={12} color={trendColor} />
                    <span className="pg-caption" style={{ color: trendColor }}>{kpi.trendValue}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Policy Coverage Gauge */}
        <div className="pg-card-elevated" role="region" aria-label="Policy coverage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
            <Target size={16} color="var(--pg-cyan)" />
            Policy Coverage
          </h3>
          <GaugeChart
            value={POLICY_COVERAGE_HEALTH.coveragePercentage}
            size={140}
            strokeWidth={12}
            color={POLICY_COVERAGE_HEALTH.coveragePercentage >= 90 ? '#10b981' : '#f59e0b'}
          />
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={14} color="#10b981" />
              <span className="pg-caption">{POLICY_COVERAGE_HEALTH.fullCoverage} fully covered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={14} color="#f59e0b" />
              <span className="pg-caption">{POLICY_COVERAGE_HEALTH.gaps} gaps ({POLICY_COVERAGE_HEALTH.highPriorityGaps} high priority)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Case Volume */}
        <div className="pg-card" role="region" aria-label="Case volume by type">
          <h3 className="pg-section-title">Case Volume by Type</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CASE_VOLUME_BY_TYPE.map(c => (
              <div key={c.category} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="pg-label" style={{ minWidth: 130 }}>{c.category}</span>
                <div className="pg-bar-track" style={{ flex: 1 }}>
                  <div className="pg-bar-fill" style={{ width: mounted ? `${c.percentage}%` : '0%', background: c.color }} />
                </div>
                <span className="pg-value-sm" style={{ minWidth: 30, textAlign: 'right', color: c.color }}>{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Decisions */}
        <div className="pg-card" role="region" aria-label="Approval decisions">
          <h3 className="pg-section-title">Approval Decisions (YTD)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {APPROVAL_DECISIONS.map(d => (
              <div key={d.category} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="pg-label" style={{ minWidth: 160 }}>{d.category}</span>
                <div className="pg-bar-track" style={{ flex: 1 }}>
                  <div className="pg-bar-fill" style={{ width: mounted ? `${d.percentage}%` : '0%', background: d.color }} />
                </div>
                <span className="pg-value-sm" style={{ minWidth: 30, textAlign: 'right', color: d.color }}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Highlights */}
      <div className="pg-card" role="region" aria-label="Recent highlights">
        <h3 className="pg-section-title">Recent Highlights</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RECENT_HIGHLIGHTS.map((h, i) => {
            const color = h.type === 'success' ? '#10b981' : h.type === 'warning' ? '#f59e0b' : '#3b82f6';
            return (
              <div
                key={h.id}
                className="pg-highlight-row"
                style={{
                  background: `${color}08`,
                  border: `1px solid ${color}20`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-12px)',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${0.6 + i * 0.1}s`,
                }}
              >
                <div className="pg-icon-bubble-sm" style={{ background: `${color}18` }}>
                  <CheckCircle2 size={14} color={color} />
                </div>
                <div>
                  <div className="pg-label" style={{ color }}>{h.title}</div>
                  <div className="pg-caption">{h.description}</div>
                  <div className="pg-caption" style={{ marginTop: 2, fontWeight: 600 }}>{h.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PrizymPage>
  );
}
