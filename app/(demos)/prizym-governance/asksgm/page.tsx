'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { Sparkles, BookOpen, Gavel, Scale, Eye, ArrowRight, Send, MessageSquare } from 'lucide-react';

interface PromptGroup {
  quadrant: 'design' | 'operate' | 'dispute' | 'oversee';
  title: string;
  color: string;
  icon: typeof BookOpen;
  prompts: string[];
}

const PROMPT_GROUPS: PromptGroup[] = [
  {
    quadrant: 'design',
    title: 'Design',
    color: '#06b6d4',
    icon: BookOpen,
    prompts: [
      'Explain ASC 606 performance obligations for a SaaS + implementation bundle.',
      'Draft contract clause language to separate onboarding as a distinct PO.',
      'How should I calculate pay mix ratio for a quota-crushing enterprise AE?',
      'What are the windfall review triggers under SCP-007?',
    ],
  },
  {
    quadrant: 'operate',
    title: 'Operate',
    color: '#3b82f6',
    icon: Gavel,
    prompts: [
      'Which approvals are pending my review this week?',
      'Summarize the last 3 CRB decisions and their rationale.',
      'Draft an SGCC meeting agenda for next week based on open items.',
      'What are the SLA deadlines for approvals in the queue right now?',
    ],
  },
  {
    quadrant: 'dispute',
    title: 'Dispute',
    color: '#6366f1',
    icon: Scale,
    prompts: [
      'What is the standard escalation path for a crediting dispute?',
      'Summarize the open high-priority dispute cases and their status.',
      'Draft a response to a split-credit dispute under SCP-001.',
      'What precedent decisions exist for clawback force majeure claims?',
    ],
  },
  {
    quadrant: 'oversee',
    title: 'Oversee',
    color: '#8b5cf6',
    icon: Eye,
    prompts: [
      'Show me SOX controls that are currently at risk.',
      'What is our current compliance score and trend?',
      'Generate a Q1 governance executive summary.',
      'Which policies need review or update this quarter?',
    ],
  },
];

const RECENT_QUERIES = [
  'Explain ASC 606 five-step model',
  'Q1 windfall approvals pending review',
  'SOX-003 month-end cut-off evidence',
];

export default function AskSGMWorkspacePage() {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <PrizymPage title="AskSGM Workspace" subtitle="Full-page AI assistant for governance questions, analysis, and drafting">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }} className="asksgm-grid">
        {/* Main */}
        <div>
          <div
            className="pg-card-elevated"
            style={{
              padding: 32, marginBottom: 20, textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(139,92,246,0.08))',
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 12px 40px rgba(139,92,246,0.3)',
            }}>
              <Sparkles size={32} style={{ color: '#fff' }} />
            </div>
            <h2 className="pg-heading" style={{ marginBottom: 8 }}>Ask SGM</h2>
            <p className="pg-caption" style={{ marginBottom: 24, maxWidth: 520, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Your governance AI assistant knows your policies, plans, approvals, decisions, and disputes. Ask questions, draft responses, or generate analysis.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); setQuery(''); }}
              style={{ display: 'flex', gap: 10, maxWidth: 640, margin: '0 auto' }}
            >
              <input
                type="text"
                placeholder="Ask anything about your governance program..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  flex: 1, padding: '14px 18px',
                  background: 'var(--pg-card)', border: '1px solid var(--pg-border)', borderRadius: 12,
                  color: 'var(--pg-text)', fontSize: 15,
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '14px 22px',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  border: 'none', borderRadius: 12,
                  color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(139,92,246,0.25)',
                }}
              >
                <Send size={16} /> Ask
              </button>
            </form>
          </div>

          <h3 className="pg-subheading" style={{ marginBottom: 14 }}>Suggested Prompts by Quadrant</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {PROMPT_GROUPS.map((group, gi) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.quadrant}
                  className="pg-card"
                  style={{
                    borderTop: `3px solid ${group.color}`,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'all 0.4s ease',
                    transitionDelay: `${0.2 + gi * 0.08}s`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: `${group.color}18`, border: `1px solid ${group.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={16} style={{ color: group.color }} />
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--pg-text)' }}>{group.title}</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {group.prompts.map((p, pi) => (
                      <button
                        key={pi}
                        onClick={() => setQuery(p)}
                        style={{
                          textAlign: 'left', padding: '8px 10px', borderRadius: 6,
                          background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border-faint)',
                          color: 'var(--pg-text-secondary)', fontSize: 14, lineHeight: 1.45,
                          cursor: 'pointer', transition: 'all 0.15s ease',
                          display: 'flex', alignItems: 'flex-start', gap: 6,
                        }}
                      >
                        <ArrowRight size={12} style={{ color: group.color, flexShrink: 0, marginTop: 2 }} />
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="pg-card" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease', transitionDelay: '0.3s' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Recent Queries
            </h4>
            {RECENT_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuery(q)}
                style={{
                  display: 'block', textAlign: 'left', width: '100%',
                  padding: '8px 10px', borderRadius: 6, marginBottom: 6,
                  background: 'transparent', border: 'none',
                  color: 'var(--pg-text-secondary)', fontSize: 14, cursor: 'pointer',
                }}
              >
                <MessageSquare size={11} style={{ display: 'inline', marginRight: 6 }} /> {q}
              </button>
            ))}
          </div>

          <div className="pg-card" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease', transitionDelay: '0.4s' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Knowledge Context
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--pg-text-muted)' }}>
              <div>• 88 SGM checkpoints indexed</div>
              <div>• 21 SCPs + 4 ASC 606 policies</div>
              <div>• 8 pending approvals in queue</div>
              <div>• 6 dispute cases tracked</div>
              <div>• 12 compliance controls monitored</div>
              <div>• 9 prebuilt reports available</div>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.asksgm-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PrizymPage>
  );
}
