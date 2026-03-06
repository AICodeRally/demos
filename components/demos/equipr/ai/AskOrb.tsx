'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquareText, Minimize2, X, Send, BookOpen } from 'lucide-react';
import { askConversation, askModes } from '@/data/equipr/ai-platform';
import type { AskMessage } from '@/data/equipr/ai-platform';
import { useAIWidgets } from './AIWidgetProvider';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Canned responses
// ---------------------------------------------------------------------------

const CANNED_RESPONSES = [
  {
    keywords: ['excavator', 'cat', 'dig'],
    response:
      'We currently have 4 excavators available:\n\n\u2022 CAT 320 (Orlando Central) \u2014 Available now\n\u2022 CAT 330 (Tampa Bay) \u2014 Available March 3\n\u2022 Volvo EC220 (Jacksonville) \u2014 Available now\n\u2022 Komatsu PC200 (Orlando Central) \u2014 In maintenance until March 1\n\nThe CAT 320 at Orlando Central is your best option for immediate availability. Want me to check reservation conflicts?',
    sources: ['Fleet Database', 'Reservation System'],
  },
  {
    keywords: ['rate', 'price', 'cost', 'discount'],
    response:
      'Current rate card for heavy equipment:\n\n| Equipment | Daily | Weekly | Monthly |\n|-----------|-------|--------|---------|\n| Excavators | $650-$950 | $2,400-$3,600 | $7,200-$10,800 |\n| Boom Lifts | $275-$450 | $1,100-$1,800 | $3,300-$5,400 |\n| Skid Steers | $225-$350 | $900-$1,400 | $2,700-$4,200 |\n\nNote: Sunbelt raised aerial rates 8% last week. Our rates are now 6% below market \u2014 repricing opportunity of $18K/month.',
    sources: ['Rate Engine', 'Rouse Analytics'],
  },
  {
    keywords: ['maintenance', 'service', 'repair', 'broken'],
    response:
      'Maintenance summary for this week:\n\n\ud83d\udd34 **Urgent**: CAT 320 at 4,847 hours \u2014 service due at 5,000\n\ud83d\udfe1 **Scheduled**: Volvo A30G oil analysis overdue (flagged by Trackunit)\n\ud83d\udfe2 **Completed**: JLG 600S annual inspection passed\n\n3 units in shop, avg turnaround 2.1 days. Predictive model shows 2 additional units likely to need service within 10 days based on telematics data.',
    sources: ['SmartEquip', 'Trackunit Telematics'],
  },
  {
    keywords: ['utilization', 'idle', 'usage', 'sitting'],
    response:
      'Fleet utilization snapshot:\n\n\u2022 **Overall**: 78% (target: 80%)\n\u2022 **Heavy Equipment**: 82% \u2705\n\u2022 **Aerial/Lifts**: 75% \u2014 3 boom lifts idle 14+ days at Mesa yard\n\u2022 **Compaction**: 68% \u26a0\ufe0f seasonal low\n\nRecommendation: Transfer 3 idle boom lifts from Mesa to Scottsdale (demand signal: 4 unfilled requests last week). Projected revenue recovery: $8,400/week.',
    sources: ['Trackunit GPS', 'Wynne Systems'],
  },
  {
    keywords: ['customer', 'account', 'contractor', 'builder'],
    response:
      'Top 5 accounts by revenue (trailing 12 months):\n\n1. **Meridian Builders** \u2014 $287K (14% of total)\n2. **Coastal Contractors** \u2014 $198K\n3. **ABC Construction** \u2014 $176K\n4. **SunState Development** \u2014 $142K\n5. **Regional Grading Co** \u2014 $118K\n\nAlert: Meridian Builders is up for contract renewal March 15. Current rate compliance: 94%. Recommend locking multi-year at current rates.',
    sources: ['Point of Rental CRM', 'Wynne Systems'],
  },
  {
    keywords: ['safety', 'osha', 'incident', 'inspection'],
    response:
      'Safety dashboard:\n\n\u2022 **Incidents (30 days)**: 2 minor, 0 recordable\n\u2022 **Inspection compliance**: 91% (target 95%)\n\u2022 **Overdue inspections**: 7 units past due\n\u2022 **OSHA bulletin**: New boom lift inspection requirements effective April 1\n\n\u26a0\ufe0f Action needed: 7 units need inspection within 5 days to maintain compliance. Recommend batch-scheduling at Tampa Bay yard (closest to 4 of 7 units).',
    sources: ['Safety Module', 'SmartEquip'],
  },
];

