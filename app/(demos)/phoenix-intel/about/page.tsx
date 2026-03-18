'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { HeartHandshake, Target, Users, Award, MapPin, TrendingUp, BarChart3, Repeat, Star, DollarSign } from 'lucide-react';

const PILLARS_6P = [
  { name: 'Purpose', color: '#facc15', description: 'Mission clarity, strategic vision, and organizational alignment' },
  { name: 'People', color: '#7c3aed', description: 'Board, staff, volunteers, and donor community development' },
  { name: 'Process', color: '#2563eb', description: 'Systems, workflows, technology, and operational infrastructure' },
  { name: 'Practice', color: '#c026d3', description: 'Fundraising methodologies, stewardship, and cultivation programs' },
  { name: 'Pipeline', color: '#db2777', description: 'Prospect identification, cultivation pipeline, and deal flow' },
  { name: 'Profit', color: '#10b981', description: 'Revenue growth, margin optimization, and financial sustainability' },
];

const SERVICES = [
  'Fundraising Program Assessment', 'Capital Campaign Consulting', 'Board Development & Training',
  'Major Gifts Strategy', 'Annual Fund Optimization', 'Planned Giving Programs',
  'Donor Stewardship Design', 'Development Staff Coaching', 'Grant Writing & Strategy',
  'CRM Implementation', 'Interim Development Leadership', 'Feasibility Studies',
  'Strategic Planning', 'Campaign Readiness Assessment',
];

const LEADERSHIP = [
  { name: 'Richard Tollefson', title: 'President', specialty: 'Capital Campaigns & Strategic Planning', note: 'Generates 70-75% of business (down from 92%)' },
  { name: 'Cheryl Tollefson', title: 'COO', specialty: 'Operations & Finance', note: 'Oversees all internal operations' },
  { name: 'Dr. Michal Tyra', title: 'Senior Consultant', specialty: 'Business Development & Client Strategy', note: 'Key BD leader — expanding revenue share' },
];

const FIRM_STATS = [
  { label: 'Team Size', value: '20', sub: 'Mostly independent contractors', icon: Users, color: '#3b6bf5' },
  { label: 'Repeat Business', value: '60%', sub: 'Long-term client relationships', icon: Repeat, color: '#10b981' },
  { label: 'Client Referral Rate', value: '75%+', sub: 'Organic growth engine', icon: TrendingUp, color: '#c9942b' },
  { label: 'Client Satisfaction', value: '98%', sub: 'Survey-based measurement', icon: Star, color: '#7c3aed' },
  { label: 'Typical Project', value: '$100-120K', sub: 'Annual engagement value', icon: DollarSign, color: '#3b6bf5' },
  { label: 'Campaign Range', value: '$100M-3B', sub: 'Higher ed campaigns up to $3B', icon: BarChart3, color: '#ec4899' },
  { label: 'Overhead', value: '20-25%', sub: 'Lean operating model', icon: Target, color: '#10b981' },
  { label: 'Billable Target', value: '1,800h', sub: '~50% of standard 2,080h', icon: Award, color: '#c9942b' },
];

