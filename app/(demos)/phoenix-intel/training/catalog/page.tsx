'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { COURSES } from '@/data/phoenix-intel/training-data';
import type { CourseCategory, CourseLevel, CourseFormat } from '@/data/phoenix-intel/training-data';
import { Star, Users, Clock } from 'lucide-react';

const LEVEL_COLORS: Record<CourseLevel, string> = { Beginner: '#10b981', Intermediate: '#3b6bf5', Advanced: '#7c3aed' };
const FORMAT_COLORS: Record<CourseFormat, string> = { Workshop: '#c9942b', Seminar: '#3b6bf5', Webinar: '#10b981', Coaching: '#c026d3' };

export default function CatalogPage() {
  const insight = getInsight('training/catalog');
  const [filterCategory, setFilterCategory] = useState<CourseCategory | 'All'>('All');
  const [filterLevel, setFilterLevel] = useState<CourseLevel | 'All'>('All');
  const [filterFormat, setFilterFormat] = useState<CourseFormat | 'All'>('All');

  const categories: CourseCategory[] = ['Fundraising Fundamentals', 'Major Gifts', 'Board Development', 'Campaign Strategy', 'Donor Relations', 'Operations'];
  const levels: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
  const formats: CourseFormat[] = ['Workshop', 'Seminar', 'Webinar', 'Coaching'];

  const filtered = COURSES.filter(c => {
    if (filterCategory !== 'All' && c.category !== filterCategory) return false;
    if (filterLevel !== 'All' && c.level !== filterLevel) return false;
    if (filterFormat !== 'All' && c.format !== filterFormat) return false;
    return true;
  });

  return (
    <PhoenixPage title="Course Catalog" subtitle={`${COURSES.length} courses available`} accentColor="#7c3aed">
      {/* Filters */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <span className="pi-label-muted" style={{ marginRight: 6 }}>Category:</span>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as CourseCategory | 'All')} className="pi-body" style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--pi-border)', background: 'var(--pi-card)', color: 'var(--pi-text)' }}>
              <option value="All">All</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <span className="pi-label-muted" style={{ marginRight: 6 }}>Level:</span>
            {(['All', ...levels] as const).map(l => (
              <button key={l} onClick={() => setFilterLevel(l)} className="pi-body" style={{
                padding: '4px 10px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', border: 'none', marginRight: 4,
                background: filterLevel === l ? (l === 'All' ? 'var(--pi-sapphire)' : LEVEL_COLORS[l]) : 'var(--pi-card)',
                color: filterLevel === l ? '#fff' : 'var(--pi-text-muted)',
              }}>
                {l}
              </button>
            ))}
          </div>
          <div>
            <span className="pi-label-muted" style={{ marginRight: 6 }}>Format:</span>
            {(['All', ...formats] as const).map(f => (
              <button key={f} onClick={() => setFilterFormat(f)} className="pi-body" style={{
                padding: '4px 10px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', border: 'none', marginRight: 4,
                background: filterFormat === f ? (f === 'All' ? 'var(--pi-sapphire)' : FORMAT_COLORS[f]) : 'var(--pi-card)',
                color: filterFormat === f ? '#fff' : 'var(--pi-text-muted)',
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filtered.map(course => (
          <Link key={course.id} href={`/phoenix-intel/training/catalog/${course.id}`} style={{ textDecoration: 'none' }}>
            <div className="phoenix-card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div className="pi-label">{course.title}</div>
                  <div className="pi-body-muted" style={{ marginTop: 4 }}>{course.category} — {course.instructor}</div>
                </div>
              </div>
              <p className="pi-body-muted" style={{ marginBottom: 10, lineHeight: 1.5 }}>{course.description}</p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <span className="pi-badge" style={{ background: `${LEVEL_COLORS[course.level]}20`, color: LEVEL_COLORS[course.level] }}>
                  {course.level}
                </span>
                <span className="pi-badge" style={{ background: `${FORMAT_COLORS[course.format]}20`, color: FORMAT_COLORS[course.format] }}>
                  {course.format}
                </span>
              </div>
              <div className="pi-caption" style={{ display: 'flex', gap: 12, paddingTop: 8, borderTop: '1px solid var(--pi-border-faint)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} /> {course.duration}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Users size={10} /> {course.enrollmentCount}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Star size={10} /> {course.rating}</span>
                <span>{course.modules.length} modules</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
