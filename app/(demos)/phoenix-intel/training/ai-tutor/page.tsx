'use client';

import { useState, useRef, useEffect } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { Send, GraduationCap } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const TUTOR_RESPONSES: Record<string, string> = {
  'stewardship': 'Great question! Donor stewardship is the process of building lasting relationships with donors after they give. Phoenix uses a **tiered stewardship matrix** that maps activities to giving levels:\n\n• **All donors**: Thank-you within 48 hours, annual impact report\n• **$1K+**: Personal phone call, quarterly updates\n• **$5K+**: Individual meeting, behind-the-scenes tour\n• **$25K+**: Named recognition, executive access, custom reporting\n\nThe key principle: stewardship is not fundraising — it\'s relationship building. The goal is to make donors feel valued, not solicited.',
  'annual': 'The annual fund is the backbone of nonprofit fundraising. Here\'s the Phoenix framework for a strong annual fund:\n\n**1. Segmentation Strategy**\nDivide donors into segments: first-time, lapsed, recurring, major gift prospects. Each gets a different message and cadence.\n\n**2. Multi-Channel Approach**\n- Direct mail (still #1 for donors 50+)\n- Email (3-5 touchpoints per appeal)\n- Social media (awareness, not solicitation)\n- Personal asks (for top 20%)\n\n**3. Calendar Planning**\nPlan 12 months ahead. Key windows: year-end (40% of giving), spring appeal, Giving Tuesday.\n\n**4. Measurement**\nTrack: response rate, average gift, retention rate, and cost per dollar raised.',
  'prospect': 'Prospect research identifies potential donors based on capacity (can they give?) and affinity (will they give?). Here\'s a structured approach:\n\n**Wealth Indicators** (Capacity)\n- Real estate holdings\n- SEC filings and stock ownership\n- Business affiliations\n- Previous philanthropic giving\n\n**Affinity Indicators** (Inclination)\n- Existing relationship with organization\n- Volunteer history\n- Event attendance\n- Board connections\n- Alumni status\n\n**Phoenix Tip**: The best prospects have BOTH high capacity AND high affinity. A billionaire with no connection is not as strong a prospect as a mid-level donor who volunteers regularly.',
  'default': 'That\'s an excellent topic for discussion! As your AI Tutor, I can help you learn about:\n\n• **Fundraising fundamentals** — annual fund, major gifts, planned giving\n• **Board engagement** — governance, giving expectations, recruitment\n• **Campaign planning** — feasibility studies, gift tables, volunteer management\n• **Donor relations** — stewardship, retention, upgrade strategies\n• **Operations** — CRM systems, KPIs, data management\n\nWhat specific area would you like to explore? The more specific your question, the more detailed guidance I can provide.',
};

function getTutorResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('steward') || lower.includes('thank') || lower.includes('retain')) return TUTOR_RESPONSES.stewardship;
  if (lower.includes('annual') || lower.includes('year-end') || lower.includes('appeal')) return TUTOR_RESPONSES.annual;
  if (lower.includes('prospect') || lower.includes('research') || lower.includes('wealth')) return TUTOR_RESPONSES.prospect;
  return TUTOR_RESPONSES.default;
}

export default function AITutorPage() {
  const insight = getInsight('training/ai-tutor');
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

    // Simulate streaming with progressive reveal
    const fullResponse = getTutorResponse(userMsg.content);
    const words = fullResponse.split(' ');
    let currentText = '';
    let wordIndex = 0;

    const interval = setInterval(() => {
      if (wordIndex >= words.length) {
        clearInterval(interval);
        setIsTyping(false);
        return;
      }
      currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
      wordIndex++;

      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          newMessages[newMessages.length - 1] = { ...lastMsg, content: currentText };
        } else {
          newMessages.push({ role: 'assistant', content: currentText });
        }
        return newMessages;
      });
    }, 30);
  };

  const suggestions = [
    'What is donor stewardship?',
    'How do I plan an annual fund?',
    'Explain prospect research',
  ];

  return (
    <PhoenixPage title="AI Tutor" subtitle="Interactive learning assistant for advancement professionals" accentColor="#7c3aed">
      {insight && <div style={{ marginBottom: 16 }}><AIInsightCard label={insight.label}>{insight.text}</AIInsightCard></div>}

      <div className="phoenix-card" style={{ minHeight: 450, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <GraduationCap size={48} color="#7c3aed" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--pi-text-muted)', marginBottom: 16 }}>Welcome to the AI Tutor! Ask any question about fundraising and nonprofit advancement.</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {suggestions.map(s => (
                  <button key={s} onClick={() => setInput(s)} style={{
                    padding: '8px 14px', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                    border: '1px solid var(--pi-border)', background: 'var(--pi-card)', color: 'var(--pi-text-secondary)',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%', padding: '10px 14px', borderRadius: 12,
                background: msg.role === 'user' ? '#7c3aed' : 'var(--pi-card-alt)',
                color: msg.role === 'user' ? '#fff' : 'var(--pi-text)',
                fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-wrap',
                border: msg.role === 'assistant' ? '1px solid var(--pi-border)' : 'none',
              }}>
                {msg.content.split('**').map((part, j) =>
                  j % 2 === 0 ? <span key={j}>{part}</span> : <strong key={j}>{part}</strong>
                )}
              </div>
            </div>
          ))}

          {isTyping && messages[messages.length - 1]?.role !== 'assistant' && (
            <div style={{ display: 'flex', gap: 4, padding: 10 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--pi-text-muted)', animation: `pi-fade-in 0.6s ease-in-out infinite alternate`, animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div style={{ borderTop: '1px solid var(--pi-border)', paddingTop: 12, display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isTyping && sendMessage()}
            placeholder="Ask about fundraising concepts..."
            style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--pi-border)', background: 'var(--pi-bg)', color: 'var(--pi-text)', fontSize: '0.95rem', outline: 'none' }}
          />
          <button onClick={sendMessage} disabled={isTyping} style={{
            padding: '10px 16px', borderRadius: 8, border: 'none', background: isTyping ? 'var(--pi-border)' : '#7c3aed',
            color: '#fff', cursor: isTyping ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </PhoenixPage>
  );
}
