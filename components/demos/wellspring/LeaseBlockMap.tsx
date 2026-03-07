'use client';

interface LeaseBlock {
  id: string;
  name: string;
  section: string;
  status: 'active' | 'expiring' | 'prospect';
  royaltyRate: number;
  acreage: number;
}

interface LeaseBlockMapProps {
  leases: LeaseBlock[];
  height?: number;
}

const STATUS_COLORS: Record<string, string> = {
  active: '#16A34A',
  expiring: '#D97706',
  prospect: '#2563EB',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  expiring: 'Expiring',
  prospect: 'Prospect',
};

export type { LeaseBlock };

export function LeaseBlockMap({ leases, height: propHeight }: LeaseBlockMapProps) {
  if (leases.length === 0) return null;

  // Layout: arrange leases in a grid (like township sections)
  const cols = Math.min(Math.ceil(Math.sqrt(leases.length * 1.5)), 6);
  const rows = Math.ceil(leases.length / cols);
  const cellW = 72;
  const cellH = 58;
  const gap = 4;
  const pad = { top: 8, left: 12, right: 12, bottom: 40 };

  const W = pad.left + cols * (cellW + gap) - gap + pad.right;
  const H = propHeight ?? pad.top + rows * (cellH + gap) - gap + pad.bottom;

  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}>
      <h3 className="text-sm font-semibold mb-2" style={{ color: '#F1F5F9' }}>
        Lease Block Map
      </h3>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="block"
      >
        {leases.map((lease, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = pad.left + col * (cellW + gap);
          const y = pad.top + row * (cellH + gap);
          const fill = STATUS_COLORS[lease.status] ?? '#334155';

          return (
            <g key={lease.id}>
              {/* Cell background */}
              <rect
                x={x}
                y={y}
                width={cellW}
                height={cellH}
                rx={4}
                fill={fill}
                opacity={0.18}
                stroke={fill}
                strokeWidth={1.5}
              />

              {/* Section number (top-left) */}
              <text x={x + 5} y={y + 12} fill={fill} fontSize={8} fontWeight="bold">
                S{lease.section}
              </text>

              {/* Lease name (center) */}
              <text
                x={x + cellW / 2}
                y={y + 26}
                textAnchor="middle"
                fill="#F1F5F9"
                fontSize={9}
                fontWeight={600}
              >
                {lease.name.length > 10 ? lease.name.slice(0, 9) + '...' : lease.name}
              </text>

              {/* Acreage */}
              <text
                x={x + cellW / 2}
                y={y + 38}
                textAnchor="middle"
                fill="#CBD5E1"
                fontSize={7}
              >
                {lease.acreage.toLocaleString()} ac
              </text>

              {/* Royalty rate (bottom-right) */}
              <text
                x={x + cellW - 5}
                y={y + cellH - 6}
                textAnchor="end"
                fill="#94A3B8"
                fontSize={7}
              >
                {(lease.royaltyRate * 100).toFixed(1)}% RI
              </text>
            </g>
          );
        })}

        {/* Legend */}
        {Object.entries(STATUS_COLORS).map(([status, color], i) => (
          <g key={`legend-${status}`}>
            <rect
              x={pad.left + i * 80}
              y={H - 24}
              width={12}
              height={10}
              rx={2}
              fill={color}
              opacity={0.5}
              stroke={color}
              strokeWidth={1}
            />
            <text
              x={pad.left + i * 80 + 16}
              y={H - 16}
              fill="#CBD5E1"
              fontSize={8}
            >
              {STATUS_LABELS[status]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
