'use client';

import Link from 'next/link';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { ASSESSMENT_TEMPLATES, ASSESSMENT_RESULTS } from '@/data/phoenix-intel/assessment-data';
import { ClipboardCheck } from 'lucide-react';

const MATURITY_COLORS: Record<string, string> = {
  Emerging: '#ef4444', Developing: '#c9942b', Established: '#3b6bf5', Advanced: '#10b981', Leading: '#059669',
};

export default function AssessmentsPage() {
  const insight = getInsight('assessments');

  return (
    <PhoenixPage title="Assessments" subtitle={`5 diagnostic tools — ${ASSESSMENT_RESULTS.length} completed assessments`} accentColor="#10b981">
      {/* Assessment Templates */}
      <div className="mb-8">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 12 }}>TPPG Diagnostic Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASSESSMENT_TEMPLATES.map(template => (
            <div key={template.id} className="phoenix-card" style={{ borderTop: '3px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <ClipboardCheck size={18} color="#10b981" />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--pi-text)' }}>{template.name}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--pi-text-muted)', marginBottom: 12, lineHeight: 1.5 }}>{template.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {template.dimensions.map(d => (
                  <span key={d} style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600, background: 'var(--pi-sapphire-bg)', color: 'var(--pi-sapphire)' }}>
                    {d}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--pi-text-faint)', paddingTop: 8, borderTop: '1px solid var(--pi-border-faint)' }}>
                <span>{template.questionCount} questions</span>
                <span>{template.duration}</span>
                <span>{template.completedCount} completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Results */}
      <div className="mb-8">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 12 }}>Recent Assessment Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ASSESSMENT_RESULTS.slice(0, 8).map(result => (
            <Link key={result.id} href={`/phoenix-intel/assessments/${result.id}`} style={{ textDecoration: 'none' }}>
              <div className="phoenix-card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pi-text)' }}>{result.clientName}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--pi-text-muted)' }}>{result.templateName}</div>
                  </div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700,
                    background: `${MATURITY_COLORS[result.maturityLevel]}20`, color: MATURITY_COLORS[result.maturityLevel],
                  }}>
                    {result.maturityLevel}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pi-text)' }}>{result.overallScore}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--pi-text-faint)' }}>/ {result.maxScore}</div>
                </div>
                {/* Mini radar-ish display */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {result.dimensionScores.map(d => {
                    const pct = (d.score / d.max) * 100;
                    return (
                      <div key={d.dimension} style={{ flex: '1 1 45%', minWidth: 100 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
                          <span style={{ color: 'var(--pi-text-faint)' }}>{d.dimension.slice(0, 15)}</span>
                          <span style={{ fontWeight: 700, color: 'var(--pi-text-muted)' }}>{d.score}</span>
                        </div>
                        <div style={{ height: 4, background: 'var(--pi-border-faint)', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: '#10b981', borderRadius: 2 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-faint)', marginTop: 8 }}>Completed: {result.completedDate}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