const DEFAULT_RESPONSE =
  "I'm looking into that for you. In the meantime, I can help with fleet availability, rates, maintenance status, utilization analysis, customer accounts, and safety compliance. What specific area would you like to explore?";

function findCannedResponse(input: string): { response: string; sources: string[] } {
  const lower = input.toLowerCase();
  for (const cr of CANNED_RESPONSES) {
    if (cr.keywords.some((kw) => lower.includes(kw))) {
      return { response: cr.response, sources: cr.sources };
    }
  }
  return { response: DEFAULT_RESPONSE, sources: ['EQUIPR Knowledge Base'] };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AskOrb({ panelOnly }: { panelOnly?: boolean } = {}) {
  const { state, toggleAsk } = useAIWidgets();
  const isOpen = state.askOpen;

  const [messages, setMessages] = useState<AskMessage[]>([...askConversation]);
  const [input, setInput] = useState('');
  const [activeMode, setActiveMode] = useState('.fleet');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(askConversation.length + 1);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || typing) return;

    const userMsg: AskMessage = {
      id: `user-${nextId.current++}`,
      role: 'user',
      content: text,
      mode: activeMode,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulated AI response after delay
    setTimeout(() => {
      const { response, sources } = findCannedResponse(text);
      const aiMsg: AskMessage = {
        id: `ai-${nextId.current++}`,
        role: 'assistant',
        content: response,
        sources: sources.map((s) => ({ title: s })),
        mode: activeMode,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const messageCount = messages.filter((m) => m.role === 'assistant').length;

  return (
    <>
      {/* Orb button */}
      {!panelOnly && !isOpen && (
        <button
          onClick={toggleAsk}
          className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
          }}
          title="Ask EQUIPR"
        >
          <MessageSquareText className="h-6 w-6 text-white" />
          {/* Badge */}
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#2563EB] shadow">
            {messageCount}
          </span>
        </button>
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed bottom-14 right-4 z-50 flex w-[400px] flex-col rounded-xl shadow-2xl transition-all duration-300',
          isOpen ? 'h-[600px] opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-4 pointer-events-none'
        )}
        style={{ background: 'var(--prizym-card-bg, #FFFFFF)', border: '1px solid var(--prizym-border-default, #E5E7EB)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between rounded-t-xl px-4 py-3"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">Ask EQUIPR</span>
            </div>
            <span className="text-[11px] text-white/70">Fleet AI Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleAsk}
              className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              title="Minimize"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              onClick={toggleAsk}
              className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 border-b px-4 py-2" style={{ borderColor: 'var(--prizym-border-default, #E5E7EB)' }}>
          {askModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={cn(
                'rounded-full px-3 py-1 text-[11px] font-semibold transition-all',
                activeMode === mode.id
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t px-4 py-3" style={{ borderColor: 'var(--prizym-border-default, #E5E7EB)' }}>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about fleet, rates, safety..."
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || typing}
              className={cn(
                'rounded-lg p-1.5 transition-colors',
                input.trim() && !typing
                  ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
                  : 'bg-gray-200 text-gray-400'
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Message bubble sub-component
// ---------------------------------------------------------------------------

function MessageBubble({ message }: { message: AskMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-[#2563EB] text-white'
            : 'border border-gray-100 bg-gray-50 text-gray-800'
        )}
      >
        <div
          className={cn(
            'whitespace-pre-wrap text-[13px] leading-relaxed',
            isUser ? 'text-white' : 'text-gray-800'
          )}
        >
          {message.content}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-gray-200/50 pt-2">
            {message.sources.map((src, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700"
              >
                <BookOpen className="h-2.5 w-2.5" />
                {src.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
