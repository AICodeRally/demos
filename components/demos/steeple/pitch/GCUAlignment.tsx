import Link from 'next/link';
import { GraduationCap, Heart, Award, ArrowRight } from 'lucide-react';
import { gcuAlignmentCards } from '@/data/steeple';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Heart,
  Award,
};

export function GCUAlignment() {
  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-sm font-bold text-[#C5972C]">07</div>
        <div>
          <h3 className="text-3xl font-bold text-[#2d3142]">Why Grand Canyon University</h3>
          <p className="text-gray-600">Academic pipeline, faith mission, and university brand — aligned on all axes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gcuAlignmentCards.map((card) => {
          const Icon = iconMap[card.icon];
          return (
            <div
              key={card.title}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(82,35,152,0.06),0_1px_2px_rgba(82,35,152,0.04)]"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#522398] to-[#6B3FA0]">
                {Icon && <Icon className="h-7 w-7 text-white" />}
              </div>
              <h4 className="text-lg font-semibold text-[#2d3142]">{card.title}</h4>
              <ul className="mt-3 space-y-2.5">
                {card.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C5972C]" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#522398] via-[#6B3FA0] to-[#522398] p-10 text-center">
        <h4 className="text-2xl font-bold text-white">See It In Action</h4>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          Explore the live STEEPLE demo to see these capabilities in action — from check-in to
          giving, facilities to insights.
        </p>
        <Link
          href="/steeple"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[#522398] shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
        >
          Explore the Live Demo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
