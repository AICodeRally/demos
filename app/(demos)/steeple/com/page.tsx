'use client';

import { StatCard, ChartCard } from '@/components/demos/steeple';
import {
  MessageSquare,
  Bell,
  Mail,
  TrendingUp,
  Heart,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Video,
  Calendar,
  Users,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  ThumbsUp,
  MessageCircle,
  Share2,
  Eye,
  MousePointer,
  UserCheck,
} from 'lucide-react';
import {
  prayerRequests,
  announcements,
  emailCampaigns,
  commsStats,
} from '@/data/steeple';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
} from 'recharts';
import { useState } from 'react';

// Existing color mappings
const categoryColors: Record<string, string> = {
  health: '#DC2626',
  family: '#7C3AED',
  guidance: '#2563EB',
  gratitude: '#059669',
  community: '#D97706',
};

const priorityColors: Record<string, string> = {
  urgent: '#DC2626',
  normal: '#2563EB',
  info: '#6B7280',
};

const audienceColors: Record<string, string> = {
  all: '#2563EB',
  staff: '#7C3AED',
  volunteers: '#059669',
  youth: '#D97706',
};

// NEW: Social media mock data
const socialPlatforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    followers: 8420,
    engagement: 4.2,
    postsThisWeek: 5,
    trending: 'up',
    change: '+12%',
    color: '#1877F2',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    followers: 6230,
    engagement: 6.8,
    postsThisWeek: 7,
    trending: 'up',
    change: '+18%',
    color: '#E4405F',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    followers: 3450,
    engagement: 3.5,
    postsThisWeek: 2,
    trending: 'up',
    change: '+8%',
    color: '#FF0000',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: Video,
    followers: 4890,
    engagement: 9.2,
    postsThisWeek: 4,
    trending: 'up',
    change: '+24%',
    color: '#000000',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: Twitter,
    followers: 2150,
    engagement: 2.8,
    postsThisWeek: 6,
    trending: 'down',
    change: '-3%',
    color: '#1DA1F2',
  },
];

// NEW: Weekly engagement data
const weeklyEngagement = [
  { week: 'Week 1', Facebook: 3.8, Instagram: 5.2, YouTube: 2.9, TikTok: 7.5, Twitter: 3.1 },
  { week: 'Week 2', Facebook: 4.1, Instagram: 5.8, YouTube: 3.2, TikTok: 8.2, Twitter: 2.9 },
  { week: 'Week 3', Facebook: 3.9, Instagram: 6.1, YouTube: 3.4, TikTok: 8.8, Twitter: 2.7 },
  { week: 'Week 4', Facebook: 4.3, Instagram: 6.4, YouTube: 3.6, TikTok: 9.1, Twitter: 2.6 },
  { week: 'Week 5', Facebook: 4.0, Instagram: 6.6, YouTube: 3.3, TikTok: 8.9, Twitter: 2.8 },
  { week: 'Week 6', Facebook: 4.2, Instagram: 6.7, YouTube: 3.5, TikTok: 9.0, Twitter: 2.7 },
  { week: 'Week 7', Facebook: 4.1, Instagram: 6.9, YouTube: 3.4, TikTok: 9.3, Twitter: 2.9 },
  { week: 'Week 8', Facebook: 4.2, Instagram: 6.8, YouTube: 3.5, TikTok: 9.2, Twitter: 2.8 },
];

// NEW: Recent social posts
const recentSocialPosts = [
  {
    id: 1,
    platform: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    content: 'Join us this Sunday for our Easter celebration service! 🌸',
    date: '2 hours ago',
    likes: 342,
    comments: 28,
    shares: 15,
  },
  {
    id: 2,
    platform: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    content: 'Youth group mission trip recap - Amazing week in Haiti! 🙏',
    date: '5 hours ago',
    likes: 289,
    comments: 42,
    shares: 31,
  },
  {
    id: 3,
    platform: 'TikTok',
    icon: Video,
    color: '#000000',
    content: 'Behind the scenes: Worship team rehearsal 🎵',
    date: '1 day ago',
    likes: 1240,
    comments: 87,
    shares: 156,
  },
  {
    id: 4,
    platform: 'YouTube',
    icon: Youtube,
    color: '#FF0000',
    content: 'Sunday Sermon: Finding Peace in Chaos - Pastor Mike',
    date: '2 days ago',
    likes: 156,
    comments: 34,
    shares: 22,
  },
  {
    id: 5,
    platform: 'X (Twitter)',
    icon: Twitter,
    color: '#1DA1F2',
    content: 'Community food drive starts tomorrow! Drop-off locations...',
    date: '3 days ago',
    likes: 87,
    comments: 12,
    shares: 45,
  },
];

