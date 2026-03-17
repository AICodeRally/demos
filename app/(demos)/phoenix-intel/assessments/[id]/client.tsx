'use client';

import { use } from 'react';
import Link from 'next/link';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { ASSESSMENT_RESULTS, AI_INTERPRETATIONS, BENCHMARK_DATA, getAssessmentRoadmap } from '@/data/phoenix-intel/assessment-data';
import { ArrowLeft } from 'lucide-react';

const MATURITY_COLORS: Record<string, string> = {
  Emerging: '#ef4444', Developing: '#c9942b', Established: '#3b6bf5', Advanced: '#10b981', Leading: '#059669',
};

export default function AssessmentDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const result = ASSESSMENT_RESULTS.find(r => r.id === id) ?? ASSESSMENT_RESULTS[0];
  const interpretation = AI_INTERPRETATIONS[result.id];
  const roadmap = getAssessmentRoadmap(result.id);

  // Simple radar chart using SVG
  const dims = result.dimensionScores;
  const angleStep = (2 * Math.PI) / dims.length;
  const cx = 120, cy = 120, maxR = 90;

  const radarPoints = dims.map((d, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = (d.score / d.max) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const radarPath = radarPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <PhoenixPage title={result.clientName} subtitle={`${result.templateName} — Score: ${result.overallScore}/${result.maxScore}`} accentColor={MATURITY_COLORS[result.maturityLevel]}>
      <Link href="/phoenix-intel/assessments" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--pi-sapphire)', textDecoration: 'none', marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Assessments
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Radar Chart */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Dimension Scores</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width={240} height={240} viewBox="0 0 240 240">
              {/* Grid rings */}
              {[25, 50, 75, 100].map(pct => {
                const r = (pct / 100) * maxR;
                return <circle key={pct} cx={cx} cy={cy} r={r} fill="none" stroke="var(--pi-border)" strokeWidth={0.5} />;
              })}
              {/* Axis lines */}
              {dims.map((_, i) => {
                const angle = angleStep * i - Math.PI / 2;
                return <line key={i} x1={cx} y1={cy} x2={cx + maxR * Math.cos(angle)} y2={cy + maxR * Math.sin(angle)} stroke="var(--pi-border)" strokeWidth={0.5} />;
              })}
              {/* Data polygon */}
              <path d={radarPath} fill="rgba(59,107,245,0.15)" stroke="#3b6bf5" strokeWidth={2} />
              {/* Data points */}
              {radarPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={4} fill="#3b6bf5" />
              ))}
              {/* Labels */}
              {dims.map((d, i) => {
                const angle = angleStep * i - Math.PI / 2;
                const labelR = maxR + 18;
                const lx = cx + labelR * Math.cos(angle);
                const ly = cy + labelR * Math.sin(angle);
                return (
                  <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="var(--pi-text-muted)">
                    {d.dimension.split(' ')[0]}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Scores table + benchmark */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Scores vs Benchmark</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dims.map(d => {
              const benchmark = BENCHMARK_DATA[d.dimension];
              const benchmarkVal = benchmark ? benchmark[result.maturityLevel.toLowerCase() as keyof typeof benchmark] : 0;
              return (
                <div key={d.dimension}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--pi-text-secondary)', fontWeight: 600 }}>{d.dimension}</span>
                    <span style={{ fontWeight: 700, color: 'var(--pi-text)' }}>{d.score}/{d.max}</span>
                  </div>
                  <div style={{ position: 'relative', height: 8, background: 'var(--pi-border-faint)', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${(d.score / d.max) * 100}%`, background: '#3b6bf5', borderRadius: 4 }} />
                    {benchmarkVal > 0 && (
                      <div style={{
                        position: 'absolute', top: -2, left: `${benchmarkVal}%`, width: 2, height: 12,
                        background: '#c9942b', borderRadius: 1,
                      }} title={`Benchmark: ${benchmarkVal}`} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-faint)', marginTop: 2, textAlign: 'right' }}>
                    Benchmark ({result.maturityLevel}): {benchmarkVal}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Interpretation */}
      {interpretation && (
        <div style={{ marginBottom: 20 }}>
          <AIInsightCard label="AI Assessment Interpretation">{interpretation}</AIInsightCard>
        </div>
      )}

      {/* 12-month Roadmap */}
      <div className="phoenix-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>12-Month Improvement Roadmap</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {roadmap.map(item => {
            const priorityColor = item.priority === 'high' ? '#ef4444' : item.priority === 'medium' ? '#c9942b' : '#94a3b8';
            return (
              <div key={item.month} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--pi-sapphire-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: 'var(--pi-sapphire)', flexShrink: 0 }}>
                  M{item.month}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', color: 'var(--pi-text-secondary)' }}>{item.action}</div>
                </div>
                <span style={{
                  padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700,
                  background: `${priorityColor}20`, color: priorityColor, flexShrink: 0,
                }}>
                  {item.priority}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </PhoenixPage>
  );
}
