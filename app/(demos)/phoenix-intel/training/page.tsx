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
                <span style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', fontWeight: 600 }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--pi-text)' }}>{kpi.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Completions */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Recent Completions</h3>
          {COMPLETIONS.slice(0, 6).map(comp => (
            <div key={comp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--pi-text)' }}>{comp.learnerName}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)' }}>{comp.courseTitle}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: comp.score >= 90 ? '#10b981' : '#c9942b' }}>{comp.score}%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-faint)' }}>{comp.completedDate}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Browse Course Catalog', href: '/phoenix-intel/training/catalog', color: '#7c3aed' },
              { label: 'Log a Completion', href: '/phoenix-intel/training/progress', color: '#10b981' },
              { label: 'Generate Training Package', href: '/phoenix-intel/training/builder', color: '#3b6bf5' },
              { label: 'Ask AI Tutor', href: '/phoenix-intel/training/ai-tutor', color: '#c9942b' },
            ].map(action => (
              <Link key={action.label} href={action.href} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 8,
                background: `${action.color}10`, border: `1px solid ${action.color}30`, textDecoration: 'none',
                fontSize: '0.95rem', fontWeight: 600, color: action.color, transition: 'background 0.2s',
              }}>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Academy Vision — Monetization & Async Learning */}
      <div className="phoenix-card" style={{ marginBottom: 24, borderLeft: '3px solid #7c3aed' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <MonitorPlay size={18} color="#7c3aed" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7c3aed' }}>Advancement Academy — Asynchronous Learning Platform</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 12 }}>
          Currently a loss leader for client engagements — but the Academy has strong monetization potential as a standalone product. Nonprofit professionals can purchase courses, earn certifications, and share credentials on LinkedIn.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: MonitorPlay, label: 'Async Courses', desc: 'Self-paced video + exercises, available 24/7', color: '#7c3aed' },
            { icon: Award, label: 'LinkedIn Badges', desc: 'Digital credentials shared to professional profiles', color: '#3b6bf5' },
            { icon: DollarSign, label: 'Revenue Stream', desc: 'Course purchases, subscriptions, org licenses', color: '#10b981' },
            { icon: Globe, label: 'Public Catalog', desc: 'Open enrollment — not limited to Phoenix clients', color: '#c9942b' },
          ].map(v => (
            <div key={v.label} style={{
              padding: '10px 12px', borderRadius: 8,
              background: `${v.color}08`, border: `1px solid ${v.color}20`,
            }}>
              <v.icon size={16} color={v.color} style={{ marginBottom: 6 }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: v.color }}>{v.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{v.desc}</div>
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
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-muted)', marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Popular Courses */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Popular Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COURSES.slice(0, 4).map(course => (
            <Link key={course.id} href={`/phoenix-intel/training/catalog/${course.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--pi-border)', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--pi-text)' }}>{course.title}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: '0.8rem', color: 'var(--pi-text-faint)' }}>
                  <span>{course.format}</span>
                  <span>{course.level}</span>
                  <span>{course.duration}</span>
                  <span>⭐ {course.rating}</span>
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
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#3b6bf5' }}>Content Repository Modernization — In Progress</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 12 }}>
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
            <div key={p.label} style={{
              padding: '8px 10px', borderRadius: 6, textAlign: 'center',
              background: `${p.color}08`, border: `1px solid ${p.color}20`,
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: p.color }}>{p.rating}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pi-text-muted)' }}>{p.label}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--pi-text-faint)' }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {['AI-generated drafts', 'Auto-tagging & metadata', 'Duplicate detection', 'Stale content flagging', 'Format conversion', 'Searchable transcripts', 'Catalog descriptions'].map(tag => (
            <span key={tag} style={{
              padding: '3px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700,
              background: '#3b6bf515', color: '#3b6bf5',
            }}>{tag}</span>
          ))}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-faint)', borderTop: '1px solid var(--pi-border-faint)', paddingTop: 8 }}>
          Taxonomy: Track / Module / Topic · Target: August 2026 · SMEs: Richard, Michal, Kelly
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