// NEW: Content calendar data
const contentCalendar = [
  { day: 'Mon', date: 'Feb 17', platforms: ['facebook', 'twitter'], content: 'Morning devotional' },
  { day: 'Tue', date: 'Feb 18', platforms: ['instagram', 'tiktok'], content: 'Worship team practice' },
  { day: 'Wed', date: 'Feb 19', platforms: ['facebook', 'instagram', 'twitter'], content: 'Mid-week service promo' },
  { day: 'Thu', date: 'Feb 20', platforms: ['youtube'], content: 'Sermon series teaser' },
  { day: 'Fri', date: 'Feb 21', platforms: ['instagram', 'tiktok'], content: 'Youth night highlights' },
  { day: 'Sat', date: 'Feb 22', platforms: ['facebook', 'instagram'], content: 'Weekend service reminder' },
  { day: 'Sun', date: 'Feb 23', platforms: ['facebook', 'instagram', 'youtube', 'twitter'], content: 'Live service stream' },
];

const upcomingContent = [
  { date: 'Feb 17', time: '9:00 AM', title: 'Morning Prayer Reflection', platforms: ['facebook', 'twitter'] },
  { date: 'Feb 17', time: '2:00 PM', title: 'Community Service Spotlight', platforms: ['instagram'] },
  { date: 'Feb 18', time: '10:00 AM', title: 'Scripture of the Day', platforms: ['twitter', 'facebook'] },
  { date: 'Feb 18', time: '5:00 PM', title: 'Worship Team Behind-the-Scenes', platforms: ['tiktok', 'instagram'] },
  { date: 'Feb 19', time: '12:00 PM', title: 'Mid-Week Service Announcement', platforms: ['facebook', 'instagram', 'twitter'] },
  { date: 'Feb 19', time: '7:00 PM', title: 'Small Groups - Join Us Tonight', platforms: ['facebook'] },
  { date: 'Feb 20', time: '9:00 AM', title: 'Sunday Sermon Preview', platforms: ['youtube'] },
  { date: 'Feb 20', time: '3:00 PM', title: 'Testimony Tuesday: Sarah\'s Story', platforms: ['instagram', 'facebook'] },
  { date: 'Feb 21', time: '11:00 AM', title: 'Youth Night This Friday!', platforms: ['instagram', 'tiktok'] },
  { date: 'Feb 21', time: '4:00 PM', title: 'Volunteer Appreciation Post', platforms: ['facebook', 'twitter'] },
  { date: 'Feb 22', time: '8:00 AM', title: 'Weekend Service Reminder', platforms: ['facebook', 'instagram'] },
  { date: 'Feb 22', time: '6:00 PM', title: 'Saturday Night Worship', platforms: ['instagram'] },
  { date: 'Feb 23', time: '9:00 AM', title: 'Sunday Service - Live Stream', platforms: ['facebook', 'youtube'] },
  { date: 'Feb 23', time: '11:00 AM', title: 'Second Service - Live Stream', platforms: ['facebook', 'youtube'] },
  { date: 'Feb 23', time: '5:00 PM', title: 'Sunday Highlights Reel', platforms: ['instagram', 'tiktok'] },
];

// NEW: Email funnel data
const emailFunnelData = [
  { stage: 'Sent', value: 5420, color: '#2563EB' },
  { stage: 'Opened', value: 3254, color: '#7C3AED' },
  { stage: 'Clicked', value: 1247, color: '#059669' },
  { stage: 'Converted', value: 342, color: '#DC2626' },
];

// NEW: A/B test results
const abTestResults = {
  testName: 'Easter Service Invite - Subject Line Test',
  variant_a: {
    subject: 'You\'re Invited: Easter Celebration Service',
    sent: 2710,
    openRate: 58.2,
    clickRate: 22.4,
  },
  variant_b: {
    subject: 'Join Us for Easter Sunday 🌸',
    sent: 2710,
    openRate: 64.7,
    clickRate: 26.8,
  },
  winner: 'B',
};

