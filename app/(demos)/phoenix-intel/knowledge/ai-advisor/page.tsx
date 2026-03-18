'use client';

import { useState, useRef, useEffect } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { Send, Brain } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SAMPLE_RESPONSES: Record<string, string> = {
  'fundraising': 'Based on Phoenix methodology, effective fundraising programs need 5 key elements: (1) Clear case for support, (2) Engaged board leadership, (3) Robust prospect pipeline, (4) Professional staff capacity, (5) Donor stewardship systems. Our Fundraising Maturity Assessment evaluates all 5 dimensions across 42 questions.',
  'board': 'Board engagement is the #1 predictor of campaign success. Phoenix recommends the "3G" framework: Give, Get, Govern. Every board member should make a personally meaningful gift, actively participate in fundraising, and provide governance oversight. Our Board Engagement Assessment measures 6 dimensions of board effectiveness.',
  'campaign': 'Capital campaign success requires careful preparation. Phoenix\'s Campaign Readiness Assessment evaluates 6 critical dimensions. We recommend a feasibility study before any campaign exceeding $5M. Key indicators: 60%+ of goal should be achievable from top 15 donors, board must demonstrate 100% giving participation.',
  'donor': 'Donor retention is more cost-effective than acquisition. Phoenix benchmarks show first-year donor retention averages 23% — organizations achieving 40%+ have formal stewardship programs. Key strategies: 48-hour acknowledgment, personalized impact reports, tiered stewardship matrix, and monthly giving programs.',
  'major': 'Major gifts typically represent 80% of philanthropic revenue from 20% of donors. Phoenix recommends a portfolio-based approach: each major gift officer manages 120-150 prospects with 12-15 monthly meaningful contacts. Our Major Gift Officer Certification program covers moves management, prospect research, and closing strategies.',
  'default': 'That\'s a great question! As Phoenix\'s AI Advisor, I draw from our comprehensive knowledge base of 156 resources and 15+ years of consulting experience. I can help with fundraising strategy, board engagement, campaign planning, donor stewardship, assessment interpretation, and nonprofit governance. Could you share more about your specific situation so I can provide tailored guidance?',
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('fundrais') || lower.includes('fund raising')) return SAMPLE_RESPONSES.fundraising;
  if (lower.includes('board')) return SAMPLE_RESPONSES.board;
  if (lower.includes('campaign') || lower.includes('capital')) return SAMPLE_RESPONSES.campaign;
  if (lower.includes('donor') || lower.includes('steward') || lower.includes('retain')) return SAMPLE_RESPONSES.donor;
  if (lower.includes('major gift') || lower.includes('major donor')) return SAMPLE_RESPONSES.major;
  return SAMPLE_RESPONSES.default;
}

export default function AIAdvisorPage() {
  const insight = getInsight('knowledge/ai-advisor');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(userMsg.content);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const suggestions = [
    'How do I improve donor retention?',
    'What makes a board fundraising-ready?',
    'When should we launch a capital campaign?',
    'How do I build a major gifts program?',
  ];

  return (
    <PhoenixPage title="AI Advisor" subtitle="Ask questions about fundraising, strategy, and Phoenix methodology" accentColor="#10b981">
      {insight && <div style={{ marginBottom: 16 }}><AIInsightCard label={insight.label}>{insight.text}</AIInsightCard></div>}

      {/* Chat area */}
      <div className="phoenix-card" style={{ minHeight: 400, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Brain size={48} color="var(--pi-sapphire)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--pi-text-muted)', marginBottom: 16 }}>Ask the AI Advisor about fundraising, board engagement, campaigns, or any advancement topic.</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); }}
                    style={{
                      padding: '8px 14px', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                      border: '1px solid var(--pi-border)', background: 'var(--pi-card)', color: 'var(--pi-text-secondary)',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '80%', padding: '10px 14px', borderRadius: 12,
                background: msg.role === 'user' ? 'var(--pi-sapphire)' : 'var(--pi-card-alt)',
                color: msg.role === 'user' ? '#fff' : 'var(--pi-text)',
                fontSize: '0.95rem', lineHeight: 1.6,
                border: msg.role === 'assistant' ? '1px solid var(--pi-border)' : 'none',
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: 'var(--pi-card-alt)', border: '1px solid var(--pi-border)', maxWidth: '80%' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--pi-text-muted)', animation: `pi-fade-in 0.6s ease-in-out infinite alternate`, animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--pi-text-muted)' }}>AI Advisor is thinking...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ borderTop: '1px solid var(--pi-border)', paddingTop: 12, display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about fundraising, boards, campaigns..."
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--pi-border)',
              background: 'var(--pi-bg)', color: 'var(--pi-text)', fontSize: '0.95rem', outline: 'none',
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: '10px 16px', borderRadius: 8, border: 'none', background: 'var(--pi-sapphire)',
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </PhoenixPage>
  );
}
