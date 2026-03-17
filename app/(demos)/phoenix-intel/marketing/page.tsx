'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { Mail, Calendar, FileText, Users } from 'lucide-react';

const CAMPAIGNS = [
  { name: 'AFP Conference Follow-Up', type: 'Email Drip', status: 'Active', leads: 12, conversions: 3, startDate: '2026-02-20' },
  { name: 'Spring Newsletter', type: 'Newsletter', status: 'Sent', leads: 45, conversions: 2, startDate: '2026-03-01' },
  { name: 'Board Training Webinar Promo', type: 'Email', status: 'Active', leads: 28, conversions: 5, startDate: '2026-03-10' },
  { name: 'Year-End Campaign Toolkit Launch', type: 'Content', status: 'Planned', leads: 0, conversions: 0, startDate: '2026-09-15' },
];

const EVENTS = [
  { name: 'AFP ICON 2026', date: '2026-04-06', location: 'Seattle, WA', status: 'Registered', leads: 0 },
  { name: 'Nonprofit Leadership Summit', date: '2026-05-15', location: 'Chicago, IL', status: 'Speaking', leads: 0 },
  { name: 'Board Fundraising Bootcamp (Public)', date: '2026-06-10', location: 'Virtual', status: 'Open', leads: 8 },
];

const CONTENT_STATS = [
  { type: 'Blog Posts', count: 24, views: 4500, leads: 12 },
  { type: 'Case Studies', count: 6, views: 1200, leads: 8 },
  { type: 'Whitepapers', count: 3, views: 890, leads: 15 },
  { type: 'Webinar Recordings', count: 8, views: 2100, leads: 22 },
];

export default function MarketingPage() {
  const insight = getInsight('marketing');

  return (
    <PhoenixPage title="Marketing" subtitle="Campaigns, events, lead generation, and content performance" accentColor="#3b6bf5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Mail, label: 'Active Campaigns', value: '3', color: '#3b6bf5' },
          { icon: Users, label: 'Total Leads (QTD)', value: '85', color: '#10b981' },
          { icon: Calendar, label: 'Upcoming Events', value: '3', color: '#c9942b' },
          { icon: FileText, label: 'Content Assets', value: '41', color: '#7c3aed' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="phoenix-card">
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
        {/* Campaigns */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Campaigns</h3>
          {CAMPAIGNS.map(c => (
            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--pi-text)' }}>{c.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{c.type} — {c.startDate}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--pi-text-faint)' }}>{c.leads} leads</span>
                <span style={{
                  padding: '3px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700,
                  background: c.status === 'Active' ? '#10b98120' : c.status === 'Sent' ? '#3b6bf520' : '#94a3b820',
                  color: c.status === 'Active' ? '#10b981' : c.status === 'Sent' ? '#3b6bf5' : '#94a3b8',
                }}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Events */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Upcoming Events</h3>
          {EVENTS.map(e => (
            <div key={e.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--pi-text)' }}>{e.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{e.date} — {e.location}</div>
              </div>
              <span style={{
                padding: '3px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700,
                background: '#c9942b20', color: '#c9942b',
              }}>
                {e.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Stats */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Content Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CONTENT_STATS.map(stat => (
            <div key={stat.type} style={{ textAlign: 'center', padding: 12, background: 'var(--pi-bg)', borderRadius: 8 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', fontWeight: 600, marginBottom: 6 }}>{stat.type}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--pi-text)' }}>{stat.count}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-faint)', marginTop: 4 }}>{stat.views.toLocaleString()} views — {stat.leads} leads</div>
            </div>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
