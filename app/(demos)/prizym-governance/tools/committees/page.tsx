'use client';

import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { showDemoToast } from '@/components/demos/prizym-governance/Toast';
import { ALL_COMMITTEES, type Committee, type CommitteeMember } from '@/data/prizym-governance/committees';
import { Users, UserCheck, UserMinus, Gavel, Calendar, Scale, Plus, X } from 'lucide-react';

interface AddMemberFormProps {
  onAdd: (member: Omit<CommitteeMember, 'id'>) => void;
  onCancel: () => void;
}

function AddMemberForm({ onAdd, onCancel }: AddMemberFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Member');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [isVoting, setIsVoting] = useState(true);

  function handleAdd() {
    if (!name.trim() || !title.trim() || !department.trim()) return;
    onAdd({ name: name.trim(), role: role.trim() || 'Member', title: title.trim(), department: department.trim(), isVoting });
  }

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    background: 'rgba(15, 23, 42, 0.55)',
    border: '1px solid rgba(255, 255, 255, 0.28)',
    borderRadius: 10,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 600,
    outline: 'none',
    fontFamily: 'inherit',
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' };

  return (
    <div
      style={{
        marginTop: 10,
        padding: 16,
        borderRadius: 12,
        background: 'rgba(14,165,233,0.1)',
        border: '1.5px solid var(--pg-cyan-bright)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1.4fr 1fr auto',
        gap: 12,
        alignItems: 'end',
      }}
    >
      <div>
        <label style={labelStyle}>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" style={{ ...inputStyle, width: '100%' }} />
      </div>
      <div>
        <label style={labelStyle}>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
          <option value="Member" style={{ background: '#0f172a' }}>Member</option>
          <option value="Chair" style={{ background: '#0f172a' }}>Chair</option>
          <option value="Vice Chair" style={{ background: '#0f172a' }}>Vice Chair</option>
          <option value="Secretary" style={{ background: '#0f172a' }}>Secretary</option>
          <option value="Observer" style={{ background: '#0f172a' }}>Observer</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VP Sales Ops" style={{ ...inputStyle, width: '100%' }} />
      </div>
      <div>
        <label style={labelStyle}>Department</label>
        <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Sales" style={{ ...inputStyle, width: '100%' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ ...labelStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={isVoting} onChange={(e) => setIsVoting(e.target.checked)} style={{ accentColor: 'var(--pg-cyan-bright)' }} />
          Voting
        </label>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" onClick={handleAdd} style={{ padding: '9px 14px', background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 10, color: '#ffffff', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Add</button>
          <button type="button" onClick={onCancel} style={{ padding: '9px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.24)', borderRadius: 10, color: '#ffffff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function CommitteesPage() {
  const [mounted, setMounted] = useState(false);
  const [committees, setCommittees] = useState<Committee[]>(() => ALL_COMMITTEES.map(c => ({ ...c, members: [...c.members] })));
  const [addingTo, setAddingTo] = useState<string | null>(null);
  useEffect(() => { setMounted(true); }, []);

  function addMember(committeeId: string, member: Omit<CommitteeMember, 'id'>) {
    const newMember: CommitteeMember = { ...member, id: `m-${Date.now().toString(36)}` };
    setCommittees(prev => prev.map(c => c.id === committeeId ? { ...c, members: [...c.members, newMember] } : c));
    setAddingTo(null);
    showDemoToast(`${newMember.name} added to committee`, 'success');
  }

  function removeMember(committeeId: string, memberId: string, memberName: string) {
    setCommittees(prev => prev.map(c => c.id === committeeId ? { ...c, members: c.members.filter(m => m.id !== memberId) } : c));
    showDemoToast(`${memberName} removed from committee`, 'warning');
  }

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
        {committees.map((committee, ci) => {
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <UserCheck size={14} strokeWidth={2.4} />
                    Voting Members ({votingMembers.length})
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddingTo(addingTo === committee.id ? null : committee.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)',
                      border: '1px solid rgba(255,255,255,0.35)',
                      borderRadius: 10, color: '#ffffff',
                      fontSize: 13, fontWeight: 800, cursor: 'pointer',
                      boxShadow: '0 6px 18px rgba(14,165,233,0.28)',
                    }}
                  >
                    <Plus size={14} strokeWidth={2.8} /> Add Member
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {votingMembers.map(m => (
                    <div
                      key={m.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 1.4fr 1fr auto',
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
                      <button
                        type="button"
                        onClick={() => removeMember(committee.id, m.id, m.name)}
                        aria-label={`Remove ${m.name}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 30, height: 30, borderRadius: 8,
                          background: 'rgba(252,165,165,0.1)',
                          border: '1px solid rgba(252,165,165,0.4)',
                          color: 'var(--pg-danger-bright)',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={14} strokeWidth={2.6} />
                      </button>
                    </div>
                  ))}
                </div>

                {addingTo === committee.id && (
                  <AddMemberForm
                    onAdd={(member) => addMember(committee.id, member)}
                    onCancel={() => setAddingTo(null)}
                  />
                )}

                {nonVoting.length > 0 && (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <UserMinus size={14} strokeWidth={2.4} />
                      Non-Voting ({nonVoting.length})
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {nonVoting.map(m => (
                        <div key={m.id} style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{m.name}</span>
                          <span style={{ fontSize: 14, color: '#f1f5f9' }}>· {m.role}</span>
                          <button
                            type="button"
                            onClick={() => removeMember(committee.id, m.id, m.name)}
                            aria-label={`Remove ${m.name}`}
                            style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 22, height: 22, borderRadius: 6,
                              background: 'rgba(252,165,165,0.1)',
                              border: '1px solid rgba(252,165,165,0.4)',
                              color: 'var(--pg-danger-bright)',
                              cursor: 'pointer',
                            }}
                          >
                            <X size={12} strokeWidth={2.6} />
                          </button>
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
