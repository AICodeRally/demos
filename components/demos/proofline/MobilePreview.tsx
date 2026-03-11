'use client';

import { Signal, BatteryFull } from 'lucide-react';

interface MobilePreviewProps {
  currentStop: {
    accountName: string;
    type: string;
    arrivalTime: string;
    talkingPoints: string[];
  } | null;
  repName: string;
  time: string;
}

const TYPE_COLORS: Record<string, string> = {
  'load-out': '#C6A052',
  'key-account': '#2563EB',
  'chain-drop': '#7C3AED',
  'presell': '#B87333',
  'new-account': '#22D3EE',
  'compliance': '#EF4444',
  'problem-resolution': '#F97316',
  'presell-spirits': '#A855F7',
  'merchandising': '#10B981',
  'drive-by': '#6B7280',
  'windshield': '#6B7280',
  'return': '#C6A052',
};

export function MobilePreview({ currentStop, repName, time }: MobilePreviewProps) {
  return (
    <div className="relative mx-auto" style={{ width: 260, height: 520 }}>
      {/* iPhone frame */}
      <div
        className="absolute inset-0 rounded-[36px] border-2 border-white/20 overflow-hidden"
        style={{ background: '#0F172A' }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-black rounded-b-2xl z-10" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-[8px] pb-1 text-xs text-white/60 relative z-0">
          <span className="font-medium">{time}</span>
          <div className="flex items-center gap-1">
            <Signal size={10} />
            <span className="text-xs">5G</span>
            <BatteryFull size={12} />
          </div>
        </div>

        {/* App header */}
        <div className="px-4 pt-4 pb-2">
          <div className="text-xs uppercase tracking-wider text-white/40 font-mono">
            PROOFLINE Mobile
          </div>
          <div className="text-sm font-semibold text-white mt-0.5">{repName}</div>
        </div>

        {/* Content area */}
        <div className="px-4 flex-1">
          {currentStop ? (
            <div
              className="rounded-xl p-3 mt-2"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Type badge */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: `${TYPE_COLORS[currentStop.type] ?? '#6B7280'}20`,
                    color: TYPE_COLORS[currentStop.type] ?? '#6B7280',
                  }}
                >
                  {currentStop.type.replace(/-/g, ' ')}
                </span>
                <span className="text-xs text-white/40">{currentStop.arrivalTime}</span>
              </div>

              {/* Account name */}
              <div className="text-sm font-bold text-white mb-3">{currentStop.accountName}</div>

              {/* Talking points */}
              {currentStop.talkingPoints.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/40 mb-1.5 font-mono">
                    Talking Points
                  </div>
                  <ul className="space-y-1.5">
                    {currentStop.talkingPoints.slice(0, 2).map((tp, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-white/70 flex items-start gap-1.5"
                      >
                        <span className="text-[#C6A052] mt-px shrink-0">&bull;</span>
                        <span className="leading-snug">{tp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <span className="text-2xl opacity-30">&#128205;</span>
              </div>
              <div className="text-sm text-white/30">Select a stop</div>
              <div className="text-[13px] text-white/20 mt-1">
                Tap a pin on the map to preview
              </div>
            </div>
          )}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] rounded-full bg-white/20" />
      </div>
    </div>
  );
}
