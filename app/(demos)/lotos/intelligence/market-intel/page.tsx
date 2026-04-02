'use client';

import { AI_RESPONSES } from '@/data/lotos';

const marketResponse = AI_RESPONSES.find((r) => r.id === 'ai-006')!;

const KEY_METRICS = [
  { label: 'Price Trend', value: '-1.2%', detail: 'Week-over-week', color: '#DC2626', bg: '#FEF2F2' },
  { label: 'Inventory Level', value: '+8%', detail: 'Area dealers', color: '#D97706', bg: '#FFFBEB' },
  { label: 'Gross / Unit', value: '$4,650', detail: 'vs $4,000 target', color: '#16A34A', bg: '#F0FDF4' },
];

const ACTION_ITEMS = [
  {
    priority: 'HIGH',
    priorityColor: '#DC2626',
    priorityBg: '#FEF2F2',
    title: 'Auction Opportunity',
    detail: 'Manheim Phoenix Thursday sale has 40+ Toyota/Honda units — your fastest-turning brands.',
  },
  {
    priority: 'HIGH',
    priorityColor: '#DC2626',
    priorityBg: '#FEF2F2',
    title: 'Price Adjustment Needed',
    detail: 'STK-005 and STK-010 are 60+ days. Drop asking price 8-10% or wholesale this week.',
  },
  {
    priority: 'MED',
    priorityColor: '#D97706',
    priorityBg: '#FFFBEB',
    title: 'F&I Push',
    detail: 'Penetration at 70% — strong. New maintenance plan (FNI-006) is driving incremental $795/deal.',
  },
];

function parseBriefSections(text: string): { type: 'heading' | 'bullet' | 'numbered' | 'bold-line' | 'paragraph' | 'blank'; content: string }[] {
  const lines = text.split('\n');
  return lines.map((line) => {
    if (line.startsWith('## ')) return { type: 'heading', content: line.slice(3) };
    if (/^[-•]\s/.test(line.trim())) return { type: 'bullet', content: line.replace(/^[-•]\s*/, '') };
    if (/^\d+\.\s/.test(line.trim())) return { type: 'numbered', content: line };
    if (line.trim() === '') return { type: 'blank', content: '' };
    return { type: 'paragraph', content: line };
  });
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

function RenderBrief({ text }: { text: string }) {
  const sections = parseBriefSections(text);
  const elements: React.ReactNode[] = [];
  let key = 0;
  let numberedBuffer: string[] = [];

  const flushNumbered = () => {
    if (numberedBuffer.length > 0) {
      elements.push(
        <ol key={key++} className="space-y-1 my-2 ml-2">
          {numberedBuffer.map((item, i) => {
            const content = item.replace(/^\d+\.\s*/, '');
            return (
              <li key={i} className="flex gap-2">
                <span style={{ color: '#DC2626', fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>
                <span>{renderInline(content)}</span>
              </li>
            );
          })}
        </ol>
      );
      numberedBuffer = [];
    }
  };

  for (const section of sections) {
    if (section.type !== 'numbered' && numberedBuffer.length > 0) {
      flushNumbered();
    }

    if (section.type === 'heading') {
      elements.push(
        <div
          key={key++}
          className="mt-5 mb-2 pl-4 py-2 rounded-r-lg"
          style={{ borderLeft: '4px solid #DC2626', backgroundColor: '#FEF2F2' }}
        >
          <h3 className="text-base font-bold" style={{ color: '#1C1917' }}>{section.content}</h3>
        </div>
      );
    } else if (section.type === 'bullet') {
      elements.push(
        <div key={key++} className="flex gap-2 my-1 ml-2">
          <span style={{ color: '#DC2626', fontWeight: 700 }}>•</span>
          <span className="text-base" style={{ color: '#57534E' }}>{renderInline(section.content)}</span>
        </div>
      );
    } else if (section.type === 'numbered') {
      numberedBuffer.push(section.content);
    } else if (section.type === 'paragraph' && section.content.trim()) {
      elements.push(
        <p key={key++} className="text-base leading-relaxed" style={{ color: '#57534E' }}>
          {renderInline(section.content)}
        </p>
      );
    } else if (section.type === 'blank') {
      elements.push(<div key={key++} className="h-2" />);
    }
  }

  if (numberedBuffer.length > 0) flushNumbered();

  return <>{elements}</>;
}

export default function MarketIntelPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            Market Intelligence
          </h1>
          <p className="mt-1 text-base" style={{ color: '#57534E' }}>
            Weekly AI-generated brief — Phoenix Metro used vehicle market
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-xl px-4 py-2 text-sm font-bold transition-colors"
            style={{ backgroundColor: '#F5F5F4', color: '#1C1917', border: '1px solid #E7E5E4' }}
          >
            Share Brief
          </button>
          <button
            className="rounded-xl px-4 py-2 text-sm font-bold"
            style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
          >
            Generate New Brief
          </button>
        </div>
      </div>

      {/* Date Header */}
      <div
        className="rounded-xl px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-base"
            style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
          >
            AI
          </div>
          <div>
            <p className="text-base font-bold" style={{ color: '#1C1917' }}>Weekly Market Brief — April 1, 2026</p>
            <p className="text-sm" style={{ color: '#78716C' }}>Generated by AskLotOS AI · Phoenix Metro · Sora Auto</p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
          style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}
        >
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#16A34A' }} />
          Live
        </div>
      </div>

      {/* Key Metrics + Brief Side-by-Side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Key Metrics Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-base font-bold" style={{ color: '#1C1917' }}>Key Metrics</h2>
          {KEY_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border p-4"
              style={{ backgroundColor: metric.bg, borderColor: '#E7E5E4' }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>{metric.label}</p>
              <p className="text-3xl font-black mt-1" style={{ color: metric.color }}>{metric.value}</p>
              <p className="text-xs mt-0.5" style={{ color: '#57534E' }}>{metric.detail}</p>
            </div>
          ))}
        </div>

        {/* Brief Content */}
        <div className="lg:col-span-3 rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <RenderBrief text={marketResponse.answer} />
        </div>
      </div>

      {/* Action Items */}
      <div>
        <h2 className="text-lg font-bold mb-3" style={{ color: '#1C1917' }}>Action Items</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ACTION_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-xl bg-white border p-5"
              style={{ borderColor: '#E7E5E4' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: item.priorityBg, color: item.priorityColor }}
                >
                  {item.priority}
                </span>
                <span className="text-xs font-semibold" style={{ color: '#78716C' }}>Action {i + 1}</span>
              </div>
              <p className="text-base font-bold" style={{ color: '#1C1917' }}>{item.title}</p>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#57534E' }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
