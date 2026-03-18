'use client';

import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { ALL_COMMITTEES } from '@/data/prizym-governance/committees';
import { Users, UserCheck, UserMinus, Gavel } from 'lucide-react';

export default function CommitteesPage() {
  return (
    <PrizymPage title="Governance Committees" subtitle="SGCC and CRB — oversight bodies for compensation governance" mode="oversee">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {ALL_COMMITTEES.map(committee => {
          const votingMembers = committee.members.filter(m => m.isVoting);
          const nonVoting = committee.members.filter(m => !m.isVoting);

          return (
            <div key={committee.id} className="pg-card">
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                <div style={{ background: 'rgba(139,92,246,0.12)', borderRadius: 10, padding: 10, display: 'flex' }}>
                  <Gavel size={24} color="#8b5cf6" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <span className="pg-overline" style={{ color: '#8b5cf6' }}>{committee.code}</span>
                    <StatusBadge status={committee.status} />
                  </div>
                  <h2 className="pg-subheading" style={{ marginTop: 4 }}>{committee.name}</h2>
                  <p className="pg-caption" style={{ marginTop: 4 }}>{committee.description}</p>
                </div>
              </div>

              {/* Purpose */}
              <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 8, background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border-faint)' }}>
                <div className="pg-overline" style={{ marginBottom: 6 }}>Purpose</div>
                <p className="pg-body" style={{ color: 'var(--pg-text-muted)' }}>{committee.purpose}</p>
              </div>

              {/* Authority */}
              <div style={{ marginBottom: 16 }}>
                <div className="pg-overline" style={{ marginBottom: 8 }}>Authority</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {committee.authority.map(a => (
                    <li key={a} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: '#8b5cf6', flexShrink: 0, marginTop: 2 }}>&#x2022;</span>
                      <span className="pg-body" style={{ color: 'var(--pg-text-muted)' }}>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Members */}
              <div style={{ marginBottom: 16 }}>
                <div className="pg-overline" style={{ marginBottom: 8 }}>
                  <UserCheck size={12} style={{ display: 'inline', marginRight: 4 }} />
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
                          <td><span className="pg-caption" style={{ color: m.role === 'Chair' ? '#8b5cf6' : 'var(--pg-text-muted)' }}>{m.role}</span></td>
                          <td><span className="pg-caption">{m.title}</span></td>
                          <td><span className="pg-caption">{m.department}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {nonVoting.length > 0 && (
                  <>
                    <div className="pg-overline" style={{ marginTop: 12, marginBottom: 8 }}>
                      <UserMinus size={12} style={{ display: 'inline', marginRight: 4 }} />
                      Non-Voting ({nonVoting.length})
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {nonVoting.map(m => (
                        <div key={m.id} style={{ padding: '6px 12px', borderRadius: 6, background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border-faint)' }}>
                          <span className="pg-label" style={{ fontSize: 'var(--pg-fs-caption)' }}>{m.name}</span>
                          <span className="pg-caption" style={{ marginLeft: 6 }}>{m.role}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Meeting info */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div className="pg-overline" style={{ marginBottom: 4 }}>Meeting Cadence</div>
                  <span className="pg-caption">{committee.meetingCadence}</span>
                </div>
                <div>
                  <div className="pg-overline" style={{ marginBottom: 4 }}>Quorum</div>
                  <span className="pg-caption">{committee.quorumRequirement}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PrizymPage>
  );
}
