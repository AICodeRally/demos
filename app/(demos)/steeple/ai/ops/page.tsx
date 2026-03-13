'use client';

import { StatCard, ChartCard, EdgeBadge } from '@/components/demos/steeple';
import {
  healthDimensions,
  healthTrendData,
  healthAlerts,
} from '@/data/steeple';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Info,
  Shield,
  Heart,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from 'recharts';

const overallScore = 87;

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};
const trendColors = {
  up: 'text-emerald-600',
  down: 'text-red-500',
  stable: 'text-gray-400',
};

export default function OpsPage() {
  return (

      <div className="space-y-6">
        <div className="flex justify-end">
          <EdgeBadge variant="sync" />
        </div>

        {/* Health Score + Dimensions */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Donut */}
          <ChartCard title="Overall Health Score">
            <div className="flex flex-col items-center py-4">
              <div className="relative">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { value: overallScore, fill: '#522398' },
                        { value: 100 - overallScore, fill: '#E5E7EB' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">
                      {overallScore}
                    </div>
                    <div className="text-sm text-gray-600">/ 100</div>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm font-medium text-emerald-600">
                <TrendingUp className="h-4 w-4" />
                +2 points from last month
              </div>
            </div>
          </ChartCard>

          {/* 6 Dimension cards */}
          <div className="lg:col-span-2 grid gap-3 sm:grid-cols-2">
            {healthDimensions.map((dim) => {
              const TrendIcon = trendIcons[dim.trend];
              const trendCls = trendColors[dim.trend];
              return (
                <div
                  key={dim.name}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {dim.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendIcon className={`h-4 w-4 ${trendCls}`} />
                      <span
                        className="text-lg font-bold"
                        style={{ color: dim.color }}
                      >
                        {dim.score}
                      </span>
                    </div>
                  </div>
                  {/* Score bar */}
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${dim.score}%`,
                        backgroundColor: dim.color,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{dim.details}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trend Chart */}
        <ChartCard title="Health Score — 12 Week Trend">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={healthTrendData}>
              <defs>
                <linearGradient
                  id="healthGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#522398" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#522398" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[75, 95]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#522398"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#healthGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Alert Panel */}
        <ChartCard title="Operational Alerts">
          <div className="space-y-3">
            {healthAlerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#faf8f4] p-3"
              >
                <div
                  className={`shrink-0 rounded-lg p-2 ${
                    alert.severity === 'warning'
                      ? 'bg-amber-50'
                      : 'bg-blue-50'
                  }`}
                >
                  {alert.severity === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Info className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">
                    {alert.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-gray-600">
                    {alert.detail}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  {alert.time}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

  );
}
