'use client';

import { useState, useEffect } from 'react';
import { COMPLIANCE_CONTROLS, getComplianceScore, type ComplianceControl } from '@/data/prizym-governance/oversee';
import { ShieldCheck, AlertTriangle, XCircle, Clock, FileCheck } from 'lucide-react';

const STATUS_CONFIG: Record<ComplianceControl['status'], { label: string; color: string; icon: typeof ShieldCheck }> = {
  compliant: { label: 'Compliant', color: 'var(--pg-success-bright)', icon: ShieldCheck },
  at_risk: { label: 'At Risk', color: 'var(--pg-warning-bright)', icon: AlertTriangle },
  non_compliant: { label: 'Non-Compliant', color: 'var(--pg-danger-bright)', icon: XCircle },
  not_tested: { label: 'Not Tested', color: 'var(--pg-neutral)', icon: Clock },
};

export default function CompliancePage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const score = getComplianceScore();
  const categories = Array.from(new Set(COMPLIANCE_CONTROLS.map(c => c.category)));
  const filtered = categoryFilter === 'all'
    ? COMPLIANCE_CONTROLS
    : COMPLIANCE_CONTROLS.filter(c => c.category === categoryFilter);

  const counts = {
    compliant: COMPLIANCE_CONTROLS.filter(c => c.status === 'compliant').length,
    at_risk: COMPLIANCE_CONTROLS.filter(c => c.status === 'at_risk').length,
    non_compliant: COMPLIANCE_CONTROLS.filter(c => c.status === 'non_compliant').length,
    not_tested: COMPLIANCE_CONTROLS.filter(c => c.status === 'not_tested').length,
  };

  // Gauge geometry — same recipe as home page Program Pulse
  const gaugeSize = 132;
  const gaugeStroke = 13;
  const gaugeR = (gaugeSize - gaugeStroke) / 2;
  const gaugeC = 2 * Math.PI * gaugeR;
  const gaugeOffset = gaugeC * (1 - score / 100);

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Compliance Dashboard
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.5 }}>
          SOX controls, wage law, tax, and data security — unified compliance view.
        </p>
      </div>

      <div className="pg-card-elevated" style={{ padding: 20, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: gaugeSize, height: gaugeSize, flexShrink: 0 }}>
            <svg width={gaugeSize} height={gaugeSize} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={gaugeSize / 2} cy={gaugeSize / 2} r={gaugeR} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={gaugeStroke} />
              <circle
                cx={gaugeSize / 2}
                cy={gaugeSize / 2}
                r={gaugeR}
                fill="none"
                stroke="var(--pg-oversee-bright)"
                strokeWidth={gaugeStroke}
                strokeDasharray={gaugeC}
                strokeDashoffset={gaugeOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{score}%</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>Compliance</div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Program Compliance Score</h2>
            <p style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.5, marginBottom: 14 }}>
              Weighted score across {COMPLIANCE_CONTROLS.length} controls in {categories.length} categories — SOX / ICFR, wage and hour, tax, and data security.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {Object.entries(counts).map(([k, v]) => {
                const cfg = STATUS_CONFIG[k as ComplianceControl['status']];
                const Icon = cfg.icon;
                return (
                  <div
                    key={k}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: `1px solid rgba(255, 255, 255, 0.22)`,
                      borderLeft: `4px solid ${cfg.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <div className="pg-icon-bubble pg-icon-bubble-sm" style={{ borderColor: cfg.color }}>
                      <Icon size={16} color={cfg.color} strokeWidth={2.4} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{v}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{cfg.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {(['all', ...categories] as string[]).map((cat) => {
          const active = categoryFilter === cat;
          const count = cat === 'all' ? COMPLIANCE_CONTROLS.length : COMPLIANCE_CONTROLS.filter(c => c.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                background: active ? 'rgba(196, 181, 253, 0.22)' : 'rgba(255, 255, 255, 0.06)',
                border: active ? '1.5px solid var(--pg-oversee-bright)' : '1px solid rgba(255, 255, 255, 0.2)',
                color: active ? 'var(--pg-oversee-bright)' : '#ffffff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {cat === 'all' ? 'All' : cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Controls table — scroll-isolated */}
      <div className="pg-card" style={{ padding: 0, overflow: 'hidden', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="pg-scroll" style={{ overflowY: 'auto', overflowX: 'auto', flex: 1, minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(15, 23, 42, 0.72)', backdropFilter: 'blur(12px)', zIndex: 1 }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.24)' }}>
                {['Control', 'Category', 'Status', 'Owner', 'Last Tested', 'Evidence'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 14, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const cfg = STATUS_CONFIG[c.status];
                const Icon = cfg.icon;
                return (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.12)',
                      opacity: mounted ? 1 : 0,
                      transition: 'opacity 0.4s ease',
                      transitionDelay: `${i * 0.02}s`,
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-oversee-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.code}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{c.name}</div>
                      <div style={{ fontSize: 14, color: '#f1f5f9', marginTop: 2 }}>{c.relatedPolicy}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#ffffff' }}>{c.category}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 12,
                        background: 'rgba(0,0,0,0.28)',
                        border: `1.5px solid ${cfg.color}`,
                        color: cfg.color,
                        fontSize: 14, fontWeight: 700,
                      }}>
                        <Icon size={14} strokeWidth={2.4} /> {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#ffffff' }}>{c.owner}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#f1f5f9' }}>{c.lastTested}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#ffffff' }}>
                        <FileCheck size={14} color="var(--pg-success-bright)" strokeWidth={2.4} /> {c.evidence}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
