'use client';

import { useRef, useState, useEffect } from 'react';
import { AI_RESPONSES } from '@/data/lotos';
import { MarkdownRenderer } from '@/components/demos/lotos';

const chatResponses = AI_RESPONSES.filter((r) => r.category === 'chat');

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const QUICK_ACTIONS = [
  { label: 'What should I wholesale?', keyword: 'wholesale' },
  { label: 'Turn rate analysis', keyword: 'turn rate' },
  { label: 'Subprime strategies', keyword: 'subprime' },
];

function findMatchingResponse(input: string): string | null {
  const lower = input.toLowerCase();
  for (const response of chatResponses) {
    const qLower = response.question.toLowerCase();
    const words = lower.split(/\s+/);
    for (const word of words) {
      if (word.length > 3 && qLower.includes(word)) return response.answer;
    }
    if (qLower.includes(lower) || lower.includes(qLower.split(' ').slice(0, 3).join(' '))) {
      return response.answer;
    }
  }
  return null;
}

export default function AskLotosChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Welcome to AskLotOS! I can help with inventory analysis, deal structuring, market intelligence, and more. Ask me anything about your dealership.' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const match = findMatchingResponse(trimmed);
      const aiText = match ?? "I'll research that and get back to you.";
      setMessages((prev) => [...prev, { role: 'ai', text: aiText }]);
      setIsTyping(false);
    }, 1000);
  }

  function handleQuickAction(action: typeof QUICK_ACTIONS[number]) {
    const match = chatResponses.find((r) => r.question.toLowerCase().includes(action.keyword));
    if (!match) return;
    setMessages((prev) => [...prev, { role: 'user', text: match.question }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: match.answer }]);
      setIsTyping(false);
    }, 1000);
  }

  return (
    <div className="lot-page" style={{ padding: '24px' }}>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="lot-heading">
              AskLotOS Chat
            </h1>
            <p className="lot-description">
              AI-powered dealership intelligence — ask anything about your inventory, deals, and performance
            </p>
          </div>
          <div
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold"
            style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: '#DC2626' }}
            />
            Powered by AskLotOS AI
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-semibold self-center" style={{ color: 'var(--lot-text-muted)' }}>Quick questions:</span>
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.keyword}
              onClick={() => handleQuickAction(action)}
              className="lot-btn"
            >
              {action.label}
            </button>
          ))}
        </div>

        <div className="space-y-6" style={{ maxHeight: '60vh', overflowY: 'auto', background: 'var(--lot-card-alt)', borderRadius: '12px', padding: '16px 8px 16px 16px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className="lot-animate-in">
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div
                    className="max-w-2xl rounded-2xl rounded-tr-md px-5 py-4"
                    style={{
                      backgroundColor: 'rgba(232, 93, 44, 0.1)',
                      border: '1px solid rgba(232, 93, 44, 0.2)',
                    }}
                  >
                    <p className="text-base font-medium" style={{ color: 'var(--lot-text)' }}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                  >
                    AI
                  </div>
                  <div
                    className="flex-1 rounded-2xl rounded-tl-md px-5 py-4"
                    style={{
                      backgroundColor: 'var(--lot-card)',
                      border: '1px solid var(--lot-border)',
                    }}
                  >
                    <div className="text-sm font-semibold mb-2" style={{ color: '#DC2626' }}>
                      AskLotOS
                    </div>
                    <div className="text-base leading-relaxed" style={{ color: 'var(--lot-text-secondary)' }}>
                      <MarkdownRenderer text={msg.text} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
              >
                AI
              </div>
              <div
                className="rounded-2xl rounded-tl-md px-5 py-4"
                style={{
                  backgroundColor: 'var(--lot-card)',
                  border: '1px solid var(--lot-border)',
                }}
              >
                <div className="flex gap-1.5 items-center" style={{ height: '24px' }}>
                  <span className="inline-block w-2.5 h-2.5 rounded-full lot-bounce" style={{ backgroundColor: '#DC2626', animationDelay: '0s' }} />
                  <span className="inline-block w-2.5 h-2.5 rounded-full lot-bounce" style={{ backgroundColor: '#DC2626', animationDelay: '0.2s' }} />
                  <span className="inline-block w-2.5 h-2.5 rounded-full lot-bounce" style={{ backgroundColor: '#DC2626', animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <style>{`
          .lot-bounce {
            animation: lot-bounce 1.4s infinite ease-in-out both;
          }
        `}</style>

        <div
          className="lot-card sticky bottom-0 rounded-2xl p-4"
          style={{
            boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Ask LotOS anything about your dealership..."
              className="lot-input flex-1"
            />
            <button
              onClick={handleSend}
              className="rounded-xl px-5 py-3 text-sm font-bold transition-opacity"
              style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
            >
              Send
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--lot-text-muted)' }}>
            AI-powered assistant. Responses match pre-loaded dealership data.
          </p>
        </div>
      </div>
    </div>
  );
}
