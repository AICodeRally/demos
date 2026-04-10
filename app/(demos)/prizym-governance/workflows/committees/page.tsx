'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { ALL_COMMITTEES } from '@/data/prizym-governance/committees';
import { Users, UserCheck, UserMinus, Gavel, Calendar, Scale } from 'lucide-react';

export default function CommitteesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <PrizymPage title="Governance Committees" subtitle="SGCC and CRB — oversight bodies for compensation governance" mode="oversee">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {ALL_COMMITTEES.map((committee, ci) => {
          const votingMembers = committee.members.filter(m => m.isVoting);
          const nonVoting = committee.members.filter(m => !m.isVoting);

          return (
            <div
              key={committee.id}
              className="pg-card-elevated"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${ci * 0.15}s`,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
                <div className="pg-icon-bubble" style={{ background: 'rgba(139,92,246,0.12)', padding: 12 }}>
                  <Gavel size={26} color="#8b5cf6" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <span className="pg-overline" style={{ color: '#8b5cf6' }}>{committee.code}</span>
                    <StatusBadge status={committee.status} />
                  </div>
                  <h2 className="pg-subheading" style={{ marginTop: 4, fontSize: '1.2rem' }}>{committee.name}</h2>
                  <p className="pg-caption" style={{ marginTop: 4 }}>{committee.description}</p>
                </div>
              </div>

              {/* Purpose */}
              <div style={{ marginBottom: 18, padding: '14px 18px', borderRadius: 10, background: 'var(--pg-gradient-subtle)', border: '1px solid var(--pg-border-faint)' }}>
                <div className="pg-overline" style={{ marginBottom: 6, color: '#8b5cf6' }}>Purpose</div>
                <p className="pg-body" style={{ color: 'var(--pg-text-muted)' }}>{committee.purpose}</p>
              </div>

              {/* Authority */}
              <div style={{ marginBottom: 18 }}>
                <div className="pg-overline" style={{ marginBottom: 8 }}>Authority</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {committee.authority.map(a => (
                    <li key={a} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <Scale size={12} color="#8b5cf6" style={{ marginTop: 4, flexShrink: 0 }} />
                      <span className="pg-body" style={{ color: 'var(--pg-text-muted)' }}>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Members */}
              <div style={{ marginBottom: 18 }}>
                <div className="pg-overline" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <UserCheck size={12} />
                  Voting Members ({votingMembers.length})
                </div>
                <div className="pg-table-wrap">
                  <table className="pg-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Title</th>
                        <th>Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      {votingMembers.map(m => (
                        <tr key={m.id}>
                          <td><span className="pg-label">{m.name}</span></td>
                          <td><span className="pg-caption" style={{ color: m.role === 'Chair' ? '#8b5cf6' : m.role === 'Vice Chair' ? '#06b6d4' : 'var(--pg-text-muted)', fontWeight: m.role.includes('Chair') ? 700 : 400 }}>{m.role}</span></td>
                          <td><span className="pg-caption">{m.title}</span></td>
                          <td><span className="pg-caption">{m.department}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {nonVoting.length > 0 && (
                  <>
                    <div className="pg-overline" style={{ marginTop: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <UserMinus size={12} />
                      Non-Voting ({nonVoting.length})
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {nonVoting.map(m => (
                        <div key={m.id} style={{ padding: '8px 14px', borderRadius: 8, background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border-faint)', transition: 'all 0.2s' }}>
                          <span className="pg-label" style={{ fontSize: 'var(--pg-fs-caption)' }}>{m.name}</span>
                          <span className="pg-caption" style={{ marginLeft: 6 }}>{m.role}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Meeting info */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '12px 16px', borderRadius: 8, background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border-faint)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calendar size={14} color="var(--pg-text-faint)" />
                  <div>
                    <div className="pg-overline" style={{ marginBottom: 2 }}>Meeting Cadence</div>
                    <span className="pg-caption">{committee.meetingCadence}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users size={14} color="var(--pg-text-faint)" />
                  <div>
                    <div className="pg-overline" style={{ marginBottom: 2 }}>Quorum</div>
                    <span className="pg-caption">{committee.quorumRequirement}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PrizymPage>
  );
}
