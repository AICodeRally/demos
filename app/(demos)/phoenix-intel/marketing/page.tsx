'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { MetricCardWithIcon } from '@/components/demos/phoenix-intel/MetricCard';
import { Alert } from '@/components/demos/phoenix-intel/Alert';
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
        <h3 className="pi-section-title" style={{ marginBottom: 8 }}>Marketing Operations</h3>
        <p className="pi-body-muted" style={{ marginBottom: 12 }}>
          New role: Kris Jacober (Marketing &amp; Communications Consultant) now leads brand presence, digital assets, newsletter calendar, and speaking logistics — previously scattered across Executive Coordinator and Director of Client Services.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Kris Jacober', desc: 'Marketing lead — website (Pixa), newsletters, social, speaking events', color: '#ec4899' },
            { label: 'Pixa (Vendor)', desc: 'Website maintenance, email templates, social media drafts', color: '#3b6bf5' },
            { label: 'Constant Contact', desc: '7 audience lists, quarterly newsletter, President\'s Corner', color: '#10b981' },
            { label: 'Annual Calendar', desc: 'Newsletter, President\'s Corner (bi-monthly), social posts, event promos', color: '#c9942b' },
          ].map(m => (
            <div key={m.label} className="pi-metric-tile" style={{
              background: `${m.color}08`, border: `1px solid ${m.color}20`,
            }}>
              <div className="pi-caption" style={{ fontWeight: 700, color: m.color }}>{m.label}</div>
              <div className="pi-overline" style={{ textTransform: 'none', marginTop: 2 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SWOT: Marketing Weakness */}
      <Alert variant="danger" icon={Mail}>
        <strong style={{ color: '#ef4444' }}>SWOT weakness:</strong> No active marketing initiatives until Kris&apos;s hire. Outdated website and overpriced direct mail vendor with messy listserv. Digital marketing strategy now in development.
      </Alert>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" role="region" aria-label="Marketing KPIs">
        <MetricCardWithIcon label="Active Campaigns" value="3" icon={Mail} color="#3b6bf5" />
        <MetricCardWithIcon label="Total Leads (QTD)" value="85" icon={Users} color="#10b981" />
        <MetricCardWithIcon label="Upcoming Events" value="3" icon={Calendar} color="#c9942b" />
        <MetricCardWithIcon label="Content Assets" value="41" icon={FileText} color="#7c3aed" />
      </div>

      {/* Ecosystem Flow Diagram */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <h3 className="pi-section-title" style={{ marginBottom: 4 }}>Marketing Ecosystem</h3>
        <p className="pi-body-muted" style={{ marginBottom: 16 }}>Current data flow: Website &rarr; Knack &rarr; Constant Contact &rarr; Audience Lists</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: Globe, label: 'Phoenix Website', color: '#3b6bf5', lines: ['3 entry points:', 'Contact Us, Webinar, Newsletter'] },
            { icon: Database, label: 'Knack', color: '#c9942b', lines: ['2,500-3,000 records', 'Individuals & organizations', 'Marketing categories'] },
            { icon: Send, label: 'Constant Contact', color: '#10b981', lines: ['7 audience lists', 'Natalie extracts from Knack', 'Unsubs/bounces sync back'] },
            { icon: Mail, label: 'Outlook', color: '#7c3aed', lines: ['2 accounts:', 'Richard (personal)', 'Phoenix Org'] },
          ].map((node, i) => {
            const Icon = node.icon;
            return (
              <div key={node.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i > 0 && <ArrowRight size={16} color="var(--pi-text-faint)" />}
                <div style={{ padding: '12px 16px', borderRadius: 10, background: `${node.color}15`, border: `1px solid ${node.color}30`, textAlign: 'center', minWidth: 140 }}>
                  <Icon size={20} color={node.color} style={{ margin: '0 auto 6px' }} />
                  <div className="pi-label">{node.label}</div>
                  {node.lines.map((line, j) => (
                    <div key={j} className="pi-caption" style={{ marginTop: j === 0 ? 4 : 0 }}>{line}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          {['Proposals (Kelly)', 'Client Meetings / BD (All)', 'Webinars (Kris)', 'Ad-hoc (All)'].map(item => (
            <span key={item} className="pi-badge" style={{
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
        <h3 className="pi-section-title" style={{ marginBottom: 4 }}>Constant Contact Audience Lists</h3>
        <p className="pi-body-muted" style={{ marginBottom: 16 }}>
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
                <div className="pi-label">{list.name}</div>
                <div className="pi-caption" style={{ marginTop: 2 }}>{list.description}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                <div className="pi-value-sm">{list.subscribers.toLocaleString()}</div>
                <div className="pi-overline" style={{ color: '#10b981', textTransform: 'none' }}>{list.openRate} open</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Campaigns */}
        <div className="phoenix-card">
          <h3 className="pi-section-title">Campaigns</h3>
          {CAMPAIGNS.map(c => (
            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
              <div>
                <div className="pi-label" style={{ fontWeight: 600 }}>{c.name}</div>
                <div className="pi-body-muted" style={{ marginTop: 2 }}>{c.type} — {c.startDate}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="pi-caption">{c.leads} leads</span>
                <span className="pi-badge" style={{
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
          <h3 className="pi-section-title">Events & Thought Leadership</h3>
          {EVENTS.map(e => (
            <div key={e.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
              <div>
                <div className="pi-label" style={{ fontWeight: 600 }}>{e.name}</div>
                <div className="pi-body-muted" style={{ marginTop: 2 }}>{e.date} — {e.location}</div>
              </div>
              <span className="pi-badge" style={{ background: '#c9942b20', color: '#c9942b' }}>
                {e.status}
              </span>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: '#7c3aed10', border: '1px solid #7c3aed20' }}>
            <div className="pi-label" style={{ color: '#7c3aed', marginBottom: 4 }}>Thought Leadership</div>
            <div className="pi-caption" style={{ lineHeight: 1.5 }}>
              Published articles, public speaking engagements, and President&apos;s Corner bi-monthly columns drive significant brand awareness and referral pipeline.
            </div>
          </div>
        </div>
      </div>

      {/* Content Stats */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 className="pi-section-title">Content Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CONTENT_STATS.map(stat => (
            <div key={stat.type} style={{ textAlign: 'center', padding: 12, background: 'var(--pi-bg)', borderRadius: 8 }}>
              <div className="pi-label-muted" style={{ marginBottom: 6 }}>{stat.type}</div>
              <div className="pi-value-sm">{stat.count}</div>
              <div className="pi-caption" style={{ marginTop: 4 }}>{stat.views.toLocaleString()} views — {stat.leads} leads</div>
            </div>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
