'use client';


import {
  TECHNICIANS,
  WORKFORCE_KPIS,
  SKILL_GAP_DATA,
  KNOWLEDGE_CAPTURE_TREND,
  REPAIR_COMPARISON,
} from '@/data/equipr/ai-workforce';
import type { Technician, SkillLevel } from '@/data/equipr/ai-workforce';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { GraduationCap, Users, Brain, ShieldCheck, Clock, BookOpen, Search, Wrench } from 'lucide-react';

/* ── Tooltip style ──────────────────────────────────────────── */

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  color: '#111827',
  fontSize: 12,
  boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
};

/* ── Skill Level Badges ─────────────────────────────────────── */

const SKILL_BADGE: Record<SkillLevel, { bg: string; text: string; label: string }> = {
  expert: { bg: 'rgba(16,185,129,0.12)', text: '#059669', label: 'Expert' },
  proficient: { bg: 'rgba(37,99,235,0.12)', text: '#2563EB', label: 'Proficient' },
  developing: { bg: 'rgba(245,158,11,0.12)', text: '#D97706', label: 'Developing' },
  novice: { bg: 'rgba(107,114,128,0.12)', text: '#6B7280', label: 'Novice' },
};

/* ── KPI Card ───────────────────────────────────────────────── */

function KpiCard({
  label,
  value,
  accent,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  accent: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}) {
  return (
    <div
      className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
      style={{
        background: 'var(--prizym-card-bg)',
        border: '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <div>
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            {label}
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {value}
          </div>
          {sub && (
            <div
              className="text-[11px] mt-1.5"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              {sub}
            </div>
          )}
        </div>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
          style={{ background: `${accent}15` }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

/* ── Technician Card ────────────────────────────────────────── */

function TechCard({ tech }: { tech: Technician }) {
  const badge = SKILL_BADGE[tech.skillLevel];
  return (
    <div
      className="rounded-xl p-4 transition-shadow hover:shadow-md"
      style={{
        background: 'var(--prizym-card-bg)',
        border: '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
      }}
    >
      {/* Row 1: Name + badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold"
            style={{
              background: badge.bg,
              color: badge.text,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {tech.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div
              className="text-[13px] font-semibold"
              style={{ color: 'var(--prizym-text-primary)' }}
            >
              {tech.name}
            </div>
            <div
              className="text-[11px]"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              {tech.yearsExperience} yrs experience
            </div>
          </div>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
          style={{ background: badge.bg, color: badge.text }}
        >
          {badge.label}
        </span>
      </div>

      {/* Row 2: Specialties */}
      <div className="flex flex-wrap gap-1 mb-3">
        {tech.specialties.map(s => (
          <span
            key={s}
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(139,92,246,0.08)',
              color: '#7C3AED',
              border: '1px solid rgba(139,92,246,0.15)',
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Row 3: Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div
            className="text-[10px] uppercase"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Fix Rate
          </div>
          <div
            className="text-[14px] font-bold"
            style={{
              color: tech.firstTimeFixRate >= 90 ? '#059669' : tech.firstTimeFixRate >= 80 ? '#2563EB' : '#D97706',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {tech.firstTimeFixRate}%
          </div>
        </div>
        <div className="text-center">
          <div
            className="text-[10px] uppercase"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Avg Repair
          </div>
          <div
            className="text-[14px] font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {tech.avgRepairTime}h
          </div>
        </div>
        <div className="text-center">
          <div
            className="text-[10px] uppercase"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            AI Queries
          </div>
          <div
            className="text-[14px] font-bold"
            style={{
              color: '#8B5CF6',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {tech.aiAssistUsage}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Example Knowledge Entry ────────────────────────────────── */

function KnowledgeEntry({ title, content }: { title: string; content: string }) {
  return (
    <div
      className="rounded-lg px-4 py-3"
      style={{
        background: 'rgba(139,92,246,0.04)',
        border: '1px solid rgba(139,92,246,0.12)',
      }}
    >
      <div className="flex items-start gap-2.5">
        <BookOpen className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: '#8B5CF6' }} />
        <div>
          <div
            className="text-[12px] font-semibold"
            style={{ color: 'var(--prizym-text-primary)' }}
          >
            {title}
          </div>
          <div
            className="text-[11px] mt-0.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════ */

const sortedTechs = [...TECHNICIANS].sort((a, b) => b.yearsExperience - a.yearsExperience);

export default function AIWorkforcePage() {
  return (
    <>
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            AI Workforce Intelligence
          </h1>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            Closing the experience gap with AI-powered knowledge capture and mentoring
          </p>
        </div>
        <div
          className="text-[12px] font-medium px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(139,92,246,0.12)',
            color: '#8B5CF6',
            border: '1px solid rgba(139,92,246,0.25)',
          }}
        >
          Feb 2026
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 1: Hero KPIs
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Avg Experience"
          value={`${WORKFORCE_KPIS.avgExperience} yrs`}
          accent="#F59E0B"
          sub="down from 12.4 yrs in 2021"
          icon={Users}
        />
        <KpiCard
          label="AI Knowledge Queries"
          value={`${WORKFORCE_KPIS.aiKnowledgeQueries}/mo`}
          accent="#8B5CF6"
          sub={`${WORKFORCE_KPIS.knowledgeArticles.toLocaleString()} articles captured`}
          icon={Brain}
        />
        <KpiCard
          label="First-Time Fix Rate"
          value={`+${WORKFORCE_KPIS.firstTimeFixImprovement}%`}
          accent="#10B981"
          sub="improvement with AI assist"
          icon={Wrench}
        />
        <KpiCard
          label="Repair Time"
          value={`-${WORKFORCE_KPIS.repairTimeReduction}%`}
          accent="#2563EB"
          sub="faster with AI guidance"
          icon={Clock}
        />
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 2: "The Experience Gap" — Money Shot
          ════════════════════════════════════════════════════ */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-1">
          <GraduationCap className="h-5 w-5" style={{ color: '#8B5CF6' }} />
          <h2
            className="text-[15px] font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Closing the Experience Gap with AI
          </h2>
        </div>
        <p
          className="text-[12px] mb-5"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          Proficiency score comparison: veteran benchmark vs. current workforce without AI vs. current workforce with AI assist
        </p>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={SKILL_GAP_DATA}
            margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
            barCategoryGap="18%"
            barGap={3}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="skill"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  veteranAvg: 'Veteran Benchmark',
                  currentAvg: 'Without AI',
                  aiAssistedAvg: 'With AI Assist',
                };
                return [`${value}%`, labels[String(name)] || String(name)];
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  veteranAvg: 'Veteran Benchmark',
                  currentAvg: 'Without AI',
                  aiAssistedAvg: 'With AI Assist',
                };
                return labels[value] || value;
              }}
              wrapperStyle={{ fontSize: 12 }}
            />
            <Bar
              dataKey="veteranAvg"
              fill="#1E3A5F"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
            <Bar
              dataKey="currentAvg"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
            <Bar
              dataKey="aiAssistedAvg"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 3: Two Panels
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Left: Technician Roster */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{
              background: '#F3F4F6',
              borderBottom: '1px solid var(--prizym-border-default)',
            }}
          >
            <h3
              className="text-[13px] font-bold"
              style={{
                color: 'var(--prizym-text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Technician Roster
            </h3>
            <span
              className="text-[11px]"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              {sortedTechs.length} techs
            </span>
          </div>
          <div className="p-4 flex flex-col gap-3 max-h-[520px] overflow-y-auto">
            {sortedTechs.map(tech => (
              <TechCard key={tech.id} tech={tech} />
            ))}
          </div>
        </div>

        {/* Right: Knowledge Capture */}
        <div className="flex flex-col gap-4">
          {/* Chart */}
          <div
            className="rounded-xl p-5"
            style={{
              background: 'var(--prizym-card-bg)',
              border: '1px solid var(--prizym-border-default)',
              boxShadow: 'var(--prizym-shadow-card)',
            }}
          >
            <h3
              className="text-[13px] font-bold mb-4"
              style={{
                color: 'var(--prizym-text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Knowledge Capture Trend
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={KNOWLEDGE_CAPTURE_TREND}
                margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
              >
                <defs>
                  <linearGradient id="gradArticles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => {
                    const labels: Record<string, string> = {
                      articlesAdded: 'Articles Added',
                      queriesAnswered: 'Queries Answered',
                    };
                    return [value, labels[String(name)] || String(name)];
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={28}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      articlesAdded: 'Articles Added',
                      queriesAnswered: 'Queries Answered',
                    };
                    return labels[value] || value;
                  }}
                  wrapperStyle={{ fontSize: 11 }}
                />
                <Area
                  type="monotone"
                  dataKey="articlesAdded"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fill="url(#gradArticles)"
                />
                <Area
                  type="monotone"
                  dataKey="queriesAnswered"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fill="url(#gradQueries)"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Stat below chart */}
            <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <Search className="h-3.5 w-3.5" style={{ color: '#8B5CF6' }} />
              <span
                className="text-[13px] font-bold"
                style={{
                  color: 'var(--prizym-text-primary)',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {WORKFORCE_KPIS.knowledgeArticles.toLocaleString()}
              </span>
              <span
                className="text-[12px]"
                style={{ color: 'var(--prizym-text-secondary)' }}
              >
                expert knowledge articles captured
              </span>
            </div>
          </div>

          {/* Example Knowledge Entries */}
          <div
            className="rounded-xl p-5"
            style={{
              background: 'var(--prizym-card-bg)',
              border: '1px solid var(--prizym-border-default)',
              boxShadow: 'var(--prizym-shadow-card)',
            }}
          >
            <h3
              className="text-[13px] font-bold mb-3"
              style={{
                color: 'var(--prizym-text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Sample Knowledge Base Entries
            </h3>
            <div className="flex flex-col gap-2.5">
              <KnowledgeEntry
                title="CAT 320 Hydraulic Pump — Error Code H47"
                content="Replace seal ring (Part #4T-0356), torque to 85 ft-lbs. Flush lines before reassembly."
              />
              <KnowledgeEntry
                title="Genie S-60 Boom — Platform won't extend"
                content="Check flow control valve, common failure at 800hrs. Valve kit #GN-82451. 45-min fix."
              />
              <KnowledgeEntry
                title="Wacker DPU 6555 — Excessive vibration at idle"
                content="Inspect exciter bearing (Part #5000182382). Replace if play exceeds 0.3mm. Grease weekly."
              />
            </div>
          </div>

          {/* Repair Time Comparison */}
          <div
            className="rounded-xl p-5"
            style={{
              background: 'var(--prizym-card-bg)',
              border: '1px solid var(--prizym-border-default)',
              boxShadow: 'var(--prizym-shadow-card)',
            }}
          >
            <h3
              className="text-[13px] font-bold mb-4"
              style={{
                color: 'var(--prizym-text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Avg Repair Time by Category
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={REPAIR_COMPARISON}
                layout="vertical"
                margin={{ top: 5, right: 30, bottom: 5, left: 10 }}
                barGap={2}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.06)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
                  tickLine={false}
                  tickFormatter={(v) => `${v}h`}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fill: '#374151', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => {
                    const labels: Record<string, string> = {
                      withoutAI: 'Without AI',
                      withAI: 'With AI Assist',
                    };
                    return [`${value}h`, labels[String(name)] || String(name)];
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={28}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      withoutAI: 'Without AI',
                      withAI: 'With AI Assist',
                    };
                    return labels[value] || value;
                  }}
                  wrapperStyle={{ fontSize: 11 }}
                />
                <Bar
                  dataKey="withoutAI"
                  fill="#EF4444"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={16}
                />
                <Bar
                  dataKey="withAI"
                  fill="#10B981"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 4: Impact Summary Banner
          ════════════════════════════════════════════════════ */}
      <div
        className="rounded-xl px-6 py-5"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(16,185,129,0.06) 100%)',
          border: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#10B981' }} />
          <div>
            <div
              className="text-[13px] font-bold mb-1.5"
              style={{
                color: 'var(--prizym-text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Since deploying AI-assisted knowledge base:
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              <span className="text-[12px]" style={{ color: 'var(--prizym-text-secondary)' }}>
                <span className="font-bold" style={{ color: '#10B981' }}>41%</span> fewer safety incidents
              </span>
              <span className="text-[12px]" style={{ color: 'rgba(0,0,0,0.15)' }}>|</span>
              <span className="text-[12px]" style={{ color: 'var(--prizym-text-secondary)' }}>
                Repair callbacks <span className="font-bold" style={{ color: '#10B981' }}>down 34%</span>
              </span>
              <span className="text-[12px]" style={{ color: 'rgba(0,0,0,0.15)' }}>|</span>
              <span className="text-[12px]" style={{ color: 'var(--prizym-text-secondary)' }}>
                Junior techs performing at <span className="font-bold" style={{ color: '#8B5CF6' }}>87%</span> of veteran benchmark
                <span className="text-[11px]" style={{ color: 'var(--prizym-text-muted)' }}> (up from 62%)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
