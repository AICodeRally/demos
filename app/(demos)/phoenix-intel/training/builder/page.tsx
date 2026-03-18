'use client';

import { useState } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { CLIENTS } from '@/data/phoenix-intel/nonprofit-data';
import { ASSESSMENT_TEMPLATES } from '@/data/phoenix-intel/assessment-data';
import { Wand2, Sparkles } from 'lucide-react';

type TabKey = 'outline' | 'facilitator' | 'participant';

const SAMPLE_OUTLINE = `# Board Fundraising Readiness Training

## Session Overview
- **Duration:** 6 hours (full day)
- **Audience:** Board members of Hope Springs Foundation
- **Based on:** Board Engagement Assessment (Score: 48/100, Emerging)

## Learning Objectives
1. Understand fiduciary responsibility for fundraising
2. Develop personal comfort with donor engagement
3. Create individual 90-day fundraising action plans
4. Practice peer-to-peer solicitation techniques

## Agenda

### Morning Session (9:00 AM - 12:00 PM)
1. **Welcome & Context Setting** (30 min)
   - State of fundraising at Hope Springs
   - Assessment results walkthrough
   - Why board participation matters

2. **Finding Your Fundraising Style** (60 min)
   - The 4 types of board fundraising
   - Self-assessment exercise
   - Small group discussion

3. **The Art of the Ask** (60 min)
   - Storytelling workshop
   - Role-play scenarios
   - Overcoming objections

### Afternoon Session (1:00 PM - 4:00 PM)
4. **Building Your Network Map** (45 min)
   - Prospect identification exercise
   - Concentric circles of influence
   - Peer-to-peer strategy

5. **Your 90-Day Plan** (45 min)
   - Individual action planning
   - Accountability partner selection
   - Milestone setting

6. **Practice & Commitment** (30 min)
   - Live practice sessions
   - Public commitments
   - Next steps and support resources`;

const SAMPLE_FACILITATOR = `# Facilitator Guide: Board Fundraising Readiness Training

## Pre-Session Preparation
- [ ] Review Hope Springs assessment results (Board Engagement: 48/100)
- [ ] Prepare personalized data points for each board member
- [ ] Set up breakout areas for small group exercises
- [ ] Print prospect mapping worksheets (1 per attendee)
- [ ] Prepare role-play scenario cards (8 scenarios)

## Key Facilitation Notes

### Opening (Critical Tone Setting)
Start with appreciation, not criticism. The assessment score of 48 can feel demoralizing — frame it as "tremendous opportunity" and "starting from a strong foundation of commitment."

### Activity: Finding Your Style
Allow 15 minutes for self-reflection before group discussion. Some board members will resist identifying as "askers" — validate ALL fundraising styles including thank-you caller, event host, and connector.

### Role-Play Section
Pair experienced fundraisers with newer members. Use the "fishbowl" technique: one pair practices in the center while others observe and provide feedback.

### 90-Day Plan
Each plan should include:
- 3 specific cultivation activities
- 1 solicitation target
- 1 stewardship touchpoint
- Accountability check-in date

## Materials Needed
- Projector and screen
- Flip chart and markers
- Prospect mapping worksheets
- Role-play scenario cards
- 90-Day Plan templates
- Assessment summary handouts`;

const SAMPLE_PARTICIPANT = `# Participant Handout: Board Fundraising Readiness

## Welcome!
Thank you for investing a full day in strengthening our fundraising capacity. Your participation sends a powerful message about our commitment to our mission.

## Today's Goal
By the end of today, you will have a personalized 90-day fundraising action plan that matches YOUR style and comfort level.

## Key Concepts

### The 4 Fundraising Styles
1. **The Asker** — Comfortable directly soliciting gifts
2. **The Connector** — Introduces prospects to the organization
3. **The Host** — Creates cultivation opportunities through events
4. **The Ambassador** — Shares the mission through storytelling

### Your Personal Fundraising Toolkit
- Your compelling personal story (why you serve)
- 3 impact statistics that resonate with you
- A list of 5 people who should know about our work
- Your preferred communication channel

## Exercises

### Exercise 1: My Story (15 min)
Write your personal "why" in 60 seconds or less. Practice telling it to a partner.

### Exercise 2: Network Mapping (20 min)
Using the concentric circles worksheet, identify:
- Inner Circle (5 people): Close contacts with giving capacity
- Middle Circle (10 people): Professional contacts with potential interest
- Outer Circle (15 people): Broader network for awareness

### Exercise 3: 90-Day Plan (20 min)
Complete the action plan template with specific, measurable commitments.

## Resources
- Phoenix Knowledge Base: 156 resources on fundraising best practices
- Board Fundraising FAQ (attached)
- Recording of today's session (available within 48 hours)`;

