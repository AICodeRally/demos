'use client';

import { StatCard, ChartCard, EdgeBadge, MarketCallout } from '@/components/demos/steeple';
import {
  Users,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  ArrowRight,
  Heart,
  UserPlus,
  Video,
  UsersRound,
  Megaphone,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Target,
  HandHeart,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Link from 'next/link';
import { weeklyTotals, memberStats, recentDonations } from '@/data/steeple';
import { events } from '@/data/steeple/events';

// Get last 12 weeks of giving data
const recentGivingData = weeklyTotals.slice(-12).map(week => ({
  week: week.date,
  total: week.total,
}));

// Calculate week-over-week change
const currentWeekTotal = weeklyTotals[weeklyTotals.length - 1]?.total || 0;
const previousWeekTotal = weeklyTotals[weeklyTotals.length - 2]?.total || 0;
const givingChange = previousWeekTotal > 0
  ? Number((((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100).toFixed(1))
  : 0;

// Calculate member growth
const memberChange = 3.2;

// Count active events this month
const activeEvents = events.filter(e => {
  const eventDate = new Date(e.date);
  const now = new Date();
  return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
}).length;

// Calculate volunteer hours (mock calculation)
const volunteerHours = 3240;

// Church Health Score Data
const healthScore = 87;
const healthDimensions = [
  { name: 'Financial Health', score: 92, color: '#C5972C' },
  { name: 'Engagement', score: 88, color: '#8B5CF6' },
  { name: 'Growth', score: 85, color: '#7C3AED' },
  { name: 'Volunteerism', score: 84, color: '#4338CA' },
  { name: 'Outreach', score: 86, color: '#D97706' },
];

// Health donut chart data
const healthDonutData = healthDimensions.map((dim, index) => ({
  name: dim.name,
  value: dim.score,
  fill: dim.color,
}));

// Additional KPI metrics
const additionalKPIs = [
  {
    title: 'Giving Per Capita',
    value: '$861',
    subtitle: 'per member',
    icon: DollarSign,
    color: '#C5972C',
    trend: '+5.2%',
  },
  {
    title: 'Visitor Conversion',
    value: '34%',
    subtitle: 'visitors → members',
    icon: UserPlus,
    color: '#8B5CF6',
    trend: '+2.1%',
  },
  {
    title: 'Online Attendance',
    value: '1,240',
    subtitle: 'avg viewers',
    icon: Video,
    color: '#7C3AED',
    trend: '+18%',
  },
  {
    title: 'Volunteer Ratio',
    value: '1:4.4',
    subtitle: 'volunteer per 4.4 members',
    icon: UsersRound,
    color: '#4338CA',
    trend: 'Healthy',
  },
];

// Social media pulse data
const socialMediaStats = [
  { platform: 'Facebook', followers: '4.2K', growth: '+12%', icon: Facebook, color: '#1877F2' },
  { platform: 'Instagram', followers: '2.8K', growth: '+18%', icon: Instagram, color: '#E4405F' },
  { platform: 'YouTube', followers: '890', growth: '+8%', icon: Youtube, color: '#FF0000' },
  { platform: 'Website', followers: '12.4K', growth: 'monthly visits', icon: Globe, color: '#522398' },
];

// Upcoming events this week
const upcomingEvents = [
  {
    title: 'Wednesday Prayer Meeting',
    time: 'Wed, Feb 19 • 7:00 PM',
    location: 'Chapel',
    attendees: 45,
    color: '#7C3AED',
  },
  {
    title: 'Youth Group',
    time: 'Thu, Feb 20 • 6:30 PM',
    location: 'Youth Center',
    attendees: 78,
    color: '#8B5CF6',
  },
  {
    title: 'Men\'s Breakfast',
    time: 'Sat, Feb 22 • 8:00 AM',
    location: 'Fellowship Hall',
    attendees: 32,
    color: '#D97706',
  },
  {
    title: 'Sunday Service',
    time: 'Sun, Feb 23 • 10:00 AM',
    location: 'Main Sanctuary',
    attendees: 1240,
    color: '#4338CA',
  },
  {
    title: 'New Members Class',
    time: 'Sun, Feb 23 • 12:00 PM',
    location: 'Room 204',
    attendees: 18,
    color: '#9333EA',
  },
];

// Recent activity feed (mixing donations, events, new members)
const recentActivity = [
  {
    type: 'donation',
    title: 'Michael Johnson donated $1,200',
    subtitle: 'General Fund via online giving',
    time: '2 hours ago',
    icon: DollarSign,
    color: '#C5972C',
  },
  {
    type: 'event',
    title: 'Easter Celebration Service scheduled',
    subtitle: 'April 12 at 10:00 AM in Main Sanctuary',
    time: '5 hours ago',
    icon: Calendar,
    color: '#7C3AED',
  },
  {
    type: 'member',
    title: 'New member: Sarah Williams',
    subtitle: 'Joined via New Members Class',
    time: '1 day ago',
    icon: Users,
    color: '#8B5CF6',
  },
  {
    type: 'donation',
    title: 'Robert Anderson donated $1,500',
    subtitle: 'General Fund via online giving',
    time: '1 day ago',
    icon: DollarSign,
    color: '#C5972C',
  },
  {
    type: 'event',
    title: 'Youth Retreat Weekend confirmed',
    subtitle: '65 attendees, 12 volunteers',
    time: '2 days ago',
    icon: Calendar,
    color: '#7C3AED',
  },
];

// Module quick links
const moduleLinks = [
  { name: 'Stewardship & Finance', href: '/steeple/tfm', color: '#C5972C', description: 'Manage donations, funds, and campaigns' },
  { name: 'Events & Gatherings', href: '/steeple/evm', color: '#7C3AED', description: 'Schedule and coordinate events' },
  { name: 'Congregation & Families', href: '/steeple/mbm', color: '#8B5CF6', description: 'Track members and families' },
  { name: 'Outreach & Communications', href: '/steeple/com', color: '#D97706', description: 'Send messages and newsletters' },
  { name: 'Campus & Facilities', href: '/steeple/flm', color: '#9333EA', description: 'Manage rooms and resources' },
  { name: 'Leadership & Ministry', href: '/steeple/ldm', color: '#4338CA', description: 'Leadership tools and analytics' },
];

export default function DashboardPage() {
  return (
      <div className="space-y-6">
        {/* Edge sync indicator */}
        <div className="flex justify-end">
          <EdgeBadge variant="sync" />
        </div>

        {/* Hero Section with Easter Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#522398] via-[#6B3FA0] to-[#522398] p-8 shadow-lg">
          {/* Subtle radial overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)]" />

          {/* Welcome text */}
          <div className="relative mb-6">
            <h2 className="text-2xl font-bold text-white">Grace Community Church</h2>
            <p className="mt-1 text-white/80">
              Powered by STEEPLE — The complete church management platform
            </p>
          </div>

          {/* Easter Banner (embedded in hero) */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 shadow-lg">
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
              <Sparkles className="h-full w-full" />
            </div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-white/20 p-3">
                  <Megaphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Easter Service Registration Now Open</h3>
                  <p className="text-sm text-white/90">3 services available • April 12 • Registration closes April 5</p>
                </div>
              </div>
              <Link
                href="/steeple/evm"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-amber-600 shadow-sm transition-all hover:bg-amber-50"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>

        {/* Market context */}
        <MarketCallout
          stat="380,000+"
          description="Congregations across the United States served by church management platforms"
          source="Hartford Institute, 2023"
        />

        {/* Church Health Score + Primary Stats */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Church Health Score */}
          <div className="lg:col-span-1">
            <ChartCard title="Church Health Score">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { value: healthScore, fill: '#522398' },
                          { value: 100 - healthScore, fill: '#E5E7EB' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                      >
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{healthScore}</div>
                      <div className="text-sm text-gray-600">/ 100</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 w-full space-y-3">
                  {healthDimensions.map((dim) => (
                    <div key={dim.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-700">{dim.name}</span>
                        <span className="font-semibold" style={{ color: dim.color }}>{dim.score}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${dim.score}%`,
                            backgroundColor: dim.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Primary Stats */}
          <div className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                title="Total Members"
                value={memberStats.totalMembers.toLocaleString()}
                change={memberChange}
                icon={Users}
                color="#8B5CF6"
              />
              <StatCard
                title="Weekly Giving"
                value={`$${currentWeekTotal.toLocaleString()}`}
                change={givingChange}
                icon={DollarSign}
                color="#C5972C"
              />
              <StatCard
                title="Active Events"
                value={activeEvents}
                icon={Calendar}
                color="#7C3AED"
              />
              <StatCard
                title="Volunteer Hours"
                value={`${volunteerHours.toLocaleString()}/mo`}
                icon={Clock}
                color="#4338CA"
              />
            </div>

            {/* Additional KPIs */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {additionalKPIs.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={kpi.title}
                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                        <div className="mt-1 flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                          <p className="text-xs text-gray-500">{kpi.subtitle}</p>
                        </div>
                        <p className="mt-1 text-xs font-medium text-green-600">{kpi.trend}</p>
                      </div>
                      <div
                        className="rounded-lg p-2"
                        style={{ backgroundColor: `${kpi.color}15` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: kpi.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming This Week */}
        <ChartCard title="Upcoming This Week">
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg border border-gray-100 bg-[#faf8f4] p-3 transition-all hover:border-gray-200 hover:bg-white"
              >
                <div
                  className="h-12 w-1 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  <div className="mt-0.5 flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {event.time}
                    </span>
                    <span>•</span>
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                    <Users className="h-4 w-4 text-gray-400" />
                    {event.attendees}
                  </div>
                  <p className="text-xs text-gray-500">expected</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Charts Row - Giving Trend & Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Giving Trend */}
          <ChartCard title="Weekly Giving Trend">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={recentGivingData}>
                <defs>
                  <linearGradient id="colorTotalNavy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#522398" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#522398" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, 'Total']}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#522398"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotalNavy)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Recent Activity */}
          <ChartCard title="Recent Activity">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className="rounded-lg p-2"
                      style={{ backgroundColor: `${activity.color}15` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: activity.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.subtitle}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>

        {/* Social Media Pulse */}
        <div>
          <h3 className="text-lg font-semibold text-[#2d3142] tracking-tight mb-4">Social Media Pulse</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {socialMediaStats.map((social) => {
              const Icon = social.icon;
              return (
                <div
                  key={social.platform}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)] transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-lg p-2.5"
                      style={{ backgroundColor: `${social.color}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: social.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">{social.platform}</p>
                      <div className="mt-0.5 flex items-baseline gap-2">
                        <p className="text-xl font-bold text-gray-900">{social.followers}</p>
                        <p className="text-xs font-semibold text-green-600">{social.growth}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-[#2d3142] tracking-tight mb-4">Quick Access to Modules</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {moduleLinks.map((module) => (
              <Link
                key={module.name}
                href={module.href}
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(82,35,152,0.06)] transition-all hover:shadow-[0_4px_12px_rgba(82,35,152,0.1)]"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: module.color }} />
                <div className="pl-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                        {module.name}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">{module.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
  );
}
