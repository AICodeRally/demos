'use client';

import { ActNavigation, SectionCard } from '@/components/demos/meridian';
import { DD_CHECKLIST, PIPELINE } from '@/data/meridian';

const activeDeal = PIPELINE[0]; // MedVista — in LOI

export default function DiligencePage() {
  return (
    <>
      <ActNavigation currentAct={2} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#8B5CF6' }}>
          Due Diligence &middot; Workstream Tracker
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Due Diligence Dashboard
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          Active: {activeDeal.name} ({activeDeal.stage}) &middot; Target close: {activeDeal.targetClose}
        </p>
      </div>

      {/* DD Progress */}
      <SectionCard title={`${activeDeal.name} — Diligence Progress`}>
        <div className="space-y-4">
          {DD_CHECKLIST.map((cat) => {
            // Simulate progress
            const completedCount = cat.category === 'Financial' ? 4 : cat.category === 'Commercial' ? 3 : cat.category === 'Operations' ? 2 : cat.category === 'Legal & Regulatory' ? 3 : 1;
            const pct = completedCount / cat.items.length;
            return (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold" style={{ color: 'var(--mr-text)' }}>{cat.category}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: pct === 1 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: pct === 1 ? '#10B981' : '#F59E0B' }}>
                      {completedCount}/{cat.items.length}
                    </span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>Weight: {(cat.weight * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full mb-2" style={{ background: 'var(--mr-chart-bar-track)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct * 100}%`, background: pct === 1 ? '#10B981' : pct > 0.5 ? '#F59E0B' : '#EF4444' }} />
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {cat.items.map((item, i) => (
                    <div key={item} className="flex items-center gap-2 text-[12px]" style={{ color: i < completedCount ? '#10B981' : 'var(--mr-text-muted)' }}>
                      <span>{i < completedCount ? '\u2713' : '\u25CB'}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(212,168,71,0.06)', border: '1px solid rgba(212,168,71,0.15)' }}>
          <div className="text-xs font-bold font-mono mb-1" style={{ color: '#D4A847' }}>OVERALL DD COMPLETION</div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
              <div className="h-full rounded-full" style={{ width: '72%', background: 'linear-gradient(90deg, #D4A847, #10B981)' }} />
            </div>
            <span className="text-sm font-bold font-mono" style={{ color: '#D4A847' }}>72%</span>
          </div>
          <div className="text-xs font-mono mt-1" style={{ color: 'var(--mr-text-faint)' }}>
            Est. completion: 3 weeks &middot; IC presentation: March 28, 2026
          </div>
        </div>
      </SectionCard>

      {/* Advisor Network */}
      <SectionCard title="Third-Party Advisors">
        <div className="grid grid-cols-3 gap-3">
          {[
            { role: 'Financial Advisor', firm: 'Lazard', status: 'Engaged', color: '#3B82F6' },
            { role: 'Legal Counsel', firm: 'Kirkland & Ellis', status: 'Engaged', color: '#8B5CF6' },
            { role: 'QoE Provider', firm: 'Alvarez & Marsal', status: 'In Progress', color: '#F59E0B' },
            { role: 'Insurance DD', firm: 'Aon', status: 'Scheduled', color: '#6B7280' },
            { role: 'IT Assessment', firm: 'EY-Parthenon', status: 'Scheduled', color: '#6B7280' },
            { role: 'Market Study', firm: 'Bain & Company', status: 'Complete', color: '#10B981' },
          ].map((a) => (
            <div key={a.role} className="p-3 rounded-lg border" style={{ borderColor: 'var(--mr-border)' }}>
              <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>{a.role}</div>
              <div className="text-sm font-bold" style={{ color: 'var(--mr-text)' }}>{a.firm}</div>
              <span className="text-xs font-mono px-2 py-0.5 rounded mt-1 inline-block" style={{ background: `${a.color}15`, color: a.color }}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
