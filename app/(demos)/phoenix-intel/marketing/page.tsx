'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { Mail, Calendar, FileText, Users, Database, Globe, ArrowRight, Send } from 'lucide-react';

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

const CC_LISTS = [
  { name: "President's Corner", subscribers: 1240, description: 'Bi-monthly article from Richard', openRate: '34%' },
  { name: 'CASE', subscribers: 680, description: 'Higher ed — Case District VII Annual Conference attendees', openRate: '28%' },
  { name: 'Full Client List', subscribers: 2100, description: 'Quarterly newsletters, webinar announcements, team updates, year-end messages', openRate: '31%' },
  { name: 'Giving USA — Phoenix', subscribers: 320, description: 'Location-specific: Phoenix metro area contacts', openRate: '26%' },
  { name: 'Giving USA — San Diego', subscribers: 285, description: 'Location-specific: San Diego area contacts', openRate: '29%' },
  { name: 'Giving USA — Long Beach', subscribers: 195, description: 'Location-specific: Long Beach area contacts', openRate: '24%' },
  { name: 'Giving USA — Tucson', subscribers: 160, description: 'Location-specific: Tucson area contacts', openRate: '22%' },
];

export default function MarketingPage() {
  const insight = getInsight('marketing');

  return (
    <PhoenixPage title="Marketing & Communications" subtitle="Campaigns, Constant Contact lists, website funnel, events, and thought leadership" accentColor="#ec4899">
      {/* Marketing Team & Vendors */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 8 }}>Marketing Operations</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 12 }}>
          New role: Kris Jacober (Marketing &amp; Communications Consultant) now leads brand presence, digital assets, newsletter calendar, and speaking logistics — previously scattered across Executive Coordinator and Director of Client Services.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Kris Jacober', desc: 'Marketing lead — website (Pixa), newsletters, social, speaking events', color: '#ec4899' },
            { label: 'Pixa (Vendor)', desc: 'Website maintenance, email templates, social media drafts', color: '#3b6bf5' },
            { label: 'Constant Contact', desc: '7 audience lists, quarterly newsletter, President\'s Corner', color: '#10b981' },
            { label: 'Annual Calendar', desc: 'Newsletter, President\'s Corner (bi-monthly), social posts, event promos', color: '#c9942b' },
          ].map(m => (
            <div key={m.label} style={{
              padding: '10px 12px', borderRadius: 8,
              background: `${m.color}08`, border: `1px solid ${m.color}20`,
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: m.color }}>{m.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SWOT: Marketing Weakness */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 16,
        borderRadius: 8, background: '#ef444408', border: '1px solid #ef444420', fontSize: '0.85rem', color: 'var(--pi-text-muted)',
      }}>
        <Mail size={14} color="#ef4444" style={{ flexShrink: 0 }} />
        <span>
          <strong style={{ color: '#ef4444' }}>SWOT weakness:</strong> No active marketing initiatives until Kris&apos;s hire. Outdated website and overpriced direct mail vendor with messy listserv. Digital marketing strategy now in development.
        </span>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

      {/* Ecosystem Flow Diagram */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 4 }}>Marketing Ecosystem</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 16 }}>Current data flow: Website &rarr; Knack (NAC) &rarr; Constant Contact &rarr; Audience Lists</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Website */}
          <div style={{ padding: '12px 16px', borderRadius: 10, background: '#3b6bf515', border: '1px solid #3b6bf530', textAlign: 'center', minWidth: 140 }}>
            <Globe size={20} color="#3b6bf5" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pi-text)' }}>Phoenix Website</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-faint)', marginTop: 4 }}>3 entry points:</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--pi-text-muted)' }}>Contact Us, Webinar, Newsletter</div>
          </div>
          <ArrowRight size={16} color="var(--pi-text-faint)" />
          {/* Knack */}
          <div style={{ padding: '12px 16px', borderRadius: 10, background: '#c9942b15', border: '1px solid #c9942b30', textAlign: 'center', minWidth: 160 }}>
            <Database size={20} color="#c9942b" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pi-text)' }}>Knack (NAC)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-faint)', marginTop: 4 }}>3,940 records</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--pi-text-muted)' }}>3,385 individuals · 342 orgs</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--pi-text-muted)' }}>22 marketing categories</div>
          </div>
          <ArrowRight size={16} color="var(--pi-text-faint)" />
          {/* Constant Contact */}
          <div style={{ padding: '12px 16px', borderRadius: 10, background: '#10b98115', border: '1px solid #10b98130', textAlign: 'center', minWidth: 160 }}>
            <Send size={20} color="#10b981" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pi-text)' }}>Constant Contact</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-faint)', marginTop: 4 }}>7 audience lists</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--pi-text-muted)' }}>Natalie extracts from Knack</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--pi-text-muted)' }}>Unsubs/bounces sync back</div>
          </div>
          <ArrowRight size={16} color="var(--pi-text-faint)" />
          {/* Outlook */}
          <div style={{ padding: '12px 16px', borderRadius: 10, background: '#7c3aed15', border: '1px solid #7c3aed30', textAlign: 'center', minWidth: 140 }}>
            <Mail size={20} color="#7c3aed" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pi-text)' }}>Outlook</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-faint)', marginTop: 4 }}>2 accounts:</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--pi-text-muted)' }}>Richard (personal)</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--pi-text-muted)' }}>Phoenix Org</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          {['Proposals (Kelly)', 'Client Meetings / BD (All)', 'Webinars (Kris)', 'Ad-hoc (All)'].map(item => (
            <span key={item} style={{
              padding: '4px 12px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600,
              background: 'var(--pi-surface-alt, rgba(255,255,255,0.05))', color: 'var(--pi-text-muted)',
              border: '1px solid var(--pi-border-faint)',
            }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Constant Contact Lists */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 4 }}>Constant Contact Audience Lists</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 16 }}>
          {CC_LISTS.reduce((s, l) => s + l.subscribers, 0).toLocaleString()} total subscribers across {CC_LISTS.length} lists
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CC_LISTS.map(list => (
            <div key={list.name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 12px', borderRadius: 8,
              background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))',
              border: '1px solid var(--pi-border-faint)',
            }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pi-text)' }}>{list.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-faint)', marginTop: 2 }}>{list.description}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pi-text)' }}>{list.subscribers.toLocaleString()}</div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>{list.openRate} open</div>
              </div>
            </div>
          ))}
        </div>
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

        {/* Events & Thought Leadership */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Events & Thought Leadership</h3>
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
          <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: '#7c3aed10', border: '1px solid #7c3aed20' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7c3aed', marginBottom: 4 }}>Thought Leadership</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', lineHeight: 1.5 }}>
              Published articles, public speaking engagements, and President&apos;s Corner bi-monthly columns drive significant brand awareness and referral pipeline.
            </div>
          </div>
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
