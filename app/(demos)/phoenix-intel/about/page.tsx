'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { HeartHandshake, Target, Users, Award } from 'lucide-react';

const PILLARS_6P = [
  { name: 'Purpose', color: '#facc15', description: 'Mission clarity, strategic vision, and organizational alignment' },
  { name: 'People', color: '#7c3aed', description: 'Board, staff, volunteers, and donor community development' },
  { name: 'Process', color: '#3b6bf5', description: 'Systems, workflows, technology, and operational infrastructure' },
  { name: 'Practice', color: '#c026d3', description: 'Fundraising methodologies, stewardship, and cultivation programs' },
  { name: 'Pipeline', color: '#db2777', description: 'Prospect identification, cultivation pipeline, and deal flow' },
  { name: 'Profit', color: '#10b981', description: 'Revenue growth, margin optimization, and financial sustainability' },
];

const SERVICES = [
  'Fundraising Program Assessment', 'Capital Campaign Consulting', 'Board Development & Training',
  'Major Gifts Strategy', 'Annual Fund Optimization', 'Planned Giving Programs',
  'Donor Stewardship Design', 'Development Staff Coaching', 'Grant Writing & Strategy',
  'CRM Implementation', 'Interim Development Leadership',
];

const TEAM = [
  { name: 'Jennifer Blake', title: 'Managing Director', specialty: 'Capital Campaigns', years: 18 },
  { name: 'Marcus Rivera', title: 'Senior Consultant', specialty: 'Board Development', years: 12 },
  { name: 'Sarah Kim', title: 'Senior Consultant', specialty: 'Annual Giving', years: 10 },
  { name: 'Thomas Park', title: 'Consultant', specialty: 'Planned Giving', years: 7 },
  { name: 'Diana Reeves', title: 'Associate Consultant', specialty: 'Donor Research', years: 4 },
  { name: 'Carlos Mendez', title: 'Operations Manager', specialty: 'Project Management', years: 8 },
];

export default function AboutPage() {
  const insight = getInsight('about');

  return (
    <PhoenixPage title="About TPPG" subtitle="The Phoenix Philanthropy Group — Empowering Nonprofits to Thrive" accentColor="#3b6bf5">
      {/* Mission */}
      <div className="phoenix-card" style={{ marginBottom: 20, borderTop: '3px solid var(--pi-sapphire)' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <HeartHandshake size={32} color="var(--pi-sapphire)" />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--pi-text)' }}>Our Mission</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--pi-text-secondary)', marginTop: 4, lineHeight: 1.6 }}>
              We partner with nonprofit organizations to build sustainable fundraising programs, strengthen board engagement, and create lasting donor relationships. Our data-driven approach combines deep sector expertise with advanced analytics to deliver measurable results.
            </p>
          </div>
        </div>
      </div>

      {/* 6P Framework */}
      <div className="mb-8">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 12 }}>The 6P Framework</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PILLARS_6P.map(p => (
            <div key={p.name} className="phoenix-card" style={{ borderTop: `3px solid ${p.color}`, textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: p.color, marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', lineHeight: 1.4 }}>{p.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Services */}
        <div className="phoenix-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Target size={18} color="var(--pi-sapphire)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)' }}>Services</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SERVICES.map(s => (
              <span key={s} style={{ padding: '6px 12px', borderRadius: 6, fontSize: '0.875rem', fontWeight: 600, background: 'var(--pi-sapphire-bg)', color: 'var(--pi-sapphire)' }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="phoenix-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Users size={18} color="var(--pi-gold)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)' }}>Our Team</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TEAM.map(m => (
              <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--pi-text)' }}>{m.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)' }}>{m.title} — {m.specialty}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: 'var(--pi-text-faint)' }}>
                  <Award size={12} /> {m.years}yr
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
