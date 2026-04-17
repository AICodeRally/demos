'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tablet, LayoutDashboard, FileCode2, ChevronLeft } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/swic/tablet', label: 'Tablet POS', icon: Tablet },
  { href: '/swic/tablet/manager', label: 'Manager', icon: LayoutDashboard },
  { href: '/swic/tablet/integration', label: 'Integration', icon: FileCode2 },
] as const;

export function DemoNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-nav z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-12">
        {/* Left: back + brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--page-muted)' }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SWIC</span>
          </Link>
          <div
            className="w-px h-5"
            style={{ background: 'var(--glass-border)' }}
          />
          <span className="text-xs font-bold tracking-wide" style={{ color: 'var(--page-muted)' }}>
            Summit Sleep Co. D365
          </span>
        </div>

        {/* Center: page links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #6366f118, #a855f718)'
                    : 'transparent',
                  color: isActive ? '#818cf8' : 'var(--page-muted)',
                  border: isActive
                    ? '1px solid #6366f130'
                    : '1px solid transparent',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: spacer for balance */}
        <div className="w-20" />
      </div>
    </nav>
  );
}
