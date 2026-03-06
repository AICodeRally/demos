'use client';


import { StatCard, ChartCard, EdgeBadge, MarketCallout } from '@/components/demos/steeple';
import {
  FileText,
  Calendar,
  Clock,
  Grid3x3,
  DollarSign,
  Users,
  CalendarDays,
  Heart,
  Building,
  TrendingUp,
  Download,
  Play,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const availableReports = [
  {
    id: 'financial',
    title: 'Financial Summary',
    description: 'Monthly, quarterly, and annual giving reports with fund breakdowns',
    icon: DollarSign,
    color: '#2563EB',
    lastRun: '2026-02-15',
  },
  {
    id: 'membership',
    title: 'Membership Analytics',
    description: 'Growth trends, retention rates, and demographic insights',
    icon: Users,
    color: '#059669',
    lastRun: '2026-02-14',
  },
  {
    id: 'events',
    title: 'Event Performance',
    description: 'Attendance trends, engagement metrics, and volunteer utilization',
    icon: CalendarDays,
    color: '#7C3AED',
    lastRun: '2026-02-13',
  },
  {
    id: 'ministry',
    title: 'Ministry Impact',
    description: 'Team effectiveness, volunteer hours, and program outcomes',
    icon: Heart,
    color: '#D97706',
    lastRun: '2026-02-12',
  },
  {
    id: 'facility',
    title: 'Facility Usage',
    description: 'Room utilization, maintenance costs, and resource allocation',
    icon: Building,
    color: '#DC2626',
    lastRun: '2026-02-11',
  },
  {
    id: 'stewardship',
    title: 'Stewardship Report',
    description: 'Comprehensive church health assessment with key performance indicators',
    icon: TrendingUp,
    color: '#0891B2',
    lastRun: '2026-02-10',
  },
];

const recentReports = [
  {
    id: 'r001',
    name: 'January 2026 Financial Report',
    type: 'Financial',
    generatedDate: '2026-02-01',
    status: 'completed' as const,
  },
  {
    id: 'r002',
    name: 'Q4 2025 Membership Analytics',
    type: 'Membership',
    generatedDate: '2026-01-15',
    status: 'completed' as const,
  },
  {
    id: 'r003',
    name: 'Annual Stewardship Report 2025',
    type: 'Stewardship',
    generatedDate: '2026-01-10',
    status: 'completed' as const,
  },
  {
    id: 'r004',
    name: 'December Events Summary',
    type: 'Event',
    generatedDate: '2026-01-05',
    status: 'completed' as const,
  },
  {
    id: 'r005',
    name: 'Facility Usage Report - Q4',
    type: 'Facility',
    generatedDate: '2025-12-31',
    status: 'pending' as const,
  },
];

const givingSparklineData = [32400, 34200, 33800, 35100, 36500, 34900, 35700, 33600, 36200, 35800, 34500, 37200];
const membershipSparklineData = [1124, 1127, 1132, 1138, 1145, 1151, 1156, 1162, 1168, 1174, 1180, 1186];

export default function ReportsPage() {
  return (

      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Reports"
            value="12"
            icon={FileText}
            color="#2563EB"
          />
          <StatCard
            title="Scheduled Reports"
            value="3"
            icon={Calendar}
            color="#059669"
          />
          <StatCard
            title="Last Generated"
            value="Today"
            icon={Clock}
            color="#7C3AED"
          />
          <StatCard
            title="Module Coverage"
            value="7 modules"
            icon={Grid3x3}
            color="#D97706"
          />
        </div>

        {/* Engagement Alerts */}
        <div className="space-y-3">
          {[
            { title: '12 members absent 3+ consecutive weeks', desc: 'Last active: Jan 26 \u2013 Feb 2 window', color: 'border-amber-200 bg-amber-50' },
            { title: '5 recurring givers missed last 2 months', desc: 'Combined monthly giving impact: ~$2,400', color: 'border-amber-200 bg-amber-50' },
          ].map((alert) => (
            <div key={alert.title} className={`rounded-xl border-2 ${alert.color} p-4`}>
              <p className="font-semibold text-amber-800">{alert.title}</p>
              <p className="mt-1 text-sm text-amber-700">{alert.desc}</p>
            </div>
          ))}
        </div>

        {/* Giving Volatility */}
        <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-lg">&darr;</span>
            <div>
              <p className="font-semibold text-red-700">Recurring giving down 8% this quarter</p>
              <p className="text-sm text-red-600">Q1 2026 vs Q4 2025 &middot; $12,400 monthly variance</p>
            </div>
          </div>
        </div>

        {/* Attendance Anomaly */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 text-lg">&uarr;</span>
            <div>
              <p className="font-semibold text-emerald-700">Sunday attendance spike +45%</p>
              <p className="text-sm text-emerald-600">Easter effect detected &mdash; normal seasonal pattern</p>
            </div>
          </div>
        </div>

        {/* Available Reports Grid */}
        <ChartCard title="Available Reports">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableReports.map((report) => {
              const Icon = report.icon;
              return (
                <div
                  key={report.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(82,35,152,0.06)] transition-all hover:border-[#522398]/20 hover:shadow-[0_4px_12px_rgba(82,35,152,0.1)]"
                >
                  {/* Icon */}
                  <div
                    className="mb-3 inline-flex rounded-lg p-3"
                    style={{ backgroundColor: `${report.color}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: report.color }} />
                  </div>

                  {/* Content */}
                  <h4 className="font-semibold text-gray-900">{report.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{report.description}</p>

                  {/* Last Run */}
                  <div className="mt-3 text-xs text-gray-500">
                    Last run:{' '}
                    {new Date(report.lastRun).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>

                  {/* Generate Button */}
                  <button
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#522398] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#6B3FA0]"
                    onClick={() => alert('This is a demo. Report generation is not available in demo mode.')}
                  >
                    <Play className="h-4 w-4" />
                    Generate Report
                  </button>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Recent Reports Table */}
        <ChartCard title="Recent Reports">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Report Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Generated
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-[#faf8f4]">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {report.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {report.type}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {new Date(report.generatedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {report.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                      <button
                        className="inline-flex items-center gap-1 text-[#522398] hover:text-[#6B3FA0]"
                        onClick={() => alert('This is a demo. Download is not available in demo mode.')}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Summary Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Giving Trend Sparkline */}
          <ChartCard title="Giving Trend (Last 12 Weeks)">
            <div className="flex items-end justify-between gap-1">
              {givingSparklineData.map((value, index) => {
                const maxValue = Math.max(...givingSparklineData);
                const height = (value / maxValue) * 120;
                return (
                  <div
                    key={index}
                    className="flex-1 rounded-t bg-[#522398] transition-all hover:bg-[#6B3FA0]"
                    style={{ height: `${height}px` }}
                    title={`Week ${index + 1}: $${value.toLocaleString()}`}
                  />
                );
              })}
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">$35,524</div>
                <div className="text-sm text-gray-600">Average Weekly</div>
              </div>
              <div className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                <TrendingUp className="h-4 w-4" />
                +5.8%
              </div>
            </div>
          </ChartCard>

          {/* Membership Trend Sparkline */}
          <ChartCard title="Membership Trend (Last 12 Months)">
            <div className="flex items-end justify-between gap-1">
              {membershipSparklineData.map((value, index) => {
                const maxValue = Math.max(...membershipSparklineData);
                const minValue = Math.min(...membershipSparklineData);
                const height = ((value - minValue) / (maxValue - minValue)) * 120;
                return (
                  <div
                    key={index}
                    className="flex-1 rounded-t bg-emerald-600 transition-all hover:bg-emerald-700"
                    style={{ height: `${Math.max(height, 20)}px` }}
                    title={`Month ${index + 1}: ${value} members`}
                  />
                );
              })}
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">1,186</div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
              <div className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                <TrendingUp className="h-4 w-4" />
                +5.5%
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Market Callout */}
        <MarketCallout
          stat="86%"
          description="Church leaders say technology is vital for fostering connection"
          source="State of Church Technology, 2025"
        />
      </div>

  );
}
