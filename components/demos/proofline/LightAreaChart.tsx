'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface LightAreaChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKey: string | string[];
  colors?: string[];
  height?: number;
  stacked?: boolean;
  formatValue?: (val: number) => string;
}

export function LightAreaChart({
  data,
  xKey,
  yKey,
  colors = ['#C6A052'],
  height = 240,
  stacked = false,
  formatValue,
}: LightAreaChartProps) {
  const yKeys = Array.isArray(yKey) ? yKey : [yKey];
  const defaultFormat = (v: number) => `$${(v / 1e6).toFixed(1)}M`;
  const valFormatter = formatValue ?? defaultFormat;

  // For many stacked series, use flat solid fill with very low opacity
  const manyStacked = stacked && yKeys.length > 4;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
          {!manyStacked && (
            <defs>
              {yKeys.map((key, idx) => {
                const color = colors[idx % colors.length];
                return (
                  <linearGradient key={key} id={`light-gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.20} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                );
              })}
            </defs>
          )}
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 11 }} tickFormatter={(v) => valFormatter(v as number)} />
          <Tooltip
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              color: '#1A1A2E',
              fontSize: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            formatter={(value) => [valFormatter(value as number), undefined]}
          />
          {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 11, color: '#4A5568' }} />}
          {yKeys.map((key, idx) => {
            const color = colors[idx % colors.length];
            return (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={manyStacked ? 1.5 : 2}
                fill={manyStacked ? color : `url(#light-gradient-${key})`}
                fillOpacity={manyStacked ? 0.08 : 1}
                dot={false}
                stackId={stacked ? 'stack' : undefined}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
