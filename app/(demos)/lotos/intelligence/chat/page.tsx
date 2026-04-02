'use client';

import { useRef, useState } from 'react';
import { AI_RESPONSES } from '@/data/lotos';

const chatResponses = AI_RESPONSES.filter((r) => r.category === 'chat');

function renderMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const lines = text.split('\n');
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '') {
      parts.push(<br key={key++} />);
      continue;
    }

    // Numbered list item
    if (/^\d+\./.test(line.trim())) {
      const content = line.replace(/^\d+\.\s*/, '');
      parts.push(
        <div key={key++} className="flex gap-2 mt-1">
          <span style={{ color: '#DC2626', fontWeight: 700, minWidth: 20 }}>
            {line.match(/^(\d+)/)?.[1]}.
          </span>
          <span>{renderInline(content)}</span>
        </div>
      );
      continue;
    }

    parts.push(<span key={key++}>{renderInline(line)}<br /></span>);
  }

  return <>{parts}</>;
}

function renderInline(text: string): React.ReactNode {
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.startsWith('**') && seg.endsWith('**')) {
          return <strong key={i} style={{ color: '#1C1917' }}>{seg.slice(2, -2)}</strong>;
        }
        return <span key={i}>{seg}</span>;
      })}
    </>
  );
}

const QUICK_ACTIONS = [
  { label: 'What should I wholesale?', targetId: 'msg-ai-001' },
  { label: 'Turn rate analysis', targetId: 'msg-ai-002' },
  { label: 'Subprime strategies', targetId: 'msg-ai-003' },
];

export default function AskLotosChatPage() {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  function scrollToMessage(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            AskLotOS Chat
          </h1>
          <p className="mt-1 text-base" style={{ color: '#57534E' }}>
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

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-semibold self-center" style={{ color: '#78716C' }}>Quick questions:</span>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.targetId}
            onClick={() => scrollToMessage(action.targetId)}
            className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: '#F5F5F4',
              color: '#1C1917',
              border: '1px solid #E7E5E4',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FEF2F2';
              (e.currentTarget as HTMLButtonElement).style.color = '#DC2626';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#FECACA';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F5F5F4';
              (e.currentTarget as HTMLButtonElement).style.color = '#1C1917';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#E7E5E4';
            }}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="space-y-6">
        {chatResponses.map((response) => (
          <div key={response.id} className="space-y-3" id={`msg-${response.id}`}>
            {/* User Message */}
            <div className="flex justify-end">
              <div
                className="max-w-2xl rounded-2xl rounded-tr-md px-5 py-4"
                style={{
                  backgroundColor: 'rgba(232, 93, 44, 0.1)',
                  border: '1px solid rgba(232, 93, 44, 0.2)',
                }}
              >
                <p className="text-base font-medium" style={{ color: '#1C1917' }}>
                  {response.question}
                </p>
              </div>
            </div>

            {/* AI Response */}
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
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E7E5E4',
                }}
              >
                <div className="text-sm font-semibold mb-2" style={{ color: '#DC2626' }}>
                  AskLotOS
                </div>
                <div className="text-base leading-relaxed" style={{ color: '#57534E' }}>
                  {renderMarkdown(response.answer)}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div
        className="sticky bottom-0 rounded-2xl p-4"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E7E5E4',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask LotOS anything about your dealership..."
            className="flex-1 rounded-xl px-4 py-3 text-base outline-none"
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E7E5E4',
              color: '#1C1917',
            }}
          />
          <button
            className="rounded-xl px-5 py-3 text-sm font-bold transition-opacity"
            style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
          >
            Send
          </button>
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: '#78716C' }}>
          This demo shows pre-populated AI conversations. Powered by AskLotOS AI — responses are illustrative.
        </p>
      </div>
    </div>
  );
}
