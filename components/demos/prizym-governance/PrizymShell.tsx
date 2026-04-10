'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Home, FileText, BookOpen, ListChecks, ShieldCheck, LayoutTemplate,
  Calculator, Grid3x3, Network, Scale, BarChart3, ClipboardCheck,
  CheckSquare, PenLine, Gavel, AlertOctagon, Briefcase, Users,
  Calendar, History, Sparkles, Circle,
} from 'lucide-react';
import demoConfig from '@/app/(demos)/prizym-governance/demo.config';

const ICON_MAP: Record<string, typeof Home> = {
  Home, FileText, BookOpen, ListChecks, ShieldCheck, LayoutTemplate,
  Calculator, Grid3x3, Network, Scale, BarChart3, ClipboardCheck,
  CheckSquare, PenLine, Gavel, AlertOctagon, Briefcase, Users,
  Calendar, History, Sparkles,
};

// Drop the "Home" section — the top-left logo handles home navigation.
const NAV_SECTIONS = demoConfig.nav.filter((s) => s.section !== 'Home');

function findSectionForPath(pathname: string): string | null {
  for (const sec of NAV_SECTIONS) {
    if (sec.items.some((i) => i.href === pathname || pathname.startsWith(`${i.href}/`))) {
      return sec.section;
    }
  }
  return null;
}

export function PrizymShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const urlSection = useMemo(() => findSectionForPath(pathname), [pathname]);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const topbarRef = useRef<HTMLElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close the dropdown whenever the route changes (module click lands us on a new URL).
  useEffect(() => {
    setOpenSection(null);
  }, [pathname]);

  // ESC key closes the dropdown.
  useEffect(() => {
    if (!openSection) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSection(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSection]);

  // Pointer-down outside the topbar + dropdown closes it.
  useEffect(() => {
    if (!openSection) return;
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (topbarRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpenSection(null);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [openSection]);

  const dropdownSection = openSection
    ? NAV_SECTIONS.find((s) => s.section === openSection) ?? null
    : null;

  return (
    <div className="pg-bshell">
      <header className="pg-bshell-topbar" ref={topbarRef}>
        <Link href="/prizym-governance" className="pg-bshell-logo" aria-label="Go to workspace home">
          <span className="pg-bshell-logo-title">Prizym SGM</span>
          <span className="pg-bshell-logo-sub">Sales Governance Manager</span>
        </Link>

        <nav className="pg-bshell-sections-inner" aria-label="Primary">
          {NAV_SECTIONS.map((sec) => {
            const highlighted = urlSection === sec.section;
            const isOpen = openSection === sec.section;
            const showActive = highlighted || isOpen;
            return (
              <button
                key={sec.section}
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onClick={() => setOpenSection((prev) => (prev === sec.section ? null : sec.section))}
                className={`pg-bshell-section${showActive ? ' is-active' : ''}${isOpen ? ' is-open' : ''}`}
                style={showActive ? { borderColor: sec.color, color: sec.color, background: `${sec.color}1a` } : undefined}
              >
                {sec.section}
              </button>
            );
          })}
        </nav>

        <div className="pg-bshell-topbar-meta">
          {demoConfig.product.badge && (
            <span className="pg-bshell-badge">{demoConfig.product.badge}</span>
          )}
        </div>
      </header>

      {dropdownSection && (
        <div
          ref={dropdownRef}
          className="pg-bshell-dropdown"
          role="menu"
          aria-label={`${dropdownSection.section} modules`}
        >
          <div className="pg-bshell-dropdown-inner">
            {dropdownSection.items.map((item) => {
              const Icon = ICON_MAP[item.icon] ?? Circle;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpenSection(null)}
                  className={`pg-bshell-module${active ? ' is-active' : ''}`}
                  style={active ? { borderColor: dropdownSection.color, color: dropdownSection.color, background: `${dropdownSection.color}22` } : undefined}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <main className="pg-bshell-content">{children}</main>

      <footer className="pg-bshell-footer">
        <span className="pg-bshell-footer-copy">{demoConfig.footer?.copyright}</span>
        {demoConfig.footer?.poweredBy && (
          <span className="pg-bshell-footer-power">Powered by {demoConfig.footer.poweredBy}</span>
        )}
      </footer>
    </div>
  );
}
