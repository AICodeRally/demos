'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { TRAINING_KPIS, COMPLETIONS, COURSES } from '@/data/phoenix-intel/training-data';
import { GraduationCap, Users, CheckCircle, Star, DollarSign, Award, MonitorPlay, Globe } from 'lucide-react';

export default function TrainingPage() {
  const insight = getInsight('training');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const kpis = [
    { icon: Users, label: 'Total Enrollments', value: TRAINING_KPIS.totalEnrollments.toLocaleString(), color: '#7c3aed' },
    { icon: CheckCircle, label: 'Completion Rate', value: `${TRAINING_KPIS.completionRate}%`, color: '#10b981' },
    { icon: Star, label: 'Avg Satisfaction', value: `${TRAINING_KPIS.avgSatisfaction}/5`, color: '#c9942b' },
    { icon: GraduationCap, label: 'Certificates Issued', value: TRAINING_KPIS.certificatesIssued.toLocaleString(), color: '#3b6bf5' },
  ];

  return (
    <PhoenixPage title="Advancement Academy" subtitle="Training, certification, and professional development" accentColor="#7c3aed">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="phoenix-card" style={{
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: `${i * 0.08}s`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ background: `${kpi.color}18`, borderRadius: 8, padding: 6, display: 'flex' }}><Icon size={16} color={kpi.color} /></div>
                <span className="pi-label-muted">{kpi.label}</span>
              </div>
              <div className="pi-value">{kpi.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Completions */}
        <div className="phoenix-card">
          <h3 className="pi-section-title">Recent Completions</h3>
          {COMPLETIONS.slice(0, 6).map(comp => (
            <div key={comp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
              <div>
                <div className="pi-label" style={{ fontWeight: 600 }}>{comp.learnerName}</div>
                <div className="pi-body-muted">{comp.courseTitle}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="pi-label" style={{ color: comp.score >= 90 ? '#10b981' : '#c9942b' }}>{comp.score}%</div>
                <div className="pi-caption">{comp.completedDate}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="phoenix-card">
          <h3 className="pi-section-title">Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Browse Course Catalog', href: '/phoenix-intel/training/catalog', color: '#7c3aed' },
              { label: 'Log a Completion', href: '/phoenix-intel/training/progress', color: '#10b981' },
              { label: 'Generate Training Package', href: '/phoenix-intel/training/builder', color: '#3b6bf5' },
              { label: 'Ask AI Tutor', href: '/phoenix-intel/training/ai-tutor', color: '#c9942b' },
            ].map(action => (
              <Link key={action.label} href={action.href} className="pi-label" style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 8,
                background: `${action.color}10`, border: `1px solid ${action.color}30`, textDecoration: 'none',
                color: action.color, transition: 'background 0.2s',
              }}>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Academy Vision */}
      <div className="phoenix-card" style={{ marginBottom: 24, borderLeft: '3px solid #7c3aed' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <MonitorPlay size={18} color="#7c3aed" />
          <h3 className="pi-label" style={{ color: '#7c3aed' }}>Advancement Academy — Asynchronous Learning Platform</h3>
        </div>
        <p className="pi-body-muted" style={{ marginBottom: 12 }}>
          Currently a loss leader for client engagements — but the Academy has strong monetization potential as a standalone product. Nonprofit professionals can purchase courses, earn certifications, and share credentials on LinkedIn.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: MonitorPlay, label: 'Async Courses', desc: 'Self-paced video + exercises, available 24/7', color: '#7c3aed' },
            { icon: Award, label: 'LinkedIn Badges', desc: 'Digital credentials shared to professional profiles', color: '#3b6bf5' },
            { icon: DollarSign, label: 'Revenue Stream', desc: 'Course purchases, subscriptions, org licenses', color: '#10b981' },
            { icon: Globe, label: 'Public Catalog', desc: 'Open enrollment — not limited to Phoenix clients', color: '#c9942b' },
          ].map(v => (
            <div key={v.label} className="pi-metric-tile" style={{
              background: `${v.color}08`, border: `1px solid ${v.color}20`,
            }}>
              <v.icon size={16} color={v.color} style={{ marginBottom: 6 }} />
              <div className="pi-caption" style={{ fontWeight: 700, color: v.color }}>{v.label}</div>
              <div className="pi-caption" style={{ marginTop: 2 }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Potential */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Course Price (avg)', value: '$295', color: '#10b981' },
          { label: 'Org License (annual)', value: '$2,400', color: '#3b6bf5' },
          { label: 'Est. Year 1 Revenue', value: '$120K', color: '#7c3aed' },
          { label: 'Margin', value: '45%', color: '#c9942b' },
        ].map(m => (
          <div key={m.label} className="phoenix-card" style={{ textAlign: 'center' }}>
            <div className="pi-value-sm" style={{ color: m.color }}>{m.value}</div>
            <div className="pi-caption" style={{ marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Popular Courses */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 className="pi-section-title">Popular Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COURSES.slice(0, 4).map(course => (
            <Link key={course.id} href={`/phoenix-intel/training/catalog/${course.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--pi-border)', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div className="pi-label">{course.title}</div>
                <div className="pi-caption" style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <span>{course.format}</span>
                  <span>{course.level}</span>
                  <span>{course.duration}</span>
                  <span>{course.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Content Repository Modernization */}
      <div className="phoenix-card" style={{ marginBottom: 24, borderLeft: '3px solid #3b6bf5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <GraduationCap size={18} color="#3b6bf5" />
          <h3 className="pi-label" style={{ color: '#3b6bf5' }}>Content Repository Modernization — In Progress</h3>
        </div>
        <p className="pi-body-muted" style={{ marginBottom: 12 }}>
          ~13 presentation modules, ~130 content files, ~20 years of accumulated content — all in Dropbox with inconsistent naming, no version control, and no tagging.
          Biggest frustration: inability to find the latest content or formatting when creating new content.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ marginBottom: 12 }}>
          {[
            { label: 'Find Content', rating: '5/5', desc: 'Critical blocker', color: '#ef4444' },
            { label: 'Version Confusion', rating: '4/5', desc: 'Multiple versions', color: '#c9942b' },
            { label: 'Inconsistent Format', rating: '5/5', desc: 'No standard branding', color: '#ef4444' },
            { label: 'Manual Updates', rating: '5/5', desc: 'Cross-module effort', color: '#ef4444' },
          ].map(p => (
            <div key={p.label} className="pi-metric-tile" style={{
              background: `${p.color}08`, border: `1px solid ${p.color}20`,
            }}>
              <div className="pi-value-sm" style={{ color: p.color }}>{p.rating}</div>
              <div className="pi-overline" style={{ marginTop: 2 }}>{p.label}</div>
              <div className="pi-caption">{p.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {['AI-generated drafts', 'Auto-tagging & metadata', 'Duplicate detection', 'Stale content flagging', 'Format conversion', 'Searchable transcripts', 'Catalog descriptions'].map(tag => (
            <span key={tag} className="pi-badge" style={{
              background: '#3b6bf515', color: '#3b6bf5',
            }}>{tag}</span>
          ))}
        </div>
        <div className="pi-caption" style={{ borderTop: '1px solid var(--pi-border-faint)', paddingTop: 8 }}>
          Taxonomy: Track / Module / Topic · Target: August 2026 · SMEs: Richard, Michal, Kelly
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
