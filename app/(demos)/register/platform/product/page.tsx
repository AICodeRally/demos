'use client';

import {
  Building2, Target, Monitor, TrendingUp, DollarSign, Network,
  Clock, AlertTriangle, Eye, Brain,
  CheckCircle,
} from 'lucide-react';
import { ACT_SUMMARY, ROI_METRICS } from '@/data/register/platform-data';

const actIconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>> = {
  Building2,
  Target,
  Monitor,
  TrendingUp,
  DollarSign,
  Network,
};

const roiIconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Clock,
  TrendingUp,
  AlertTriangle,
  Eye,
  Brain,
};

const ACT_COLORS = ['#1E3A5F', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

const CTA_STEPS = [
  { week: 'Week 1', title: 'Data Access', desc: 'POS + HRIS read credentials, Varicent POC environment' },
  { week: 'Week 2–3', title: 'Configuration', desc: 'Comp plan mapping, measurement setup, field sync validation' },
  { week: 'Week 4', title: 'Pilot Store', desc: 'Live floor reps, real commissions, side-by-side accuracy check' },
  { week: 'Week 5–6', title: 'Rollout Plan', desc: 'District rollout sequencing, training plan, go-live readiness' },
];

export default function ProductOverviewPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Product Overview</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          PRIZYM — Revenue Operating System for Retail
        </p>
      </div>

      {/* PRIZYM hero card */}
      <div
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #06B6D4 100%)' }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Network size={32} style={{ color: '#FFFFFF' }} />
            <span className="text-3xl font-black tracking-tight text-white">PRIZYM</span>
          </div>
          <p className="text-lg font-semibold text-white mb-2">Revenue Operating System for Retail</p>
          <p className="text-sm mb-6" style={{ color: '#BAE6FD' }}>
            Floor-to-boardroom visibility for compensation, coaching, and operations
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Real-Time Comp Visibility', desc: 'Every rep sees earnings as they sell' },
              { label: 'AI-Powered Coaching', desc: 'Attach rate insights at store open' },
              { label: 'Varicent-Native Sync', desc: 'Your ICM stays the source of truth' },
            ].map((cap) => (
              <div
                key={cap.label}
                className="rounded-xl p-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <CheckCircle size={16} style={{ color: '#A7F3D0' }} className="mb-2" />
                <p className="text-[13px] font-semibold text-white">{cap.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: '#BAE6FD' }}>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Background decoration */}
        <div
          className="absolute -right-16 -top-16 rounded-full opacity-10"
          style={{ width: 300, height: 300, backgroundColor: '#FFFFFF' }}
        />
        <div
          className="absolute -right-4 bottom-0 rounded-full opacity-5"
          style={{ width: 200, height: 200, backgroundColor: '#FFFFFF' }}
        />
      </div>

      {/* 6-Act story grid */}
      <div className="mb-8">
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          The PRIZYM Platform — 6-Act Story
        </p>
        <div className="grid grid-cols-3 gap-4">
          {ACT_SUMMARY.map((act, i) => {
            const Icon = actIconMap[act.icon] ?? Network;
            const color = ACT_COLORS[i];
            return (
              <div
                key={act.act}
                className="rounded-xl border p-5"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex items-center justify-center h-8 w-8 rounded-lg"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon size={16} style={{ color }} />
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color }}
                  >
                    Act {act.act}
                  </span>
                </div>
                <p className="text-[13px] font-bold mb-1" style={{ color: '#0F172A' }}>{act.name}</p>
                <p className="text-[11px] leading-relaxed" style={{ color: '#64748B' }}>{act.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROI Projection */}
      <div className="mb-8">
        <div className="mb-4">
          <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
            Projected Impact for Summit Sleep Co.
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
            Based on 847 stores, 4,200 floor reps
          </p>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {ROI_METRICS.map((metric) => {
            const Icon = roiIconMap[metric.icon] ?? TrendingUp;
            return (
              <div
                key={metric.label}
                className="rounded-xl border p-4"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
              >
                <div
                  className="flex items-center justify-center h-9 w-9 rounded-lg mb-3"
                  style={{ backgroundColor: '#DCFCE7' }}
                >
                  <Icon size={18} style={{ color: '#059669' }} />
                </div>
                <p className="text-[11px] font-semibold mb-3" style={{ color: '#64748B' }}>{metric.label}</p>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-medium w-10 text-right shrink-0" style={{ color: '#94A3B8' }}>Before</span>
                    <span className="text-[12px] font-semibold" style={{ color: '#DC2626' }}>{metric.before}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-medium w-10 text-right shrink-0" style={{ color: '#94A3B8' }}>After</span>
                    <span className="text-[12px] font-semibold" style={{ color: '#059669' }}>{metric.after}</span>
                  </div>
                </div>
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
                >
                  {metric.improvement}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="rounded-2xl border p-8 mb-6"
        style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}
      >
        <div className="text-center mb-6">
          <p className="text-xl font-bold" style={{ color: '#0F172A' }}>Ready for Your POC?</p>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            From data access to rollout plan in 6 weeks
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {CTA_STEPS.map((step, i) => (
            <div key={step.week} className="relative">
              {/* Connector line */}
              {i < CTA_STEPS.length - 1 && (
                <div
                  className="absolute top-5 left-full w-full h-0.5 z-0"
                  style={{ backgroundColor: '#CBD5E1', width: '100%', left: '60%' }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div
                  className="flex items-center justify-center h-10 w-10 rounded-full border-2 font-bold text-sm mb-3"
                  style={{ backgroundColor: '#1E3A5F', borderColor: '#1E3A5F', color: '#FFFFFF' }}
                >
                  {i + 1}
                </div>
                <p
                  className="text-[10px] font-bold uppercase tracking-wider mb-1"
                  style={{ color: '#06B6D4' }}
                >
                  {step.week}
                </p>
                <p className="text-[13px] font-semibold mb-1.5" style={{ color: '#0F172A' }}>{step.title}</p>
                <p className="text-[11px] leading-relaxed" style={{ color: '#64748B' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs font-semibold" style={{ color: '#94A3B8' }}>
          Powered by <span style={{ color: '#1E3A5F' }}>PRIZYM</span> — An <span style={{ color: '#06B6D4' }}>AICR Platform</span> Product
        </p>
      </div>
    </>
  );
}
