'use client';

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DonutDataItem {
  name: string;
  value: number;
  color: string;
}

interface ProofDonutChartProps {
  data: DonutDataItem[];
  size?: number;
  label?: string;
  labelColor?: string;
}

export function ProofDonutChart({ data, size = 180, label, labelColor }: ProofDonutChartProps) {
  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            strokeWidth={0}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Pie>
          {label && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fill={labelColor ?? 'var(--pl-text-muted)'}
              fontSize={13}
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight={600}
            >
              {label}
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
