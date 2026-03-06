'use client';

interface FloorLayoutMapProps {
  format: string;
  width?: number;
  height?: number;
}

interface Zone {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color: string;
}

interface Rep {
  x: number;
  y: number;
  name: string;
}

const LAYOUTS: Record<string, { zones: Zone[]; reps: Rep[]; arrows: string[] }> = {
  flagship: {
    zones: [
      { x: 20, y: 20, w: 260, h: 200, label: 'Premium Mattress Gallery', color: '#1E3A5F' },
      { x: 300, y: 20, w: 140, h: 120, label: 'Adjustable Bases', color: '#06B6D4' },
      { x: 300, y: 160, w: 140, h: 60, label: 'Sleep Tech', color: '#8B5CF6' },
      { x: 20, y: 240, w: 180, h: 100, label: 'Bedding & Pillows', color: '#10B981' },
      { x: 220, y: 240, w: 100, h: 100, label: 'Sleep Assessment', color: '#F59E0B' },
      { x: 340, y: 240, w: 100, h: 100, label: 'Checkout', color: '#EF4444' },
      { x: 460, y: 20, w: 100, h: 320, label: 'Entrance & Lobby', color: '#94A3B8' },
    ],
    reps: [
      { x: 100, y: 100, name: 'Sarah' },
      { x: 200, y: 150, name: 'Marcus' },
      { x: 350, y: 70, name: 'Diana' },
      { x: 270, y: 280, name: 'James' },
      { x: 80, y: 280, name: 'Raj' },
      { x: 380, y: 290, name: 'Emily' },
    ],
    arrows: [
      'M 510 180 Q 460 180 460 120 Q 460 60 400 40',
      'M 510 200 Q 460 240 340 280',
      'M 510 160 Q 400 160 280 120',
    ],
  },
  standard: {
    zones: [
      { x: 20, y: 20, w: 220, h: 180, label: 'Mattress Floor', color: '#1E3A5F' },
      { x: 260, y: 20, w: 140, h: 100, label: 'Adjustable Bases', color: '#06B6D4' },
      { x: 260, y: 140, w: 140, h: 60, label: 'Bedding', color: '#10B981' },
      { x: 20, y: 220, w: 180, h: 120, label: 'Value Mattresses', color: '#475569' },
      { x: 220, y: 220, w: 180, h: 120, label: 'Checkout & Finance', color: '#EF4444' },
      { x: 420, y: 20, w: 120, h: 320, label: 'Entrance', color: '#94A3B8' },
    ],
    reps: [
      { x: 100, y: 90, name: 'Alex' },
      { x: 180, y: 150, name: 'Beth' },
      { x: 310, y: 60, name: 'Chris' },
      { x: 100, y: 280, name: 'Dana' },
      { x: 300, y: 270, name: 'Eli' },
    ],
    arrows: [
      'M 480 180 Q 420 180 380 120',
      'M 480 200 Q 400 240 300 260',
    ],
  },
  outlet: {
    zones: [
      { x: 20, y: 20, w: 300, h: 140, label: 'Clearance Mattresses', color: '#475569' },
      { x: 340, y: 20, w: 120, h: 140, label: 'Value Bundles', color: '#06B6D4' },
      { x: 20, y: 180, w: 200, h: 100, label: 'Overstock Bases', color: '#1E3A5F' },
      { x: 240, y: 180, w: 100, h: 100, label: 'Bedding Deals', color: '#10B981' },
      { x: 360, y: 180, w: 100, h: 100, label: 'Quick Checkout', color: '#EF4444' },
      { x: 480, y: 20, w: 80, h: 260, label: 'Entry', color: '#94A3B8' },
    ],
    reps: [
      { x: 120, y: 80, name: 'Pat' },
      { x: 380, y: 80, name: 'Sam' },
      { x: 100, y: 230, name: 'Jo' },
      { x: 390, y: 230, name: 'Kim' },
    ],
    arrows: [
      'M 520 140 Q 460 140 380 80',
      'M 520 160 Q 400 200 300 220',
    ],
  },
  'shop-in-shop': {
    zones: [
      { x: 40, y: 40, w: 200, h: 140, label: 'Featured Mattresses', color: '#1E3A5F' },
      { x: 260, y: 40, w: 120, h: 140, label: 'Bases & Bedding', color: '#06B6D4' },
      { x: 40, y: 200, w: 160, h: 80, label: 'Try Zone', color: '#F59E0B' },
      { x: 220, y: 200, w: 160, h: 80, label: 'POS Terminal', color: '#EF4444' },
      { x: 400, y: 40, w: 120, h: 240, label: 'Dept Store Aisle', color: '#94A3B8' },
    ],
    reps: [
      { x: 140, y: 110, name: 'Riley' },
      { x: 300, y: 110, name: 'Casey' },
    ],
    arrows: [
      'M 460 160 Q 400 160 320 110',
      'M 460 180 Q 380 200 280 230',
    ],
  },
};

export function FloorLayoutMap({ format, width = 580, height = 360 }: FloorLayoutMapProps) {
  const layout = LAYOUTS[format] ?? LAYOUTS.standard;

  return (
    <svg viewBox="0 0 580 360" width={width} height={height} className="w-full">
      {/* Background */}
      <rect x="0" y="0" width="580" height="360" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />

      {/* Zones */}
      {layout.zones.map((zone, i) => (
        <g key={i}>
          <rect
            x={zone.x}
            y={zone.y}
            width={zone.w}
            height={zone.h}
            rx="6"
            fill={`${zone.color}15`}
            stroke={`${zone.color}40`}
            strokeWidth="1.5"
          />
          <text
            x={zone.x + zone.w / 2}
            y={zone.y + zone.h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={zone.color}
            fontSize="11"
            fontWeight="600"
            fontFamily="Space Grotesk, sans-serif"
          >
            {zone.label}
          </text>
        </g>
      ))}

      {/* Traffic flow arrows */}
      {layout.arrows.map((d, i) => (
        <path
          key={`arrow-${i}`}
          d={d}
          fill="none"
          stroke="#94A3B8"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          markerEnd="url(#arrowhead)"
          opacity="0.6"
        />
      ))}

      {/* Arrowhead marker */}
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" />
        </marker>
      </defs>

      {/* Rep positions */}
      {layout.reps.map((rep, i) => (
        <g key={`rep-${i}`}>
          <circle cx={rep.x} cy={rep.y} r="8" fill="#1E3A5F" opacity="0.9" />
          <circle cx={rep.x} cy={rep.y} r="4" fill="#FFFFFF" />
          <text
            x={rep.x}
            y={rep.y + 18}
            textAnchor="middle"
            fill="#475569"
            fontSize="9"
            fontWeight="500"
          >
            {rep.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
