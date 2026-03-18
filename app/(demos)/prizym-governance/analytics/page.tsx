'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import {
  GOVERNANCE_KPIS, CASE_VOLUME_BY_TYPE, APPROVAL_DECISIONS,
  RISK_DISTRIBUTION, TOP_PERFORMERS, POLICY_COVERAGE_HEALTH,
} from '@/data/prizym-governance/analytics';
import { BarChart3, Shield, Users, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <PrizymPage title="Governance Analytics" subtitle="KPIs, trends, and performance metrics across governance operations">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'SLA Compliance', value: '94%', icon: CheckCircle2, color: '#10b981', sub: '+3% vs last month' },
          { label: 'Avg Approval Time', value: '8.5 days', icon: TrendingDown, color: '#06b6d4', sub: 'Improving' },
          { label: 'Policy Coverage', value: '90%', icon: Shield, color: '#f59e0b', sub: '2 gaps identified' },
          { label: 'Active Cases', value: '4', icon: AlertTriangle, color: '#8b5cf6', sub: 'Down 20%' },
        ].map((m, i) => (
          <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Risk Distribution */}
        <div className="pg-card" role="region" aria-label="Risk distribution">
          <h3 className="pg-section-title">Risk Distribution</h3>
          {RISK_DISTRIBUTION.map(r => (
            <div key={r.category} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span className="pg-label" style={{ minWidth: 70 }}>{r.category}</span>
              <div className="pg-bar-track" style={{ flex: 1 }}>
                <div className="pg-bar-fill" style={{ width: `${r.percentage}%`, background: r.color }} />
              </div>
              <span className="pg-caption" style={{ minWidth: 30, textAlign: 'right' }}>{r.count}</span>
            </div>
          ))}
        </div>

        {/* Policy Coverage Health */}
        <div className="pg-card" role="region" aria-label="Policy coverage health">
          <h3 className="pg-section-title">Policy Coverage Health</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, flexWrap: 'wrap', padding: '16px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="pg-value" style={{ fontSize: '2.5rem', color: POLICY_COVERAGE_HEALTH.coveragePercentage >= 90 ? '#10b981' : '#f59e0b' }}>
                {POLICY_COVERAGE_HEALTH.coveragePercentage}%
              </div>
              <div className="pg-caption" style={{ marginTop: 4 }}>Coverage Rate</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span className="pg-body">{POLICY_COVERAGE_HEALTH.fullCoverage} fully covered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={14} color="#f59e0b" />
                <span className="pg-body">{POLICY_COVERAGE_HEALTH.gaps} gaps ({POLICY_COVERAGE_HEALTH.highPriorityGaps} high priority)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={14} color="#10b981" />
                <span className="pg-body">{POLICY_COVERAGE_HEALTH.criticalGaps} critical gaps</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="pg-card mb-6" role="region" aria-label="Top performers">
        <h3 className="pg-section-title">Top Reviewers & Approvers</h3>
        <div className="pg-table-wrap">
          <table className="pg-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Role</th>
                <th>Decisions</th>
                <th>Avg Days</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PERFORMERS.map((p, i) => (
                <tr key={p.name}>
                  <td><span className="pg-label" style={{ color: i < 3 ? '#06b6d4' : 'var(--pg-text-faint)' }}>{i + 1}</span></td>
                  <td><span className="pg-label">{p.name}</span></td>
                  <td><span className="pg-caption">{p.role}</span></td>
                  <td><span className="pg-value-sm">{p.decisions}</span></td>
                  <td><span className="pg-caption">{p.avgDays} days</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Volume */}
        <div className="pg-card" role="region" aria-label="Case volume">
          <h3 className="pg-section-title">Case Volume by Type</h3>
          {CASE_VOLUME_BY_TYPE.map(c => (
            <div key={c.category} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span className="pg-label" style={{ minWidth: 130 }}>{c.category}</span>
              <div className="pg-bar-track" style={{ flex: 1 }}>
                <div className="pg-bar-fill" style={{ width: `${c.percentage}%`, background: c.color }} />
              </div>
              <span className="pg-caption" style={{ minWidth: 30, textAlign: 'right' }}>{c.count}</span>
            </div>
          ))}
        </div>

        {/* Approval Breakdown */}
        <div className="pg-card" role="region" aria-label="Approval breakdown">
          <h3 className="pg-section-title">Approval Decisions (YTD)</h3>
          {APPROVAL_DECISIONS.map(d => (
            <div key={d.category} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span className="pg-label" style={{ minWidth: 160 }}>{d.category}</span>
              <div className="pg-bar-track" style={{ flex: 1 }}>
                <div className="pg-bar-fill" style={{ width: `${d.percentage}%`, background: d.color }} />
              </div>
              <span className="pg-caption" style={{ minWidth: 30, textAlign: 'right' }}>{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </PrizymPage>
  );
}
