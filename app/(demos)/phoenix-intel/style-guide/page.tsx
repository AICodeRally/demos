'use client';

import { useState } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { usePhoenixTheme } from '@/components/demos/phoenix-intel/ThemeProvider';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { PillarCard } from '@/components/demos/phoenix-intel/PillarCard';
import { PerformanceRing } from '@/components/demos/phoenix-intel/PerformanceRing';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { Palette, Type, Maximize2, Sun, Moon } from 'lucide-react';

const COLORS = [
  { name: 'Sapphire (Primary)', value: '#3b6bf5', var: '--pi-sapphire' },
  { name: 'Gold (Accent)', value: '#c9942b', var: '--pi-gold' },
  { name: 'Purpose', value: '#facc15', var: '--pi-purpose' },
  { name: 'People', value: '#7c3aed', var: '--pi-people' },
  { name: 'Process', value: '#2563eb', var: '--pi-process' },
  { name: 'Practice', value: '#c026d3', var: '--pi-practice' },
  { name: 'Pipeline', value: '#db2777', var: '--pi-pipeline' },
  { name: 'Profit', value: '#10b981', var: '--pi-profit' },
  { name: 'Success', value: '#10b981', var: 'success' },
  { name: 'Danger', value: '#ef4444', var: 'danger' },
];

export default function StyleGuidePage() {
  const insight = getInsight('style-guide');
  const { theme, toggleTheme, fontSize, increaseFontSize, decreaseFontSize } = usePhoenixTheme();
  const [sampleText] = useState('The quick brown fox jumps over the lazy dog.');

  return (
    <PhoenixPage title="Style Guide" subtitle="Phoenix Intelligence Platform — Sapphire & Gold Design System" accentColor="#a855f7">
      {insight && <div style={{ marginBottom: 20 }}><AIInsightCard label={insight.label}>{insight.text}</AIInsightCard></div>}

      {/* Theme Controls */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Palette size={18} /> Live Controls
        </h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Theme</span>
            <button onClick={toggleTheme} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--pi-border)',
              background: 'var(--pi-card)', color: 'var(--pi-text)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
            }}>
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Font Size: {fontSize}px</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={decreaseFontSize} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--pi-border)', background: 'var(--pi-card)', color: 'var(--pi-text)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>Aa-</button>
              <button onClick={increaseFontSize} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--pi-border)', background: 'var(--pi-card)', color: 'var(--pi-text)', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>Aa+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Colors */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Colors</h3>
          <div className="grid grid-cols-2 gap-3">
            {COLORS.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: c.value, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--pi-text)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--pi-text-faint)', fontFamily: 'monospace' }}>{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Type size={18} /> Typography
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <span style={{ fontSize: '0.9rem', color: 'var(--pi-text-faint)', fontWeight: 600 }}>Font Family</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pi-text)' }}>Space Grotesk</div>
            </div>
            <div>
              <span style={{ fontSize: '0.9rem', color: 'var(--pi-text-faint)', fontWeight: 600 }}>Base Size</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pi-text)' }}>{fontSize}px (min 15px)</div>
            </div>
            {[
              { label: 'Heading', cls: 'pi-heading', token: '--pi-fs-heading (1.75rem / 800)' },
              { label: 'Subheading', cls: 'pi-subheading', token: '--pi-fs-subheading (1.1rem / 700)' },
              { label: 'Body', cls: 'pi-body', token: '--pi-fs-body (0.9rem / 400)' },
              { label: 'Caption', cls: 'pi-caption', token: '--pi-fs-caption (0.8rem / faint)' },
              { label: 'Overline', cls: 'pi-overline', token: '--pi-fs-overline (0.7rem / 700 / uppercase)' },
            ].map(t => (
              <div key={t.label}>
                <span className="pi-caption">{t.label} — <code style={{ fontFamily: 'monospace' }}>.{t.cls}</code> — {t.token}</span>
                <div className={t.cls}>{sampleText}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Component Preview */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Maximize2 size={18} /> Component Preview
        </h3>

        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--pi-text-muted)', fontWeight: 600, display: 'block', marginBottom: 8 }}>6P Pillar Cards</span>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {['Purpose', 'People', 'Process', 'Practice', 'Pipeline', 'Profit'].map((p, i) => (
              <PillarCard key={p} pillar={p} score={75 + i * 3} trend={2 + i} sparkline={[60, 65, 68, 72, 75, 75 + i * 3]} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--pi-text-muted)', fontWeight: 600, display: 'block', marginBottom: 8 }}>Performance Rings</span>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <PerformanceRing value={92} label="Purpose" color="#facc15" />
            <PerformanceRing value={78} label="Process" color="#3b6bf5" />
            <PerformanceRing value={85} label="Profit" color="#10b981" />
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.875rem', color: 'var(--pi-text-muted)', fontWeight: 600, display: 'block', marginBottom: 8 }}>AI Insight Card</span>
          <AIInsightCard>This is an example AI Insight card using the sapphire brand color. It provides contextual intelligence and recommendations powered by Phoenix methodology.</AIInsightCard>
        </div>
      </div>

      {/* Surface preview */}
      <div className="phoenix-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Surfaces</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Background', var: '--pi-bg' },
            { name: 'Card', var: '--pi-card' },
            { name: 'Card Alt', var: '--pi-card-alt' },
            { name: 'Border', var: '--pi-border' },
          ].map(s => (
            <div key={s.name} style={{ padding: 16, borderRadius: 8, background: `var(${s.var})`, border: '1px solid var(--pi-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--pi-text)' }}>{s.name}</div>
              <div style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--pi-text-faint)', marginTop: 4 }}>{s.var}</div>
            </div>
          ))}
        </div>
      </div>
    </PhoenixPage>
  );
}