export default function BuilderPage() {
  const insight = getInsight('training/builder');
  const [topic, setTopic] = useState('Board Fundraising Readiness');
  const [client, setClient] = useState('cl-3');
  const [assessment, setAssessment] = useState('at-3');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('outline');

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'outline', label: 'Training Outline' },
    { key: 'facilitator', label: 'Facilitator Guide' },
    { key: 'participant', label: 'Participant Handout' },
  ];

  const tabContent: Record<TabKey, string> = {
    outline: SAMPLE_OUTLINE,
    facilitator: SAMPLE_FACILITATOR,
    participant: SAMPLE_PARTICIPANT,
  };

  return (
    <PhoenixPage title="AI Training Builder" subtitle="Generate custom training packages from assessment data" accentColor="#7c3aed">
      {insight && <div style={{ marginBottom: 16 }}><AIInsightCard label={insight.label}>{insight.text}</AIInsightCard></div>}

      {/* Input form */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Wand2 size={18} color="#7c3aed" /> Configure Training Package
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Training Topic</label>
            <input value={topic} onChange={e => setTopic(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--pi-border)', background: 'var(--pi-bg)', color: 'var(--pi-text)', fontSize: '0.95rem' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Client</label>
            <select value={client} onChange={e => setClient(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--pi-border)', background: 'var(--pi-bg)', color: 'var(--pi-text)', fontSize: '0.95rem' }}>
              {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Assessment Basis</label>
            <select value={assessment} onChange={e => setAssessment(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--pi-border)', background: 'var(--pi-bg)', color: 'var(--pi-text)', fontSize: '0.95rem' }}>
              {ASSESSMENT_TEMPLATES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={generating} style={{
          marginTop: 16, padding: '10px 24px', borderRadius: 8, border: 'none',
          background: generating ? 'var(--pi-border)' : '#7c3aed', color: '#fff',
          fontSize: '0.95rem', fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Sparkles size={16} />
          {generating ? 'Generating 3-Part Package...' : 'Generate Training Package'}
        </button>
      </div>

      {/* Generated output with tabs */}
      {generated && (
        <div className="phoenix-card">
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid var(--pi-border)' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '10px 20px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700,
                  background: activeTab === tab.key ? '#7c3aed' : 'transparent',
                  color: activeTab === tab.key ? '#fff' : 'var(--pi-text-muted)',
                  borderRadius: '8px 8px 0 0',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', color: 'var(--pi-text-secondary)', lineHeight: 1.7, fontFamily: 'var(--font-space-grotesk), system-ui' }}>
            {tabContent[activeTab].split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h2 key={i} style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--pi-text)', marginTop: 16, marginBottom: 8 }}>{line.slice(2)}</h2>;
              if (line.startsWith('## ')) return <h3 key={i} style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginTop: 14, marginBottom: 6 }}>{line.slice(3)}</h3>;
              if (line.startsWith('### ')) return <h4 key={i} style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pi-sapphire)', marginTop: 12, marginBottom: 4 }}>{line.slice(4)}</h4>;
              if (line.startsWith('- ')) return <div key={i} style={{ paddingLeft: 16, marginBottom: 2 }}>{line}</div>;
              if (line.startsWith('- [ ]')) return <div key={i} style={{ paddingLeft: 16, marginBottom: 2 }}>{line}</div>;
              if (line.trim() === '') return <div key={i} style={{ height: 8 }} />;
              return <div key={i}>{line}</div>;
            })}
          </div>
        </div>
      )}
    </PhoenixPage>
  );
}
