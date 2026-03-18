'use client';

import { useState, useEffect } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { PillarCard } from '@/components/demos/phoenix-intel/PillarCard';
import { PerformanceRing } from '@/components/demos/phoenix-intel/PerformanceRing';
import { PipelineFunnel } from '@/components/demos/phoenix-intel/PipelineFunnel';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { ANNUAL_SUMMARY } from '@/data/phoenix-intel/financial-data';
import { getPipelineStages, ENGAGEMENTS, CLIENTS } from '@/data/phoenix-intel/nonprofit-data';
import { DollarSign, Users, Briefcase, TrendingUp, AlertTriangle, Database, UserCheck, Star } from 'lucide-react';

const HERO_KPIS = [
  { label: 'Annual Revenue', value: `$${(ANNUAL_SUMMARY.totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: '#3b6bf5' },
  { label: 'Active Clients', value: String(CLIENTS.filter(c => c.status === 'active').length), icon: Users, color: '#c9942b' },
  { label: 'Active Engagements', value: String(ENGAGEMENTS.filter(e => e.status === 'active').length), icon: Briefcase, color: '#10b981' },
  { label: 'Revenue Growth', value: `+${ANNUAL_SUMMARY.revenueGrowth}%`, icon: TrendingUp, color: '#7c3aed' },
];

const PILLARS = [
  { pillar: 'Purpose', score: 92, trend: 5, sparkline: [78, 82, 85, 88, 90, 92] },
  { pillar: 'People', score: 85, trend: 3, sparkline: [72, 75, 78, 80, 83, 85] },
  { pillar: 'Process', score: 78, trend: 8, sparkline: [60, 65, 68, 72, 75, 78] },
  { pillar: 'Practice', score: 88, trend: 2, sparkline: [80, 82, 84, 85, 87, 88] },
  { pillar: 'Pipeline', score: 72, trend: 12, sparkline: [52, 58, 62, 65, 68, 72] },
  { pillar: 'Profit', score: 81, trend: 6, sparkline: [65, 68, 72, 75, 78, 81] },
];

export default function DashboardPage() {
  const insight = getInsight('dashboard');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const stages = getPipelineStages();

  return (
    <PhoenixPage title="Executive Dashboard" subtitle="The Phoenix Philanthropy Group — Advancement Intelligence" accentColor="#3b6bf5">
      {/* Hero KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {HERO_KPIS.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="phoenix-card"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${i * 0.08}s`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ background: `${kpi.color}18`, borderRadius: 8, padding: 6, display: 'flex' }}>
                  <Icon size={18} color={kpi.color} />
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--pi-text-muted)', fontWeight: 600 }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pi-text)' }}>{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* 6P Pillars */}
      <div className="mb-8">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 12 }}>6P Framework Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.pillar} {...p} delay={i * 0.06} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pipeline Funnel */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Deal Pipeline</h3>
          <PipelineFunnel stages={stages} />
        </div>

        {/* Performance Rings */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Key Performance Indicators</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
            <PerformanceRing value={ANNUAL_SUMMARY.profitMargin} label="Profit Margin" color="#10b981" />
            <PerformanceRing value={78} label="Completion Rate" color="#3b6bf5" />
            <PerformanceRing value={87} label="Client Health" color="#c9942b" />
          </div>
        </div>
      </div>

      {/* Firm Health Indicators */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 12 }}>Firm Health Indicators</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'BD Concentration', value: '70-75%', sub: 'Richard generates — target <50%', icon: AlertTriangle, color: '#ef4444', alert: true },
            { label: 'Contact Database', value: '2,500-3K', sub: 'After 20 years — needs growth', icon: Database, color: '#c9942b', alert: true },
            { label: 'Repeat Business', value: '60%', sub: 'Strong retention', icon: UserCheck, color: '#10b981', alert: false },
            { label: 'Client Satisfaction', value: '98%', sub: 'Survey-based', icon: Star, color: '#3b6bf5', alert: false },
          ].map(m => (
            <div key={m.label} style={{
              padding: '12px 10px', borderRadius: 8, textAlign: 'center',
              background: m.alert ? `${m.color}08` : 'var(--pi-surface-alt, rgba(255,255,255,0.03))',
              border: `1px solid ${m.alert ? `${m.color}30` : 'var(--pi-border-faint)'}`,
            }}>
              <m.icon size={18} color={m.color} style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pi-text-muted)', marginTop: 2 }}>{m.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--pi-text-faint)', marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      {insight && (
        <AIInsightCard>{insight.text}</AIInsightCard>
      )}
    </PhoenixPage>
  );
}
