'use client';

import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { ALL_COMMITTEES } from '@/data/prizym-governance/committees';
import { Users, UserCheck, UserMinus, Gavel, Calendar, Scale } from 'lucide-react';

export default function CommitteesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Governance Committees
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          SGCC and CRB — oversight bodies for compensation governance.
        </p>
      </div>

      <div className="pg-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
        {ALL_COMMITTEES.map((committee, ci) => {
          const votingMembers = committee.members.filter(m => m.isVoting);
          const nonVoting = committee.members.filter(m => !m.isVoting);

          return (
            <div
              key={committee.id}
              className="pg-card-elevated"
              style={{
                padding: 20,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${ci * 0.12}s`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                <div className="pg-icon-bubble pg-icon-bubble-lg" style={{ borderColor: 'var(--pg-oversee-bright)' }}>
                  <Gavel size={22} color="var(--pg-oversee-bright)" strokeWidth={2.4} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-oversee-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{committee.code}</span>
                    <StatusBadge status={committee.status} />
                  </div>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#ffffff', marginTop: 4, lineHeight: 1.2 }}>{committee.name}</h2>
                  <p style={{ fontSize: 15, color: '#f1f5f9', marginTop: 5, lineHeight: 1.5 }}>{committee.description}</p>
                </div>
              </div>

              <div style={{ marginBottom: 16, padding: '14px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', borderLeft: '4px solid var(--pg-oversee-bright)' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--pg-oversee-bright)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Purpose</div>
                <p style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.55 }}>{committee.purpose}</p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Authority</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {committee.authority.map(a => (
                    <li key={a} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <Scale size={14} color="var(--pg-oversee-bright)" strokeWidth={2.4} style={{ marginTop: 3, flexShrink: 0 }} />
                      <span style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.5 }}>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <UserCheck size={14} strokeWidth={2.4} />
                  Voting Members ({votingMembers.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {votingMembers.map(m => (
                    <div
                      key={m.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 1.4fr 1fr',
                        gap: 12,
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>{m.name}</span>
                      <span style={{
                        fontSize: 14,
                        fontWeight: m.role.includes('Chair') ? 800 : 600,
                        color: m.role === 'Chair' ? 'var(--pg-oversee-bright)' : m.role === 'Vice Chair' ? 'var(--pg-cyan-bright)' : '#f1f5f9',
                      }}>{m.role}</span>
                      <span style={{ fontSize: 14, color: '#ffffff' }}>{m.title}</span>
                      <span style={{ fontSize: 14, color: '#f1f5f9' }}>{m.department}</span>
                    </div>
                  ))}
                </div>

                {nonVoting.length > 0 && (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <UserMinus size={14} strokeWidth={2.4} />
                      Non-Voting ({nonVoting.length})
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {nonVoting.map(m => (
                        <div key={m.id} style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)' }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{m.name}</span>
                          <span style={{ fontSize: 14, color: '#f1f5f9', marginLeft: 6 }}>· {m.role}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '14px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="pg-icon-bubble pg-icon-bubble-sm" style={{ borderColor: 'var(--pg-cyan-bright)' }}>
                    <Calendar size={14} color="var(--pg-cyan-bright)" strokeWidth={2.4} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meeting Cadence</div>
                    <span style={{ fontSize: 15, color: '#ffffff', fontWeight: 600 }}>{committee.meetingCadence}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="pg-icon-bubble pg-icon-bubble-sm" style={{ borderColor: 'var(--pg-success-bright)' }}>
                    <Users size={14} color="var(--pg-success-bright)" strokeWidth={2.4} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quorum</div>
                    <span style={{ fontSize: 15, color: '#ffffff', fontWeight: 600 }}>{committee.quorumRequirement}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
