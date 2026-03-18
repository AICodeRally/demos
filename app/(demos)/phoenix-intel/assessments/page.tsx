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
    <PhoenixPage title="Services & Planning" subtitle={`5 diagnostic tools — ${ASSESSMENT_RESULTS.length} completed assessments`} accentColor="#10b981">
      {/* Assessment Templates */}
      <div className="mb-8">
        <h2 className="pi-subheading" style={{ marginBottom: 12 }}>Phoenix Diagnostic Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASSESSMENT_TEMPLATES.map(template => (
            <div key={template.id} className="phoenix-card" style={{ borderTop: '3px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <ClipboardCheck size={18} color="#10b981" />
                <span className="pi-label">{template.name}</span>
              </div>
              <p className="pi-body-muted" style={{ marginBottom: 12, lineHeight: 1.5 }}>{template.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {template.dimensions.map(d => (
                  <span key={d} className="pi-badge" style={{ background: 'var(--pi-sapphire-bg)', color: 'var(--pi-sapphire)' }}>
                    {d}
                  </span>
                ))}
              </div>
              <div className="pi-caption" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--pi-border-faint)' }}>
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
        <h2 className="pi-subheading" style={{ marginBottom: 12 }}>Recent Assessment Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ASSESSMENT_RESULTS.slice(0, 8).map(result => (
            <Link key={result.id} href={`/phoenix-intel/assessments/${result.id}`} style={{ textDecoration: 'none' }}>
              <div className="phoenix-card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div className="pi-label">{result.clientName}</div>
                    <div className="pi-body-muted">{result.templateName}</div>
                  </div>
                  <span className="pi-badge" style={{
                    background: `${MATURITY_COLORS[result.maturityLevel]}20`, color: MATURITY_COLORS[result.maturityLevel],
                  }}>
                    {result.maturityLevel}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div className="pi-value">{result.overallScore}</div>
                  <div className="pi-body" style={{ color: 'var(--pi-text-faint)' }}>/ {result.maxScore}</div>
                </div>
                {/* Mini radar-ish display */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {result.dimensionScores.map(d => {
                    const pct = (d.score / d.max) * 100;
                    return (
                      <div key={d.dimension} style={{ flex: '1 1 45%', minWidth: 100 }}>
                        <div className="pi-overline" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, textTransform: 'none' }}>
                          <span>{d.dimension.slice(0, 15)}</span>
                          <span style={{ fontWeight: 700, color: 'var(--pi-text-muted)' }}>{d.score}</span>
                        </div>
                        <div className="pi-bar-track" style={{ height: 4, borderRadius: 2 }}>
                          <div className="pi-bar-fill" style={{ width: `${pct}%`, background: '#10b981', borderRadius: 2 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pi-caption" style={{ marginTop: 8 }}>Completed: {result.completedDate}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