export default function AboutPage() {
  const insight = getInsight('about');

  return (
    <PhoenixPage title="About Phoenix" subtitle="The Phoenix Philanthropy Group — Empowering Nonprofits to Thrive" accentColor="#3b6bf5">
      {/* Mission */}
      <div className="phoenix-card" style={{ marginBottom: 20, borderTop: '3px solid var(--pi-sapphire)' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <HeartHandshake size={32} color="var(--pi-sapphire)" style={{ flexShrink: 0, marginTop: 4 }} />
          <div>
            <h2 className="pi-subheading">Our Mission</h2>
            <p className="pi-body" style={{ color: 'var(--pi-text-secondary)', marginTop: 4 }}>
              We partner with nonprofit organizations and educational institutions to build sustainable fundraising programs, strengthen board engagement, and create lasting donor relationships. Our data-driven approach combines deep sector expertise with advanced analytics to deliver measurable results.
            </p>
          </div>
        </div>
      </div>

      {/* Market Position */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 className="pi-section-title">Market Position</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div style={{ padding: '12px 14px', borderRadius: 8, background: '#3b6bf508', borderLeft: '3px solid #3b6bf5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <MapPin size={14} color="#3b6bf5" />
              <span className="pi-label" style={{ color: '#3b6bf5' }}>Geographic Focus</span>
            </div>
            <p className="pi-caption" style={{ margin: 0 }}>National &amp; international operations. Dominant in Southern California and Arizona markets.</p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 8, background: '#10b98108', borderLeft: '3px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Target size={14} color="#10b981" />
              <span className="pi-label" style={{ color: '#10b981' }}>Primary Verticals</span>
            </div>
            <p className="pi-caption" style={{ margin: 0 }}>Higher education (50% of work), human services, faith-based organizations, healthcare nonprofits.</p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 8, background: '#c9942b08', borderLeft: '3px solid #c9942b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <DollarSign size={14} color="#c9942b" />
              <span className="pi-label" style={{ color: '#c9942b' }}>Client Profile</span>
            </div>
            <p className="pi-caption" style={{ margin: 0 }}>Organizations with $15-50M operating budgets. Engagements run 5-7 years for campaign work.</p>
          </div>
        </div>
      </div>

      {/* Firm Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {FIRM_STATS.map(s => (
          <div key={s.label} className="phoenix-card" style={{ textAlign: 'center', padding: '14px 10px' }}>
            <s.icon size={18} color={s.color} style={{ margin: '0 auto 6px' }} />
            <div className="pi-value" style={{ fontSize: '1.3rem' }}>{s.value}</div>
            <div className="pi-caption" style={{ fontWeight: 700, color: s.color, marginTop: 2 }}>{s.label}</div>
            <div className="pi-overline" style={{ textTransform: 'none', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Team Demographics */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 className="pi-section-title" style={{ marginBottom: 8 }}>Team Structure</h3>
        <p className="pi-body-muted" style={{ marginBottom: 12 }}>
          20-person firm of mostly independent contractors — post-retirement professionals in their 60s-70s with deep sector expertise. Consultants work approximately 50% time (1,800 billable hours annually). Technology must be extremely user-friendly given consultant demographics.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LEADERSHIP.map(m => (
            <div key={m.name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 12px', borderRadius: 8,
              background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))',
              border: '1px solid var(--pi-border-faint)',
            }}>
              <div>
                <div className="pi-label">{m.name}</div>
                <div className="pi-body-muted" style={{ marginTop: 2 }}>{m.title} — {m.specialty}</div>
              </div>
              <div className="pi-caption" style={{ textAlign: 'right', maxWidth: 200 }}>{m.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing Model */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 className="pi-section-title" style={{ marginBottom: 8 }}>Engagement & Billing Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { phase: 'Early Phase', billing: '$200-250K/yr', desc: 'Campaign planning, feasibility, board engagement' },
            { phase: 'Active Phase', billing: '$100-120K/yr', desc: 'Ongoing campaign management, stewardship' },
            { phase: 'Campaign Value', billing: '$100M-3B', desc: 'Higher ed campaigns can reach $2.5-3B' },
          ].map(p => (
            <div key={p.phase} style={{
              padding: '12px 14px', borderRadius: 8,
              background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))',
              border: '1px solid var(--pi-border-faint)',
            }}>
              <div className="pi-label" style={{ color: '#3b6bf5', marginBottom: 4 }}>{p.phase}</div>
              <div className="pi-subheading">{p.billing}</div>
              <div className="pi-caption" style={{ marginTop: 4 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <p className="pi-caption" style={{ marginTop: 10 }}>
          Hourly rates billed monthly. Multiple contract types available. Long-term engagements typically 5-7 years for campaign work.
        </p>
      </div>

      {/* UX Design Constraint */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', marginBottom: 20,
        borderRadius: 8, background: '#c9942b08', border: '1px solid #c9942b20',
      }}>
        <Users size={18} color="#c9942b" style={{ flexShrink: 0 }} />
        <div>
          <span className="pi-label" style={{ color: '#c9942b' }}>UX Design Constraint: </span>
          <span className="pi-body-muted">
            Consultants are post-retirement professionals (60s-70s) working part-time. All technology must prioritize simplicity — large click targets, minimal steps, clear labels, no training required. This drives every product design decision.
          </span>
        </div>
      </div>

      {/* 6P Framework */}
      <div className="mb-8">
        <h2 className="pi-subheading" style={{ marginBottom: 12 }}>The 6P Framework</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PILLARS_6P.map(p => (
            <div key={p.name} className="phoenix-card" style={{ borderTop: `3px solid ${p.color}`, textAlign: 'center', padding: 16 }}>
              <div className="pi-subheading" style={{ color: p.color, marginBottom: 6 }}>{p.name}</div>
              <div className="pi-caption" style={{ lineHeight: 1.4 }}>{p.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Target size={18} color="var(--pi-sapphire)" />
          <h3 className="pi-section-title" style={{ marginBottom: 0 }}>Services</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SERVICES.map(s => (
            <span key={s} className="pi-badge" style={{ padding: '6px 12px', background: 'var(--pi-sapphire-bg)', color: 'var(--pi-sapphire)' }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
