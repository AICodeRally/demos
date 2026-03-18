'use client';

import { useState } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { COMPLETIONS, COURSES } from '@/data/phoenix-intel/training-data';
import { CheckCircle, Search } from 'lucide-react';

export default function ProgressPage() {
  const insight = getInsight('training/progress');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filtered = COMPLETIONS.filter(c =>
    !search || c.learnerName.toLowerCase().includes(search.toLowerCase()) || c.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PhoenixPage title="Training Progress" subtitle="Completion tracking and certification log" accentColor="#7c3aed">
      {/* Log completion button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--pi-card)', borderRadius: 8, border: '1px solid var(--pi-border)', flex: 1, maxWidth: 400 }}>
          <Search size={14} color="var(--pi-text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by learner or course..." className="pi-body" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--pi-text)' }} />
        </div>
        <button onClick={() => setShowForm(!showForm)} className="pi-label" style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#7c3aed', color: '#fff', cursor: 'pointer' }}>
          + Log Completion
        </button>
      </div>

      {/* Quick form */}
      {showForm && (
        <div className="phoenix-card" style={{ marginBottom: 20 }}>
          <h3 className="pi-section-title">Log a Completion</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="pi-label-muted" style={{ display: 'block', marginBottom: 4 }}>Learner Name</label>
              <input placeholder="Full name" className="pi-body" style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--pi-border)', background: 'var(--pi-bg)', color: 'var(--pi-text)' }} />
            </div>
            <div>
              <label className="pi-label-muted" style={{ display: 'block', marginBottom: 4 }}>Course</label>
              <select className="pi-body" style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--pi-border)', background: 'var(--pi-bg)', color: 'var(--pi-text)' }}>
                {COURSES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="pi-label-muted" style={{ display: 'block', marginBottom: 4 }}>Score (%)</label>
              <input type="number" placeholder="0-100" className="pi-body" style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--pi-border)', background: 'var(--pi-bg)', color: 'var(--pi-text)' }} />
            </div>
          </div>
          <button className="pi-label" style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer' }}>
            Save Completion
          </button>
        </div>
      )}

      {/* Completions table */}
      <div className="phoenix-card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--pi-border)' }}>
                {['Learner', 'Organization', 'Course', 'Score', 'Date', 'Certificate'].map(h => (
                  <th key={h} className="pi-overline" style={{ textAlign: 'left', padding: '10px 8px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(comp => (
                <tr key={comp.id} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                  <td className="pi-label" style={{ padding: '10px 8px' }}>{comp.learnerName}</td>
                  <td className="pi-body-muted" style={{ padding: '10px 8px' }}>{comp.learnerOrg}</td>
                  <td className="pi-body-muted" style={{ padding: '10px 8px' }}>{comp.courseTitle}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{ fontWeight: 700, color: comp.score >= 90 ? '#10b981' : comp.score >= 80 ? '#c9942b' : '#ef4444' }}>{comp.score}%</span>
                  </td>
                  <td className="pi-caption" style={{ padding: '10px 8px' }}>{comp.completedDate}</td>
                  <td style={{ padding: '10px 8px' }}>
                    {comp.certificateIssued && <CheckCircle size={16} color="#10b981" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {insight && <div style={{ marginTop: 20 }}><AIInsightCard>{insight.text}</AIInsightCard></div>}
    </PhoenixPage>
  );
}
