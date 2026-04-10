'use client';

import React, { useState } from 'react';
import { usePrizymTheme } from '../ThemeProvider';
import { SCOPING_CATEGORIES, calculateEstimate, type Estimate, type Category } from '@/data/prizym-governance/scoping';

export function ScopingWizard() {
  const { theme } = usePrizymTheme();
  const isDark = theme === 'dark';
  const categories = SCOPING_CATEGORIES;
  const [currentCat, setCurrentCat] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [showResults, setShowResults] = useState(false);

  const C = {
    text: isDark ? '#f1f5f9' : '#0f172a',
    muted: isDark ? '#cbd5e1' : '#334155',
    border: isDark ? '#334155' : '#e2e8f0',
    surface: isDark ? '#1e293b' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    inputBg: isDark ? '#1e293b' : '#ffffff',
  };

  const setAnswer = (qId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const toggleMulti = (qId: string, option: string) => {
    const current = (answers[qId] as string[]) || [];
    const next = current.includes(option) ? current.filter(o => o !== option) : [...current, option];
    setAnswer(qId, next);
  };

  const handleSubmit = () => {
    const result = calculateEstimate(answers);
    setEstimate(result);
    setShowResults(true);
  };

  if (showResults && estimate) {
    return (
      <div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 24 }}>
          Engagement Estimate
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#6366f1' }}>{estimate.complexity}</div>
            <div style={{ fontSize: 14, color: C.muted }}>Complexity Score</div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#059669' }}>{estimate.template}</div>
            <div style={{ fontSize: 14, color: C.muted }}>Recommended Template</div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#d97706' }}>{estimate.staffing.headcount}</div>
            <div style={{ fontSize: 14, color: C.muted }}>Team Size</div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: C.text }}>${(estimate.estimate.totalEstimate / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: 14, color: C.muted }}>Total Estimate</div>
          </div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12 }}>Team Composition</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {estimate.staffing.roles.map(role => (
              <span key={role} style={{
                padding: '6px 14px',
                background: isDark ? '#334155' : '#eef2ff',
                borderRadius: 20,
                fontSize: 14,
                color: C.text,
              }}>
                {role}
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12 }}>Investment Breakdown</h3>
          <div style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>
            Weekly rate: ${estimate.estimate.weeklyRate.toLocaleString()}<br />
            Duration: {estimate.estimate.totalWeeks} weeks<br />
            Weekly hours: {estimate.staffing.weeklyHours}h/week<br />
            <strong style={{ color: C.text }}>Total: ${estimate.estimate.totalEstimate.toLocaleString()}</strong>
          </div>
        </div>

        <button
          onClick={() => { setShowResults(false); setCurrentCat(0); }}
          style={{
            padding: '12px 24px',
            background: isDark ? '#334155' : '#f1f5f9',
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            fontSize: 16,
            color: C.text,
            cursor: 'pointer',
          }}
        >
          Revise Answers
        </button>
      </div>
    );
  }

  const cat = categories[currentCat];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>
          Engagement Scoping
        </h2>
        <p style={{ fontSize: 16, color: C.muted }}>
          {cat.name} ({currentCat + 1} of {categories.length})
        </p>
        <div style={{ height: 6, background: isDark ? '#334155' : '#e2e8f0', borderRadius: 3, marginTop: 12 }}>
          <div style={{
            height: '100%',
            width: `${((currentCat + 1) / categories.length) * 100}%`,
            background: '#6366f1',
            borderRadius: 3,
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      {/* Category nav pills */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 24 }}>
        {categories.map((c2, idx) => (
          <button
            key={c2.id}
            onClick={() => setCurrentCat(idx)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: `1px solid ${idx === currentCat ? '#6366f1' : C.border}`,
              background: idx === currentCat ? '#6366f1' : 'transparent',
              color: idx === currentCat ? '#ffffff' : C.text,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {c2.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {cat.questions.map(q => (
          <div key={q.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 12 }}>{q.text}</div>

            {q.type === 'select' || q.type === 'range' ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {q.options?.map(opt => {
                  const selected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswer(q.id, opt)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        border: `1px solid ${selected ? '#6366f1' : C.border}`,
                        background: selected ? '#6366f1' : C.inputBg,
                        color: selected ? '#ffffff' : C.text,
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : q.type === 'multi-select' ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {q.options?.map(opt => {
                  const selected = ((answers[q.id] as string[]) || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleMulti(q.id, opt)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        border: `1px solid ${selected ? '#6366f1' : C.border}`,
                        background: selected ? '#6366f1' : C.inputBg,
                        color: selected ? '#ffffff' : C.text,
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
        {currentCat > 0 && (
          <button
            onClick={() => setCurrentCat(currentCat - 1)}
            style={{
              padding: '12px 24px',
              background: isDark ? '#334155' : '#f1f5f9',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              color: C.text,
              cursor: 'pointer',
            }}
          >
            Previous
          </button>
        )}
        <button
          onClick={currentCat < categories.length - 1 ? () => setCurrentCat(currentCat + 1) : handleSubmit}
          style={{
            padding: '12px 24px',
            background: '#6366f1',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            flex: 1,
          }}
        >
          {currentCat < categories.length - 1 ? 'Next Category' : 'Generate Estimate'}
        </button>
      </div>
    </div>
  );
}
