'use client';

import { useState } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { KNOWLEDGE_DOCS, CONTENT_TYPE_LABELS, TOPIC_LABELS, SECTOR_LABELS } from '@/data/phoenix-intel/knowledge-data';
import type { ContentType, Topic, Sector } from '@/data/phoenix-intel/knowledge-data';
import { FileText, Download, Search } from 'lucide-react';

const TYPE_COLORS: Record<ContentType, string> = {
  'training-module': '#7c3aed', playbook: '#3b6bf5', assessment: '#10b981', 'case-study': '#c9942b',
  'slide-deck': '#db2777', worksheet: '#6366f1', framework: '#059669', template: '#94a3b8',
};

export default function KnowledgePage() {
  const insight = getInsight('knowledge');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [filterTopic, setFilterTopic] = useState<Topic | 'all'>('all');
  const [filterSector, setFilterSector] = useState<Sector | 'all'>('all');

  const filtered = KNOWLEDGE_DOCS.filter(doc => {
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== 'all' && doc.type !== filterType) return false;
    if (filterTopic !== 'all' && doc.topic !== filterTopic) return false;
    if (filterSector !== 'all' && doc.sector !== filterSector && doc.sector !== 'all') return false;
    return true;
  }).slice(0, 30); // Show first 30

  const types = Object.keys(CONTENT_TYPE_LABELS) as ContentType[];
  const topics = Object.keys(TOPIC_LABELS) as Topic[];
  const sectors = Object.keys(SECTOR_LABELS) as Sector[];

  return (
    <PhoenixPage title="Knowledge Base" subtitle={`${KNOWLEDGE_DOCS.length} resources — ${types.length} types, ${topics.length} topics, ${sectors.length} sectors`} accentColor="#10b981">
      {/* Search + Filters */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 12px', background: 'var(--pi-bg)', borderRadius: 8, border: '1px solid var(--pi-border)' }}>
          <Search size={16} color="var(--pi-text-muted)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search knowledge base..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '0.95rem', color: 'var(--pi-text)' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.875rem' }}>
          <div>
            <span style={{ color: 'var(--pi-text-muted)', fontWeight: 600, marginRight: 6 }}>Type:</span>
            <select value={filterType} onChange={e => setFilterType(e.target.value as ContentType | 'all')} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--pi-border)', background: 'var(--pi-card)', color: 'var(--pi-text)', fontSize: '0.875rem' }}>
              <option value="all">All Types</option>
              {types.map(t => <option key={t} value={t}>{CONTENT_TYPE_LABELS[t]}</option>)}
            </select>
          </div>
          <div>
            <span style={{ color: 'var(--pi-text-muted)', fontWeight: 600, marginRight: 6 }}>Topic:</span>
            <select value={filterTopic} onChange={e => setFilterTopic(e.target.value as Topic | 'all')} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--pi-border)', background: 'var(--pi-card)', color: 'var(--pi-text)', fontSize: '0.875rem' }}>
              <option value="all">All Topics</option>
              {topics.map(t => <option key={t} value={t}>{TOPIC_LABELS[t]}</option>)}
            </select>
          </div>
          <div>
            <span style={{ color: 'var(--pi-text-muted)', fontWeight: 600, marginRight: 6 }}>Sector:</span>
            <select value={filterSector} onChange={e => setFilterSector(e.target.value as Sector | 'all')} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--pi-border)', background: 'var(--pi-card)', color: 'var(--pi-text)', fontSize: '0.875rem' }}>
              <option value="all">All Sectors</option>
              {sectors.map(s => <option key={s} value={s}>{SECTOR_LABELS[s]}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Document list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
        {filtered.map(doc => (
          <div key={doc.id} className="phoenix-card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: 1 }}>
                <FileText size={16} color={TYPE_COLORS[doc.type]} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--pi-text)' }}>{doc.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{doc.summary}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: '0.8rem', fontWeight: 600, background: `${TYPE_COLORS[doc.type]}20`, color: TYPE_COLORS[doc.type] }}>
                      {CONTENT_TYPE_LABELS[doc.type]}
                    </span>
                    <span style={{ padding: '1px 6px', borderRadius: 3, fontSize: '0.8rem', fontWeight: 600, background: 'var(--pi-sapphire-bg)', color: 'var(--pi-sapphire)' }}>
                      {TOPIC_LABELS[doc.topic]}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: 'var(--pi-text-faint)', flexShrink: 0 }}>
                <Download size={12} /> {doc.downloads}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 30 && (
          <p style={{ fontSize: '0.9rem', color: 'var(--pi-text-muted)', textAlign: 'center', padding: 12 }}>
            Showing first 30 of {KNOWLEDGE_DOCS.filter(doc => {
              if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
              if (filterType !== 'all' && doc.type !== filterType) return false;
              if (filterTopic !== 'all' && doc.topic !== filterTopic) return false;
              if (filterSector !== 'all' && doc.sector !== filterSector && doc.sector !== 'all') return false;
              return true;
            }).length} results
          </p>
        )}
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
