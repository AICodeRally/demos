'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard, StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { GOVERNANCE_KPIS, RECENT_HIGHLIGHTS, POLICY_COVERAGE_HEALTH, CASE_VOLUME_BY_TYPE, APPROVAL_DECISIONS } from '@/data/prizym-governance/analytics';
import { ALL_POLICIES, getPolicyStats } from '@/data/prizym-governance/policies';
import { PLANS, getPlanStats } from '@/data/prizym-governance/plans';
import { DOCUMENT_COUNTS } from '@/data/prizym-governance/documents';
import {
  Shield, FileText, ScrollText, Users, BarChart3, AlertTriangle,
  CheckCircle2, Clock, TrendingUp, TrendingDown, Minus,
} from 'lucide-react';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const policyStats = getPolicyStats();
  const planStats = getPlanStats();

  const HERO_KPIS = [
    { label: 'Policies', value: String(policyStats.total), icon: Shield, color: '#3b82f6', sub: `${policyStats.approved} approved` },
    { label: 'Comp Plans', value: String(planStats.total), icon: FileText, color: '#06b6d4', sub: `${planStats.avgCompletion}% avg completion` },
    { label: 'Documents', value: String(DOCUMENT_COUNTS.TOTAL), icon: ScrollText, color: '#8b5cf6', sub: '6 categories' },
    { label: 'Active Cases', value: '4', icon: AlertTriangle, color: '#f59e0b', sub: '2 high priority' },
  ];

  return (
    <PrizymPage title="Governance Dashboard" subtitle="Prizym Suite — Sales Compensation Governance" accentColor="#06b6d4">
      {/* Hero KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" role="region" aria-label="Key metrics">
        {HERO_KPIS.map((kpi, i) => (
          <MetricCard key={kpi.label} label={kpi.label} value={kpi.value} icon={kpi.icon} color={kpi.color} sub={kpi.sub} mounted={mounted} delay={i * 0.08} />
        ))}
      </div>

      {/* KPI Grid */}
      <div className="pg-card mb-6" role="region" aria-label="Governance KPIs">
        <h2 className="pg-section-title">Governance Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pg-stack-sm">
          {GOVERNANCE_KPIS.map(kpi => {
            const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;
            const trendColor = kpi.status === 'good' ? '#10b981' : kpi.status === 'warning' ? '#f59e0b' : '#ef4444';
            return (
              <div key={kpi.label} className="pg-metric-tile" style={{ background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border-faint)', borderRadius: 8 }}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Case Volume */}
        <div className="pg-card" role="region" aria-label="Case volume by type">
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

        {/* Approval Decisions */}
        <div className="pg-card" role="region" aria-label="Approval decisions">
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

      {/* Recent Highlights */}
      <div className="pg-card" role="region" aria-label="Recent highlights">
        <h3 className="pg-section-title">Recent Highlights</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RECENT_HIGHLIGHTS.map(h => {
            const color = h.type === 'success' ? '#10b981' : h.type === 'warning' ? '#f59e0b' : '#3b82f6';
            return (
              <div key={h.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 12px', borderRadius: 8, background: `${color}08`, border: `1px solid ${color}20` }}>
                <CheckCircle2 size={16} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div className="pg-label" style={{ color }}>{h.title}</div>
                  <div className="pg-caption">{h.description}</div>
                  <div className="pg-caption" style={{ marginTop: 2 }}>{h.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PrizymPage>
  );
}
