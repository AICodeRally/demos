/* ══════════════════════════════════════════════════════════
   TabletFrame — iPad Pro Bezel Wrapper

   CSS-only iPad-style frame for demo presentations.
   Landscape 4:3 aspect ratio, realistic bezel with
   camera notch, home indicator, and drop shadow.
   Supports light and dark themes.
   ══════════════════════════════════════════════════════════ */

interface TabletFrameProps {
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
}

export function TabletFrame({ children, className = '', isDark = true }: TabletFrameProps) {
  const bezelBg = isDark ? '#1a1a1e' : '#d4d2cd';
  const cameraBg = isDark ? '#2a2a30' : '#b8b6b1';
  const cameraBorder = isDark ? '#3a3a40' : '#a0a09b';
  const statusColor = isDark ? '#888' : '#666';
  const homeBg = isDark ? '#4a4a50' : '#b0ada8';
  const contentBg = isDark
    ? 'linear-gradient(180deg, #0a0f1e 0%, #0f1729 100%)'
    : 'linear-gradient(180deg, #faf8f2 0%, #f5f3ec 100%)';
  const batteryBorder = isDark ? '#666' : '#999';

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div
        className="relative tablet-bezel-shadow"
        style={{
          width: '100%',
          maxWidth: 1366,
          aspectRatio: '4 / 3',
          borderRadius: 24,
          background: bezelBg,
          padding: '12px 16px 16px 16px',
        }}
      >
        {/* Camera notch (top center) */}
        <div
          className="absolute top-[4px] left-1/2 -translate-x-1/2 z-10"
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: cameraBg,
            border: `1px solid ${cameraBorder}`,
          }}
        />

        {/* Status bar */}
        <div
          className="flex items-center justify-between px-6 py-1 text-[9px] font-medium"
          style={{ color: statusColor }}
        >
          <span>9:41</span>
          <div className="flex items-center gap-2">
            {/* WiFi icon */}
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path d="M6 9a1 1 0 100-2 1 1 0 000 2z" fill={statusColor} />
              <path d="M3.5 6.5a3.5 3.5 0 015 0" stroke={statusColor} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M1.5 4.5a6 6 0 019 0" stroke={statusColor} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {/* Battery */}
            <div className="flex items-center gap-0.5">
              <div
                style={{
                  width: 20,
                  height: 9,
                  borderRadius: 2,
                  border: `1px solid ${batteryBorder}`,
                  padding: 1,
                }}
              >
                <div style={{ width: '80%', height: '100%', borderRadius: 1, background: '#4ade80' }} />
              </div>
              <div style={{ width: 2, height: 4, borderRadius: '0 1px 1px 0', background: batteryBorder }} />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: 12,
            height: 'calc(100% - 36px)',
            background: contentBg,
          }}
        >
          {children}
        </div>

        {/* Home indicator (bottom center) */}
        <div
          className="absolute bottom-[6px] left-1/2 -translate-x-1/2"
          style={{
            width: 100,
            height: 4,
            borderRadius: 2,
            background: homeBg,
          }}
        />
      </div>
    </div>
  );
}