// NEW: Outreach metrics
const outreachMetrics = [
  { month: 'Jan', reach: 12400, engagement: 8200, conversions: 420 },
  { month: 'Feb', reach: 13800, engagement: 9100, conversions: 485 },
  { month: 'Mar', reach: 15400, engagement: 10200, conversions: 562 },
  { month: 'Apr', reach: 14200, engagement: 9400, conversions: 518 },
];

const platformColorMap: Record<string, string> = {
  facebook: '#1877F2',
  instagram: '#E4405F',
  youtube: '#FF0000',
  tiktok: '#000000',
  twitter: '#1DA1F2',
};

// Consent status badges for contact/recipient entries
const consentStatuses = [
  { label: 'Opted In', className: 'bg-emerald-50 text-emerald-700' },
  { label: 'Opted Out', className: 'bg-red-50 text-red-600' },
  { label: 'Pending', className: 'bg-amber-50 text-amber-700' },
];

// 80% Opted In, 10% Out, 10% Pending
function getConsentStatus(index: number) {
  const mod = index % 10;
  if (mod === 8) return consentStatuses[1]; // Opted Out
  if (mod === 9) return consentStatuses[2]; // Pending
  return consentStatuses[0]; // Opted In
}

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<'social' | 'email' | 'prayer' | 'announcements'>('social');

  const tabs = [
    { id: 'social' as const, label: 'Social Media', icon: Share2 },
    { id: 'email' as const, label: 'Email Campaigns', icon: Mail },
    { id: 'prayer' as const, label: 'Prayer Wall', icon: Heart },
    { id: 'announcements' as const, label: 'Announcements', icon: Bell },
  ];

  return (

      <div className="space-y-6">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Reach (This Month)"
            value="15.4K"
            icon={Users}
            color="#2563EB"
          />
          <StatCard
            title="Engagement Score"
            value="5.8"
            icon={Zap}
            color="#059669"
          />
          <StatCard
            title="Active Prayer Requests"
            value={commsStats.activePrayerRequests}
            icon={Heart}
            color="#DC2626"
          />
          <StatCard
            title="Email Open Rate"
            value={`${commsStats.averageOpenRate}%`}
            icon={TrendingUp}
            color="#7C3AED"
          />
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors
                    ${
                      activeTab === tab.id
                        ? 'border-[#522398] text-[#522398]'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SOCIAL MEDIA TAB */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            {/* Platform Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                const TrendIcon = platform.trending === 'up' ? ArrowUp : ArrowDown;
                return (
                  <div
                    key={platform.id}
                    className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(82,35,152,0.06)] hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${platform.color}15` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: platform.color }} />
                      </div>
                      <div
                        className={`flex items-center gap-1 text-sm font-semibold ${
                          platform.trending === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        <TrendIcon className="h-4 w-4" />
                        {platform.change}
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">{platform.name}</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {platform.followers.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">followers</p>
                    <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Engagement</span>
                        <span className="font-semibold text-gray-900">{platform.engagement}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Posts this week</span>
                        <span className="font-semibold text-gray-900">{platform.postsThisWeek}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weekly Engagement Chart */}
            <ChartCard title="Weekly Engagement Trends">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyEngagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" />
                  <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} label={{ value: 'Engagement %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Facebook" stroke="#1877F2" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Instagram" stroke="#E4405F" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="YouTube" stroke="#FF0000" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="TikTok" stroke="#000000" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Twitter" stroke="#1DA1F2" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Recent Posts Feed */}
            <ChartCard title="Recent Social Posts">
              <div className="space-y-3">
                {recentSocialPosts.map((post) => {
                  const Icon = post.icon;
                  return (
                    <div
                      key={post.id}
                      className="rounded-xl border border-gray-100 bg-white p-4 hover:bg-[#faf8f4] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${post.color}15` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: post.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{post.platform}</span>
                            <span className="text-xs text-gray-500">{post.date}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-700">{post.content}</p>
                          <div className="mt-3 flex items-center gap-6 text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <ThumbsUp className="h-4 w-4" />
                              <span className="font-medium">{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MessageCircle className="h-4 w-4" />
                              <span className="font-medium">{post.comments}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Share2 className="h-4 w-4" />
                              <span className="font-medium">{post.shares}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ChartCard>

            {/* Content Calendar */}
            <ChartCard title="Content Calendar - This Week">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                {contentCalendar.map((day) => (
                  <div
                    key={day.day}
                    className="rounded-xl border border-gray-100 bg-white p-3 hover:shadow-md transition-shadow shadow-[0_1px_3px_rgba(82,35,152,0.06)]"
                  >
                    <div className="text-center">
                      <div className="text-xs font-semibold text-gray-900">{day.day}</div>
                      <div className="text-xs text-gray-500">{day.date}</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                      {day.platforms.map((platform) => (
                        <div
                          key={platform}
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: platformColorMap[platform] }}
                          title={platform}
                        />
                      ))}
                    </div>
                    <div className="mt-2 text-[10px] leading-tight text-gray-600 text-center">
                      {day.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Upcoming Scheduled Posts</h4>
                <div className="space-y-2">
                  {upcomingContent.slice(0, 10).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <span className="w-16 text-gray-600">{item.date}</span>
                      <span className="w-16 text-gray-600">{item.time}</span>
                      <span className="flex-1 text-gray-900">{item.title}</span>
                      <div className="flex gap-1">
                        {item.platforms.map((platform) => (
                          <div
                            key={platform}
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: platformColorMap[platform] }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>

            {/* Outreach Metrics */}
            <ChartCard title="Outreach Metrics - Quarterly View">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={outreachMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reach" fill="#2563EB" name="Community Reach" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="engagement" fill="#7C3AED" name="Engagement" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conversions" fill="#059669" name="Conversions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">15,400</div>
                  <div className="text-xs text-gray-600">People Reached (Mar)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">10,200</div>
                  <div className="text-xs text-gray-600">Total Engagements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">562</div>
                  <div className="text-xs text-gray-600">Conversions</div>
                </div>
              </div>
            </ChartCard>
          </div>
        )}

        {/* EMAIL CAMPAIGNS TAB */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            {/* Email Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Emails Sent (This Month)"
                value={commsStats.emailsSentThisMonth.toLocaleString()}
                icon={Mail}
                color="#2563EB"
              />
              <StatCard
                title="Average Open Rate"
                value={`${commsStats.averageOpenRate}%`}
                icon={Eye}
                color="#7C3AED"
              />
              <StatCard
                title="Click-Through Rate"
                value="23.1%"
                icon={MousePointer}
                color="#059669"
              />
              <StatCard
                title="Conversions"
                value="342"
                icon={UserCheck}
                color="#DC2626"
              />
            </div>

            {/* Delivery Metrics */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)]">
              <h3 className="text-lg font-semibold text-[#2d3142]">Email Campaign Performance</h3>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Sent', value: '2,450', pct: '100%', color: 'text-gray-700' },
                  { label: 'Delivered', value: '2,380', pct: '97.1%', color: 'text-blue-600' },
                  { label: 'Opened', value: '1,640', pct: '68.9%', color: 'text-[#522398]' },
                  { label: 'Clicked', value: '420', pct: '17.6%', color: 'text-[#C5972C]' },
                ].map((metric) => (
                  <div key={metric.label} className="text-center">
                    <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                    <div className="text-xs text-gray-500">{metric.label}</div>
                    <div className="mt-1 text-[11px] font-semibold text-gray-400">{metric.pct}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Segment Builder Preview */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)]">
              <h3 className="text-lg font-semibold text-[#2d3142]">Audience Segments</h3>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {['Status: Active', 'Attendance: >70%', 'Joined: Last 6 months'].map((filter) => (
                  <span key={filter} className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-[#522398]">
                    {filter}
                  </span>
                ))}
                <span className="text-sm font-semibold text-[#C5972C]">&rarr; 127 members match</span>
              </div>
            </div>

            {/* Email Funnel */}
            <ChartCard title="Latest Campaign Funnel - Easter Service Invite">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart layout="vertical" data={emailFunnelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" />
                    <XAxis type="number" stroke="#6b7280" fontSize={12} />
                    <YAxis dataKey="stage" type="category" stroke="#6b7280" fontSize={12} width={80} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {emailFunnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList dataKey="value" position="right" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">Funnel Breakdown</h4>
                  {emailFunnelData.map((stage, idx) => {
                    const prevValue = idx > 0 ? emailFunnelData[idx - 1].value : stage.value;
                    const conversionRate = ((stage.value / prevValue) * 100).toFixed(1);
                    return (
                      <div key={stage.stage} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${stage.color}15` }}>
                          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: stage.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                            <span className="text-sm font-bold text-gray-900">{stage.value.toLocaleString()}</span>
                          </div>
                          {idx > 0 && (
                            <div className="text-xs text-gray-600">
                              {conversionRate}% conversion rate
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-4 rounded-lg bg-green-50 p-3 border border-green-200 rounded-xl">
                    <div className="text-xs text-green-800">
                      <span className="font-semibold">Overall Conversion:</span> 6.3% (342 of 5,420)
                    </div>
                  </div>
                </div>
              </div>
            </ChartCard>

            {/* A/B Test Results */}
            <ChartCard title="A/B Test Results - Subject Line Performance">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Variant A */}
                <div className="rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-900">Variant A</h4>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Control
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 italic">"{abTestResults.variant_a.subject}"</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Recipients</span>
                        <span className="font-semibold text-gray-900">{abTestResults.variant_a.sent.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Open Rate</span>
                        <span className="font-semibold text-gray-900">{abTestResults.variant_a.openRate}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-blue-600" style={{ width: `${abTestResults.variant_a.openRate}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Click Rate</span>
                        <span className="font-semibold text-gray-900">{abTestResults.variant_a.clickRate}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-purple-600" style={{ width: `${abTestResults.variant_a.clickRate}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variant B */}
                <div className="rounded-xl border-2 border-emerald-500 p-5 bg-green-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-900">Variant B</h4>
                    <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                      Winner 🏆
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 italic">"{abTestResults.variant_b.subject}"</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Recipients</span>
                        <span className="font-semibold text-gray-900">{abTestResults.variant_b.sent.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Open Rate</span>
                        <span className="font-semibold text-gray-900">{abTestResults.variant_b.openRate}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-blue-600" style={{ width: `${abTestResults.variant_b.openRate}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Click Rate</span>
                        <span className="font-semibold text-gray-900">{abTestResults.variant_b.clickRate}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-purple-600" style={{ width: `${abTestResults.variant_b.clickRate}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-[#522398]/5 p-4 border border-[#522398]/10">
                <p className="text-xs text-[#522398]">
                  <span className="font-semibold">Key Insight:</span> Adding an emoji increased open rate by 6.5%
                  and click rate by 4.4%. Consider using emojis in future subject lines for promotional content.
                </p>
              </div>
            </ChartCard>

            {/* Campaign History Table */}
            <ChartCard title="Campaign History">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Sent Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Recipients
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Open Rate
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Click Rate
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Consent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {emailCampaigns.map((campaign, campaignIdx) => {
                      const consent = getConsentStatus(campaignIdx);
                      return (
                      <tr key={campaign.id} className="hover:bg-[#faf8f4]">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {campaign.subject}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                          {new Date(campaign.sentDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {campaign.recipients.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[100px]">
                              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className="h-full rounded-full bg-blue-600"
                                  style={{ width: `${campaign.openRate}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-gray-900 font-medium">{campaign.openRate}%</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                          {campaign.clickRate}%
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${consent.className}`}>
                            {consent.label}
                          </span>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        )}

        {/* PRAYER WALL TAB */}
        {activeTab === 'prayer' && (
          <div className="space-y-6">
            <ChartCard title="Prayer Wall">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {prayerRequests.slice(0, 9).map((request) => (
                  <div key={request.id} className="rounded-xl border border-gray-100 bg-white p-4 hover:shadow-md transition-shadow shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {request.isAnonymous ? 'Anonymous' : request.author}
                        </p>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                          {request.request.length > 100
                            ? `${request.request.substring(0, 100)}...`
                            : request.request}
                        </p>
                      </div>
                      <span
                        className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: categoryColors[request.category] }}
                      >
                        {request.category}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(request.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                        <span className="font-medium">{request.prayerCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        )}

        {/* ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <ChartCard title="Announcements">
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="rounded-xl border border-gray-100 bg-white p-4 hover:bg-[#faf8f4] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                            style={{ backgroundColor: priorityColors[announcement.priority] }}
                          >
                            {announcement.priority}
                          </span>
                          <h4 className="text-sm font-semibold text-gray-900">{announcement.title}</h4>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{announcement.body}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                          <span>{announcement.author}</span>
                          <span>•</span>
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: `${audienceColors[announcement.audience]}15`,
                              color: audienceColors[announcement.audience],
                            }}
                          >
                            {announcement.audience}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(announcement.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        )}
      </div>

  );
}
