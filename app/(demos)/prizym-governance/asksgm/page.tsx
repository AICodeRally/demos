'use client';

import { useState, useEffect } from 'react';
import { AskSGMChat } from '@/components/demos/prizym-governance/ai/AskSGMChat';
import { BookOpen, Gavel, Scale, Eye, Sparkles, MessageSquare } from 'lucide-react';

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
    color: 'var(--pg-design-bright)',
    icon: BookOpen,
    prompts: [
      'Explain ASC 606 performance obligations for a SaaS + implementation bundle.',
      'Draft contract clause language to separate onboarding as a distinct PO.',
      'How should I calculate pay mix ratio for a quota-crushing enterprise AE?',
    ],
  },
  {
    quadrant: 'operate',
    title: 'Operate',
    color: 'var(--pg-operate-bright)',
    icon: Gavel,
    prompts: [
      'Which approvals are pending my review this week?',
      'Summarize the last 3 CRB decisions and their rationale.',
      'Draft an SGCC meeting agenda for next week based on open items.',
    ],
  },
  {
    quadrant: 'dispute',
    title: 'Dispute',
    color: 'var(--pg-dispute-bright)',
    icon: Scale,
    prompts: [
      'What is the standard escalation path for a crediting dispute?',
      'Summarize the open high-priority dispute cases and their status.',
      'What precedent decisions exist for clawback force majeure claims?',
    ],
  },
  {
    quadrant: 'oversee',
    title: 'Oversee',
    color: 'var(--pg-oversee-bright)',
    icon: Eye,
    prompts: [
      'Show me SOX controls that are currently at risk.',
      'What is our current compliance score and trend?',
      'Generate a Q1 governance executive summary.',
    ],
  },
];

const RECENT_QUERIES = [
  'Explain ASC 606 five-step model',
  'Q1 windfall approvals pending review',
  'SOX-003 month-end cut-off evidence',
  'Territory merge quota adjustment precedent',
];

const KNOWLEDGE_STATS = [
  { label: '88 SGM checkpoints indexed' },
  { label: '21 SCPs + 4 ASC 606 policies' },
  { label: '8 pending approvals in queue' },
  { label: '6 dispute cases tracked' },
  { label: '12 compliance controls monitored' },
  { label: '9 prebuilt reports available' },
];

export default function AskSGMWorkspacePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="pg-icon-bubble pg-icon-bubble-lg" style={{ borderColor: 'var(--pg-oversee-bright)' }}>
            <Sparkles size={22} color="var(--pg-oversee-bright)" strokeWidth={2.4} />
          </div>
          AskSGM Workspace
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45, marginLeft: 58 }}>
          Full-page AI assistant — ask questions about your governance program, draft responses, or generate analysis.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
          gap: 16,
          flex: 1,
          minHeight: 0,
        }}
        className="pg-asksgm-grid"
      >
        {/* Left: live chat */}
        <div className="pg-card-elevated" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <AskSGMChat fullHeight />
        </div>

        {/* Right: prompts + recent + knowledge */}
        <aside
          className="pg-scroll"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            minHeight: 0,
            overflowY: 'auto',
            paddingRight: 6,
          }}
        >
          {/* Suggested prompts by quadrant */}
          <div className="pg-card-elevated" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Suggested Prompts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PROMPT_GROUPS.map((group, gi) => {
                const Icon = group.icon;
                return (
                  <div
                    key={group.quadrant}
                    style={{
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateY(0)' : 'translateY(6px)',
                      transition: 'all 0.4s ease',
                      transitionDelay: `${0.15 + gi * 0.06}s`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div className="pg-icon-bubble pg-icon-bubble-sm" style={{ borderColor: group.color }}>
                        <Icon size={15} color={group.color} strokeWidth={2.4} />
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 800, color: group.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group.title}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {group.prompts.map((p, pi) => (
                        <button
                          key={pi}
                          style={{
                            textAlign: 'left',
                            padding: '9px 12px',
                            borderRadius: 10,
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            borderLeft: `4px solid ${group.color}`,
                            color: '#ffffff',
                            fontSize: 14,
                            lineHeight: 1.45,
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(ev) => { ev.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
                          onMouseLeave={(ev) => { ev.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent queries */}
          <div className="pg-card-elevated" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Recent Queries
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {RECENT_QUERIES.map((q, i) => (
                <button
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    textAlign: 'left', width: '100%',
                    padding: '9px 12px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: '#ffffff',
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(ev) => { ev.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={(ev) => { ev.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                >
                  <MessageSquare size={14} color="var(--pg-cyan-bright)" strokeWidth={2.4} /> {q}
                </button>
              ))}
            </div>
          </div>

          {/* Knowledge context */}
          <div className="pg-card-elevated" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Knowledge Context
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: '#ffffff' }}>
              {KNOWLEDGE_STATS.map((s) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--pg-success-bright)', fontWeight: 800 }}>•</span>
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
