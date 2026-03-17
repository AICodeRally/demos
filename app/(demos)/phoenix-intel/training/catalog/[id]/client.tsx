'use client';

import { use } from 'react';
import Link from 'next/link';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { COURSES } from '@/data/phoenix-intel/training-data';
import { ArrowLeft, Clock, Users, Star, BookOpen } from 'lucide-react';

export default function CourseDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const course = COURSES.find(c => c.id === id) ?? COURSES[0];

  return (
    <PhoenixPage title={course.title} subtitle={`${course.category} — ${course.instructor}`} accentColor="#7c3aed">
      <Link href="/phoenix-intel/training/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--pi-sapphire)', textDecoration: 'none', marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Catalog
      </Link>

      {/* Course meta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Clock, label: 'Duration', value: course.duration, color: '#3b6bf5' },
          { icon: BookOpen, label: 'Format', value: course.format, color: '#7c3aed' },
          { icon: Users, label: 'Enrolled', value: String(course.enrollmentCount), color: '#10b981' },
          { icon: Star, label: 'Rating', value: `${course.rating}/5`, color: '#c9942b' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="phoenix-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <div style={{ background: `${card.color}18`, borderRadius: 6, padding: 4, display: 'flex' }}><Icon size={14} color={card.color} /></div>
                <span style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{card.label}</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)' }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Description */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 8 }}>About This Course</h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--pi-text-secondary)', lineHeight: 1.6 }}>{course.description}</p>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700, background: '#7c3aed20', color: '#7c3aed' }}>{course.level}</span>
          <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700, background: '#c9942b20', color: '#c9942b' }}>{course.format}</span>
          <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700, background: '#3b6bf520', color: '#3b6bf5' }}>{course.category}</span>
        </div>
      </div>

      {/* Modules */}
      <div className="phoenix-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Course Modules</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {course.modules.map((mod, mi) => (
            <div key={mi} style={{ borderLeft: '3px solid #7c3aed', paddingLeft: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pi-text)' }}>
                  Module {mi + 1}: {mod.title}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--pi-text-faint)' }}>{mod.duration}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {mod.lessons.map((lesson, li) => (
                  <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: 'var(--pi-text-secondary)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--pi-border)', flexShrink: 0 }} />
                    {lesson}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoenixPage>
  );
}
